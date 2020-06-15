import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Subject } from "rxjs";
import { Change, Field, InputType, Value } from "src/app/model/pojo-fields";

@Component({
  selector: "app-field",
  templateUrl: "./field.component.html",
  styleUrls: ["./field.component.scss"],
})
export class FieldComponent implements OnInit {
  @Input() field: Field;

  @Output() change = new EventEmitter<Change>();

  lastValidValue: Value;
  private unsubscribe: Subject<void> = new Subject();

  @ViewChild("text", { static: true }) text: TemplateRef<any>;
  @ViewChild("date", { static: true }) date: TemplateRef<any>;

  get tipoInputStr(): string {
    return InputType[this.field.column.inputType].toLowerCase();
  }

  get itemTemplateRef() {
    const tipoInputStr = this.tipoInputStr;
    if (!tipoInputStr) {
      throw new Error(`tipoInputStr is "${tipoInputStr}".`);
    }
    const template = this[tipoInputStr];
    if (!template) {
      throw new Error(
        `template is "${tipoInputStr}" for tipoInput "${tipoInputStr}".`
      );
    }
    return template;
  }

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.lastValidValue = this.field.value;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onInputChange(e: Value) {
    const previousValue = this.lastValidValue;
    const value = e;
    this.onChangeFromChildren(previousValue, value);
  }

  onChangeFromChildren(previousValue: Value, currentValue: Value) {
    this.field.value = currentValue;

    if (!this.isValid(previousValue, currentValue)) {
      this.snackBar.open("Invalid value", "error", {
        duration: 2000,
      });
    } else {
      this.lastValidValue = this.field.value;
      const change = new Change(this.field.column, previousValue, currentValue);
      this.change.emit(change);
      this.snackBar.open("Input updated", "ok", {
        duration: 2000,
      });
    }
  }

  private isValid(previousValue: Value, currentValue: Value): boolean {
    const { inputType, isRequired } = this.field.column;

    if (previousValue === currentValue) {
      return false;
    }

    if (isRequired && inputType === InputType.TEXT && !currentValue) {
      return false;
    }

    if (inputType === InputType.DATE && !this.validDate) {
      return false;
    }

    return true;
  }

  private validDate(date: string): boolean {
    return (
      !!date && /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(date)
    );
  }
}
