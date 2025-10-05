import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Widget } from '@app/api/types/widget';
import { Layout } from '@app/layout/layout';
import { LayoutItem } from '@app/layout/layout-item';
import { LayoutItemComponent } from '@app/layout/layout-item/layout-item';
import { WIDGETS_REGISTRY_MAP } from '@app/widgets/widgets-map.token';

import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';
import { GenericWidget } from '@app/widgets/components/widget/widget';
@Component({
  selector: 'de-dashboard',
  imports: [AsyncPipe, CdkDropListGroup, CdkDropList, CdkDrag, CdkDragPlaceholder, Layout, LayoutItemComponent, NgComponentOutlet, MatIconModule, MatListModule, GenericWidget],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  #widgetsRegistryMap = inject(WIDGETS_REGISTRY_MAP);

  widgets: Widget[] = [
    {
      id: 'analytics-widget',
      title: 'Analytics',
      config: [
        {
          id: 'bar',
          title: 'Emissions',
          component: 'bar',
          data: [1, 2, 3],
          next: {
            id: 't123124234',
            title: 'txt',
            component: 'text',
            data: 'Some text'
          }
        },
        {
          id: 'line',
          title: 'Finance',
          component: 'line',
          data: [1, 2, 3]
        },
        {
          id: 'pie',
          title: 'Medicine',
          component: 'pie',
          data: [2, 3, 4]
        }
      ],
    },
    {
      id: 'overview',
      title: 'Overview',
      config: {
        id: 'overview',
        title: 'title',
        component: 'text',
        data: 'Overview text',
      }
    },
    // {
    //   id: 'registry',
    //   title: 'Registry',
    // }
  ];

  layoutItems: LayoutItem[] = [];

  // layoutItems: LayoutItem[] = [
  //   {
  //     id: 0,
  //     widgetRef: this.widgets[0]
  //   },
  //   {
  //     id: 0,
  //     widgetRef: this.widgets[1]
  //   }
  // ];

  getWidget(id: string) {
    return this.#widgetsRegistryMap[id];
  }

  dropWidget(event: CdkDragDrop<LayoutItem[], Widget[], Widget>) {    
    if (event.previousContainer.id === event.container.id) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const newLayoutItem: LayoutItem = {
        id: this.layoutItems.length + 1,
        widgetRef: event.item.data
      };

      transferArrayItem(
        event.previousContainer.data.map(item => {
          return {
            id: 0,
            widgetRef: item
          }
        }),
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      event.container.data[event.currentIndex] = newLayoutItem;

      this.removeWidgetItem(event.item.data);
    }
    
  }

  removeLayoutItem(item: LayoutItem) {
    this.layoutItems = this.layoutItems.filter(el => el.id !== item.id);
    this.widgets.push(item.widgetRef);
  }

  removeWidgetItem(item: Widget) {
    this.widgets = this.widgets.filter(el => el.id !== item.id);
  }
}
