import { Injectable } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Layer } from '../types/application-editor.type';

export interface LayerMoveEvent {
  layerId: string;
  direction: 'up' | 'down';
  success: boolean;
  message?: string;
}

export interface LayerDropEvent {
  draggedLayerId: string;
  targetLayerId: string;
  position: 'before' | 'after' | 'inside';
  success: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class LayerReordering {
  /**
   * Handle nested CDK drag-drop (smart detection of same/different containers)
   */
  handleDragAndDrop(event: CdkDragDrop<Layer[]>, allLayers: Layer[]): Layer[] {
    if (event.previousContainer === event.container) {
      const { previousIndex, currentIndex } = event;

      if (previousIndex === currentIndex) {
        return event.container.data;
      }

      const updatedLayers = [...event.container.data];
      const [movedLayer] = updatedLayers.splice(previousIndex, 1);
      updatedLayers.splice(currentIndex, 0, movedLayer);

      return updatedLayers;
    }

    return allLayers;
  }

  private updateLayerInTree(
    layers: Layer[],
    layerId: string,
    updateFn: (layer: Layer) => Layer,
  ): Layer[] {
    return layers.map((layer) => {
      if (layer.id === layerId) {
        return updateFn(layer);
      }

      if (layer.children.length > 0) {
        return {
          ...layer,
          children: this.updateLayerInTree(layer.children, layerId, updateFn),
        };
      }

      return layer;
    });
  }
}
