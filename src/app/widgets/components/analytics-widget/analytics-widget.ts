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
  data: unknown[] = [];

  chartOptions: Highcharts.Options = {
    series: [
      {
        data: [1, 2, 3],
        type: 'line',
      },
    ],
  };
}
