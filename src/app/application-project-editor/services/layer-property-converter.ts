import { Injectable, InjectionToken } from '@angular/core';
import { ILayerPropertyConverter } from '../types';
import { WidgetPropertyModel } from '../types/widget.type';

export const LAYER_PROPERTY_CONVERTER = new InjectionToken<ILayerPropertyConverter>(
  'LayerPropertyConverter',
);

// example implementation of LayerPropertiesConverter that converts layer properties to Tailwind CSS classes
@Injectable()
export class TailwindLayerPropertyConverter implements ILayerPropertyConverter {
  convertToScaffoldClasses(propertyModel: WidgetPropertyModel): string {
    // This is a very basic implementation. You would need to expand this to cover all the properties you want to support.
    let classes = propertyModel.class || '';

    if (propertyModel.styles?.backgroundColor) {
      classes += ` bg-${propertyModel.styles.backgroundColor}`;
    }

    return classes.trim();
  }
}
