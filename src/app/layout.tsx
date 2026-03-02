import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TV Box Server',
  description: 'Auto Downloader & S3 Uploader Webhook Server',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
