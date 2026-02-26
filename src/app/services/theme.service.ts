import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>(this.getInitialTheme());
  theme$ = this.themeSubject.asObservable();

  constructor() {
    const theme = this.getInitialTheme();
    document.documentElement.setAttribute('data-theme', theme);
  }

  private getInitialTheme(): string {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  }

  toggleTheme() {
    const currentTheme = this.themeSubject.value;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: string) {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  getCurrentTheme(): string {
    return this.themeSubject.value;
  }
}
