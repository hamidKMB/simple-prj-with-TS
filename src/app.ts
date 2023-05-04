/* ------------------------------ Project Types ----------------------------- */
enum Status {
  Active,
  Finished,
}

class Project {
  constructor(
    public title: string,
    public description: string,
    public numOfPeople: number,
    public status: Status
  ) {}
}

type Listener<EntryType> = (items: EntryType[]) => void;

/* ------------------------ Project State Managements ----------------------- */
class BaseState<StateType> {
  protected listeners: Listener<StateType>[] = [];

  addListeners(listenerFn: Listener<StateType>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends BaseState<Project> {
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

    for (let listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

/* --------------------------- Project Validation --------------------------- */
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable): boolean {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid &&
      validatableInput.value.trim().length > validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid &&
      validatableInput.value.trim().length < validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value < validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value > validatableInput.max;
  }
  return isValid;
}

function Autobind(
  _target: any,
  _methodName: string | Symbol | number,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
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
abstract class BaseClass<
  HostElement extends HTMLElement,
  Element extends HTMLElement
> {
  inputTemplate: HTMLTemplateElement;
  hostElement: HostElement;
  element: Element;

  constructor(
    inputTemplateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.inputTemplate = document.getElementById(
      inputTemplateId
    )! as HTMLTemplateElement;
    this.hostElement = <HostElement>document.getElementById(hostElementId)!;
    const importedNode = document.importNode(this.inputTemplate.content, true);
    this.element = <Element>importedNode.firstElementChild;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

/* ------------------------------ Project Item ------------------------------ */
class ProjectItem extends BaseClass<HTMLUListElement, HTMLLIElement> {
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

  configure(): void {}

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent =
      this.personText + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

/* ------------------------------ Project List ------------------------------ */
class ProjectList extends BaseClass<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  configure() {
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

/* ----------------------------- Project Inputs ----------------------------- */
class ProjectInput extends BaseClass<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.renderContent();
    this.configure();
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  private validateInputs(): [string, string, number] | void {
    const entered = {
      title: this.titleInputElement.value,
      desc: this.descriptionInputElement.value,
      people: this.peopleInputElement.value,
    };

    const titleValidation: Validatable = {
      value: entered.title,
      required: true,
    };

    const descriptionValidation: Validatable = {
      value: entered.desc,
      required: true,
      minLength: 5,
    };

    const peopleValidation: Validatable = {
      value: entered.people,
      required: true,
      max: 5,
      min: 0,
    };

    if (
      !validate(titleValidation) ||
      !validate(descriptionValidation) ||
      !validate(peopleValidation)
    ) {
      alert("Wrong Input");
      return;
    } else {
      return [entered.title, entered.desc, +entered.people];
    }
  }

  @Autobind
  private submitHandler(e: Event) {
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

  renderContent(): void {
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
  }
}

const prjInput = new ProjectInput();
const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");
