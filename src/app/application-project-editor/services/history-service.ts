import { Injectable } from '@angular/core';
import { Layer, AppViewSchema } from '../types/application-editor.type';

export interface HistoryState {
  appViewSchema: AppViewSchema;
  // TODO: get rid of this, because we dont need to store selected layer in history
  selectedLayer: Layer;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private history: HistoryState[] = [];
  private currentIndex = -1;
  private maxHistorySize = 50;

  pushState(state: HistoryState) {
    // Remove any redo states if we're not at the end
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Add new state
    this.history.push(state);
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }

    console.log('State pushed to history:', this.history);
  }

  undo(): HistoryState | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }

  redo(): HistoryState | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}
