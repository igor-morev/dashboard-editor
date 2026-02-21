import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ApplicationEditorState } from '@app/application-project-editor/state/application-editor-state';
import { LayerComponent } from '../layer/layer';

@Component({
  selector: 'de-scaffold-outlet',
  imports: [NgTemplateOutlet, LayerComponent],
  templateUrl: './scaffold-outlet.html',
  styleUrl: './scaffold-outlet.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScaffoldOutlet {
  private state = inject(ApplicationEditorState);

  layers = this.state.layers;
  selectedlayer = this.state.selectedlayer;
}
