import { Injectable } from '@angular/core';
import { Widget } from '../types/application-editor.type';
import { containerWidget } from './widgets-lib/container';
import { sectionWidget } from './widgets-lib/section';
import { bannerWidget } from './widgets-lib/banner';
import { linkWidget } from './widgets-lib/link';
import { listWidget } from './widgets-lib/list';
import { listItemWidget } from './widgets-lib/list-item';
import { headerWidget } from './widgets-lib/header';
import { linkButtonWidget } from './widgets-lib/link-button';
import { headingWidget } from './widgets-lib/heading';
import { textWidget } from './widgets-lib/text';
import { imageWidget } from './widgets-lib/image';
import { columnWidget } from './widgets-lib/column';
import { rowWidget } from './widgets-lib/row';
import {
  baseFeatureSectionWidget,
  featureSectionWidget1,
  featureSectionWidget2,
} from './widgets-lib/feature-section';

@Injectable({
  providedIn: 'root',
})
export class WidgetsState {
  private _widgets: Widget[] = [
    containerWidget(),
    sectionWidget(),
    rowWidget(),
    columnWidget(),
    headingWidget(),
    textWidget(),
    imageWidget(),
    listWidget([listItemWidget()]),
    linkButtonWidget(),
    linkWidget('Home'),
    {
      id: 'icon-widget',
      widgetName: 'Icon',
      widgetType: 'icon',
      canNotBeAddedInside: (widget) => {
        return true;
      },
      defaultWidgetPropertyModel: {
        class: '',
      },
    },
    bannerWidget(),
    headerWidget(),
    baseFeatureSectionWidget(),
    featureSectionWidget1(),
    featureSectionWidget2(),
  ];

  get widgets() {
    return this._widgets;
  }
}
