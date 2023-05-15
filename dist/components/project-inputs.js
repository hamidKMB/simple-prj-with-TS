var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Autobind } from "../decorators/autobind.js";
import { Status } from "../models/project.js";
import { projectState } from "../state/project-state.js";
import { validate } from "../utils/validation.js";
import { BaseClass } from "./project-baseclass.js";
export class ProjectInput extends BaseClass {
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
            projectState.addProject(title, desc, people, Status.Active);
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
