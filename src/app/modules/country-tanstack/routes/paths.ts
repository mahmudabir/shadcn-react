export const COUNTRY_TANSTACK_PATHS = {
  index: () => '/countries-tanstack',
  create: () => '/countries-tanstack/create',
  edit: (id: string = ':id') => `/countries-tanstack/${id}/edit`,
  details: (id: string = ':id') => `/countries-tanstack/${id}`,
};