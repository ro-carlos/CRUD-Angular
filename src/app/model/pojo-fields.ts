export class Field {
  constructor(public column: Column, public value: Value) {}
}

export class Column {
  isEditable = true;
  isRequired = true;
  isVisible = true;

  constructor(
    public atribute: string,
    public header = "Header",
    public inputType = InputType.TEXT
  ) {}
}

export enum InputType {
  TEXT,
  DATE,
}

export class Change {
  constructor(
    public column: Column,
    public previousValue: Value,
    public currentValue: Value
  ) {}
}

export type Value = string | Date;
