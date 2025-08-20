export const CITY_TANSTACK_PATHS = {
  index: () => "/cities-tanstack",
  create: () => "/cities-tanstack/create",
  edit: (id: string = ":id") => `/cities-tanstack/${id}/edit`,
  details: (id: string = ":id") => `/cities-tanstack/${id}`,
};