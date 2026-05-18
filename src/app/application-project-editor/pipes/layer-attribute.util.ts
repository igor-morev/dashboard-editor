import { WidgetPropertyModel } from '@app/application-project-editor/types/application-editor.type';

export function buildLayerTailwindClasses(
  classes: string,
  [key, val]: [keyof WidgetPropertyModel, WidgetPropertyModel['styles']],
): string {
  if (val !== undefined && val !== null) {
    if (key === 'defaultClass') {
      classes += ` ${val}`;
    } else if (key === 'class') {
      classes += ` ${val}`;
    } else if (key === 'styles') {
      // Assuming styles is an object where keys are CSS properties and values are their corresponding values
      if (val && typeof val === 'object') {
        if (val.backgroundColor) {
          classes += ` bg-${val.backgroundColor.name}${val.backgroundColor.range ? `-${val.backgroundColor.range}` : ''}`;
        }

        if (val.background) {
          if (val.background.color) {
            classes += ` bg-${val.background.color.name}${val.background.color.range ? `-${val.background.color.range}` : ''}`;
          }

          if (val.background.image) {
            const backgroundImage = val.background.image
              ? `[url('${val.background.image}')]`
              : null;
            classes += ` bg-${backgroundImage}`;
          }

          if (val.background.position) {
            classes += ` bg-${val.background.position}`;
          }

          if (val.background.repeat) {
            classes += ` bg-${val.background.repeat}`;
          }

          if (val.background.size) {
            classes += ` bg-${val.background.size}`;
          }
        }

        if (val.color) {
          classes += ` text-${val.color.name}${val.color.range ? `-${val.color.range}` : ''}`;
        }

        if (val.textAlign) {
          classes += ` text-${val.textAlign}`;
        }
      }
    }
  }
  return classes;
}

export function buildLayerStyleAttribute(
  result: string,
  [key, val]: [keyof WidgetPropertyModel, WidgetPropertyModel['styles']],
): string {
  if (val !== undefined && val !== null) {
    if (key === 'styles') {
      // Assuming styles is an object where keys are CSS properties and values are their corresponding values
      if (val && typeof val === 'object') {
        if (val.background) {
          if (val.background.image) {
            // https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFja2dyb3VuZCUyMGltYWdlfGVufDB8fDB8fHww
            result += `background-image: url('${val.background.image}');`;
          }
        }
      }
    }
  }
  return result;
}
