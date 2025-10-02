import { Type } from "@angular/core";
import { Observable } from "rxjs";

interface ApiSource {
  apiUrl: string;
  accesToken?: string;
}

interface WidgetConfigText {
  id: string;
  title?: string;
  component: 'text',
  api?: ApiSource;
  data: string;
}

interface WidgetConfigList {
  id: string;
  title?: string;
  component: 'list',
  api?: ApiSource;
  data: string[];
}

interface WidgetConfigImage {
  id: string;
  title?: string;
  component: 'image',
  api?: ApiSource;
  data: string;
}

interface WidgetConfigBarChart {
  id: string;
  title?: string;
  component: 'bar',
  api?: ApiSource;
  data: number[];
}

interface WidgetConfigGrid {
  id: string;
  title?: string;
  component: 'grid',
  api?: ApiSource;
  data: [string[], Record<string, any>[]];
  filters?: {};
  sorting?: {};
}
type WidgetConfig = WidgetConfigText | WidgetConfigList | WidgetConfigImage | WidgetConfigBarChart | WidgetConfigGrid;

export interface Widget {
  id: string;
  title: string;
  type?: string;
  options?: {
    columns: number;
    rows: number;
  };
  config?: WidgetConfig | WidgetConfig[];
}

export type WidgetsMap = Record<Widget['id'], Observable<Type<any>>>;