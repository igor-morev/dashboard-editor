import { AI_SYSTEM_JSON_RESPONSE } from "@app/application-project-editor/ai/constants/ai-system-prompt";

export type ProjectResponseDto = typeof AI_SYSTEM_JSON_RESPONSE;

export interface WidgetPropertyModel {
  defaultClass?: string;
  class?: string;
  content?: string | Record<string, any>;
  label?: string;
  name?: string;
  placeholder?: string;
  href?: string;
  target?: string;
  type?: string;
  options?: string[];
  inputType?: string;
  background?: Partial<{
    color: {
      name: string;
      range: string;
    };
    image: string;
    position: string;
    repeat: string;
    size: string;
  }>;
  color?: {
    name: string;
    range: string;
  };
}

export interface WidgetReference {
  widgetType: string;
}

export interface LayerDto {
  id: string;
  isVisible: boolean;
  widgetReference: WidgetReference;
  layerPropertyModel: WidgetPropertyModel;
  children: LayerDto[];
}

export interface FontPair {
  heading: string;
  body: string;
}

export interface DesignTokens {
  name: string;
  primaryColor: string;
  surfaceColor: string;
  contrastColor: string;
  borderRadius: string; // '0px', '8px', '24px'
  fontFamily: FontPair;
  typeScale: number; // 1.15, 1.25, 1.4
  baseFontSize: number; // 16
}


export interface ExportPayloadDto {
  projectName: string;
  layers: LayerDto[];
  theme: DesignTokens;
}