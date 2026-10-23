export const queryKeys = {
  menus: ["menus"] as const,
  catalog: (menu: string | null) => ["catalog", menu ?? "default"] as const,
};
