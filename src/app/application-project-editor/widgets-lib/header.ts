import { Widget } from '@app/application-project-editor/types/widget.type';
import { linkWidget } from './link';
import { listWidget } from './list';
import { listItemWidget } from './list-item';
import { imageWidget } from './image';
import { textWidget } from './text';
import { columnWidget } from './column';
import { rowWidget } from './row';
import {
  colorPalette,
  colorRange,
} from '@app/application-project-editor/constants/application-editor.constant';
import { containerWidget } from './container';
import { linkButtonWidget } from './link-button';

export interface HeaderContent {
  logoUrl?: string;
  brandName?: string;
  navLinks: Array<{ label: string; href: string }>;
  cta?: { label: string; href: string };
}

export type HeaderLayout = 'classic' | 'centered-logo' | 'nav-center' | 'minimal' | 'stacked';

export function headerWidget(layout: HeaderLayout = 'classic', content?: HeaderContent): Widget {
  const layoutTransformer = (currentLayout: HeaderLayout, data: HeaderContent) => {
    // Подготовка атомов
    const logo = columnWidget([
      imageWidget({
        content: data.logoUrl || 'https://cdn-icons-png.freepik.com/512/5200/5200787.png',
        class: 'w-[50px] object-contain',
      }),
    ]);

    const brand = columnWidget([
      textWidget({ content: data.brandName || 'Discover', class: 'font-bold' }),
    ]);

    const nav = columnWidget([
      listWidget(
        data.navLinks.map((link) => listItemWidget(linkWidget(link.label))),
        'flex gap-x-2 list-none',
      ),
    ]);

    const cta = columnWidget([linkButtonWidget({ content: data.cta?.label || 'Get Started' })], {
      class: 'text-right',
    });

    const layouts: Record<HeaderLayout, Widget[]> = {
      // 1. Лого (слева) --- Навигация (центр) --- Кнопка (справа)
      classic: [
        rowWidget([logo, brand, nav, cta], {
          class: 'items-center justify-between',
        }),
      ],

      // 2. Лого (по центру) --- Навигация и кнопка по бокам
      'centered-logo': [
        rowWidget([nav, logo, cta], {
          class: 'items-center justify-between',
        }),
      ],

      // 3. Лого (слева) --- Пустота --- Навигация (справа)
      'nav-center': [
        rowWidget(
          [
            logo,
            nav, // grow заставит навигацию занять центр
            cta,
          ],
          {
            class: 'items-center justify-between',
          },
        ),
      ],

      // 4. Только лого и навигация (без кнопок)
      minimal: [
        rowWidget([logo, brand, nav], {
          class: 'items-center justify-between',
        }),
      ],

      // 5. Двухэтажный (Лого вверху, меню внизу)
      stacked: [
        containerWidget(
          [
            rowWidget([logo, brand], { class: 'justify-center items-center py-2' }),
            rowWidget([nav], { class: 'justify-center border-t py-2' }),
          ],
          { class: 'w-full' },
        ),
      ],
    };

    return layouts[currentLayout];
  };

  const defaultContent: HeaderContent = content || {
    logoUrl: 'https://cdn-icons-png.freepik.com/512/5200/5200787.png',
    brandName: 'Discover',
    navLinks: [
      { label: 'Home', href: '/' },
      { label: 'Contact', href: '/contact' },
    ],
    cta: { label: 'Explore', href: '#' },
  };

  return {
    id: 'header-widget',
    widgetName: 'Header',
    widgetType: 'header',
    canNotBeAddedInside: (widget) =>
      widget.widgetType === 'header' || widget.widgetType === 'section',
    propertyConfig: {
      layout: { options: ['classic', 'centered-logo', 'nav-center', 'minimal', 'stacked'] },
      styles: { backgroundColor: { nameOptions: colorPalette, rangeOptions: colorRange } },
    },
    defaultWidgetPropertyModel: {
      layout,
      content: defaultContent as Record<string, any>,
      class: 'bg-white shadow-sm block px-6 py-2 w-full',
    },
    layoutTransformer,
    children: layoutTransformer(layout, defaultContent),
  } as Widget;
}
