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

class ProjectList {
  inputTemplate: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;

  constructor(private type: "active" | "finished") {
    this.inputTemplate = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = <HTMLDivElement>document.getElementById("app")!;

    const importedNode = document.importNode(this.inputTemplate.content, true);
    this.element = <HTMLElement>importedNode.firstElementChild;
    this.element.id = `${this.type}-projects`;
    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

class ProjectInput {
  inputTemplate: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.inputTemplate = <HTMLTemplateElement>(
      document.getElementById("project-input")!
    );
    this.hostElement = <HTMLDivElement>document.getElementById("app")!;

    const importedNode = document.importNode(this.inputTemplate.content, true);
    this.element = <HTMLFormElement>importedNode.firstElementChild;
    this.element.id = "user-input";
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
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
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");