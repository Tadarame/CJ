export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 px-6 py-10 text-sm text-muted sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <span>CocadaJak — Fotografia</span>
        <div className="flex gap-6">
          <a href="mailto:admin@cocadajak.com" className="transition-colors hover:text-foreground">
            admin@cocadajak.com
          </a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}