import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'de-application-projects',
  imports: [RouterLink],
  templateUrl: './application-projects.html',
  styleUrl: './application-projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationProjects {

}
