export interface LayoutItem {
  id: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  widgetRef: {
    id: string;
    title: string;
  }
}