export class BackendError {
  constructor(
    public id: number,
    public action: string,
    public errorCode: string,
    public severity: number,
    public value: string | string[]
  ) {}
}
