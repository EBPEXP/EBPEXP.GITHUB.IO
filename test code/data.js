const categories = [
    {
      id: "statutory-benefits",
      name: "Statutory Benefits",
      icon: "fas fa-balance-scale",
      description: "Benefits mandated by law."
    },
    {
      id: "tax-saving-benefits",
      name: "Tax-saving Benefits",
      icon: "fas fa-piggy-bank",
      description: "Benefits that help save on taxes."
    },
    {
      id: "other-benefits",
      name: "Other Benefits",
      icon: "fas fa-gift",
      description: "Additional perks and benefits."
    }
  ];

  
//benefits data sample, use this data for populating content in your page.

const benefits = [
  {
      id: "epf",
      name: "Employees' Provident Fund (EPF)",
      icon: "fas fa-piggy-bank",
      description: "A retirement savings scheme mandatory for large organizations.",
      content: "<p>A social security benefit for employees.</p><p>Eligibility: Mandatory for organizations with 20 or more employees.</p><p>Contribution: Both employee and employer contribute 12% of the employee’s monthly salary.</p><p>Voluntary Provident Fund: Employees can contribute up to 100% of their basic salary and DA.</p><p>How to Avail: Automatically deducted and managed by the employer.</p>",
      faqs: [
          {
              question: "What is EPF?",
              answer: "EPF is a social security benefit for employees."
          },
          {
              question: "How much is the contribution?",
              answer: "Both employee and employer contribute 12% of the employee’s monthly salary."
          },
          {
              question: "Who is eligible for EPF?",
              answer: "EPF is mandatory for organizations with 20 or more employees."
          },
          {
              question: "Can employees contribute more to EPF?",
              answer: "Yes, employees can contribute up to 100% of their basic salary and DA under the Voluntary Provident Fund."
          }
      ],
      categoryId: "statutory-benefits",
      views: 150
  },
  {
      id: "esi",
      name: "Employees' State Insurance Scheme (ESI)",
      icon: "fas fa-heartbeat",
      description: "A scheme providing medical and other benefits to employees.",
      content: "<p>Provides medical, maternity, disability, and dependents benefits.</p><p>Eligibility: Mandatory for employees earning up to INR 21,000 per month.</p><p>Contribution: Employee contributes 0.75% and employer contributes 3.25%.</p><p>How to Avail: Automatically deducted and managed by the employer.</p>",
      faqs: [
          {
              question: "What is ESI?",
              answer: "ESI provides medical, maternity, disability, and dependents benefits."
          },
          {
              question: "Who is eligible for ESI?",
              answer: "Employees earning up to INR 21,000 per month are eligible."
          },
          {
              question: "What are the contribution rates for ESI?",
              answer: "Employee contributes 0.75% and employer contributes 3.25% of the employee’s salary."
          },
          {
              question: "How are ESI benefits availed?",
              answer: "ESI benefits are automatically deducted and managed by the employer."
          }
      ],
      categoryId: "statutory-benefits",
      views: 120
  },
  {
      id: "labour-welfare-fund",
      name: "Labour Welfare Fund",
      icon: "fas fa-hand-holding-heart",
      description: "A fund providing various welfare benefits to employees.",
      content: "<p>Provides various welfare benefits including pensions and maternity benefits.</p><p>Contribution: INR 50 per month.</p><p>How to Avail: Automatically deducted and managed by the employer.</p>",
      faqs: [
          {
              question: "What is Labour Welfare Fund?",
              answer: "It provides various welfare benefits including pensions and maternity benefits."
          },
          {
              question: "How much is the contribution for Labour Welfare Fund?",
              answer: "The contribution is INR 50 per month."
          },
          {
              question: "Who manages the Labour Welfare Fund?",
              answer: "The fund is automatically deducted and managed by the employer."
          },
          {
              question: "What benefits are provided under the Labour Welfare Fund?",
              answer: "Benefits include pensions and maternity benefits."
          }
      ],
      categoryId: "statutory-benefits",
      views: 80
  },
  {
      id: "statutory-leaves",
      name: "Statutory Leaves",
      icon: "fas fa-calendar-check",
      description: "Various types of mandatory leaves available to employees.",
      content: "<p>Various types of statutory leaves.</p><p>Types of Leaves:</p><ul><li>Sick Leave (12 days)</li><li>Casual Leave (12 days)</li><li>Privilege/Earned Leave (12 days)</li><li>National and Regional Holidays (10 days)</li><li>Bereavement Leave (2 days)</li><li>Maternity Leave (26 weeks)</li><li>Paternity Leave (3 days)</li></ul><p>How to Avail: Through leave application process in the employee portal.</p>",
      faqs: [
          {
              question: "What are statutory leaves?",
              answer: "They include various types of leaves such as sick leave, casual leave, and maternity leave."
          },
          {
              question: "How many sick leave days are provided?",
              answer: "Employees are provided 12 days of sick leave."
          },
          {
              question: "How can employees avail statutory leaves?",
              answer: "Statutory leaves can be availed through the leave application process in the employee portal."
          },
          {
              question: "What is the duration of maternity leave?",
              answer: "Maternity leave is 26 weeks."
          }
      ],
      categoryId: "statutory-benefits",
      views: 100
  },
  {
      id: "gratuity",
      name: "Gratuity",
      icon: "fas fa-money-check-alt",
      description: "A lump sum payment given to employees after 5 years of service.",
      content: "<p>A lump sum payment to employees who have served for at least 5 years.</p><p>Calculation: (Last drawn Basic + DA) * 15/26 * Number of years of service.</p><p>How to Avail: Automatically processed upon eligibility.</p>",
      faqs: [
          {
              question: "What is gratuity?",
              answer: "A lump sum payment to employees who have served for at least 5 years."
          },
          {
              question: "How is gratuity calculated?",
              answer: "Gratuity is calculated as (Last drawn Basic + DA) * 15/26 * Number of years of service."
          },
          {
              question: "When is gratuity paid out?",
              answer: "Gratuity is automatically processed upon eligibility after 5 years of service."
          },
          {
              question: "Who is eligible for gratuity?",
              answer: "Employees who have served for at least 5 years are eligible."
          }
      ],
      categoryId: "statutory-benefits",
      views: 90
  },
  {
      id: "meal-fuel-cards",
      name: "Meal and Fuel Cards",
      icon: "fas fa-utensils",
      description: "Tax-free benefits provided to employees under the old tax regime.",
      content: "<p>Tax-free benefits under the old tax regime.</p><p>Providers: Happay and Sodexo.</p><p>Options:</p><ul><li>Meal Cards: Rs. 1000, Rs. 2200, Rs. 3000/month</li><li>Fuel Cards: Rs. 900 (two-wheeler), Rs. 1800 (small car), Rs. 2400 (large car)</li></ul><p>How to Avail: Register quarterly; employee must own the vehicle for fuel card.</p>",
      faqs: [
          {
              question: "What are meal and fuel cards?",
              answer: "They are tax-free benefits under the old tax regime."
          },
          {
              question: "Who provides the meal and fuel cards?",
              answer: "The providers are Happay and Sodexo."
          },
          {
              question: "How can employees avail meal and fuel cards?",
              answer: "Employees need to register quarterly and own the vehicle for the fuel card."
          },
          {
              question: "What are the available options for meal cards?",
              answer: "The options are Rs. 1000, Rs. 2200, and Rs. 3000 per month."
          }
      ],
      categoryId: "tax-saving-benefits",
      views: 110
  },
  {
      id: "lta",
      name: "Leave Travel Allowance (LTA)",
      icon: "fas fa-plane",
      description: "A benefit offering tax exemptions for travel expenses during leave.",
      content: "<p>Tax exemptions for travel expenses during leave.</p><p>Eligibility: Exemptions up to 10% of basic salary; domestic travel only.</p><p>How to Avail: Submit proofs of travel expenses.</p>",
      faqs: [
          {
              question: "What is LTA?",
              answer: "It provides tax exemptions for travel expenses during leave."
          },
          {
              question: "What is the eligibility for LTA?",
              answer: "Exemptions are up to 10% of basic salary and for domestic travel only."
          },
          {
              question: "How can employees avail LTA?",
              answer: "Employees need to submit proofs of travel expenses."
          },
          {
              question: "Is international travel covered under LTA?",
              answer: "No, only domestic travel is covered under LTA."
          }
      ],
      categoryId: "tax-saving-benefits",
      views: 105
  },
  {
    id: "mobile-internet-allowance",
    name: "Mobile/Internet Allowance",
    icon: "fas fa-mobile-alt",
    description: "A tax exemption for employees using mobile/internet for work purposes.",
    content: "<p>Tax exemption for employees using mobile/internet for work.</p><p>Eligibility: Employee must have the connection in their name.</p><p>How to Avail: Submit monthly claims up to Rs. 1500.</p>",
    faqs: [
      {
        question: "What is Mobile/Internet Allowance?",
        answer: "It provides tax exemption for employees using mobile/internet for work."
      }
    ],
    categoryId: "tax-saving-benefits",
    views: 95
  },
  {
    id: "nps",
    name: "National Pension Scheme (NPS)",
    icon: "fas fa-chart-line",
    description: "A voluntary scheme for retirement savings.",
    content: "<p>A voluntary retirement saving scheme.</p><p>Contribution: Employer can contribute up to 10% of annual basic pay.</p><p>How to Avail: Register through HDFC or provide existing NPS account details.</p>",
    faqs: [
      {
        question: "What is NPS?",
        answer: "It is a voluntary retirement saving scheme."
      }
    ],
    categoryId: "tax-saving-benefits",
    views: 130
  },
  {
    id: "gmc",
    name: "Group Medical Insurance (GMC)",
    icon: "fas fa-medkit",
    description: "An insurance scheme covering hospitalization expenses for employees and their families.",
    content: "<p>Covers hospitalization expenses.</p><p>Coverage: Employee, spouse, and three children.</p><p>How to Avail: E-cards available on MediAssist portal.</p>",
    faqs: [
      {
        question: "What is GMC?",
        answer: "It covers hospitalization expenses."
      }
    ],
    categoryId: "other-benefits",
    views: 140
  }
];


  


  const icons = [
    'fas fa-user',
    'fas fa-home',
    'fas fa-car',
    'fas fa-cog',
    'fas fa-bell',
    'fas fa-briefcase',
    'fas fa-chart-line',
    'fas fa-file-alt',
    'fas fa-piggy-bank',
    'fas fa-wallet',
    'fas fa-handshake',
    'fas fa-globe',
    'fas fa-heart',
    'fas fa-users',
    'fas fa-user-friends',
    'fas fa-user-tie',
    'fas fa-id-badge',
    'fas fa-id-card',
    'fas fa-calendar-alt',
    'fas fa-clock',
    'fas fa-dollar-sign',
    'fas fa-credit-card',
    'fas fa-money-bill-wave',
    'fas fa-gift',
    'fas fa-graduation-cap',
    'fas fa-laptop',
    'fas fa-headset',
    'fas fa-umbrella',
    'fas fa-hospital',
    'fas fa-stethoscope',
    'fas fa-apple-alt',
    'fas fa-leaf',
    'fas fa-coffee',
    'fas fa-apple',
    'fas fa-basketball-ball',
    'fas fa-futbol',
    'fas fa-swimmer',
    'fas fa-dumbbell',
    'fas fa-biking',
    'fas fa-yoga',
    'fas fa-mountain',
    'fas fa-hand-holding-heart',
    'fas fa-user-md',
    'fas fa-medkit',
    'fas fa-pills',
    'fas fa-first-aid',
    'fas fa-hands-helping',
    'fas fa-briefcase-medical',
    'fas fa-wheelchair',
    'fas fa-blind',
    'fas fa-deaf',
    'fas fa-sign-language',
    'fas fa-chalkboard-teacher',
    'fas fa-user-graduate',
    'fas fa-school',
    'fas fa-university',
    'fas fa-building',
    'fas fa-city',
    'fas fa-hands',
    'fas fa-hand-holding',
    'fas fa-hand-sparkles',
    'fas fa-hand-paper',
    'fas fa-hand-peace',
    'fas fa-hand-point-up',
    'fas fa-hand-point-down',
    'fas fa-hand-point-left',
    'fas fa-hand-point-right',
    'fas fa-handshake-alt',
    'fas fa-pray',
    'fas fa-running',
    'fas fa-walking',
    'fas fa-jogging',
    'fas fa-clinic-medical',
    'fas fa-hospital-alt',
    'fas fa-file-medical',
    'fas fa-notes-medical',
    'fas fa-heartbeat',
    'fas fa-procedures',
    'fas fa-syringe',
    'fas fa-tablets',
    'fas fa-band-aid',
    'fas fa-hospital-user',
    'fas fa-user-nurse',
    'fas fa-prescription-bottle',
    'fas fa-prescription-bottle-alt',
    'fas fa-user-plus',
    'fas fa-user-minus',
    'fas fa-user-clock',
    'fas fa-user-check',
    'fas fa-user-slash',
    'fas fa-users-cog',
    'fas fa-user-shield',
    'fas fa-comments',
    'fas fa-comment-dots',
    'fas fa-comment-medical',
    'fas fa-comment-dollar',
    'fas fa-comment-alt',
    'fas fa-comments-alt',
    'fas fa-smile',
    'fas fa-frown',
    'fas fa-meh',
    'fas fa-smile-beam',
    'fas fa-smile-wink',
    'fas fa-sad-tear',
    'fas fa-sad-cry',
    'fas fa-laugh',
    'fas fa-laugh-beam',
    'fas fa-laugh-squint',
    'fas fa-laugh-wink',
    'fas fa-dizzy',
    'fas fa-flushed',
    'fas fa-grin',
    'fas fa-grin-alt',
    'fas fa-grin-beam',
    'fas fa-grin-beam-sweat',
    'fas fa-grin-hearts',
    'fas fa-grin-squint',
    'fas fa-grin-squint-tears',
    'fas fa-grin-stars',
    'fas fa-grin-tears',
    'fas fa-grin-tongue',
    'fas fa-grin-tongue-squint',
    'fas fa-grin-tongue-wink',
    'fas fa-grin-wink',
    'fas fa-user-circle',
    'fas fa-users',
    'fas fa-user-friends',
    'fas fa-user-tie',
    'fas fa-id-badge',
    'fas fa-id-card',
    'fas fa-calendar-alt',
    'fas fa-clock',
    'fas fa-dollar-sign',
    'fas fa-money-bill-wave',
    'fas fa-briefcase',
    'fas fa-chart-line',
    'fas fa-file-alt',
    'fas fa-book',
    'fas fa-clipboard',
    'fas fa-award',
    'fas fa-certificate',
    'fas fa-star',
    'fas fa-rocket',
    'fas fa-lightbulb',
    'fas fa-shield-alt',
    'fas fa-lock',
    'fas fa-key',
    'fas fa-medal',
    'fas fa-trophy',
    'fas fa-piggy-bank',
    'fas fa-wallet',
    'fas fa-coins',
    'fas fa-hand-holding-usd',
    'fas fa-percent',
    'fas fa-gift',
    'fas fa-shopping-cart',
    'fas fa-truck',
    'fas fa-plane',
    'fas fa-globe',
    'fas fa-map-marked-alt',
    'fas fa-laptop',
    'fas fa-tablet-alt',
    'fas fa-mobile-alt',
    'fas fa-headset',
    'fas fa-umbrella',
    'fas fa-heart',
    'fas fa-heartbeat',
    'fas fa-band-aid',
    'fas fa-pills',
    'fas fa-syringe',
    'fas fa-hospital',
    'fas fa-stethoscope',
    'fas fa-ambulance',
    'fas fa-clinic-medical',
    'fas fa-file-medical',
    'fas fa-notes-medical',
    'fas fa-user-md',
    'fas fa-tooth',
    'fas fa-brain',
    'fas fa-microscope',
    'fas fa-balance-scale',
    'fas fa-graduation-cap',
    'fas fa-book-open',
    'fas fa-pencil-alt',
    'fas fa-eraser',
    'fas fa-comments',
    'fas fa-comment-dots',
    'fas fa-comment-medical',
    'fas fa-phone',
    'fas fa-envelope',
    'fas fa-map-pin',
    'fas fa-home',
    'fas fa-building',
    'fas fa-store-alt',
    'fas fa-landmark',
    'fas fa-city',
    'fas fa-train',
    'fas fa-bus',
    'fas fa-car',
    'fas fa-motorcycle',
    'fas fa-bicycle',
    'fas fa-walking',
    'fas fa-running',
    'fas fa-swimmer',
    'fas fa-skiing',
    'fas fa-football-ball',
    'fas fa-basketball-ball',
    'fas fa-baseball-ball',
    'fas fa-golf-ball',
    'fas fa-volleyball-ball',
    'fas fa-futbol',
    'fas fa-dumbbell',
    'fas fa-biking',
    'fas fa-yoga',
    'fas fa-paw',
    'fas fa-kiwi-bird',
    'fas fa-tree',
    'fas fa-seedling',
    'fas fa-cloud',
    'fas fa-sun',
    'fas fa-moon',
    'fas fa-snowflake',
    'fas fa-fire',
    'fas fa-thermometer',
    'fas fa-tint',
    'fas fa-wind',
    'fas fa-water',
    'fas fa-wine-glass',
    'fas fa-beer',
    'fas fa-cocktail',
    'fas fa-coffee',
    'fas fa-utensils',
    'fas fa-pizza-slice',
    'fas fa-birthday-cake'
];
