import type { Metadata } from 'next';
import './globals.css';
import './design-system.css';
export const metadata: Metadata = { title: 'Geocontrol Project Hub', description: 'Plataforma multiproyecto para planificación, seguimiento, documentación y continuidad.', robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="es"><body>{children}</body></html>; }
