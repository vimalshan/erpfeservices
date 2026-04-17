import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryStylesService {
  private styleElements = new Map<string, HTMLStyleElement>();

  setGradientStyles(key: string, gradient: Record<string, string>): void {
    this.cleanup(key);

    const css = Object.entries(gradient)
      .map(
        ([category, color]) =>
          `.category-${key}-${category.replace(/\s+/g, '-').toLowerCase()} { background-color: ${color}; }`,
      )
      .join('\n');

    const style = document.createElement('style');
    style.textContent = css;
    style.setAttribute('data-category-style', key);
    document.head.appendChild(style);
    this.styleElements.set(key, style);
  }

  cleanup(key: string): void {
    const existing = this.styleElements.get(key);

    if (existing) {
      existing.remove();
      this.styleElements.delete(key);
    }
  }
}
