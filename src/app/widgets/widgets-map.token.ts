import { InjectionToken } from "@angular/core";
import { WidgetsMap } from "@app/api/types/widget";
import { defer } from "rxjs";

// Must register all widgets here
export const WIDGETS_REGISTRY_MAP = new InjectionToken<WidgetsMap>('Widgets mapping list', {
  factory: () => {
    return {
      'overview': defer(() => import('./components/overview/overview').then(m => m.Overview)),
      'analytics-widget': defer(() => import('./components/analytics-widget/analytics-widget').then(m => m.AnalyticsWidget)),
      'registry': defer(() => import('./components/registry/registry').then(m => m.Registry)),
    };
}});