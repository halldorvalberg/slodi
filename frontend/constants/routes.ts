// constants/routes.ts
export const ROUTES = {
  HOME: "/",
  // The bank lists every content type — tasks, events and programmes — so the
  // route is no longer named after one of them. /programs still resolves here
  // via a permanent redirect in next.config.ts.
  PROGRAMS: "/content",
  PROGRAM_DETAIL: (id: string) => `/content/${id}`,
} as const;
