import { Autobind } from "../decorators/autobind.js";
import { DragTarget } from "../models/drag-drop.js";
import { Project, Status } from "../models/project.js";
import { projectState } from "../state/project-state.js";
import { BaseClass } from "./project-baseclass.js";
import { ProjectItem } from "./project-item.js";

/* ------------------------------ Project List ------------------------------ */
export class ProjectList
  extends BaseClass<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @Autobind
  dragLeaveHandler(event: DragEvent): void {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  @Autobind
  dropHandler(event: DragEvent): void {
    projectState.changeStatus(
      event.dataTransfer!.getData("text/plain"),
      this.type == "active" ? Status.Active : Status.Finished
    );
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    projectState.addListeners((projects: Project[]) => {
      const revelantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === Status.Active;
        }
        return prj.status === Status.Finished;
      });
      this.assignedProjects = revelantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const prjInfo of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjInfo);
    }
  }
}
