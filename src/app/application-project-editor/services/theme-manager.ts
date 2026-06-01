import { Injectable, signal, effect } from '@angular/core';
import { DesignTokens, THEME_PRESETS } from '../types/theme';

@Injectable({ providedIn: 'root' })
export class ThemeManager {
  // Текущее состояние темы (Angular Signal)
  private themeSignal = signal<DesignTokens>(THEME_PRESETS['grooming']);
  readonly currentTheme = this.themeSignal.asReadonly();

  constructor() {
    // Автоматически обновляем DOM при изменении сигнала
    effect(() => this.applyThemeToDom(this.themeSignal()));
  }

  setThemeByPreset(presetName: string) {
    if (THEME_PRESETS[presetName]) {
      this.themeSignal.set(THEME_PRESETS[presetName]);
    }
  }

  getTheme(presetName: string) {
    return THEME_PRESETS[presetName] || null;
  }

  setTheme(customTokens: Partial<DesignTokens>) {
    const current = this.themeSignal();
    const updatedTheme = { ...current, ...customTokens };
    this.themeSignal.set(updatedTheme);
  }

  varPrefix() {
    return '--project';
  }

  private applyThemeToDom(theme: DesignTokens) {
    const root = document.documentElement;
    const s = theme.typeScale;
    const base = theme.baseFontSize;

    // 1. Цвета и скругления
    root.style.setProperty(`${this.varPrefix()}-primary-color`, theme.primaryColor);
    root.style.setProperty(`${this.varPrefix()}-surface-color`, theme.surfaceColor);
    root.style.setProperty(`${this.varPrefix()}-contrast-color`, theme.contrastColor);

    root.style.setProperty(`${this.varPrefix()}-radius`, theme.borderRadius);

    // 2. Типографика (Шрифты)
    root.style.setProperty(`${this.varPrefix()}-font-heading`, theme.fontFamily.heading);
    root.style.setProperty(`${this.varPrefix()}-font-body`, theme.fontFamily.body);

    // 3. Масштабируемая шкала размеров (Modular Scale)
    root.style.setProperty(`${this.varPrefix()}-h1-size`, `${base * Math.pow(s, 4)}px`);
    root.style.setProperty(`${this.varPrefix()}-h2-size`, `${base * Math.pow(s, 3)}px`);
    root.style.setProperty(`${this.varPrefix()}-h3-size`, `${base * Math.pow(s, 2)}px`);
    root.style.setProperty(`${this.varPrefix()}-body-size`, `${base}px`);
  }
}
