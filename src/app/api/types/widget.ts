import { Type } from "@angular/core";
import { Observable } from "rxjs";

interface ApiSource {
  apiUrl: string;
  accesToken?: string;
}

interface WidgetConfigBase {
  id: string;
  title?: string;
  next?: WidgetConfig;
}

interface WidgetConfigText extends WidgetConfigBase {
  component: 'text',
  api?: ApiSource;
  data: string;
}

interface WidgetConfigList extends WidgetConfigBase {
  component: 'list',
  api?: ApiSource;
  data: string[];
}

interface WidgetConfigImage extends WidgetConfigBase {
  component: 'image',
  api?: ApiSource;
  data: string;
}

export interface WidgetConfigBarChart extends WidgetConfigBase {
  component: 'bar',
  api?: ApiSource;
  data: number[];
}

export interface WidgetConfigLineChart extends WidgetConfigBase {
  component: 'line',
  api?: ApiSource;
  data: number[];
}

export interface WidgetConfigPieChart extends WidgetConfigBase {
  component: 'pie',
  api?: ApiSource;
  data: number[];
}

interface WidgetConfigGrid extends WidgetConfigBase {
  component: 'grid',
  api?: ApiSource;
  data: [string[], Record<string, any>[]];
  filters?: {};
  sorting?: {};
}

export type WidgetConfig = 
  WidgetConfigText | 
  WidgetConfigList | 
  WidgetConfigImage | 
  WidgetConfigBarChart | 
  WidgetConfigLineChart | 
  WidgetConfigPieChart | 
  WidgetConfigGrid;

export interface Widget {
  id: string;
  title: string;
  type?: string;
  options?: {
    columns: number;
    rows: number;
  };
  config: WidgetConfig | WidgetConfig[];
}

export type WidgetsMap = Record<Widget['id'], Observable<Type<any>>>;