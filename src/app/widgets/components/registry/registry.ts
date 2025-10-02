import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

type TableRow = Record<string, any>;

const ELEMENT_DATA: TableRow[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
];

@Component({
  selector: 'de-registry',
  imports: [MatTableModule],
  templateUrl: './registry.html',
  styleUrl: './registry.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Registry {
  columns: string[] = ['position', 'name', 'weight', 'symbol'];
  rows = ELEMENT_DATA;
}
