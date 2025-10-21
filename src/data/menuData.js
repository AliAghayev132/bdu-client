/**
 * BDU Mega Menu Data Structure
 * Unlimited nested hierarchy support
 * Backend-də bu strukturu dinamik generate edə bilərik
 * 
 * SINGLE SOURCE OF TRUTH - Bütün page content və navigation burada
 */

export const menuData = {
  university: {
    id: 'university',
    label: {
      az: 'UNİVERSİTET',
      en: 'UNIVERSITY'
    },
    type: 'mega',
    columns: [
      {
        title: { az: 'Ümumi', en: 'General' },
        items: [
          {
            id: 'history',
            label: { az: 'Universitetin tarixi', en: 'University History' },
            href: { az: '/universitet/tarix', en: '/university/history' },
            description: { az: 'BDU-nun 100 illik tarixi', en: '100 years of BSU' }
          },
          {
            id: 'aliyev',
            label: { az: 'Heydər Əliyev və BDU', en: 'Heydar Aliyev and BSU' },
            href: { az: '/universitet/heydar-aliyev', en: '/university/aliyev' }
          },
          {
            id: 'president',
            label: { az: 'Azərbaycan Prezidenti və BDU', en: 'President of Azerbaijan and BSU' },
            href: { az: '/universitet/prezident', en: '/university/president' }
          },
          {
            id: 'leadership',
            label: { az: 'Rəhbərlik', en: 'Leadership' },
            href: { az: '/universitet/rehberlik', en: '/university/leadership' },
            
            // Page configuration
            pageType: 'card',
            content: {
              az: {
                title: 'Rəhbərlik',
                description: 'Bakı Dövlət Universitetinin rəhbərliyi'
              },
              en: {
                title: 'Leadership',
                description: 'Leadership of Baku State University'
              }
            },
            items: [
              {
                id: 'rector',
                name: { az: 'Elçin Səfərəli oğlu Babayev', en: 'Elchin Safarali oglu Babayev' },
                position: { az: 'Rektor', en: 'Rector' },
                phone: '(+994 12) 430-32-45',
                email: 'rector@bsu.edu.az',
                image: '/images/people/elcin.jpg',
                // hasDetail: false - sadəcə card, detail page yoxdur
              },
              {
                id: 'farda-imanov',
                name: { az: 'Fərdə Əli oğlu İmanov', en: 'Farda Ali oglu Imanov' },
                position: { az: 'Tədrisin təşkili və tədris texnologiyaları üzrə prorektor', en: 'Vice-Rector for Teaching Organization and Technologies' },
                phone: '(+994 12) 539-15-87',
                email: 'farda.imanov@bsu.edu.az',
                image: '/images/people/elcin.jpg',
                hasDetail: true, // Detail page var
                // Detail page content (Quill.js HTML)
                bio: {
                  az: `<p>İmanov Fərdə Əli oğlu - coğrafiya üzrə elmlər doktoru, professor</p>
                       <p>Tədrisin təşkili və təlim texnologiyaları üzrə prorektor</p>
                       <p>13 mart 1957-ci il tarixində anadan olub.</p>
                       <p>1974-1979-cu illərdə Leninqrad Hidrometeorologiya İnstitutunun (LHMİ) Hidrologiya fakültəsində təhsil alıb.</p>`,
                  en: `<p>Imanov Farda Ali oglu - Doctor of Geography, Professor</p>
                       <p>Vice-Rector for Teaching Organization and Educational Technologies</p>
                       <p>Born on March 13, 1957.</p>`
                }
              },
              {
                id: 'vice-rector-2',
                name: { az: 'Hüseyn Mikayıl oğlu Məmmədov', en: 'Huseyn Mikayil oglu Mammadov' },
                position: { az: 'Elm və innovasiyalar üzrə prorektor', en: 'Vice-Rector for Science and Innovation' },
                phone: '(+994 12) 538-15-54',
                email: 'mammad.huseyn.m@bsu.edu.az',
                image: '/images/people/elcin.jpg'
              },
              {
                id: 'vice-rector-3',
                name: { az: 'Əliş Çoban oğlu Ağamirzəyev', en: 'Alish Choban oglu Aghamirzayev' },
                position: { az: 'Sosial məsələlər, tələbələrlə və ictimaiyyətlə əlaqələr üzrə prorektor', en: 'Vice-Rector for Social Affairs, Student and Public Relations' },
                phone: '(+994 12) 539-03-43',
                email: 'alish.aghamirzayev@bsu.edu.az',
                image: '/images/people/elcin.jpg'
              },
              {
                id: 'vice-rector-4',
                name: { az: 'Şahin Məhəmməd oğlu Pənahov', en: 'Shahin Mahammad oglu Panahov' },
                position: { az: 'Beynəlxalq əlaqələr üzrə prorektor', en: 'Vice-Rector for International Relations' },
                phone: '(+994 12) 538-53-57',
                email: 'shahin.panahov@bsu.edu.az',
                image: '/images/people/elcin.jpg'
              }
            ],
            
            subitems: [
              {
                label: { az: 'Rektor', en: 'Rector' },
                href: { az: '/universitet/rehberlik/rektor', en: '/university/leadership/rector' }
              },
              {
                label: { az: 'Prorektorlar', en: 'Vice-Rectors' },
                href: { az: '/universitet/rehberlik/prorektorlar', en: '/university/leadership/vice-rectors' }
              }
            ]
          }
        ]
      },
      {
        title: { az: 'İdarəetmə', en: 'Governance' },
        items: [
          {
            id: 'trustees',
            label: { az: 'Himayəçilər Şurası', en: 'Board of Trustees' },
            href: { az: '/universitet/himayecilar-surasi', en: '/university/trustees' }
          },
          {
            id: 'scientific-council',
            label: { az: 'Elmi Şura', en: 'Scientific Council' },
            href: { az: '/universitet/elmi-sura', en: '/university/scientific-council' },
            subitems: [
              {
                label: { az: 'Elmi şuranın tərkibi', en: 'Council Structure' },
                href: { az: '/universitet/elmi-sura/terkibi', en: '/university/scientific-council/structure' }
              },
              {
                label: { az: 'Elmi şuranın fəaliyyəti', en: 'Council Activities' },
                href: { az: '/universitet/elmi-sura/fealiyyeti', en: '/university/scientific-council/activities' },
                subitems: [
                  {
                    label: { az: '2025-ci il', en: '2025' },
                    href: { az: '/universitet/elmi-sura/fealiyyeti/2025', en: '/university/scientific-council/activities/2025' }
                  },
                  {
                    label: { az: 'ARXİV', en: 'ARCHIVE' },
                    href: { az: '/universitet/elmi-sura/fealiyyeti/arxiv', en: '/university/scientific-council/activities/archive' },
                    subitems: [
                      {
                        label: { az: '2025-ci il', en: '2025' },
                        href: { az: '/universitet/elmi-sura/fealiyyeti/arxiv/2025', en: '/university/scientific-council/activities/archive/2025' }
                      },
                      {
                        label: { az: '2024-ci il', en: '2024' },
                        href: { az: '/universitet/elmi-sura/fealiyyeti/arxiv/2024', en: '/university/scientific-council/activities/archive/2024' }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'methodological-council',
            label: { az: 'Elmi-Metodiki Şura', en: 'Methodological Council' },
            href: { az: '/universitet/elmi-metodiki-sura', en: '/university/methodological-council' }
          }
        ]
      },
      {
        title: { az: 'Keyfiyyət', en: 'Quality' },
        items: [
          {
            id: 'accreditation',
            label: { az: 'Akkreditasiya', en: 'Accreditation' },
            href: { az: '/universitet/akkreditasiya', en: '/university/accreditation' }
          },
          {
            id: 'quality-assurance',
            label: { az: 'Keyfiyyət təminatı', en: 'Quality Assurance' },
            href: { az: '/universitet/keyfiyyet-teminati', en: '/university/quality-assurance' }
          },
          {
            id: 'rankings',
            label: { az: 'Reytinqlər', en: 'Rankings' },
            href: { az: '/universitet/reytinqler', en: '/university/rankings' }
          }
        ]
      },
      {
        title: { az: 'Struktur', en: 'Structure' },
        items: [
          {
            id: 'campus',
            label: { az: 'Kampus', en: 'Campus' },
            href: { az: '/universitet/kampus', en: '/university/campus' }
          },
          {
            id: 'gazakh',
            label: { az: 'Qazax Filialı', en: 'Gazakh Branch' },
            href: { az: '/universitet/qazax-filiali', en: '/university/gazakh' }
          },
          {
            id: 'college',
            label: { az: 'İqtisadiyyat və Humanitar Kolleci', en: 'Economics and Humanities College' },
            href: { az: '/universitet/iqtisadiyyat-humanitar-kollec', en: '/university/college' }
          },
          {
            id: 'lyceum',
            label: { az: 'Gənc İstedadlar Litseyı', en: 'Young Talents Lyceum' },
            href: { az: '/universitet/genc-istedadlar-litseyi', en: '/university/lyceum' }
          }
        ]
      }
    ]
  },

  education: {
    id: 'education',
    label: {
      az: 'TƏHSİL',
      en: 'EDUCATION'
    },
    type: 'mega',
    columns: [
      {
        title: { az: 'Fakültələr', en: 'Faculties' },
        items: [
          {
            id: 'faculties',
            label: { az: 'Bütün fakültələr', en: 'All Faculties' },
            href: '/education/faculties'
          },
          {
            id: 'programs',
            label: { az: 'Təhsil proqramları', en: 'Educational Programs' },
            href: '/education/programs'
          }
        ]
      },
      {
        title: { az: 'Qəbul', en: 'Admission' },
        items: [
          {
            id: 'admission',
            label: { az: 'Bakalavriat', en: 'Bachelor' },
            href: '/education/admission/bachelor'
          },
          {
            id: 'magistracy',
            label: { az: 'Magistratura', en: 'Master' },
            href: '/education/admission/master'
          },
          {
            id: 'doctorate',
            label: { az: 'Doktorantura', en: 'Doctorate' },
            href: '/education/admission/doctorate'
          }
        ]
      }
    ]
  },

  science: {
    id: 'science',
    label: {
      az: 'ELM VƏ İNNOVASİYA',
      en: 'SCIENCE AND INNOVATION'
    },
    type: 'mega',
    columns: [
      {
        title: { az: 'Elmi fəaliyyət', en: 'Scientific Activity' },
        items: [
          {
            id: 'research',
            label: { az: 'Tədqiqat mərkəzləri', en: 'Research Centers' },
            href: '/science/research-centers'
          },
          {
            id: 'publications',
            label: { az: 'Nəşrlər', en: 'Publications' },
            href: '/science/publications'
          }
        ]
      }
    ]
  },

  social: {
    id: 'social',
    label: {
      az: 'SOSİAL FƏALİYYƏT',
      en: 'SOCIAL ACTIVITY'
    },
    type: 'mega',
    columns: [
      {
        title: { az: 'Tələbə həyatı', en: 'Student Life' },
        items: [
          {
            id: 'clubs',
            label: { az: 'Klublar', en: 'Clubs' },
            href: '/social/clubs'
          },
          {
            id: 'sports',
            label: { az: 'İdman', en: 'Sports' },
            href: '/social/sports'
          }
        ]
      }
    ]
  },

  cooperation: {
    id: 'cooperation',
    label: {
      az: 'ƏMƏKDAŞLIQ',
      en: 'COOPERATION'
    },
    type: 'mega',
    columns: [
      {
        title: { az: 'Beynəlxalq', en: 'International' },
        items: [
          {
            id: 'international',
            label: { az: 'Beynəlxalq əlaqələr', en: 'International Relations' },
            href: '/cooperation/international'
          },
          {
            id: 'partnerships',
            label: { az: 'Partnyorlar', en: 'Partners' },
            href: '/cooperation/partners'
          }
        ]
      }
    ]
  }
};

// Bottom navigation items
export const bottomNavItems = [
  {
    id: 'rector-office',
    label: { az: 'Rektora müraciət', en: 'Appeal to Rector' },
    href: { az: '/rektora-muraciet', en: '/appeal-to-rector' }
  },
  {
    id: 'applicants',
    label: { az: 'Abituriyentlər üçün', en: 'For Applicants' },
    href: { az: '/abituriyentler', en: '/applicants' }
  },
  {
    id: 'students',
    label: { az: 'Tələbələr üçün', en: 'For Students' },
    href: { az: '/telebeler', en: '/students' }
  },
  {
    id: 'employees',
    label: { az: 'Əməkdaşlar üçün', en: 'For Employees' },
    href: { az: '/emekdaslar', en: '/employees' }
  },
  {
    id: 'graduates',
    label: { az: 'Məzunlar üçün', en: 'For Graduates' },
    href: { az: '/mezunlar', en: '/graduates' }
  },
  {
    id: 'news',
    label: { az: 'Əlaqə', en: 'Contact' },
    href: { az: '/elaqe', en: '/contact' }
  }
];

/**
 * Helper function to get localized label
 */
export const getLabel = (item, locale) => {
  return typeof item.label === 'object' ? item.label[locale] : item.label;
};

/**
 * Helper function to build breadcrumbs from path
 */
export const buildBreadcrumbs = (path, locale) => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [{ label: getLabel({ label: { az: 'Ana səhifə', en: 'Home' } }, locale), href: '/' }];
  
  let currentPath = '';
  segments.forEach((segment, index) => {
    if (segment !== locale && segment !== 'en') {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: currentPath
      });
    }
  });
  
  return breadcrumbs;
};

/**
 * Rekursiv olaraq menu item-i tap
 */
const findMenuItem = (items, href, locale) => {
  for (const item of items) {
    const itemHref = typeof item.href === 'object' ? item.href[locale] : item.href;
    if (itemHref === href) {
      return item;
    }
    if (item.subitems) {
      const found = findMenuItem(item.subitems, href, locale);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Bütün menu-dan item tap
 */
export const findMenuItemByPath = (path, locale) => {
  for (const categoryKey in menuData) {
    const category = menuData[categoryKey];
    if (category.columns) {
      for (const column of category.columns) {
        const found = findMenuItem(column.items, path, locale);
        if (found) return found;
      }
    }
  }
  return null;
};

/**
 * Parent item-i tap və sidebar generate et
 */
export const generateSidebar = (currentPath, locale) => {
  // Current page-i tap
  const currentItem = findMenuItemByPath(currentPath, locale);
  
  console.log('generateSidebar - currentPath:', currentPath);
  console.log('generateSidebar - currentItem:', currentItem);
  
  if (!currentItem) {
    console.log('generateSidebar - currentItem not found!');
    return null;
  }
  
  // Əgər current item-in subitems-i varsa, sidebar göstər
  if (currentItem.subitems && currentItem.subitems.length > 0) {
    console.log('generateSidebar - has subitems:', currentItem.subitems);
    return {
      show: true,
      items: [
        {
          label: currentItem.label,
          href: currentItem.href,
          children: currentItem.subitems
        }
      ]
    };
  }
  
  // Əgər subitems yoxdursa, sidebar göstərmə
  console.log('generateSidebar - no subitems, returning null');
  return null;
};

/**
 * Detail page üçün item tap (card items içində)
 * Auto-generate URL: parent.href + '/' + cardItem.id
 */
const findDetailItem = (path, locale) => {
  for (const categoryKey in menuData) {
    const category = menuData[categoryKey];
    if (category.columns) {
      for (const column of category.columns) {
        for (const item of column.items) {
          // Check if this item has items (card list)
          if (item.items) {
            for (const cardItem of item.items) {
              // Auto-generate detail URL from parent href + card id
              if (cardItem.hasDetail) {
                const parentHref = typeof item.href === 'object' ? item.href[locale] : item.href;
                const autoDetailUrl = `${parentHref}/${cardItem.id}`;
                
                if (autoDetailUrl === path) {
                  return { parentItem: item, detailItem: cardItem };
                }
              }
            }
          }
        }
      }
    }
  }
  return null;
};

/**
 * Page data-nı menuData-dan götür
 */
export const getPageDataFromMenu = (path, locale) => {
  // Əvvəlcə normal menu item-i yoxla
  const item = findMenuItemByPath(path, locale);
  
  if (item) {
    return {
      content: item.content || {
        [locale]: {
          title: getLabel(item, locale),
          description: item.description?.[locale] || ''
        }
      },
      type: { [locale]: item.pageType || 'blog' },
      items: item.items || [],
      sidebar: generateSidebar(path, locale)
    };
  }
  
  // Əgər tapılmadısa, detail page ola bilər
  const detailData = findDetailItem(path, locale);
  if (detailData) {
    const { parentItem, detailItem } = detailData;
    return {
      content: {
        [locale]: {
          title: detailItem.name?.[locale] || '',
          description: detailItem.position?.[locale] || '',
          body: detailItem.bio?.[locale] || ''
        }
      },
      type: { [locale]: 'blog' },
      detailItem: detailItem, // Şəkil, telefon və s. üçün
      sidebar: generateSidebar(parentItem.href[locale] || parentItem.href, locale)
    };
  }
  
  return null;
};
