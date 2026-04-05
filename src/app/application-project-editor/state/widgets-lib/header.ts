import { Widget } from '@app/application-project-editor/types/application-editor.type';
import { linkWidget } from './link';
import { listWidget } from './list';
import { listItemWidget } from './list-item';
import { imageWidget } from './image';
import { textWidget } from './text';
import { columnWidget } from './column';
import { rowWidget } from './row';

export function headerWidget(): Widget {
  return {
    id: 'header-widget',
    widgetName: 'Header',
    widgetType: 'header',
    canNotBeAddedInside: (widget) => {
      return widget.widgetType === 'header' || widget.widgetType === 'section';
    },
    defaultWidgetPropertyModel: {
      class: 'bg-gray-white h-16 flex items-center px-4',
    },
    children: [
      rowWidget([
        columnWidget([
          imageWidget({
            class: 'w-[50px]',
            src: '',
            alt: '',
            content:
              'https://cdn-icons-png.freepik.com/512/5200/5200787.png?ga=GA1.1.859669412.1773966547',
          }),
        ]),
        columnWidget(
          [
            textWidget({
              class: 'font-bold text-lg',
              content: 'Discover',
            }),
          ],
          {
            class: 'grow pl-2 pr-2  flex h-full items-center ',
          },
        ),
        columnWidget(
          [
            listWidget(
              [listItemWidget(linkWidget('Home')), listItemWidget(linkWidget('Contact'))],
              'flex gap-x-2 list-none',
            ),
          ],
          {
            class: 'grow flex pl-2 pr-2  flex h-full items-center ',
          },
        ),
      ]),
    ],
  };
}
