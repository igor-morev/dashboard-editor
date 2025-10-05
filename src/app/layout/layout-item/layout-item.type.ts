import { Widget } from "@app/api/types/widget";

export interface LayoutItem {
  id: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  widgetRef: Widget;
}