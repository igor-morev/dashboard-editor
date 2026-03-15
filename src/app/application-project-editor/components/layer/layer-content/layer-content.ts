import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { LAYER_REF } from '../layer';
import { Autofocus } from '@app/application-project-editor/ui/directives/autofocus';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'de-layer-content',
  imports: [Autofocus, ReactiveFormsModule],
  templateUrl: './layer-content.html',
  styleUrl: './layer-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerContent {
  private readonly layerRef = inject(LAYER_REF);

  get layer() {
    return this.layerRef.layer;
  }

  get selected() {
    return this.layerRef.selected;
  }

  get highlighted() {
    return this.layerRef.highlighted;
  }

  get editingLayer() {
    return this.layerRef.editingLayer;
  }

  layerName = computed(() =>
    this.layer().layerName ? this.layer().layerName : this.layer().widgetReference.widgetName,
  );

  editLayerNameControl = new FormControl('');

  layerEffect = effect(() => {
    this.editLayerNameControl.setValue(this.layerName()!);
  });

  startEditingLayer(): void {
    this.layerRef.onStartEditingLayer.emit();
  }

  saveLayerName(newName: string): void {
    this.layerRef.onSaveEditingLayerName.emit(newName);
  }

  cancelEditingLayer(): void {
    this.layerRef.onCancelEditingLayer.emit();
  }
}
