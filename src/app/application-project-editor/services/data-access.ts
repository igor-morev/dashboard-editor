import { Injectable, inject } from '@angular/core';
import { ProjectEditorApi } from '@app/api/services/project-editor-api';
import { ApplicationEditorState } from '../state/application-editor-state';
import { Layer } from '../types/project.type';
import { Widget } from '../types/widget.type';
import { scaffoldLayer } from '../utils/editor';
import { LayersEditor } from './layers-editor';
import { ThemeManager } from './theme-manager';
import { ProjectResponseDto } from '@app/api/types/project';
import { sectionWidget } from '../widgets-lib/section';
import {
  headerWidget,
  featureSectionWidget,
  heroWidget,
  bannerWidget,
  testimonialsWidget,
  faqWidget,
  footerWidget,
} from '../widgets-lib/sections';
import { contactSectionWidget } from '../widgets-lib/contact';

@Injectable({
  providedIn: 'root',
})
export class DataAccess {
  private api = inject(ProjectEditorApi);
  private state = inject(ApplicationEditorState);
  private layersEditor = inject(LayersEditor);
  private themeManager = inject(ThemeManager);

  get appState() {
    return this.state.appState;
  }

  renderPage(response: ProjectResponseDto) {
    this.state.resetAppState();

    this.themeManager.setCustomTheme(response.theme);

    const widgets = this.convertProjectResponseDtoToSectionWidgets(response);

    console.log(widgets);

    widgets.forEach((widget) => this.populateLayer(widget));
  }

  private populateLayer(widget: Widget, selectedLayer: Layer = scaffoldLayer()) {
    const newLayer = this.layersEditor.createLayerForWidget(
      widget,
      selectedLayer.id,
      selectedLayer.children.length,
    );
    const updatedLayers = this.layersEditor.insertLayerInSchema(
      this.appState.appViewSchema.layers,
      selectedLayer.id,
      newLayer,
    );
    const updatedMap = this.layersEditor.updateLayersMap(updatedLayers, {});

    this.state.updateAppState({
      selectedLayer: updatedMap[newLayer.parentId!],
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayers,
        layersMap: this.layersEditor.updateLayersMap(updatedLayers, {}),
      },
    });
  }

  convertProjectResponseDtoToSectionWidgets(projectResponseDto: ProjectResponseDto) {
    // it should return array of widgets with all properties mapped from projectResponseDto
    return projectResponseDto.sections.map((section) => {
      switch (section.type) {
        case 'header': {
          console.log('Converting header section:', section);
          return headerWidget(section.layout as any, section.content as any);
        }

        case 'features': {
          return featureSectionWidget(section.layout as any, section.content as any);
        }

        case 'hero': {
          return heroWidget(section.layout as any, section.content as any);
        }

        case 'banner': {
          return bannerWidget(section.layout as any, section.content as any);
        }

        case 'testimonials': {
          return testimonialsWidget(section.layout as any, section.content as any);
        }

        case 'contact': {
          return contactSectionWidget(section.layout as any, section.content as any);
        }

        case 'faq': {
          return faqWidget(section.layout as any, section.content as any);
        }

        case 'footer': {
          return footerWidget(section.layout as any, section.content as any);
        }

        default:
          return sectionWidget();
      }
    });
  }
}
