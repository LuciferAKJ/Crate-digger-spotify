interface PlaceholderPageProps {
  title: string;
  description: string;
  phase: string;
}

export function PlaceholderPage({ title, description, phase }: PlaceholderPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">{phase}</span>
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      <p className="max-w-md text-sm text-text-secondary">{description}</p>
    </div>
  );
}
