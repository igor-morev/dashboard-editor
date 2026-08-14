import { AI_SYSTEM_JSON_RESPONSE } from "@app/application-project-editor/ai/constants/ai-system-prompt";

export type ProjectResponseDto = typeof AI_SYSTEM_JSON_RESPONSE;

export interface WidgetPropertyModel {
  defaultClass?: string;
  class?: string;
  layout?: string;
  content?: string | Record<string, any>;
  label?: string;
  name?: string;
  placeholder?: string;
  href?: string;
  target?: string;
  type?: string;
  options?: string[];
  inputType?: string;
  required?: boolean;
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
  id: string;
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

export interface ProjectSummaryDto {
  id: string;
  name: string;
  industry?: string;
  status: 'draft' | 'published';
  updatedAt?: string;
}

export interface ProjectPageSummaryDto {
  id: string;
  pageName: string;
}

export interface ProjectDto extends ProjectSummaryDto {
  theme?: DesignTokens;
  pages: ProjectPageSummaryDto[];
}

export interface CreateProjectDto {
  name: string;
  industry?: string;
}

export type UpdateProjectDto = Partial<{
  name: string;
  theme: DesignTokens;
  status: 'draft' | 'published';
}>;

export interface PageDto {
  id: string;
  pageName: string;
  layers: LayerDto[];
}