import {
  ImageWidget,
  ImageWidgetPropertyModel,
  Widget,
} from '@app/application-project-editor/types/widget.type';

export function imageWidget(model: Partial<ImageWidgetPropertyModel> = {}): ImageWidget {
  return {
    id: 'image-widget',
    widgetName: 'Image',
    widgetType: 'image',
    // renderContent:
    //   'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
    canNotBeAddedInside: (widget) => {
      return true;
    },
    propertyConfig: {
      hasContent: true,
    },
    defaultWidgetPropertyModel: {
      class: 'w-full h-auto',
      src: '',
      content:
        'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
      alt: '',
      ...model,
    },
  };
}
