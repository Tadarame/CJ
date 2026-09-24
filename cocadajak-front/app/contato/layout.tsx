import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com CocadaJak para orçamentos e agendamentos.",
  openGraph: {
    title: "Contato | CocadaJak",
    description: "Entre em contato com CocadaJak para orçamentos e agendamentos.",
  },
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return children;
}