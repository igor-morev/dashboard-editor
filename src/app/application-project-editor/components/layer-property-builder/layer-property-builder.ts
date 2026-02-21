import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LAYER_PROPERTY_CONVERTER, TailwindLayerPropertyConverter } from '@app/application-project-editor/services/layer-property-converter';

@Component({
  selector: 'de-layer-property-builder',
  imports: [ReactiveFormsModule],
  templateUrl: './layer-property-builder.html',
  styleUrl: './layer-property-builder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: LAYER_PROPERTY_CONVERTER,
    useClass: TailwindLayerPropertyConverter
  }]
})
export class LayerPropertyBuilder {
  private layerPropertyConverter = inject(LAYER_PROPERTY_CONVERTER);
  formGroup = new FormGroup({
    
  })

  update() {
    this.layerPropertyConverter.convertToScaffoldClasses(this.formGroup.value);
  }
}
