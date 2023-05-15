import { Project } from "../models/project.js";
/* ------------------------ Project State Managements ----------------------- */
class BaseState {
    constructor() {
        this.listeners = [];
    }
    addListeners(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class ProjectState extends BaseState {
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
        const newProject = new Project(title, desc, numOfPeople, status);
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
export const projectState = ProjectState.getInstance();
