import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LegalLens AI | Understand the fine print. Make informed next steps.',
  description: 'AI-powered legal document understanding platform for non-lawyers. Plain-English summaries, grounded evidence citations, document Q&A, and lawyer consultation briefs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
