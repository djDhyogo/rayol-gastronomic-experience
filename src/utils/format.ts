const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatPrice(value: string | number): string {
  const numeric = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return "—";
  return currency.format(numeric);
}

export function toNumber(value: string | number): number {
  const numeric = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

/** Remove emojis e símbolos decorativos vindos da API ("$ PROMOÇÃO DO DIA $"). */
export function cleanCategoryName(raw: string): string {
  const stripped = raw
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, " ")
    .replace(/[$@*#|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return toTitleCase(stripped || raw.trim());
}

const LOWERCASE_WORDS = new Set(["de", "do", "da", "e", "com", "ao", "à", "na", "no"]);

export function toTitleCase(value: string): string {
  return value
    .toLocaleLowerCase("pt-BR")
    .split(" ")
    .map((word, index) => {
      if (index > 0 && LOWERCASE_WORDS.has(word)) return word;
      return word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1);
    })
    .join(" ");
}

/** Normaliza texto para busca (sem acentos, minúsculo). */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function truncate(value: string, max = 120): string {
  const clean = value.replace(/\s*\n\s*/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trimEnd()}…`;
}
