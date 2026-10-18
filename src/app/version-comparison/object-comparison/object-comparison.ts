import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ComparisonFieldRenderer {
  fieldName: string;
  render: (value: any, object: any) => string | null;
}

export interface ComparisonConfig {
  fieldRenderers?: ComparisonFieldRenderer[];
  fieldLabels?: Record<string, string>;
  ignoredFields?: string[];
  highlightDifferences?: boolean;
  nestedFieldLabelPrefix?: boolean;
}

interface ComparisonField {
  name: string;
  label: string;
  leftValue: any;
  rightValue: any;
  isDifferent: boolean;
  isNested: boolean;
  nestedFields?: ComparisonField[];
}

@Component({
  selector: 'de-object-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './object-comparison.html',
  styleUrls: ['./object-comparison.scss'],
})
export class ObjectComparison implements OnInit {
  @Input() leftObject: any;
  @Input() rightObject: any;
  @Input() config: ComparisonConfig = {
    highlightDifferences: true,
    ignoredFields: ['id', '_id'],
    nestedFieldLabelPrefix: true,
  };

  comparisonFields: ComparisonField[] = [];

  ngOnInit(): void {
    this.buildComparison();
  }

  private buildComparison(): void {
    const allKeys = this.getAllKeys(this.leftObject, this.rightObject);
    const ignoredFields = this.config.ignoredFields || [];

    this.comparisonFields = allKeys
      .filter(key => !ignoredFields.includes(key))
      .map(key => this.createComparisonField(key, ''));
  }

  private getAllKeys(obj1: any, obj2: any): string[] {
    const keys = new Set<string>();
    if (obj1 && typeof obj1 === 'object') {
      Object.keys(obj1).forEach(k => keys.add(k));
    }
    if (obj2 && typeof obj2 === 'object') {
      Object.keys(obj2).forEach(k => keys.add(k));
    }
    return Array.from(keys).sort();
  }

  private createComparisonField(fieldName: string, parentLabel: string): ComparisonField {
    const leftValue = this.leftObject?.[fieldName];
    const rightValue = this.rightObject?.[fieldName];
    const isNested = this.isComplexObject(leftValue) || this.isComplexObject(rightValue);

    const label = this.config.fieldLabels?.[fieldName] || this.formatFieldName(fieldName);
    const finalLabel = parentLabel && this.config.nestedFieldLabelPrefix ? `${parentLabel} → ${label}` : label;

    const field: ComparisonField = {
      name: fieldName,
      label: finalLabel,
      leftValue,
      rightValue,
      isDifferent: !this.deepEqual(leftValue, rightValue),
      isNested,
    };

    // Flatten nested objects
    if (isNested) {
      field.nestedFields = this.flattenNestedFields(leftValue, rightValue, label);
    }

    return field;
  }

  private flattenNestedFields(leftObj: any, rightObj: any, parentLabel: string): ComparisonField[] {
    const allKeys = this.getAllKeys(leftObj, rightObj);
    const ignoredFields = this.config.ignoredFields || [];

    return allKeys
      .filter(key => !ignoredFields.includes(key))
      .map(key => {
        const leftValue = leftObj?.[key];
        const rightValue = rightObj?.[key];
        const label = this.config.fieldLabels?.[key] || this.formatFieldName(key);
        const finalLabel = `${parentLabel} → ${label}`;
        const isNested = this.isComplexObject(leftValue) || this.isComplexObject(rightValue);

        const field: ComparisonField = {
          name: key,
          label: finalLabel,
          leftValue,
          rightValue,
          isDifferent: !this.deepEqual(leftValue, rightValue),
          isNested,
        };

        // One level deeper for very nested structures
        if (isNested) {
          field.nestedFields = this.flattenNestedFields(leftValue, rightValue, finalLabel);
        }

        return field;
      });
  }

  private isComplexObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  private deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object' || a === null || b === null) return false;
    return JSON.stringify(a) === JSON.stringify(b);
  }

  private formatFieldName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, char => char.toUpperCase())
      .trim();
  }

  renderValue(fieldName: string, value: any, object: any): string {
    const renderer = this.config.fieldRenderers?.find(
      r => r.fieldName === fieldName
    );
    if (renderer) {
      const result = renderer.render(value, object);
      return result || this.defaultRender(value);
    }
    return this.defaultRender(value);
  }

  private defaultRender(value: any): string {
    if (value === null || value === undefined) {
      return '—';
    }
    if (Array.isArray(value)) {
      return `${value.length} items`;
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'object') {
      return '[Complex Object]';
    }
    return String(value);
  }

  getAllFlattedFields(): ComparisonField[] {
    return this.comparisonFields.reduce((acc, field) => {
      acc.push(field);
      if (field.nestedFields) {
        acc.push(...field.nestedFields);
      }
      return acc;
    }, [] as ComparisonField[]);
  }
}