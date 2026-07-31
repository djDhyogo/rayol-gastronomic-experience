interface ListCategoryProps {
  id: string;
  name: string;
}

export function ListCategory({ id, name }: ListCategoryProps) {
  return (
    <header className="mb-2 text-center">
      <h2
        id={id}
        className="font-display text-2xl tracking-wide text-brand-navy uppercase sm:text-3xl"
      >
        {name}
      </h2>
      <div className="mx-auto mt-3 h-px w-full max-w-md bg-border" aria-hidden="true" />
    </header>
  );
}
