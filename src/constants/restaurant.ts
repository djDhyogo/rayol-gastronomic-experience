export const RESTAURANT = {
  name: "Rayol Bistrô",
  fullName: "Rayol Bistrô Terra & Mar",
  tagline: "Terra & Mar",
  shortDescription:
    "Cozinha contemporânea de mar e terra, servida com hospitalidade litorânea.",
  address: "Barra do Sahy, São Sebastião — Litoral Norte de São Paulo",
  phone: "+55 12 99999-0000",
  whatsapp: "5512999990000",
  instagram: "@rayolbistroterraemar",
  instagramUrl: "https://instagram.com/rayolbistroterraemar",
  hours: [
    { days: "Quarta a Sexta", time: "18h — 23h" },
    { days: "Sábado", time: "12h — 00h" },
    { days: "Domingo", time: "12h — 22h" },
  ],
} as const;

export const CATEGORY_ORDER = [
  "promocao-do-dia",
  "happy-hour",
  "entradas",
  "compartilhar",
  "individual",
  "tradicionais",
  "sobremesas",
  "drinks",
  "bebidas",
  "embalagens",
] as const;

export const HIDDEN_CATEGORY_SLUGS = ["embalagens"];

export const PROMO_SLUG = "promocao-do-dia";
export const HAPPY_HOUR_SLUG = "happy-hour";
