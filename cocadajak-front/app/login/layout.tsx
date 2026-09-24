import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false }, // não faz sentido o Google indexar sua tela de login
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}