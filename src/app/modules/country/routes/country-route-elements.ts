export const COUNTRY_ROUTES = {
    index: () => '/countries',
    create: () => '/countries/create',
    edit: (id: string = ':id') => `/countries/${id}/edit`,
    details: (id: string = ':id') => `/countries/${id}`,
};