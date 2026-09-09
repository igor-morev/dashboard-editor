import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform<T, K extends keyof T>(
    items: T[] | null | undefined, 
    searchText: string, 
    propertyName: K
  ): T[] {
    if (!items) return [];
    if (!searchText) return items;

    const lowerSearch = searchText.toLowerCase();

    return items.filter(item => {
      const value = item[propertyName];
      if (value !== null && value !== undefined) {
        return value.toString().toLowerCase().includes(lowerSearch);
      }
      return false;
    });
  }

}
