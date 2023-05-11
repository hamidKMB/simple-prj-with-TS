"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* -------------------------- Drag&Drop Interfaces -------------------------- */
var App;
(function (App) {
    let Status;
    (function (Status) {
        Status[Status["Active"] = 0] = "Active";
        Status[Status["Finished"] = 1] = "Finished";
    })(Status = App.Status || (App.Status = {}));
    class Project {
        constructor(title, description, numOfPeople, status) {
            this.title = title;
            this.description = description;
            this.numOfPeople = numOfPeople;
            this.status = status;
        }
    }
    App.Project = Project;
})(App || (App = {}));
/// <reference path='drag-drop-interfaces.ts' />
/// <reference path="project-model.ts" />
var App;
(function (App) {
    /* ------------------------ Project State Managements ----------------------- */
    class BaseState {
        constructor() {
            this.listeners = [];
        }
        addListeners(listenerFn) {
            this.listeners.push(listenerFn);
        }
    }
    class ProjectState extends BaseState {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            else {
                this.instance = new ProjectState();
                return this.instance;
            }
        }
        addProject(title, desc, numOfPeople, status) {
            const newProject = new App.Project(title, desc, numOfPeople, status);
            this.projects.push(newProject);
            this.updateListeners();
        }
        changeStatus(titleOfSelectedPrj, newStatus) {
            const project = this.projects.find((prj) => prj.title === titleOfSelectedPrj);
            if (project) {
                project.status = newStatus;
            }
            this.updateListeners();
        }
        updateListeners() {
            for (let listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
    }
    const projectState = ProjectState.getInstance();
    function validate(validatableInput) {
        let isValid = true;
        if (validatableInput.required) {
            isValid =
                isValid && validatableInput.value.toString().trim().length !== 0;
        }
        if (validatableInput.minLength != null &&
            typeof validatableInput.value === "string") {
            isValid =
                isValid &&
                    validatableInput.value.trim().length > validatableInput.minLength;
        }
        if (validatableInput.maxLength != null &&
            typeof validatableInput.value === "string") {
            isValid =
                isValid &&
                    validatableInput.value.trim().length < validatableInput.maxLength;
        }
        if (validatableInput.min != null &&
            typeof validatableInput.value === "number") {
            isValid = isValid && validatableInput.value < validatableInput.min;
        }
        if (validatableInput.max != null &&
            typeof validatableInput.value === "number") {
            isValid = isValid && validatableInput.value > validatableInput.max;
        }
        return isValid;
    }
    function Autobind(_target, _methodName, descriptor) {
        const originalMethod = descriptor.value;
        const adjDescriptor = {
            configurable: true,
            enumerable: false,
            get() {
                const boundFn = originalMethod.bind(this);
                return boundFn;
            },
        };
        return adjDescriptor;
    }
    /* ------------------------------- Base Class ------------------------------- */
    class BaseClass {
        constructor(inputTemplateId, hostElementId, insertAtStart, newElementId) {
            this.inputTemplate = document.getElementById(inputTemplateId);
            this.hostElement = document.getElementById(hostElementId);
            const importedNode = document.importNode(this.inputTemplate.content, true);
            this.element = importedNode.firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach(insertAtStart);
        }
        attach(insertAtStart) {
            this.hostElement.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.element);
        }
    }
    /* ------------------------------ Project Item ------------------------------ */
    class ProjectItem extends BaseClass {
        get personText() {
            const { numOfPeople } = this.project;
            if (numOfPeople === 1) {
                return "1 person";
            }
            return `${numOfPeople} persons`;
        }
        constructor(hostElementId, project) {
            super("single-project", hostElementId, true, project.title);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        dragStartHandler(event) {
            event.dataTransfer.setData("text/plain", this.project.title);
            event.dataTransfer.effectAllowed = "move";
        }
        dragEndHandler(event) { }
        configure() {
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragend", this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector("h2").textContent = this.project.title;
            this.element.querySelector("h3").textContent =
                this.personText + " assigned";
            this.element.querySelector("p").textContent = this.project.description;
        }
    }
    __decorate([
        Autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    /* ------------------------------ Project List ------------------------------ */
    class ProjectList extends BaseClass {
        constructor(type) {
            super("project-list", "app", false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
                event.preventDefault();
                const listEl = this.element.querySelector("ul");
                listEl.classList.add("droppable");
            }
        }
        dragLeaveHandler(event) {
            const listEl = this.element.querySelector("ul");
            listEl.classList.remove("droppable");
        }
        dropHandler(event) {
            projectState.changeStatus(event.dataTransfer.getData("text/plain"), this.type == "active" ? App.Status.Active : App.Status.Finished);
        }
        configure() {
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            this.element.addEventListener("drop", this.dropHandler);
            projectState.addListeners((projects) => {
                const revelantProjects = projects.filter((prj) => {
                    if (this.type === "active") {
                        return prj.status === App.Status.Active;
                    }
                    return prj.status === App.Status.Finished;
                });
                this.assignedProjects = revelantProjects;
                this.renderProjects();
            });
        }
        renderContent() {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector("ul").id = listId;
            this.element.querySelector("h2").textContent = `${this.type.toUpperCase()} PROJECTS`;
        }
        renderProjects() {
            const listEl = document.getElementById(`${this.type}-projects-list`);
            listEl.innerHTML = "";
            for (const prjInfo of this.assignedProjects) {
                new ProjectItem(this.element.querySelector("ul").id, prjInfo);
            }
        }
    }
    __decorate([
        Autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        Autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    __decorate([
        Autobind
    ], ProjectList.prototype, "dropHandler", null);
    /* ----------------------------- Project Inputs ----------------------------- */
    class ProjectInput extends BaseClass {
        constructor() {
            super("project-input", "app", true, "user-input");
            this.renderContent();
            this.configure();
        }
        clearInputs() {
            this.titleInputElement.value = "";
            this.descriptionInputElement.value = "";
            this.peopleInputElement.value = "";
        }
        validateInputs() {
            const entered = {
                title: this.titleInputElement.value,
                desc: this.descriptionInputElement.value,
                people: this.peopleInputElement.value,
            };
            const titleValidation = {
                value: entered.title,
                required: true,
            };
            const descriptionValidation = {
                value: entered.desc,
                required: true,
                minLength: 5,
            };
            const peopleValidation = {
                value: entered.people,
                required: true,
                max: 5,
                min: 0,
            };
            if (!validate(titleValidation) ||
                !validate(descriptionValidation) ||
                !validate(peopleValidation)) {
                alert("Wrong Input");
                return;
            }
            else {
                return [entered.title, entered.desc, +entered.people];
            }
        }
        submitHandler(e) {
            e.preventDefault();
            const userInputs = this.validateInputs();
            if (Array.isArray(userInputs)) {
                const [title, desc, people] = userInputs;
                projectState.addProject(title, desc, people, App.Status.Active);
                this.clearInputs();
            }
        }
        configure() {
            this.element.addEventListener("submit", this.submitHandler);
        }
        renderContent() {
            this.titleInputElement = this.element.querySelector("#title");
            this.descriptionInputElement = this.element.querySelector("#description");
            this.peopleInputElement = this.element.querySelector("#people");
        }
    }
    __decorate([
        Autobind
    ], ProjectInput.prototype, "submitHandler", null);
    const prjInput = new ProjectInput();
    const activeProjects = new ProjectList("active");
    const finishedProjects = new ProjectList("finished");
})(App || (App = {}));
