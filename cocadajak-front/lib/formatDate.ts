export function formatMonthYear(dateString: string | null): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
  // Capitaliza a primeira letra ("setembro de 2026" -> "Setembro de 2026")
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}