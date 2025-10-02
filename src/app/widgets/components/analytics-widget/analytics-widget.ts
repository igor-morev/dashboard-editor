import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { HighchartsChartDirective } from 'highcharts-angular';

@Component({
  selector: 'de-analytics-widget',
  imports: [MatTabsModule, HighchartsChartDirective],
  templateUrl: './analytics-widget.html',
  styleUrl: './analytics-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsWidget {
  options: Highcharts.Options[] = [{
    title: {
      text: 'Emissions',
      style: {
        'display': 'none'
      }
    },
    series: [
      {
        data: [1, 2, 3],
        type: 'bar',
        name: 'dfsdf'
      },
      {
        data: [1, 2, 3],
        type: 'bar',
        name: 'vcbcvb'
      },
    ],
  }, {
    title: {
      text: 'Finance',
      style: {
        'display': 'none'
      }
    },
    series: [
      {
        data: [1, 2, 3],
        type: 'line',
        name: 'dfsdf'
      },
      {
        data: [1, 2, 3],
        type: 'line',
        name: 'vcbcvb'
      },
    ],
  }, {
    title: {
      text: 'Historic World Population by Region',
      style: {
        'display': 'none'
      }
    },
    series: [
      {
        data: [
          {
            name: 'Water',
            y: 55.02
          },
          {
            name: 'Fat',
            sliced: true,
            selected: true,
            y: 26.71
          },
          {
            name: 'Carbohydrates',
            y: 1.09
          },
          {
            name: 'Protein',
            y: 15.5
          },
          {
            name: 'Ash',
            y: 1.68
          }
        ],
        type: 'pie',
        name: 'dfsdf'
      },
    ],
  }];
}
