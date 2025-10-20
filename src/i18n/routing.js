import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['az', 'en'],
  defaultLocale: 'az',
  localePrefix: {
    mode: 'as-needed',
    prefixes: {
      'en': '/en'
    }
  }
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
