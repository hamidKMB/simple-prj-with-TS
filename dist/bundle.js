var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("decorators/autobind", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Autobind = void 0;
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
    exports.Autobind = Autobind;
});
define("models/project", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Project = exports.Status = void 0;
    var Status;
    (function (Status) {
        Status[Status["Active"] = 0] = "Active";
        Status[Status["Finished"] = 1] = "Finished";
    })(Status = exports.Status || (exports.Status = {}));
    class Project {
        constructor(title, description, numOfPeople, status) {
            this.title = title;
            this.description = description;
            this.numOfPeople = numOfPeople;
            this.status = status;
        }
    }
    exports.Project = Project;
});
define("state/project-state", ["require", "exports", "models/project"], function (require, exports, project_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.projectState = exports.ProjectState = void 0;
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
            const newProject = new project_1.Project(title, desc, numOfPeople, status);
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
    exports.ProjectState = ProjectState;
    exports.projectState = ProjectState.getInstance();
});
define("utils/validation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validate = void 0;
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
    exports.validate = validate;
});
define("components/project-baseclass", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseClass = void 0;
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
    exports.BaseClass = BaseClass;
});
define("components/project-inputs", ["require", "exports", "decorators/autobind", "models/project", "state/project-state", "utils/validation", "components/project-baseclass"], function (require, exports, autobind_1, project_2, project_state_1, validation_1, project_baseclass_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectInput = void 0;
    class ProjectInput extends project_baseclass_1.BaseClass {
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
            if (!(0, validation_1.validate)(titleValidation) ||
                !(0, validation_1.validate)(descriptionValidation) ||
                !(0, validation_1.validate)(peopleValidation)) {
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
                project_state_1.projectState.addProject(title, desc, people, project_2.Status.Active);
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
        autobind_1.Autobind
    ], ProjectInput.prototype, "submitHandler", null);
    exports.ProjectInput = ProjectInput;
});
/* -------------------------- Drag&Drop Interfaces -------------------------- */
define("models/drag-drop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/project-item", ["require", "exports", "decorators/autobind", "components/project-baseclass"], function (require, exports, autobind_2, project_baseclass_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectItem = void 0;
    /* ------------------------------ Project Item ------------------------------ */
    class ProjectItem extends project_baseclass_2.BaseClass {
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
        autobind_2.Autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    exports.ProjectItem = ProjectItem;
});
define("components/project-list", ["require", "exports", "decorators/autobind", "models/project", "state/project-state", "components/project-baseclass", "components/project-item"], function (require, exports, autobind_3, project_3, project_state_2, project_baseclass_3, project_item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectList = void 0;
    /* ------------------------------ Project List ------------------------------ */
    class ProjectList extends project_baseclass_3.BaseClass {
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
            project_state_2.projectState.changeStatus(event.dataTransfer.getData("text/plain"), this.type == "active" ? project_3.Status.Active : project_3.Status.Finished);
        }
        configure() {
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            this.element.addEventListener("drop", this.dropHandler);
            project_state_2.projectState.addListeners((projects) => {
                const revelantProjects = projects.filter((prj) => {
                    if (this.type === "active") {
                        return prj.status === project_3.Status.Active;
                    }
                    return prj.status === project_3.Status.Finished;
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
                new project_item_1.ProjectItem(this.element.querySelector("ul").id, prjInfo);
            }
        }
    }
    __decorate([
        autobind_3.Autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        autobind_3.Autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    __decorate([
        autobind_3.Autobind
    ], ProjectList.prototype, "dropHandler", null);
    exports.ProjectList = ProjectList;
});
define("app", ["require", "exports", "components/project-inputs", "components/project-list"], function (require, exports, project_inputs_1, project_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new project_inputs_1.ProjectInput();
    new project_list_1.ProjectList("active");
    new project_list_1.ProjectList("finished");
});
