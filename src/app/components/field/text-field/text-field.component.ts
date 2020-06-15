import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Value } from "src/app/model/pojo-fields";

@Component({
  selector: "app-text-field",
  templateUrl: "./text-field.component.html",
  styleUrls: ["./text-field.component.scss"],
})
export class TextFieldComponent implements OnInit {
  @Input() title: string;
  @Input() isEditable: boolean;
  @Input() isRequired: boolean;
  @Input() value: string;

  @Output() change = new EventEmitter<Value>();

  form: FormGroup;

  lastValidValue: Value;

  constructor() {}

  ngOnInit() {
    const validator = this.isRequired ? Validators.required : null;
    this.form = new FormGroup({
      field: new FormControl("", validator),
    });
  }

  onFocus() {
    this.lastValidValue = this.value;
  }

  onBlur() {
    if (this.isValid(this.value) && this.value !== this.lastValidValue) {
      this.change.emit(this.value);
    }
  }

  private isValid(value: Value) {
    return value !== null && value !== undefined;
  }
}
