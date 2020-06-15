import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Item } from "../model/item";
import { BackendResponse } from "../model/response";

@Injectable({
  providedIn: "root",
})
export class LocalCrudService {
  private CONSECUTIVE = 9;
  private items: Item[] = [
    new Item("1", "Carlos", "carlos.com", "Colombian", "1996-12-25"),
    new Item("2", "Alejandro", "alejandro.com", "Colombian", "1998-04-28"),
    new Item("3", "Esmeralda", "web", "esmeralda.com", "1972-08-18"),
    new Item("4", "Marcela", "web", "marcela.com", "1996-09-13"),
    new Item("5", "Diana", "web", "diana.com", "1977-03-17"),
    new Item("6", "Juan", "web", "juan.com", "1993-06-06"),
    new Item("7", "Leonardo", "web", "leonardo.com", "2001-01-01"),
    new Item("8", "Ana", "web", "ana.com", "1999-12-31"),
  ];

  constructor() {}

  ngOnInit() {}

  list(): Observable<BackendResponse> {
    return new Observable((subscriber) => {
      setTimeout(() => {
        const response = new BackendResponse(
          this.items,
          0,
          this.items.length,
          this.items.length,
          1,
          200
        );
        subscriber.next(response);
        subscriber.complete();
      }, 0);
    });
  }

  filterByDates(
    startDate: string,
    endDate: string
  ): Observable<BackendResponse> {
    return new Observable((subscriber) => {
      setTimeout(() => {
        const filteredItems = this.items.filter((item) => {
          const minDate = new Date(startDate);
          const maxDate = new Date(endDate);
          const currDate = new Date(item.birthday);

          return currDate >= minDate && currDate <= maxDate;
        });
        const response = new BackendResponse(
          filteredItems,
          0,
          filteredItems.length,
          filteredItems.length,
          1,
          200
        );
        subscriber.next(response);
        subscriber.complete();
      }, 0);
    });
  }

  filter(value: string): Observable<BackendResponse> {
    return new Observable((subscriber) => {
      setTimeout(() => {
        const filteredItems = this.items.filter((item) => {
          return (
            item.id.includes(value) ||
            item.name.includes(value) ||
            item.nationality.includes(value) ||
            item.website.includes(value)
          );
        });
        const response = new BackendResponse(
          filteredItems,
          0,
          filteredItems.length,
          filteredItems.length,
          1,
          200
        );
        subscriber.next(response);
        subscriber.complete();
      }, 0);
    });
  }

  createItem(item: Item): Observable<BackendResponse> {
    return new Observable((subscriber) => {
      setTimeout(() => {
        item.id = this.CONSECUTIVE + "";
        this.items.push(item);

        const response = new BackendResponse([item], 0, 1, 1, 1, 200);

        subscriber.next(response);
        subscriber.complete();
        this.CONSECUTIVE += 1;
      }, 0);
    });
  }

  updateItem(item: Item): Observable<BackendResponse> {
    return new Observable((subscriber) => {
      setTimeout(() => {
        this.items.map((it) => {
          if (it.id === item.id) {
            it.name = item.name;
            it.nationality = item.nationality;
            it.website = item.website;
            it.birthday = item.birthday;
          }
        });
        const response = new BackendResponse([item], 0, 1, 1, 1, 200);

        subscriber.next(response);
        subscriber.complete();
      }, 0);
    });
  }

  removeItem(id: string): Observable<BackendResponse> {
    return new Observable((subscriber) => {
      setTimeout(() => {
        const filteredItems = this.items.filter((item) => {
          return item.id !== id;
        });
        this.items = filteredItems;

        const response = {
          content: [],
          number: 0,
          size: 0,
          totalElements: 0,
          totalPages: 1,
          status: 200,
        };
        subscriber.next();
        subscriber.complete();
      }, 0);
    });
  }
}
