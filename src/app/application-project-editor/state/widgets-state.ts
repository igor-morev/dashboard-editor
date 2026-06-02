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
    contactSectionWidget(),
    faqWidget(),
    footerWidget(),
  ];

  private _templates = signal<Template[]>([
    {
      id: 'dog-grooming',
      templateName: 'Dog Grooming',
      source: 'predefined',
      theme: this.themeManager.getTheme('grooming')!,
      widgets: [
        headerWidget(),
        heroWidget(),
        featureSectionWidget('card-centered', {
          title: 'Our Services',
          subtitle: 'Comprehensive grooming solutions for your furry friend.',
          buttonText: 'Learn More',
          items: [
            {
              title: 'Full Grooming Package',
              description:
                'Includes bath, haircut, nail trimming, ear cleaning, and more for a complete pampering experience.',
              imageSrc: 'https://loremflickr.com/600/400/dog,grooming,full-package',
            },
            {
              title: 'Bath & Brush',
              description:
                'A refreshing bath followed by thorough brushing to keep your dog clean and comfortable.',
              imageSrc: 'https://loremflickr.com/600/400/dog,grooming,bath-brush',
            },
            {
              title: 'Nail Trimming',
              description:
                'Professional nail trimming to maintain your dog’s comfort and prevent overgrowth.',
              imageSrc: 'https://loremflickr.com/600/400/dog,grooming,nail-trimming',
            },
          ],
        }),
        bannerWidget('split-accent'),
        testimonialsWidget(),
        contactSectionWidget(),
        faqWidget(),
        bannerWidget('image-background', {
          title: 'Ready to Dive In?',
          description: 'Explore thousands of AI games and assets. Your next adventure awaits!',
          buttonText: 'Browse Marketplace',
          imageSrc: 'https://loremflickr.com/1200/400/ai,gaming,marketplace',
          badge: 'EXPLORE',
        }),
        footerWidget(),
      ],
    },
  ]);

  get widgets() {
    return this._widgets;
  }

  templates = this._templates.asReadonly();

  addTemplate(template: Template) {
    this._templates.update((templates) => [...templates, template]);
  }
}
