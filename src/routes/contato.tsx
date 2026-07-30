import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { contactFormSchema, type ContactFormValues } from "@/schemas/catalog";
import { RESTAURANT } from "@/constants/restaurant";

const title = `Contato e reservas — ${RESTAURANT.fullName}`;
const description =
  "Reserve sua mesa no Rayol Bistrô Terra & Mar em Barra do Sahy: telefone, WhatsApp, endereço e horários de funcionamento.";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contato" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: ContactPage,
});

const emptyForm: ContactFormValues = { name: "", phone: "", people: "2", message: "" };

const FIELD_CLASS =
  "mt-2 min-h-11 w-full rounded-md border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors focus:border-brand-clay/60";

function ContactPage() {
  const [values, setValues] = useState<ContactFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = contactFormSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      toast.error("Revise os campos destacados.");
      return;
    }

    setErrors({});
    const text = encodeURIComponent(
      `Olá! Sou ${result.data.name} e gostaria de reservar mesa para ${result.data.people} pessoa(s). Telefone: ${result.data.phone}.${
        result.data.message ? ` Observação: ${result.data.message}` : ""
      }`,
    );
    window.open(`https://wa.me/${RESTAURANT.whatsapp}?text=${text}`, "_blank", "noopener");
    toast.success("Abrimos o WhatsApp para concluir sua reserva.");
    setValues(emptyForm);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2">
      <div>
        <p className="eyebrow">Contato</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-foreground sm:text-5xl">
          Reserve sua mesa
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Reservas por WhatsApp com confirmação no mesmo dia. Para grupos acima de 10 pessoas,
          entre em contato por telefone.
        </p>

        <dl className="mt-10 space-y-8 border-t border-border pt-10">
          <div>
            <dt className="eyebrow">Endereço</dt>
            <dd className="mt-3 text-sm text-foreground">{RESTAURANT.address}</dd>
          </div>
          <div>
            <dt className="eyebrow">Telefone</dt>
            <dd className="mt-3 text-sm text-foreground">
              <a href={`tel:${RESTAURANT.phone.replace(/\D/g, "")}`} className="hover:underline">
                {RESTAURANT.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Horários</dt>
            <dd className="mt-3 space-y-1 text-sm text-foreground">
              {RESTAURANT.hours.map((entry) => (
                <p key={entry.days}>
                  {entry.days} — {entry.time}
                </p>
              ))}
            </dd>
          </div>
        </dl>
      </div>

      <form onSubmit={handleSubmit} noValidate className="rounded-lg border border-border bg-card p-6 sm:p-8">
        <div>
          <label htmlFor="name" className="eyebrow">
            Nome
          </label>
          <input
            id="name"
            value={values.name}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={FIELD_CLASS}
          />
          {errors.name ? (
            <p id="name-error" className="mt-2 text-xs text-destructive">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="eyebrow">
              Telefone
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              value={values.phone}
              onChange={(event) => setValues((prev) => ({ ...prev, phone: event.target.value }))}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={FIELD_CLASS}
            />
            {errors.phone ? (
              <p id="phone-error" className="mt-2 text-xs text-destructive">
                {errors.phone}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="people" className="eyebrow">
              Pessoas
            </label>
            <input
              id="people"
              inputMode="numeric"
              value={values.people}
              onChange={(event) => setValues((prev) => ({ ...prev, people: event.target.value }))}
              aria-invalid={Boolean(errors.people)}
              aria-describedby={errors.people ? "people-error" : undefined}
              className={FIELD_CLASS}
            />
            {errors.people ? (
              <p id="people-error" className="mt-2 text-xs text-destructive">
                {errors.people}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="message" className="eyebrow">
            Observações (opcional)
          </label>
          <textarea
            id="message"
            rows={4}
            value={values.message}
            onChange={(event) => setValues((prev) => ({ ...prev, message: event.target.value }))}
            className={`${FIELD_CLASS} resize-none py-3`}
          />
          {errors.message ? (
            <p className="mt-2 text-xs text-destructive">{errors.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-7 text-xs tracking-[0.18em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
        >
          Enviar pelo WhatsApp
        </button>
      </form>
    </div>
  );
}
