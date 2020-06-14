import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  set(key: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      sessionStorage.setItem(key, value);
      resolve();
    });
  }

  get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      sessionStorage.getItem(key);
      resolve();
    });
  }

  remove(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      sessionStorage.removeItem(key);
      resolve();
    });
  }

  clear(): void {
    sessionStorage.clear();
  }
}
