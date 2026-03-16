import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { LAYER_REF } from '../layer';
import { Autofocus } from '@app/application-project-editor/ui/directives/autofocus';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

/**
 * LayerContent component is responsible for displaying the content of a layer, including its name and editing capabilities.
 * It uses the LAYER_REF injection token to access the layer's properties and actions, such as starting to edit the layer name, saving the new name, and canceling the editing process.
 */
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
    if (this.layer().locked) {
      return;
    }
    this.layerRef.onStartEditingLayer.emit();
  }

  saveLayerName(newName: string): void {
    this.layerRef.onSaveEditingLayerName.emit(newName);
  }

  cancelEditingLayer(): void {
    this.layerRef.onCancelEditingLayer.emit();
  }
}
