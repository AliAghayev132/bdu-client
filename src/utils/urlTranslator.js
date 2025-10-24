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
  
  
  // Bottom nav
  'rektora-muraciet': { az: 'rektora-muraciet', en: 'appeal-to-rector' },
  'appeal-to-rector': { az: 'rektora-muraciet', en: 'appeal-to-rector' },
  'abituriyentler': { az: 'abituriyentler', en: 'applicants' },
  'applicants': { az: 'abituriyentler', en: 'applicants' },
  'telebeler': { az: 'telebeler', en: 'students' },
  'students': { az: 'telebeler', en: 'students' },
  // Specific landing: For Students
  'telebeler-ucun': { az: 'telebeler-ucun', en: 'for-students' },
  'for-students': { az: 'telebeler-ucun', en: 'for-students' },
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
