import { Type } from "@angular/core";
import { PointOptionsObject } from "highcharts";
import { Observable } from "rxjs";

interface ApiSource<T> {
  apiUrl: string;
  response: Observable<T | null>
  accesToken?: string;
}

interface WidgetConfigBase<T> {
  id: string;
  title?: string;
  next?: WidgetConfig;
  api?: ApiSource<T>;
  data?: T;
}

interface WidgetConfigText extends WidgetConfigBase<string> {
  component: 'text',
}

interface WidgetConfigList extends WidgetConfigBase<string[]> {
  component: 'ul',
}

interface WidgetConfigImage extends WidgetConfigBase<string> {
  component: 'image',
}

export interface WidgetConfigBarChart extends WidgetConfigBase<number[]> {
  component: 'bar',
}

export interface WidgetConfigLineChart extends WidgetConfigBase<number[]> {
  component: 'line',
}

export interface WidgetConfigPieChart extends WidgetConfigBase<(number | Pick<PointOptionsObject, 'name' | 'y'>)[]> {
  component: 'pie',
}

interface WidgetConfigGrid extends WidgetConfigBase<[string[], Record<string, any>[]]> {
  component: 'grid',
  filters?: {};
  sorting?: {};
}

export type WidgetConfigChart = WidgetConfigBarChart | WidgetConfigLineChart | WidgetConfigPieChart;

export type WidgetConfig = 
  WidgetConfigText | 
  WidgetConfigList | 
  WidgetConfigImage | 
  WidgetConfigChart | 
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