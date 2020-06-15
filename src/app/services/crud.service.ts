import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Item } from "../model/item";

@Injectable({
  providedIn: "root",
})
export class CrudService {
  private headers = new HttpHeaders({});

  constructor(
    private http: HttpClient,
    @Inject("backendUrl") private backendUrl: string
  ) {}

  ngOnInit() {
    this.headers = this.headers.set("Content-Type", "text/plain");
  }

  list(): Observable<any> {
    const url = this.backendUrl + "list";
    return this.http.get(url, { withCredentials: true, headers: this.headers });
  }

  createItem(item: Item): Observable<any> {
    const url = this.backendUrl + "create";
    return this.http.post(url, item, {
      withCredentials: true,
      headers: this.headers,
    });
  }

  filterByDates(startDate: string, endDate: string) {
    const url = this.backendUrl + "consult";

    let params = new HttpParams();
    params = params.append("startDate", startDate);
    params = params.append("endDate", endDate);

    return this.http.get(url, {
      withCredentials: true,
      params,
      headers: this.headers,
    });
  }

  filter(id: string): Observable<any> {
    const url = this.backendUrl + "consult/" + id;

    return this.http.get(url, { withCredentials: true, headers: this.headers });
  }

  updateItem(item: Item) {
    const url = this.backendUrl + "update/" + item.id;

    return this.http.put(url, item, {
      withCredentials: true,
      headers: this.headers,
    });
  }

  removeItem(id: string): Observable<any> {
    const url = this.backendUrl + "delete/" + id;

    return this.http.delete(url, {
      withCredentials: true,
      headers: this.headers,
    });
  }
}
