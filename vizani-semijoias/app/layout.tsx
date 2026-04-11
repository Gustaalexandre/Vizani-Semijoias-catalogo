import type { ReactNode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

export const metadata = {
  title: 'Vizani Semijoias',
  description: 'Catálogo de semijoias banhadas a ouro',


};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
    
  );
}