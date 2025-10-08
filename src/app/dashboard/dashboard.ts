import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Widget } from '@app/api/types/widget';
import { Layout } from '@app/layout/layout';
import { LayoutItem } from '@app/layout/layout-item';
import { LayoutItemComponent } from '@app/layout/layout-item/layout-item';

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
import { delay, of, startWith } from 'rxjs';
@Component({
  selector: 'de-dashboard',
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, CdkDragPlaceholder, Layout, LayoutItemComponent, MatIconModule, MatListModule, GenericWidget],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  isUnderLayout = false;

  widgets: Widget[] = [
    {
      id: 'analytics-widget',
      title: 'Analytics',
      config: [
        {
          id: 'bar',
          title: 'Emissions',
          component: 'bar',
          api: {
            apiUrl: 'test',
            response: of([1, 2, 3]).pipe(
              delay(300),
              startWith(null)
            )
          },
          next: {
            id: 't123124234',
            title: 'txt',
            component: 'text',
            data: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.'
          }
        },
        {
          id: 'line',
          title: 'Finance',
          component: 'line',
          api: {
            apiUrl: 'test',
            response: of([44, 66, 2]).pipe(
              delay(200),
              startWith(null)
            )
          }
        },
        {
          id: 'pie',
          title: 'Medicine',
          component: 'pie',
          api: {
            apiUrl: 'test',
            response: of([
              {
                name: 'Water',
                y: 55.02
            },
            {
                name: 'Fat',
                y: 26.71
            },
            {
                name: 'Carbohydrates',
                y: 1.09
            },
            {
                name: 'Protein',
                y: 15.5
            },
            {
                name: 'Ash',
                y: 1.68
            }
            ]).pipe(
              delay(300),
              startWith(null)
            )
          }
        }
      ],
    },
    {
      id: 'overview',
      title: 'Overview',
      config: {
        id: 'overview',
        component: 'text',
        api: {
          apiUrl: 'fake',
          response: of(`There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.`).pipe(
            delay(1000),
            startWith(null),
          )
        },
        data: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.`,
        next: {
          id: 'overview1',
          component: 'ul',
          data: ['Nam porta mi nec est lacinia rhoncus.', 'Sed scelerisque elit quis orci sodales aliquam.'],
          next: {
            id: 'overview2',
            component: 'image',
            data: 'https://plus.unsplash.com/premium_photo-1677545183884-421157b2da02?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          }
        }
      }
    },
    {
      id: 'registry',
      title: 'Registry',
      config: {
        id: 'text1',
        component: 'text',
        data: 'Nulla tincidunt dolor nec auctor volutpat.',
        next: {
          id: 'grid',
          title: 'title',
          component: 'grid',
          data: [
            ['position', 'name', 'weight', 'symbol'],
            [
              {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
              {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
              {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
              {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
              {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
            ]
          ],
          next: {
            id: 'overview2',
            component: 'image',
            data: 'https://images.unsplash.com/photo-1472491235688-bdc81a63246e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          }
        }
      }
    }
  ];

  layoutItems: LayoutItem[] = [];

  dropWidget(event: CdkDragDrop<LayoutItem[], Widget[], Widget>) {    
    this.isUnderLayout = false;

    if (event.previousContainer.id === event.container.id) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // TODO: check logic here
      const newLayoutItem: LayoutItem = {
        id: this.layoutItems.length + 1,
        widgetRef: event.item.data
      };

      transferArrayItem(
        event.previousContainer.data.map((item, i) => {
          return {
            id: i,
            widgetRef: item
          }
        }),
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      event.container.data[event.currentIndex] = newLayoutItem;

      this.#removeWidgetItem(event.item.data);
    }
    
  }

  removeLayoutItem(item: LayoutItem) {
    this.layoutItems = this.layoutItems.filter(el => el.id !== item.id);
    this.widgets.push(item.widgetRef);
  }

  #removeWidgetItem(item: Widget) {
    this.widgets = this.widgets.filter(el => el.id !== item.id);
  }

  onLayoutEnter() {
    this.isUnderLayout = true;
  }

  onLayoutExit() {
    this.isUnderLayout = false;
  }

  onLayoutDragStarted() {
    this.isUnderLayout = true;
  }
}
