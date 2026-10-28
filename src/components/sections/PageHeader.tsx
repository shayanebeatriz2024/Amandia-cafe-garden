type PageHeaderProps = {
  eyebrow: string;
  title: string;
  intro?: string;
};

export function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
  return (
    <header className="container pb-12 pt-section">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h1 className="text-h1">{title}</h1>
      {intro && <p className="mt-6 max-w-prose text-lg">{intro}</p>}
    </header>
  );
}
