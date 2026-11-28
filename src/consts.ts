// Site-wide constants. Update PHONE once a number is confirmed — it is
// conditionally rendered wherever it's used, so leaving it blank is safe.

export const SITE_NAME = 'A2 Commercial Fit Out';
export const SITE_NAME_FULL = 'A2 Commercial Fit Out LTD';
export const SITE_URL = 'https://commercialfitout.co.uk';
export const EMAIL = 'info@commercialfitout.co.uk';
export const PHONE = '';

// Google Analytics 4 measurement ID (e.g. 'G-XXXXXXXXXX'). Leave blank to
// disable GA entirely: no script, no CSP exceptions. When set, gtag.js
// still only loads after the visitor accepts analytics cookies.
export const GA_MEASUREMENT_ID = 'G-XY2KW6T7G3';

export const ADDRESS_LOCALITY = 'Maidstone';
export const ADDRESS_REGION = 'Kent';
export const ADDRESS_COUNTRY = 'GB';

export const AREA_SERVED = ['London', 'Kent', 'Essex', 'South East England'];

export const SOCIAL = {
  // Left empty intentionally — no verified social profiles yet.
};

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services/', label: 'Services' },
  { href: '/sectors/', label: 'Sectors' },
  { href: '/projects/', label: 'Projects' },
  { href: '/insights/', label: 'Insights' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export const SERVICE_LINKS = [
  { href: '/services/office-fit-out/', label: 'Office Fit Out' },
  { href: '/services/office-refurbishment/', label: 'Office Refurbishment' },
  { href: '/services/retail-fit-out/', label: 'Retail Fit Out' },
  { href: '/services/healthcare-fit-out/', label: 'Healthcare Fit Out' },
  { href: '/services/landlord-refurbishment/', label: 'Landlord Refurbishment' },
  { href: '/services/higher-education-fit-out/', label: 'Higher Education Fit Out' },
];

// Location pages are temporarily removed from the site (see LOCATION_LINKS
// history in git) — LOCATION_LINKS is unused while they're disabled.
