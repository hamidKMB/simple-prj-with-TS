namespace App {
  /* ------------------------------ Project Item ------------------------------ */
  export class ProjectItem
    extends BaseClass<HTMLUListElement, HTMLLIElement>
    implements Draggable
  {
    private project: Project;

    get personText(): string {
      const { numOfPeople } = this.project;

      if (numOfPeople === 1) {
        return "1 person";
      }

      return `${numOfPeople} persons`;
    }

    constructor(hostElementId: string, project: Project) {
      super("single-project", hostElementId, true, project.title);
      this.project = project;

      this.configure();
      this.renderContent();
    }

    @Autobind
    dragStartHandler(event: DragEvent): void {
      event.dataTransfer!.setData("text/plain", this.project.title);
      event.dataTransfer!.effectAllowed = "move";
    }

    dragEndHandler(event: DragEvent): void {}

    configure(): void {
      this.element.addEventListener("dragstart", this.dragStartHandler);
      this.element.addEventListener("dragend", this.dragEndHandler);
    }

    renderContent(): void {
      this.element.querySelector("h2")!.textContent = this.project.title;
      this.element.querySelector("h3")!.textContent =
        this.personText + " assigned";
      this.element.querySelector("p")!.textContent = this.project.description;
    }
  }
}
