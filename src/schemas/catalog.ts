import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  position: z.number().default(0),
});

export const productSchema = z.object({
  id: z.string(),
  code: z.string().nullable().default(null),
  name: z.string(),
  slug: z.string(),
  category: z.string().nullable().default(null),
  category_name: z.string().default(""),
  category_slug: z.string().default(""),
  sell_type: z.string().nullable().default(null),
  price: z.string(),
  description: z.string().nullable().default(""),
  position: z.number().default(0),
});

export function paginatedSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(item),
  });
}

export const contactFormSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
  phone: z
    .string()
    .min(10, "Informe um telefone válido com DDD.")
    .max(20, "Telefone muito longo."),
  people: z
    .string()
    .regex(/^[1-9]\d?$/, "Informe de 1 a 99 pessoas."),
  message: z.string().max(400, "Mensagem muito longa.").optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
