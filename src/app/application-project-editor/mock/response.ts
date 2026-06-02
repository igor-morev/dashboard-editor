export const PROJECT_PAGE_RESPONSE = {
  industry: 'grooming',
  theme: {
    name: 'Modern Cat Grooming',
    primaryColor: '#8E9AAF',
    surfaceColor: '#F8F8F8',
    contrastColor: '#333333',
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
        logoUrl: 'https://loremflickr.com/100/100/cat,grooming',
        brandName: 'МурМур Груминг',
        navLinks: [
          {
            label: 'Услуги',
            href: '#services',
          },
          {
            label: 'Галерея',
            href: '#gallery',
          },
          {
            label: 'Отзывы',
            href: '#testimonials',
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
      layout: 'centered-overlay',
      content: {
        title: 'Идеальный уход для вашего котика',
        subtitle: 'Профессиональный груминг для кошек всех пород в уютной и безопасной атмосфере.',
        ctaText: 'Записаться на груминг',
        imageSrc: 'https://loremflickr.com/1200/800/cat,grooming,salon',
      },
    },
    {
      type: 'features',
      layout: 'card-centered',
      content: {
        title: 'Наши услуги',
        subtitle: 'Полный спектр услуг для красоты и здоровья вашего питомца.',
        buttonText: 'Подробнее об услугах',
        items: [
          {
            title: 'Стрижка и вычесывание',
            description:
              'Бережная стрижка и профессиональное вычесывание колтунов для здоровой шерсти.',
            imageSrc: 'https://loremflickr.com/600/400/cat,haircut',
          },
          {
            title: 'Купание и сушка',
            description: 'Использование гипоаллергенных средств и деликатная сушка.',
            imageSrc: 'https://loremflickr.com/600/400/cat,bath',
          },
          {
            title: 'Гигиенический уход',
            description:
              'Чистка ушей, глаз, подстригание когтей для полного комфорта вашего котика.',
            imageSrc: 'https://loremflickr.com/600/400/cat,hygiene',
          },
          {
            title: 'SPA-процедуры',
            description: 'Расслабляющие и оздоровительные процедуры для шерсти и кожи.',
            imageSrc: 'https://loremflickr.com/600/400/cat,spa',
          },
        ],
      },
    },
    {
      type: 'banner',
      layout: 'split-accent',
      content: {
        title: 'Первое посещение со скидкой 15%!',
        description:
          'Подарите своему котику лучший уход и получите приятный бонус на первое посещение.',
        buttonText: 'Получить скидку',
        imageSrc: 'https://loremflickr.com/1200/400/cat,discount',
        badge: 'АКЦИЯ',
      },
    },
    {
      type: 'testimonials',
      layout: 'single-quote',
      content: {
        title: 'Что говорят наши клиенты',
        items: [
          {
            author: 'Анна Смирнова',
            role: 'Владелица кошки Мурки',
            text: 'Мой кот всегда выходит от вас счастливым и пушистым! Спасибо за профессионализм и любовь к животным. Очень рекомендую!',
            avatar: 'https://loremflickr.com/100/100/face,professional',
            rating: 5,
          },
          {
            author: 'Елена Петрова',
            role: 'Владелица кота Барсика',
            text: 'Очень уютное место, мастера знают свое дело. Моя персидская кошка теперь выглядит как с обложки журнала!',
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
        title: 'Запишитесь на груминг',
        subtitle:
          'Подарите вашему питомцу заботу, которую он заслуживает. Оставьте заявку, и мы свяжемся с вами.',
        formTitle: 'Форма записи',
        contacts: [
          {
            icon: 'phone',
            text: '+7 (495) 123-45-67',
          },
          {
            icon: 'email',
            text: 'info@murmurgrooming.ru',
          },
          {
            icon: 'location',
            text: 'г. Москва, ул. Кошачья, д. 5',
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
            name: 'email',
            label: 'Ваш email',
            placeholder: 'Введите ваш email',
            type: 'email',
            required: true,
          },
          {
            name: 'phone',
            label: 'Ваш телефон',
            placeholder: 'Введите ваш телефон',
            type: 'text',
          },
          {
            name: 'service',
            label: 'Выберите услугу',
            placeholder: '',
            type: 'select',
            options: ['Стрижка', 'Купание', 'Гигиена', 'SPA-процедуры'],
          },
          {
            name: 'message',
            label: 'Дополнительная информация',
            placeholder: 'Напишите, если есть особые пожелания или вопросы',
            type: 'textarea',
          },
        ],
        submitButtonText: 'Отправить заявку',
      },
    },
    {
      type: 'faq',
      layout: 'accordion',
      content: {
        title: 'Часто задаваемые вопросы',
        subtitle: 'Ответы на популярные вопросы о груминге кошек.',
        items: [
          {
            question: 'Как часто нужно стричь кошку?',
            answer:
              'Частота стрижки зависит от породы и длины шерсти. В среднем, для длинношерстных кошек рекомендуется стрижка раз в 3-6 месяцев.',
          },
          {
            question: 'Используете ли вы наркоз для кошек?',
            answer:
              'Нет, мы категорически не используем наркоз. Все процедуры проводятся бережно, с использованием успокаивающих техник и терпения.',
          },
          {
            question: 'Можно ли присутствовать во время процедуры?',
            answer:
              'Для безопасности питомца и мастера, а также для минимизации стресса у животного, присутствие владельца во время процедуры не рекомендуется.',
          },
          {
            question: 'Какие средства вы используете?',
            answer:
              'Мы используем только профессиональную гипоаллергенную косметику, разработанную специально для кошек, учитывая особенности их кожи и шерсти.',
          },
        ],
      },
    },
    {
      type: 'footer',
      layout: 'newsletter-split',
      content: {
        logoUrl: 'https://loremflickr.com/100/100/cat,grooming',
        brandName: 'МурМур Груминг',
        copyright: '© 2024 МурМур Груминг. Все права защищены.',
        linkGroups: [
          {
            title: 'Услуги',
            links: [
              {
                label: 'Стрижка',
                href: '#',
              },
              {
                label: 'Купание',
                href: '#',
              },
              {
                label: 'Гигиена',
                href: '#',
              },
            ],
          },
          {
            title: 'Компания',
            links: [
              {
                label: 'О нас',
                href: '#',
              },
              {
                label: 'Отзывы',
                href: '#testimonials',
              },
              {
                label: 'Контакты',
                href: '#contact',
              },
            ],
          },
        ],
        newsletter: {
          title: 'Подпишитесь на нашу рассылку',
          subtitle: 'Получайте новости, акции и полезные советы по уходу за котиками.',
          placeholder: 'Введите ваш email',
          buttonText: 'Подписаться',
        },
      },
    },
  ],
};
