import { DesignTokens } from './theme';
import { Widget } from './widget.type';

export interface Template {
  id: string;
  templateName: string;
  description?: string;
  thumbnailUrl?: string;
  theme: DesignTokens;
  widgets: Widget[];
}
