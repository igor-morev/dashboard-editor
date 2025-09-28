import { Type } from "@angular/core";
import { Observable } from "rxjs";

interface WidgetConfig {
  id: string;
  title: string;
  componentType: 'text' | 'list' | 'image' | 'bar-chart' | 'line-chart' | 'grid';
  data: string | {
    accesToken?: string;
    url: string;
    queryParams?: {};
  } | [];
  filters?: {};
  sorting?: {};
  toolbar?: WidgetConfig[];
}

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