import { colorPalette, colorRange } from "@app/application-project-editor/constants/application-editor.constant";
import { Widget } from "@app/application-project-editor/types/application-editor.type";
import { columnWidget } from "./column";
import { containerWidget } from "./container";
import { headingWidget } from "./heading";
import { rowWidget } from "./row";
import { sectionWidget } from "./section";
import { textWidget } from "./text";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQContent {
  title: string;
  subtitle?: string;
  items: FAQItem[];
}

export type FAQLayout = 'accordion' | 'two-columns' | 'centered-list' | 'minimal-grid';

export function faqWidget(layout: FAQLayout = 'accordion', content?: FAQContent): Widget {
  
  const layoutTransformer = (currentLayout: FAQLayout, data: FAQContent) => {
    
    // Хелпер для элемента вопроса (имитация аккордеона или просто блока)
    const createFAQItem = (item: FAQItem, classes: string) => columnWidget([
      headingWidget({ 
        content: item.question, 
        class: 'text-xl font-semibold mb-2 cursor-pointer' 
      }),
      textWidget({ 
        content: item.answer, 
        class: 'text-base opacity-80 pb-4 border-b border-gray-100' 
      })
    ], { class: classes });

    const layouts: Record<FAQLayout, Widget[]> = {
      // 1. Классический аккордеон (вертикальный список)
      'accordion': [
        containerWidget([
          headingWidget({ content: data.title, class: 'text-3xl font-bold text-center mb-12' }),
          rowWidget(
            data.items.map(item => createFAQItem(item, 'w-full max-w-3xl mx-auto mb-6')),
            { class: 'flex-col' }
          )
        ])
      ],

      // 2. Две колонки (Вопрос слева, Ответ справа) - для Healthcare/Fintech
      'two-columns': [
        containerWidget([
          headingWidget({ content: data.title, class: 'text-3xl font-bold mb-12' }),
          ...data.items.map(item => rowWidget([
            columnWidget([headingWidget({ content: item.question, class: 'text-xl font-medium' })], { class: 'w-full' }),
            columnWidget([textWidget({ content: item.answer, class: 'opacity-80' })], { class: 'w-full pb-8 mb-8 border-b' })
          ], { class: 'gap-8' }))
        ])
      ],

      // 3. Минималистичная сетка (Grid) - для AI/Grooming
      'minimal-grid': [
        containerWidget([
          headingWidget({ content: data.title, class: 'text-3xl font-bold text-center mb-12' }),
          rowWidget(
            data.items.map(item => createFAQItem(item, 'w-1/2 p-4')),
            { class: 'flex-wrap gap-y-8' }
          )
        ])
      ],

      // 4. Центрированный список (для мобильных и лендингов)
      'centered-list': [
        containerWidget([
          columnWidget([
            headingWidget({ content: data.title, class: 'text-2xl font-bold mb-4' }),
            textWidget({ content: data.subtitle, class: 'mb-10 opacity-70' }),
            ...data.items.map(item => createFAQItem(item, 'mb-8'))
          ], { class: 'max-w-2xl mx-auto text-center' })
        ])
      ]
    };

    return layouts[currentLayout];
  };

  const defaultContent: FAQContent = content || {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about our service',
    items: [
      { question: 'How does it work?', answer: 'Our platform automates the entire process using advanced machine learning algorithms.' },
      { question: 'Is there a free trial?', answer: 'Yes, we offer a 14-day free trial for all new users with no credit card required.' },
      { question: 'Can I cancel anytime?', answer: 'Absolutely. You can downgrade or cancel your subscription at any point from your dashboard.' }
    ]
  };

  return {
    ...sectionWidget(),
    id: 'faq-widget',
    widgetName: 'FAQ',
    widgetType: 'section',
    propertyConfig: {
      layout: { options: ['accordion', 'two-columns', 'centered-list', 'minimal-grid'] },
      styles: { backgroundColor: { nameOptions: colorPalette, rangeOptions: colorRange } }
    },
    defaultWidgetPropertyModel: {
      layout,
      class: 'py-20 bg-gray-50',
      content: defaultContent as Record<string, any>,
    },
    layoutTransformer,
    children: layoutTransformer(layout, defaultContent)
  } as Widget;
}
