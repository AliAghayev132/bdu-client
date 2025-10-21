/**
 * URL Translator - Dil dəyişəndə URL-i translate edir
 */

// URL segment mapping
const urlMap = {
  // Categories
  universitet: { az: 'universitet', en: 'university' },
  university: { az: 'universitet', en: 'university' },
  tehsil: { az: 'tehsil', en: 'education' },
  education: { az: 'tehsil', en: 'education' },
  elm: { az: 'elm', en: 'science' },
  science: { az: 'elm', en: 'science' },
  sosial: { az: 'sosial', en: 'social' },
  social: { az: 'sosial', en: 'social' },
  emekdasliq: { az: 'emekdasliq', en: 'cooperation' },
  cooperation: { az: 'emekdasliq', en: 'cooperation' },
  
  // University pages
  'elmi-sura': { az: 'elmi-sura', en: 'scientific-council' },
  'scientific-council': { az: 'elmi-sura', en: 'scientific-council' },
  'terkibi': { az: 'terkibi', en: 'structure' },
  'structure': { az: 'terkibi', en: 'structure' },
  'fealiyyeti': { az: 'fealiyyeti', en: 'activities' },
  'activities': { az: 'fealiyyeti', en: 'activities' },
  'arxiv': { az: 'arxiv', en: 'archive' },
  'archive': { az: 'arxiv', en: 'archive' },
  'tarix': { az: 'tarix', en: 'history' },
  'history': { az: 'tarix', en: 'history' },
  'heydar-aliyev': { az: 'heydar-aliyev', en: 'aliyev' },
  'aliyev': { az: 'heydar-aliyev', en: 'aliyev' },
  'prezident': { az: 'prezident', en: 'president' },
  'president': { az: 'prezident', en: 'president' },
  'rehberlik': { az: 'rehberlik', en: 'leadership' },
  'leadership': { az: 'rehberlik', en: 'leadership' },
  'rektor': { az: 'rektor', en: 'rector' },
  'rector': { az: 'rektor', en: 'rector' },
  'prorektorlar': { az: 'prorektorlar', en: 'vice-rectors' },
  'vice-rectors': { az: 'prorektorlar', en: 'vice-rectors' },
  'himayecilar-surasi': { az: 'himayecilar-surasi', en: 'trustees' },
  'trustees': { az: 'himayecilar-surasi', en: 'trustees' },
  'elmi-metodiki-sura': { az: 'elmi-metodiki-sura', en: 'methodological-council' },
  'methodological-council': { az: 'elmi-metodiki-sura', en: 'methodological-council' },
  'akkreditasiya': { az: 'akkreditasiya', en: 'accreditation' },
  'accreditation': { az: 'akkreditasiya', en: 'accreditation' },
  'keyfiyyet-teminati': { az: 'keyfiyyet-teminati', en: 'quality-assurance' },
  'quality-assurance': { az: 'keyfiyyet-teminati', en: 'quality-assurance' },
  'reytinqler': { az: 'reytinqler', en: 'rankings' },
  'rankings': { az: 'reytinqler', en: 'rankings' },
  'kampus': { az: 'kampus', en: 'campus' },
  'campus': { az: 'kampus', en: 'campus' },
  'qazax-filiali': { az: 'qazax-filiali', en: 'gazakh' },
  'gazakh': { az: 'qazax-filiali', en: 'gazakh' },
  'iqtisadiyyat-humanitar-kollec': { az: 'iqtisadiyyat-humanitar-kollec', en: 'college' },
  'college': { az: 'iqtisadiyyat-humanitar-kollec', en: 'college' },
  'genc-istedadlar-litseyi': { az: 'genc-istedadlar-litseyi', en: 'lyceum' },
  'lyceum': { az: 'genc-istedadlar-litseyi', en: 'lyceum' },
  
  // Bottom nav
  'rektora-muraciet': { az: 'rektora-muraciet', en: 'appeal-to-rector' },
  'appeal-to-rector': { az: 'rektora-muraciet', en: 'appeal-to-rector' },
  'abituriyentler': { az: 'abituriyentler', en: 'applicants' },
  'applicants': { az: 'abituriyentler', en: 'applicants' },
  'telebeler': { az: 'telebeler', en: 'students' },
  'students': { az: 'telebeler', en: 'students' },
  'emekdaslar': { az: 'emekdaslar', en: 'employees' },
  'employees': { az: 'emekdaslar', en: 'employees' },
  'mezunlar': { az: 'mezunlar', en: 'graduates' },
  'graduates': { az: 'mezunlar', en: 'graduates' },
  'elaqe': { az: 'elaqe', en: 'contact' },
  'contact': { az: 'elaqe', en: 'contact' },
};

/**
 * Translate URL path from one locale to another
 * @param {string} pathname - Current pathname (e.g., '/universitet/elmi-sura')
 * @param {string} targetLocale - Target locale ('az' or 'en')
 * @returns {string} - Translated pathname
 */
export function translateUrl(pathname, targetLocale) {
  // Remove leading slash and split by /
  const segments = pathname.replace(/^\//, '').split('/');
  
  // Translate each segment
  const translatedSegments = segments.map(segment => {
    // Skip if segment is empty
    if (!segment) return segment;
    
    // Check if we have a mapping for this segment
    const mapping = urlMap[segment];
    if (mapping && mapping[targetLocale]) {
      return mapping[targetLocale];
    }
    
    // If no mapping found, return original segment
    return segment;
  });
  
  // Join back with /
  return '/' + translatedSegments.join('/');
}

/**
 * Get reverse mapping (for debugging)
 */
export function getUrlMapping(segment) {
  return urlMap[segment] || null;
}
