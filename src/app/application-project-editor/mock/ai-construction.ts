export const AI_CONSTRUCTION_RESPONSE = {
  industry: 'construction',
  theme: {
    name: 'Modern Urban',
    primaryColor: '#2C3E50',
    surfaceColor: '#F8F9FA',
    contrastColor: '#3498DB',
    borderRadius: '8px',
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
        logoUrl: 'https://loremflickr.com/100/100/construction,logo',
        brandName: 'Urban Heights Developers',
        navLinks: [
          {
            label: 'Home',
            href: '#home',
          },
          {
            label: 'Projects',
            href: '#projects',
          },
          {
            label: 'About Us',
            href: '#about',
          },
          {
            label: 'Contact',
            href: '#contact',
          },
        ],
        cta: {
          label: 'Get a Quote',
          href: '#contact',
        },
      },
    },
    {
      type: 'hero',
      layout: 'centered-overlay',
      content: {
        title: "Building Tomorrow's Urban Landscapes Today",
        subtitle:
          'Expertise in crafting modern apartment complexes across the US, designed for sustainable living and community.',
        ctaText: 'Explore Our Projects',
        imageSrc: 'https://loremflickr.com/1200/800/apartment,complex,construction',
      },
    },
    {
      type: 'features',
      layout: 'card-centered',
      content: {
        title: 'Our Commitment to Excellence',
        subtitle: 'Delivering high-quality, innovative, and sustainable apartment complexes.',
        buttonText: 'Learn More',
        items: [
          {
            title: 'Modern Design',
            description: 'Innovative architectural solutions for contemporary urban living spaces.',
            imageSrc: 'https://loremflickr.com/600/400/modern,architecture',
          },
          {
            title: 'Quality Construction',
            description:
              'Utilizing premium materials and advanced techniques for lasting structures.',
            imageSrc: 'https://loremflickr.com/600/400/construction,site,quality',
          },
          {
            title: 'Sustainable Practices',
            description:
              'Eco-friendly building methods for a greener future and reduced environmental impact.',
            imageSrc: 'https://loremflickr.com/600/400/green,building,sustainability',
          },
        ],
      },
    },
    {
      type: 'banner',
      layout: 'split-accent',
      content: {
        title: 'Ready to Partner on Your Next Project?',
        description:
          "We're actively seeking new opportunities to develop impactful apartment communities. Contact us to discuss your vision.",
        buttonText: 'Contact Our Team',
        imageSrc: 'https://loremflickr.com/1200/400/architect,meeting,blueprint',
        badge: 'Partnership',
      },
    },
    {
      type: 'testimonials',
      layout: 'grid',
      content: {
        title: 'What Our Clients Say',
        items: [
          {
            author: 'John D.',
            role: 'Real Estate Investor',
            text: 'Urban Heights Developers exceeded our expectations. Their professionalism and commitment to quality are unmatched.',
            avatar: 'https://loremflickr.com/100/100/face,professional',
            rating: 5,
          },
          {
            author: 'Sarah K.',
            role: 'Community Developer',
            text: 'The apartment complex they built is a testament to modern design and superior craftsmanship. Highly recommended!',
            avatar: 'https://loremflickr.com/100/100/face,professional',
            rating: 5,
          },
          {
            author: 'Michael P.',
            role: 'Project Manager',
            text: 'Their team handled every challenge with expertise and delivered the project on time and within budget.',
            avatar: 'https://loremflickr.com/100/100/face,professional',
            rating: 4,
          },
        ],
      },
    },
    {
      type: 'contact',
      layout: 'split-form-left',
      content: {
        title: 'Get in Touch',
        subtitle: "Let's discuss how we can bring your next apartment complex vision to life.",
        formTitle: 'Request a Consultation',
        contacts: [
          {
            icon: 'phone',
            text: '+1 (555) 123-4567',
          },
          {
            icon: 'email',
            text: 'info@urbanheights.com',
          },
          {
            icon: 'location',
            text: '123 Construction Way, Suite 100, City, State, USA',
          },
        ],
      },
    },
    {
      type: 'faq',
      layout: 'accordion',
      content: {
        title: 'Frequently Asked Questions',
        subtitle: 'Find answers to common questions about our construction process and services.',
        items: [
          {
            question: 'What types of apartment complexes do you build?',
            answer:
              'We specialize in multi-family residential buildings, including high-rise, mid-rise, and garden-style apartments, tailored to urban environments.',
          },
          {
            question: 'What is your approach to sustainability?',
            answer:
              'We integrate green building practices, energy-efficient designs, and sustainable materials to minimize environmental impact and promote long-term value.',
          },
          {
            question: 'How long does a typical project take?',
            answer:
              'Project timelines vary based on scale and complexity. We provide detailed schedules and regular updates to ensure transparency and efficiency.',
          },
          {
            question: 'Do you offer design-build services?',
            answer:
              'Yes, we offer comprehensive design-build services, managing your project from initial concept and architectural design through to final construction.',
          },
        ],
      },
    },
    {
      type: 'footer',
      layout: 'newsletter-split',
      content: {
        logoUrl: 'https://loremflickr.com/100/100/construction,logo',
        brandName: 'Urban Heights Developers',
        copyright: '© 2024 Urban Heights Developers. All rights reserved.',
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
            title: 'Services',
            links: [
              {
                label: 'Development',
                href: '#development',
              },
              {
                label: 'Construction',
                href: '#construction',
              },
              {
                label: 'Consulting',
                href: '#consulting',
              },
            ],
          },
          {
            title: 'Resources',
            links: [
              {
                label: 'Blog',
                href: '#blog',
              },
              {
                label: 'Case Studies',
                href: '#case-studies',
              },
              {
                label: 'FAQ',
                href: '#faq',
              },
            ],
          },
        ],
        newsletter: {
          title: 'Stay Updated',
          subtitle: 'Subscribe to our newsletter for industry insights and project updates.',
          placeholder: 'Enter your email',
          buttonText: 'Subscribe',
        },
      },
    },
  ],
};
