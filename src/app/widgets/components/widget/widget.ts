import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { WidgetConfig, WidgetConfigChart} from '@app/api/types/widget';
import { HighchartsChartDirective } from 'highcharts-angular';
import { TypedTemplateDirective } from './typed-template.directive';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'de-widget',
  imports: [AsyncPipe, TypedTemplateDirective, MatTabsModule, HighchartsChartDirective, NgTemplateOutlet, NgxSkeletonLoaderComponent, MatTableModule],
  templateUrl: './widget.html',
  styleUrl: './widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericWidget {
  config = input.required<WidgetConfig | WidgetConfig[]>();

  // here we create typeToken. the value doesn't matter as it's never used, but the type of this variable defines the types of all template parameters. 
  typeToken!: {
    $implicit: WidgetConfig;
  };

  isArray = Array.isArray;

  getHighchartOption(config: WidgetConfigChart, serverData?: WidgetConfigChart['data']): Highcharts.Options {
    return {
      title: {
        text: config.title,
        style: {
          'display': 'none'
        }
      },
      series: [
        {
          data: serverData ? serverData : config.data,
          type: config.component,
        },
        {
          data: serverData ? serverData : config.data,
          type: config.component,
        },
      ],
    }
  }
}
