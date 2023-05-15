/* ------------------------------- Base Class ------------------------------- */
export abstract class BaseClass<
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
