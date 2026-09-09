import { inject, Injectable, signal } from '@angular/core';
import { Template } from '../types/template.type';
import { Widget } from '../types/widget.type';
import { buttonWidget } from '../widgets-lib/button';
import { cardWidget } from '../widgets-lib/card';
import { columnWidget } from '../widgets-lib/column';
import { contactSectionWidget } from '../widgets-lib/sections/contact';
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
    buttonWidget([], { content: 'Click Me' }),
    iconWidget(),
    cardWidget({}),

    formWidget([
      textInputWidget({
        name: 'name',
        label: 'Name',
        placeholder: 'Enter your name',
        class: 'mb-4',
        required: true,
      }),
      textInputWidget({
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        class: 'mb-4',
        inputType: 'email',
        required: true,
      }),
      textInputWidget({
        name: 'phone',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        class: 'mb-4',
        inputType: 'tel',
        required: true,
      }),
      selectInputWidget({
        name: 'reason',
        label: 'Reason for Contact',
        options: ['Support', 'Sales', 'Feedback'],
        class: 'mb-4',
        required: true,
      }),
      textareaWidget({
        name: 'message',
        label: 'Message',
        placeholder: 'Enter your message',
        class: 'mb-4',
        required: false,
      }),
      buttonWidget([], { type: 'submit', content: 'Submit' }),
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
        heroWidget('centered-overlay', {
          title: 'Pamper Your Pup with Our Expert Grooming Services',
          subtitle: 'Tailored care for every breed and personality.',
          ctaText: 'Book an Appointment',
          imageSrc:
            'https://plus.unsplash.com/premium_photo-1666777247416-ee7a95235559?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        }),
        featureSectionWidget('card-centered', {
          title: 'Our Services',
          subtitle: 'Comprehensive grooming solutions for your furry friend.',
          buttonText: 'Learn More',
          items: [
            {
              title: 'Full Grooming Package',
              description:
                'Includes bath, haircut, nail trimming, ear cleaning, and more for a complete pampering experience.',
              imageSrc:
                'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
            {
              title: 'Bath & Brush',
              description:
                'A refreshing bath followed by thorough brushing to keep your dog clean and comfortable.',
              imageSrc:
                'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
            {
              title: 'Nail Trimming',
              description:
                'Professional nail trimming to maintain your dog’s comfort and prevent overgrowth.',
              imageSrc:
                'https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
          imageSrc: 'https://loremflickr.com/1200/800/cat,grooming,salon',
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
