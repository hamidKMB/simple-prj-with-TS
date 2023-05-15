namespace App {
  /* ----------------------------- Project Inputs ----------------------------- */
  export class ProjectInput extends BaseClass<HTMLDivElement, HTMLFormElement> {
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
}
