import { Pipe, PipeTransform } from '@angular/core';
import {
  Widget,
  WidgetPropertyModel,
} from '@app/application-project-editor/types/application-editor.type';

@Pipe({
  name: 'layerClassTransform',
})
export class LayerClassTransformPipe implements PipeTransform {
  transform<T extends WidgetPropertyModel>(value: T, transformFn?: () => string): string {
    const result = Object.entries(value).reduce((classes, [key, val]) => {
      if (val !== undefined && val !== null) {
        if (key === 'class') {
          classes += ` ${val}`;
        } else if (key === 'styles') {
          // Assuming styles is an object where keys are CSS properties and values are their corresponding values
          if (val && typeof val === 'object') {
            if (val.backgroundColor) {
              classes += ` bg-${val.backgroundColor.name}-${val.backgroundColor.range}`;
            }
          }
        }
      }
      return classes;
    }, '');

    console.log(result);

    return result;
  }
}
