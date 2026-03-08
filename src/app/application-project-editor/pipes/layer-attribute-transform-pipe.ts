import { Pipe, PipeTransform } from '@angular/core';
import { WidgetPropertyModel } from '@app/application-project-editor/types/application-editor.type';

@Pipe({
  name: 'layerAttributeTransform',
})
export class LayerAttributeTransformPipe implements PipeTransform {
  transform(value: WidgetPropertyModel, transformFn: (...args: any[]) => string): string {
    const result = Object.entries(value).reduce(transformFn, '');

    console.log(result);

    return result;
  }
}
