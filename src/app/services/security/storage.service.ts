import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  set(key: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(sessionStorage.setItem(key, value));
    });
  }

  get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(sessionStorage.getItem(key));
    });
  }

  remove(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(sessionStorage.removeItem(key));
    });
  }

  clear(): void {
    sessionStorage.clear();
  }
}
