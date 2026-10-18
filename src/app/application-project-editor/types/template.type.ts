import { DesignTokens } from '@app/api/types/project';
import { Widget } from './widget.type';

export interface Template {
  id: string;
  templateName: string;
  source: 'ai-generated' | 'predefined';
  description?: string;
  thumbnailUrl?: string;
  theme: DesignTokens;
  widgets: Widget[];
}
