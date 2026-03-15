import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ApplicationEditorState } from '@app/application-project-editor/state/application-editor-state';
import { LayerComponent } from '../layer/layer';
import { LayersEditor } from '@app/application-project-editor/services/layers-editor';
import { Layer } from '@app/application-project-editor/types/application-editor.type';

@Component({
  selector: 'de-scaffold-outlet',
  imports: [NgTemplateOutlet, LayerComponent],
  templateUrl: './scaffold-outlet.html',
  styleUrl: './scaffold-outlet.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaffoldOutlet {
  private layersEditor = inject(LayersEditor);
  private state = inject(ApplicationEditorState);

  editingLayerId = signal<string | null>(null);

  get appState() {
    return this.state.appState;
  }

  get layers() {
    return this.state.layers;
  }

  get selectedLayer() {
    return this.state.selectedlayer;
  }

  get highlightedLayer() {
    return this.state.highlightedLayer;
  }

  startEditingLayer(layerId: string): void {
    this.editingLayerId.set(layerId);
  }

  saveLayerName(newName: string, layer: Layer): void {
    if (newName.trim()) {
      const updatedLayer: Layer = {
        ...layer,
        layerName: newName,
      };

      const updatedLayersTree = this.layersEditor.updateLayerInTree(
        this.appState.appViewSchema.layers,
        layer.id,
        updatedLayer,
      );

      const updatedLayersMap = this.layersEditor.updateLayersMap(updatedLayersTree, {});

      this.state.updateAppState({
        selectedLayer: updatedLayersMap[layer.id],
        appViewSchema: {
          ...this.appState.appViewSchema,
          layers: updatedLayersTree,
          layersMap: updatedLayersMap,
        },
      });
    }
    this.editingLayerId.set(null);
  }

  cancelEditingLayer(): void {
    this.editingLayerId.set(null);
  }
}
