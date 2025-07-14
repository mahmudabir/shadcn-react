export const COUNTRY_PATHS = {
    index: () => '/countries',
    create: () => '/countries/create',
    edit: (id: string = ':id') => `/countries/${id}/edit`,
    details: (id: string = ':id') => `/countries/${id}`,
};