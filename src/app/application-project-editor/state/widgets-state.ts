import { Injectable } from '@angular/core';
import { Widget } from '../types/widget.type';
import { containerWidget } from '../widgets-lib/container';
import { sectionWidget } from '../widgets-lib/section';
import { heroWidget } from '../widgets-lib/hero';
import { linkWidget } from '../widgets-lib/link';
import { listWidget } from '../widgets-lib/list';
import { listItemWidget } from '../widgets-lib/list-item';
import { headerWidget } from '../widgets-lib/header';
import { linkButtonWidget } from '../widgets-lib/link-button';
import { headingWidget } from '../widgets-lib/heading';
import { textWidget } from '../widgets-lib/text';
import { imageWidget } from '../widgets-lib/image';
import { columnWidget } from '../widgets-lib/column';
import { rowWidget } from '../widgets-lib/row';
import { featureSectionWidget } from '../widgets-lib/feature-section';
import { cardWidget } from '../widgets-lib/card';
import { footerWidget } from '../widgets-lib/footer';
import { testimonialsWidget } from '../widgets-lib/testimonials';
import { faqWidget } from '../widgets-lib/faq';
import { iconWidget } from '../widgets-lib/icon';
import { formWidget } from '../widgets-lib/form/form';
import { textInputWidget } from '../widgets-lib/form/text-input';
import { buttonWidget } from '../widgets-lib/button';
import { selectInputWidget } from '../widgets-lib/form/select-input';
import { textareaWidget } from '../widgets-lib/form/textarea';
import { contactSectionWidget } from '../widgets-lib/contact';
import { bannerWidget } from '../widgets-lib/banner';
import { Template } from '../types/template.type';

@Injectable({
  providedIn: 'root',
})
export class WidgetsState {
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
      theme: 'grooming',
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

  get widgets() {
    return this._widgets;
  }

  get templates() {
    return this._templates;
  }
}
