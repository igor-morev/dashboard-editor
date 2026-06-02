export const AI_CLINIC_PAGE = {
  industry: 'healthcare',
  theme: {
    name: 'Modern Clinic',
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
        logoUrl: 'https://loremflickr.com/100/100/clinic,logo',
        brandName: 'Медицинский Центр Забота',
        navLinks: [
          {
            label: 'Услуги',
            href: '#features',
          },
          {
            label: 'Отзывы',
            href: '#testimonials',
          },
          {
            label: 'FAQ',
            href: '#faq',
          },
          {
            label: 'Контакты',
            href: '#contact',
          },
        ],
        cta: {
          label: 'Записаться',
          href: '#contact',
        },
      },
    },
    {
      type: 'hero',
      layout: 'split-right',
      content: {
        title: 'Ваше Здоровье — Наш Приоритет',
        subtitle:
          'Современный медицинский центр с опытными специалистами и индивидуальным подходом к каждому пациенту.',
        ctaText: 'Записаться на прием',
        imageSrc: 'https://loremflickr.com/1200/800/clinic,doctor,patient',
      },
    },
    {
      type: 'features',
      layout: 'card-centered',
      content: {
        title: 'Почему выбирают нас?',
        subtitle:
          'Мы предлагаем высококачественные медицинские услуги с заботой о каждом пациенте.',
        buttonText: 'Узнать больше',
        items: [
          {
            title: 'Опытные Врачи',
            description:
              'Наша команда состоит из высококвалифицированных специалистов с многолетним опытом.',
            imageSrc: 'https://loremflickr.com/600/400/doctor,professional',
          },
          {
            title: 'Современное Оборудование',
            description:
              'Используем передовые технологии для точной диагностики и эффективного лечения.',
            imageSrc: 'https://loremflickr.com/600/400/medical,equipment',
          },
          {
            title: 'Индивидуальный Подход',
            description:
              'Разрабатываем персонализированные планы лечения, учитывая особенности каждого пациента.',
            imageSrc: 'https://loremflickr.com/600/400/patient,care',
          },
        ],
      },
    },
    {
      type: 'banner',
      layout: 'split-accent',
      content: {
        title: 'Первичная консультация со скидкой 20%',
        description:
          'Запишитесь на первый прием к любому специалисту и получите скидку на консультацию.',
        buttonText: 'Получить скидку',
        imageSrc: 'https://loremflickr.com/1200/400/discount,medical',
        badge: 'АКЦИЯ',
      },
    },
    {
      type: 'testimonials',
      layout: 'grid',
      content: {
        title: 'Что говорят наши пациенты',
        items: [
          {
            author: 'Анна Смирнова',
            role: 'Пациент',
            text: 'Очень благодарна врачам за внимательное отношение и профессионализм. Чувствую себя намного лучше!',
            avatar: 'https://loremflickr.com/100/100/face,woman',
            rating: 5,
          },
          {
            author: 'Иван Петров',
            role: 'Пациент',
            text: 'Современная клиника, вежливый персонал, никаких очередей. Рекомендую!',
            avatar: 'https://loremflickr.com/100/100/face,man',
            rating: 5,
          },
          {
            author: 'Елена Козлова',
            role: 'Пациент',
            text: "Наконец-то нашла 'своего' доктора. Всегда выслушают и помогут. Спасибо!",
            avatar: 'https://loremflickr.com/100/100/face,woman,smiling',
            rating: 5,
          },
        ],
      },
    },
    {
      type: 'contact',
      layout: 'split-form-left',
      content: {
        title: 'Запишитесь на прием',
        subtitle:
          'Оставьте свои данные, и наш администратор свяжется с вами для уточнения деталей.',
        formTitle: 'Форма записи',
        contacts: [
          {
            icon: 'phone',
            text: '+7 (495) 123-45-67',
          },
          {
            icon: 'email',
            text: 'info@zabota-clinic.ru',
          },
          {
            icon: 'location',
            text: 'г. Москва, ул. Здоровья, д. 10',
          },
        ],
        formFields: [
          {
            name: 'name',
            label: 'Ваше имя',
            placeholder: 'Введите ваше имя',
            type: 'text',
            required: true,
          },
          {
            name: 'phone',
            label: 'Ваш телефон',
            placeholder: 'Введите ваш телефон',
            type: 'tel',
            required: true,
          },
          {
            name: 'message',
            label: 'Комментарий',
            placeholder: 'Опишите ваш запрос',
            type: 'textarea',
          },
        ],
        submitButtonText: 'Записаться',
      },
    },
    {
      type: 'faq',
      layout: 'accordion',
      content: {
        title: 'Часто задаваемые вопросы',
        subtitle: 'Ответы на популярные вопросы о наших услугах и работе клиники.',
        items: [
          {
            question: 'Какие услуги вы предоставляете?',
            answer:
              'Мы предлагаем широкий спектр медицинских услуг: терапия, кардиология, неврология, гинекология, УЗИ, лабораторные исследования и многое другое.',
          },
          {
            question: 'Как записаться на прием?',
            answer:
              'Вы можете записаться на прием по телефону, через форму на сайте или лично в клинике.',
          },
          {
            question: 'Работаете ли вы по страховке?',
            answer:
              'Да, мы работаем с большинством страховых компаний. Пожалуйста, уточните детали у администратора.',
          },
          {
            question: 'Есть ли у вас детские специалисты?',
            answer:
              'Да, в нашем центре ведут прием высококвалифицированные педиатры и детские узкие специалисты.',
          },
        ],
      },
    },
    {
      type: 'banner',
      layout: 'image-background',
      content: {
        title: 'Забота о вашем здоровье 24/7',
        description: 'Мы всегда готовы прийти на помощь. Экстренная запись доступна по телефону.',
        buttonText: 'Позвонить сейчас',
        imageSrc: 'https://loremflickr.com/1200/400/emergency,medical',
        badge: 'Срочно',
      },
    },
    {
      type: 'footer',
      layout: 'multi-column',
      content: {
        logoUrl: 'https://loremflickr.com/100/100/clinic,logo',
        brandName: 'Медицинский Центр Забота',
        copyright: '© 2024 Медицинский Центр Забота. Все права защищены.',
        linkGroups: [
          {
            title: 'Компания',
            links: [
              {
                label: 'О нас',
                href: '#',
              },
              {
                label: 'Услуги',
                href: '#features',
              },
              {
                label: 'Контакты',
                href: '#contact',
              },
            ],
          },
          {
            title: 'Помощь',
            links: [
              {
                label: 'FAQ',
                href: '#faq',
              },
              {
                label: 'Политика конфиденциальности',
                href: '#',
              },
              {
                label: 'Условия использования',
                href: '#',
              },
            ],
          },
        ],
        newsletter: {
          title: 'Подпишитесь на нашу рассылку',
          subtitle: 'Будьте в курсе наших новостей и акций.',
          placeholder: 'Введите ваш email',
          buttonText: 'Подписаться',
        },
      },
    },
  ],
};
