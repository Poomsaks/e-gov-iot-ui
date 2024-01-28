import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() {}

  saveArrayToSessionStorage(key: string, array: any[]): void {
    sessionStorage.setItem(key, JSON.stringify(array));
  }

  getArrayFromSessionStorage(key: string): any[] | null {
    const storedData = sessionStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  }
}
