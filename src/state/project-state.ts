import { Project, Status } from "../models/project";

type Listener<EntryType> = (items: EntryType[]) => void;

/* ------------------------ Project State Managements ----------------------- */
class BaseState<StateType> {
  protected listeners: Listener<StateType>[] = [];

  addListeners(listenerFn: Listener<StateType>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends BaseState<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }

  addProject(
    title: string,
    desc: string,
    numOfPeople: number,
    status: Status.Active
  ) {
    const newProject = new Project(title, desc, numOfPeople, status);
    this.projects.push(newProject);
    this.updateListeners();
  }

  changeStatus(titleOfSelectedPrj: string, newStatus: Status) {
    const project = this.projects.find(
      (prj) => prj.title === titleOfSelectedPrj
    );

    if (project) {
      project.status = newStatus;
    }

    this.updateListeners();
  }

  private updateListeners() {
    for (let listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();
