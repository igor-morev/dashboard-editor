export const AI_GAMING_RESPONSE = {
  industry: 'ai',
  theme: {
    name: 'AI Gaming Marketplace',
    primaryColor: '#6A0DAD',
    surfaceColor: '#F8F9FA',
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
        logoUrl: 'https://loremflickr.com/100/100/ai,gaming,logo',
        brandName: 'AI Gaming Hub',
        navLinks: [
          {
            label: 'Home',
            href: '#',
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
            label: 'FAQ',
            href: '#faq',
          },
          {
            label: 'Contact',
            href: '#contact',
          },
        ],
        cta: {
          label: 'Join Now',
          href: '#',
        },
      },
    },
    {
      type: 'hero',
      layout: 'centered-overlay',
      content: {
        title: 'Discover the Future of Gaming with AI',
        subtitle:
          'Explore, create, and trade AI-powered games and assets on our revolutionary marketplace.',
        ctaText: 'Start Exploring',
        imageSrc: 'https://loremflickr.com/1200/800/ai,gaming,futuristic',
      },
    },
    {
      type: 'features',
      layout: 'card-centered',
      content: {
        title: 'Why Choose AI Gaming Hub?',
        subtitle: 'Unlock unparalleled gaming experiences and opportunities.',
        buttonText: 'Learn More',
        items: [
          {
            title: 'Cutting-Edge AI Games',
            description:
              'Dive into a curated selection of games powered by advanced artificial intelligence.',
            imageSrc: 'https://loremflickr.com/600/400/ai,game,futuristic',
          },
          {
            title: 'Creator Economy',
            description: 'Empower developers to showcase and monetize their AI gaming innovations.',
            imageSrc: 'https://loremflickr.com/600/400/developer,ai,coding',
          },
          {
            title: 'Secure & Transparent',
            description:
              'Trade assets and games with confidence on our blockchain-backed platform.',
            imageSrc: 'https://loremflickr.com/600/400/blockchain,security,data',
          },
        ],
      },
    },
    {
      type: 'banner',
      layout: 'split-accent',
      content: {
        title: 'Limited Time Offer!',
        description:
          'Sign up today and get exclusive access to beta games and early bird discounts.',
        buttonText: 'Claim Your Offer',
        imageSrc: 'https://loremflickr.com/1200/400/ai,gaming,offer',
        badge: 'NEW',
      },
    },
    {
      type: 'testimonials',
      layout: 'grid',
      content: {
        title: 'What Our Users Say',
        items: [
          {
            author: 'Alex R.',
            role: 'Gamer',
            text: 'This marketplace is a game-changer! The AI games are incredibly innovative and engaging.',
            avatar: 'https://loremflickr.com/100/100/face,gamer',
            rating: 5,
          },
          {
            author: 'Dr. Lena K.',
            role: 'Game Developer',
            text: 'Finally a platform that truly supports AI game developers. My sales have skyrocketed!',
            avatar: 'https://loremflickr.com/100/100/face,developer',
            rating: 5,
          },
          {
            author: 'Sam W.',
            role: 'Tech Enthusiast',
            text: 'The future of gaming is here. Seamless experience and an amazing community.',
            avatar: 'https://loremflickr.com/100/100/face,tech',
            rating: 4,
          },
        ],
      },
    },
    {
      type: 'contact',
      layout: 'split-form-left',
      content: {
        title: 'Have Questions?',
        subtitle: 'Reach out to our support team or join our community.',
        formTitle: 'Get in Touch',
        contacts: [
          {
            icon: 'phone',
            text: '+1 (800) 123-4567',
          },
          {
            icon: 'email',
            text: 'support@aigaminghub.com',
          },
          {
            icon: 'location',
            text: '123 AI Street, Future City, FC 90210',
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
        subtitle: 'Find answers to common questions about AI Gaming Hub.',
        items: [
          {
            question: 'What is AI Gaming Hub?',
            answer:
              'AI Gaming Hub is a revolutionary marketplace dedicated to AI-powered games and digital assets, connecting players with innovative developers from around the globe.',
          },
          {
            question: 'How can I sell my AI game?',
            answer:
              'Developers can sign up for a free account, create a profile, and submit their AI games for review and listing on our platform. We offer robust tools for monetization.',
          },
          {
            question: 'Is it free to join?',
            answer:
              'Joining AI Gaming Hub as a player or developer is completely free. Transaction fees apply only to successful sales on the marketplace, ensuring a fair ecosystem.',
          },
          {
            question: 'What kind of AI games can I find?',
            answer:
              'Our marketplace features a wide range of AI games, from adaptive NPCs and procedural content generation to AI-driven narratives and intelligent opponents.',
          },
        ],
      },
    },
    {
      type: 'banner',
      layout: 'image-background',
      content: {
        title: 'Ready to Dive In?',
        description: 'Explore thousands of AI games and assets. Your next adventure awaits!',
        buttonText: 'Browse Marketplace',
        imageSrc: 'https://loremflickr.com/1200/400/ai,gaming,marketplace',
        badge: 'EXPLORE',
      },
    },
    {
      type: 'footer',
      layout: 'multi-column',
      content: {
        logoUrl: 'https://loremflickr.com/100/100/ai,gaming,logo',
        brandName: 'AI Gaming Hub',
        copyright: '© 2024 AI Gaming Hub. All rights reserved.',
        linkGroups: [
          {
            title: 'Company',
            links: [
              {
                label: 'About Us',
                href: '#',
              },
              {
                label: 'Careers',
                href: '#',
              },
              {
                label: 'Press',
                href: '#',
              },
            ],
          },
          {
            title: 'Support',
            links: [
              {
                label: 'FAQ',
                href: '#faq',
              },
              {
                label: 'Contact Us',
                href: '#contact',
              },
              {
                label: 'Terms of Service',
                href: '#',
              },
            ],
          },
          {
            title: 'Resources',
            links: [
              {
                label: 'Blog',
                href: '#',
              },
              {
                label: 'Developers',
                href: '#',
              },
              {
                label: 'Community',
                href: '#',
              },
            ],
          },
        ],
      },
    },
  ],
};
