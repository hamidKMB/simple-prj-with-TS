/* ------------------------------- Base Class ------------------------------- */
export class BaseClass {
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
