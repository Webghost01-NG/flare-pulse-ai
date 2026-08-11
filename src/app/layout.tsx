import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FlarePulse AI | Autonomous Yield & Risk Sentinel (FTSOv2)',
  description: 'AI-driven autonomous yield optimizer and risk sentinel powered by Flare Time Series Oracle (FTSOv2) on Coston2 Testnet for Flare Summer Signal Hackathon.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-[#ea2a66] selection:text-white">
        {children}
      </body>
    </html>
  );
}
