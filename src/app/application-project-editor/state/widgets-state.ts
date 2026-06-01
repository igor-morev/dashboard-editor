import { inject, Injectable, signal } from '@angular/core';
import { Template } from '../types/template.type';
import { Widget } from '../types/widget.type';
import { buttonWidget } from '../widgets-lib/button';
import { cardWidget } from '../widgets-lib/card';
import { columnWidget } from '../widgets-lib/column';
import { contactSectionWidget } from '../widgets-lib/contact';
import { containerWidget } from '../widgets-lib/container';
import { formWidget } from '../widgets-lib/form/form';
import { selectInputWidget } from '../widgets-lib/form/select-input';
import { textInputWidget } from '../widgets-lib/form/text-input';
import { textareaWidget } from '../widgets-lib/form/textarea';
import { headingWidget } from '../widgets-lib/heading';
import { iconWidget } from '../widgets-lib/icon';
import { imageWidget } from '../widgets-lib/image';
import { linkWidget } from '../widgets-lib/link';
import { linkButtonWidget } from '../widgets-lib/link-button';
import { listWidget } from '../widgets-lib/list';
import { listItemWidget } from '../widgets-lib/list-item';
import { rowWidget } from '../widgets-lib/row';
import { sectionWidget } from '../widgets-lib/section';
import {
  headerWidget,
  heroWidget,
  featureSectionWidget,
  bannerWidget,
  testimonialsWidget,
  faqWidget,
  footerWidget,
} from '../widgets-lib/sections';
import { textWidget } from '../widgets-lib/text';
import { ThemeManager } from '../services/theme-manager';

@Injectable({
  providedIn: 'root',
})
export class WidgetsState {
  private themeManager = inject(ThemeManager);

  private _widgets: Widget[] = [
    containerWidget(),
    sectionWidget(),
    rowWidget(),
    columnWidget(),
    headingWidget({
      class: 'text-project-h2 mb-4',
    }),
    textWidget(),
    imageWidget(),
    listWidget([listItemWidget()]),
    linkButtonWidget(),
    linkWidget('Home'),
    iconWidget(),
    cardWidget({}),

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
      textInputWidget({
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        class: 'mb-4',
        inputType: 'tel',
        required: true,
      }),
      selectInputWidget({
        label: 'Reason for Contact',
        options: ['Support', 'Sales', 'Feedback'],
        class: 'mb-4',
        required: true,
      }),
      textareaWidget({
        label: 'Message',
        placeholder: 'Enter your message',
        class: 'mb-4',
        required: false,
      }),
      buttonWidget({ type: 'submit', content: 'Submit' }),
    ]),

    headerWidget(),
    heroWidget(),
    featureSectionWidget(),
    bannerWidget(),
    testimonialsWidget(),
    faqWidget(),
    contactSectionWidget(),
    footerWidget(),
  ];

  private _templates: Template[] = [
    {
      id: 'dog-grooming',
      templateName: 'Dog Grooming',
      theme: this.themeManager.getTheme('dog-grooming')!,
      widgets: [
        headerWidget(),
        heroWidget(),
        featureSectionWidget(),
        bannerWidget('split-accent'),
        testimonialsWidget(),
        faqWidget(),
        contactSectionWidget(),
        footerWidget(),
      ],
    },
  ];

  private _aiTemplates = signal<Template[]>([]);

  get widgets() {
    return this._widgets;
  }

  get templates() {
    return this._templates;
  }

  aiTemplates = this._aiTemplates.asReadonly();

  addTemplate(template: Template) {
    this._aiTemplates.update((templates) => [...templates, template]);
  }
}
