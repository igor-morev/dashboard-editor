import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComparisonConfig, ObjectComparison } from './object-comparison/object-comparison';

@Component({
  selector: 'de-version-comparison',
  imports: [ObjectComparison],
  templateUrl: './version-comparison.html',
  styleUrl: './version-comparison.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionComparison {
  businessRule1 = {
    id: '1',
    name: 'Rule A',
    priority: 'HIGH',
    conditions: {
      operator: 'AND',
      rules: [
        { field: 'status', opeator: 'equal', value: 'ACTIVE' }
      ]
    },
    owner: {
      name: 'John Doe',
      email: 'john@example.com',
      department: 'Finance'
    }
  };

  businessRule2 = {
    id: '1',
    name: 'Rule A',
    priority: 'MEDIUM', // Different
    conditions: {
      operator: 'AND',
      rules: [
        { field: 'status', opeator: 'contains', value: 'PENDING' } // Different
      ]
    },
    owner: {
      name: 'John Doe',
      email: 'john@example.com',
      department: 'Accounting' // Different
    }
  };

  config: ComparisonConfig = {
    fieldLabels: {
      businessRuleName: 'Rule Name',
      conditions: 'Conditions',
      owner: 'Owner',
      operator: 'Logical Operator',
      rules: 'Business Rules'
    },
    fieldRenderers: [
      {
        fieldName: 'priority',
        render: (value) => {
          const colors: Record<string, any> = { HIGH: '🔴 HIGH', MEDIUM: '🟡 MEDIUM', LOW: '🟢 LOW' };
          return colors[value] || value;
        }
      },
      {
        fieldName: 'department',
        render: (value) => `📍 ${value}`
      }
    ],
    ignoredFields: ['id', 'metadata'],
    highlightDifferences: true
  };
}
