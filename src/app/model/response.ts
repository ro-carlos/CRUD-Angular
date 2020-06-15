export class BackendResponse {
  constructor(
    public content: Array<any>,
    public number: number,
    public size: number,
    public totalElements: number,
    public totalPages: number,
    public status: number
  ) {}
}
