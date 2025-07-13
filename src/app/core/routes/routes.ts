// Centralized route definitions for the app
export const ROUTES = {
    dashboard: '/',
    countries: '/countries',
    countryCreate: '/countries/create',
    countryEdit: (id: string = ':id') => `/countries/${id}/edit`,
    countryDetails: (id: string = ':id') => `/countries/${id}`,
};