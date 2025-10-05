import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { WidgetConfig, WidgetConfigBarChart, WidgetConfigLineChart, WidgetConfigPieChart } from '@app/api/types/widget';
import { HighchartsChartDirective } from 'highcharts-angular';
import { TypedTemplateDirective } from './typed-template.directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'de-widget',
  imports: [TypedTemplateDirective, MatTabsModule, HighchartsChartDirective, NgTemplateOutlet],
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

  getHighchartOption(config: WidgetConfigBarChart | WidgetConfigLineChart | WidgetConfigPieChart): Highcharts.Options {
    return {
      title: {
        text: config.title,
        style: {
          'display': 'none'
        }
      },
      series: [
        {
          data: config.data,
          type: config.component,
        },
        {
          data: config.data,
          type: config.component,
        },
      ],
    }
  }
}
