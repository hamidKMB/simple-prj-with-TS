/// <reference path='models/drag-drop.ts' />
/// <reference path="models/project.ts" />
/// <reference path="state/project-state.ts" />
/// <reference path="utils/validation.ts" />
/// <reference path="decorators/autobind.ts" />
/// <reference path="components/project-baseclass.ts" />
/// <reference path="components/project-item.ts" />
/// <reference path="components/project-list.ts" />
/// <reference path="components/project-inputs.ts" />

namespace App {
  const prjInput = new ProjectInput();
  const activeProjects = new ProjectList("active");
  const finishedProjects = new ProjectList("finished");
}
