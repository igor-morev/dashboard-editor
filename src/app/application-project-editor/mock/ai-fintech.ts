export const AI_FINTECH_RESPONSE = {
  industry: 'fintech',
  theme: {
    name: 'Modern Neo Bank',
    primaryColor: '#007bff',
    surfaceColor: '#f8f9fa',
    contrastColor: '#212529',
    borderRadius: '12px',
    fontFamily: {
      heading: 'Inter',
      body: 'Inter',
    },
    typeScale: 1.2,
    baseFontSize: 16,
  },
  sections: [
    {
      type: 'header',
      layout: 'classic',
      content: {
        logoUrl: 'https://loremflickr.com/100/100/fintech,bank',
        brandName: 'NovaBank',
        navLinks: [
          {
            label: 'Home',
            href: '#home',
          },
          {
            label: 'Features',
            href: '#features',
          },
          {
            label: 'Testimonials',
            href: '#testimonials',
          },
          {
            label: 'Contact',
            href: '#contact',
          },
        ],
        cta: {
          label: 'Open Account',
          href: '#open-account',
        },
      },
    },
    {
      type: 'hero',
      layout: 'centered-overlay',
      content: {
        title: 'Banking Reimagined for the Digital Age',
        subtitle:
          'Experience seamless, secure, and smart banking with NovaBank. No hidden fees, just pure financial freedom.',
        ctaText: 'Get Started Today',
        imageSrc: 'https://loremflickr.com/1200/800/digitalbanking,mobileapp',
      },
    },
    {
      type: 'features',
      layout: 'card-centered',
      content: {
        title: 'Your Money, Your Way',
        subtitle: 'Discover the benefits of modern banking designed for your lifestyle.',
        buttonText: 'Learn More',
        items: [
          {
            title: 'Zero Hidden Fees',
            description:
              'Say goodbye to monthly maintenance fees, overdraft fees, and foreign transaction fees.',
            imageSrc: 'https://loremflickr.com/600/400/money,growth',
          },
          {
            title: 'Instant Transfers',
            description:
              'Send and receive money instantly with friends and family, anytime, anywhere.',
            imageSrc: 'https://loremflickr.com/600/400/secure,payment',
          },
          {
            title: 'Smart Budgeting Tools',
            description:
              'Track your spending, set budgets, and achieve your financial goals with ease.',
            imageSrc: 'https://loremflickr.com/600/400/budget,app',
          },
        ],
      },
    },
    {
      type: 'banner',
      layout: 'split-accent',
      content: {
        title: 'Get Your NovaBank Debit Card',
        description:
          'Sign up now and receive your sleek, secure debit card delivered right to your door.',
        buttonText: 'Order Now',
        imageSrc: 'https://loremflickr.com/1200/400/creditcard,digital',
        badge: 'EXCLUSIVE',
      },
    },
    {
      type: 'testimonials',
      layout: 'single-quote',
      content: {
        title: 'What Our Customers Say',
        items: [
          {
            author: 'Sarah J.',
            role: 'Freelancer',
            text: 'NovaBank changed how I manage my finances. The app is intuitive, and I love the instant notifications. Highly recommend!',
            avatar: 'https://loremflickr.com/100/100/face,professional',
            rating: 5,
          },
          {
            author: 'Michael P.',
            role: 'Small Business Owner',
            text: 'Finally, a bank that understands modern needs. No fees, easy transfers, and excellent customer support. NovaBank is a game-changer.',
            avatar: 'https://loremflickr.com/100/100/face,professional',
            rating: 5,
          },
        ],
      },
    },
    {
      type: 'contact',
      layout: 'split-form-left',
      content: {
        title: 'Ready to Join NovaBank?',
        subtitle: 'Have questions or need assistance? Our team is here to help you get started.',
        formTitle: 'Contact Us',
        contacts: [
          {
            icon: 'phone',
            text: '+1 (800) 123-4567',
          },
          {
            icon: 'email',
            text: 'support@novabank.com',
          },
          {
            icon: 'location',
            text: '123 Digital Blvd, Fintech City, USA',
          },
        ],
        formFields: [
          {
            name: 'name',
            label: 'Name',
            placeholder: 'Enter your name',
            type: 'text',
            required: true,
          },
          {
            name: 'email',
            label: 'Email',
            placeholder: 'Enter your email',
            type: 'email',
            required: true,
          },
          {
            name: 'message',
            label: 'Message',
            placeholder: 'How can we assist you?',
            type: 'textarea',
          },
        ],
        submitButtonText: 'Send Message',
      },
    },
    {
      type: 'faq',
      layout: 'accordion',
      content: {
        title: 'Frequently Asked Questions',
        subtitle: 'Find answers to common questions about NovaBank and our services.',
        items: [
          {
            question: 'Is NovaBank FDIC insured?',
            answer:
              'Yes, NovaBank partners with FDIC-insured banks to ensure your deposits are protected up to the maximum legal limit.',
          },
          {
            question: 'How do I open an account?',
            answer:
              'Opening an account is simple! Download our app, fill out a quick application, and verify your identity in minutes.',
          },
          {
            question: 'Are there any monthly fees?',
            answer:
              'No, NovaBank prides itself on offering accounts with zero monthly maintenance fees, overdraft fees, or foreign transaction fees.',
          },
          {
            question: 'How can I deposit cash?',
            answer:
              'You can deposit cash at thousands of retail locations nationwide. Check our app for the nearest participating stores.',
          },
        ],
      },
    },
    {
      type: 'footer',
      layout: 'newsletter-split',
      content: {
        logoUrl: 'https://loremflickr.com/100/100/fintech,bank',
        brandName: 'NovaBank',
        copyright: '© 2024 NovaBank. All rights reserved.',
        linkGroups: [
          {
            title: 'Company',
            links: [
              {
                label: 'About Us',
                href: '#about',
              },
              {
                label: 'Careers',
                href: '#careers',
              },
              {
                label: 'Press',
                href: '#press',
              },
            ],
          },
          {
            title: 'Support',
            links: [
              {
                label: 'Help Center',
                href: '#help',
              },
              {
                label: 'Security',
                href: '#security',
              },
              {
                label: 'Privacy Policy',
                href: '#privacy',
              },
            ],
          },
        ],
        newsletter: {
          title: 'Stay Updated',
          subtitle: 'Subscribe to our newsletter for the latest news and offers.',
          placeholder: 'Enter your email',
          buttonText: 'Subscribe',
        },
      },
    },
  ],
};
