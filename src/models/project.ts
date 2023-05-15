namespace App {
  export enum Status {
    Active,
    Finished,
  }

  export class Project {
    constructor(
      public title: string,
      public description: string,
      public numOfPeople: number,
      public status: Status
    ) {}
  }
}
