"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* ------------------------------ Project Types ----------------------------- */
var Status;
(function (Status) {
    Status[Status["Active"] = 0] = "Active";
    Status[Status["Finished"] = 1] = "Finished";
})(Status || (Status = {}));
class Project {
    constructor(title, description, numOfPeople, status) {
        this.title = title;
        this.description = description;
        this.numOfPeople = numOfPeople;
        this.status = status;
    }
}
/* ------------------------ Project State Managements ----------------------- */
class ProjectState {
    constructor() {
        this.listeners = [];
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
    addListeners(listenerFn) {
        this.listeners.push(listenerFn);
    }
    addProject(title, desc, numOfPeople, status) {
        const newProject = new Project(title, desc, numOfPeople, status);
        this.projects.push(newProject);
        for (let listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
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
/* ------------------------------ Project List ------------------------------ */
class ProjectList {
    constructor(type) {
        this.type = type;
        this.inputTemplate = document.getElementById("project-list");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.inputTemplate.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        this.assignedProjects = [];
        projectState.addListeners((projects) => {
            const revelantProjects = projects.filter((prj) => {
                if (this.type === "active") {
                    return prj.status === Status.Active;
                }
                return prj.status === Status.Finished;
            });
            this.assignedProjects = revelantProjects;
            this.renderProjects();
        });
        this.attach();
        this.renderContent();
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = "";
        for (const prjInfo of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = prjInfo.title;
            listEl.appendChild(listItem);
        }
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent = `${this.type.toUpperCase()} PROJECTS`;
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}
/* ----------------------------- Project Inputs ----------------------------- */
class ProjectInput {
    constructor() {
        this.inputTemplate = (document.getElementById("project-input"));
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.inputTemplate.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input";
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
        this.attach();
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
            projectState.addProject(title, desc, people, Status.Active);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
const prjInput = new ProjectInput();
const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");
