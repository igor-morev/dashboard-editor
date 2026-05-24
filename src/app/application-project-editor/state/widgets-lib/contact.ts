import { Widget } from '@app/application-project-editor/types/widget.type';
import { buttonWidget } from './button';
import { columnWidget } from './column';
import { containerWidget } from './container';
import { formWidget } from './form/form';
import { selectInputWidget } from './form/select-input';
import { textInputWidget } from './form/text-input';
import { textareaWidget } from './form/textarea';
import { headingWidget } from './heading';
import { rowWidget } from './row';
import { sectionWidget } from './section';
import { textWidget } from './text';

export interface ContactContent {
  title: string;
  subtitle: string;
  formTitle?: string;
  contacts?: Array<{ icon: string; text: string }>;
  imageSrc?: string; // Для лейаутов с фото
}

export type ContactLayout =
  | 'simple-stack'
  | 'split-form-right'
  | 'split-form-left'
  | 'card-overlay'
  | 'contact-grid';

export function contactSectionWidget(
  layout: ContactLayout = 'simple-stack',
  content?: ContactContent,
): Widget {
  const layoutTransformer = (currentLayout: ContactLayout, data: ContactContent) => {
    // 1. Создаем блок с текстом
    const textInfo = columnWidget(
      [
        headingWidget({ content: data.title, class: 'text-project-h2 mb-4' }),
        textWidget({ content: data.subtitle, class: 'text-project-body mb-8' }),
        // Добавляем список контактов, если они есть
        ...(data.contacts?.map((c) => textWidget({ content: c.text, class: 'mb-2 font-medium' })) ||
          []),
      ],
      { class: 'flex flex-col' },
    );

    // 2. Создаем блок с формой (оборачиваем в карточку для красоты)
    const formBlock = columnWidget(
      [
        containerWidget(
          [
            headingWidget({
              content: data.formTitle || 'Send us a message',
              class: 'text-project-h3 mb-6',
            }),
            formWidget([
              textInputWidget({
                label: 'Name',
                placeholder: 'Enter your name',
                class: 'mb-4',
                required: true,
              }),
              textInputWidget({
                label: 'Email',
                placeholder: 'Enter your email',
                class: 'mb-4',
                inputType: 'email',
                required: true,
              }),
              selectInputWidget({
                label: 'Service',
                options: ['Support', 'Sales', 'Other'],
                class: 'mb-4',
              }),
              textareaWidget({ label: 'Message', placeholder: 'How can we help?', class: 'mb-6' }),
              buttonWidget({
                type: 'submit',
                content: 'Send Request',
              }),
            ]),
          ],
          { class: 'bg-surface p-8 rounded-theme shadow-xl border border-contrast/5' },
        ),
      ],
      { class: 'w-full' },
    );

    const layouts: Record<ContactLayout, Widget[]> = {
      // 1. Все в один столбец по центру (Classic Mobile)
      'simple-stack': [
        containerWidget(
          [
            columnWidget([textInfo], { class: 'text-center items-center mb-12' }),
            columnWidget([formBlock], { class: 'max-w-2xl mx-auto' }),
          ],
          { class: 'py-20' },
        ),
      ],

      // 2. Текст слева, Форма справа (Desktop Standard)
      'split-form-right': [
        containerWidget(
          [
            rowWidget(
              [
                columnWidget([textInfo], { class: 'w-full mb-12' }),
                columnWidget([formBlock], { class: 'w-full' }),
              ],
              { class: 'items-center flex-wrap' },
            ),
          ],
          { class: 'py-20' },
        ),
      ],

      // 3. Форма слева, Текст справа (Инверсия)
      'split-form-left': [
        containerWidget(
          [
            rowWidget(
              [
                columnWidget([formBlock], { class: 'w-full' }),
                columnWidget([textInfo], { class: 'w-full mt-12' }),
              ],
              { class: 'items-center flex-wrap' },
            ),
          ],
          { class: 'py-20' },
        ),
      ],

      // 4. Форма в "плавающей" карточке поверх фона (Modern)
      'card-overlay': [
        sectionWidget(
          [
            containerWidget([
              rowWidget(
                [
                  columnWidget([textInfo], { class: 'w-full text-white' }),
                  columnWidget([formBlock], { class: 'w-full ml-auto mt-12' }),
                ],
                { class: 'items-center' },
              ),
            ]),
          ],
          {
            class: 'relative py-32 bg-contrast', // Тут можно добавить фоновое фото
          },
        ),
      ],

      // 5. Контакты и форма разделены сеткой
      'contact-grid': [
        containerWidget(
          [
            headingWidget({ content: data.title, class: 'text-project-h2 text-center mb-16' }),
            rowWidget([
              columnWidget([formBlock], { class: 'w-full' }),
              columnWidget(
                [
                  headingWidget({ content: 'Our Offices', class: 'text-project-h3 mb-4' }),
                  textWidget({ content: '123 Business St, New York' }),
                  textWidget({ content: '+1 234 567 890', class: 'mt-4 font-bold' }),
                ],
                { class: 'w-full mt-12' },
              ),
            ]),
          ],
          {
            class: 'py-20',
          },
        ),
      ],
    };

    return layouts[currentLayout];
  };

  const defaultContent: ContactContent = content || {
    title: 'Get in Touch',
    subtitle:
      'Have a question? We would love to hear from you. Send us a message and we will respond as soon as possible.',
    formTitle: 'Contact Us',
    contacts: [{ icon: 'phone', text: '+1 (555) 000-0000' }],
  };

  return {
    ...sectionWidget(),
    id: 'contact-section-widget',
    widgetName: 'Contact Section',
    widgetType: 'section',
    propertyConfig: {
      layout: {
        options: [
          'simple-stack',
          // 'split-form-right',
          'split-form-left',
          'card-overlay',
          'contact-grid',
        ],
      },
    },
    defaultWidgetPropertyModel: {
      layout,
      class: 'bg-surface',
      content: defaultContent as Record<string, any>,
    },
    layoutTransformer,
    children: layoutTransformer(layout, defaultContent),
  } as Widget;
}
