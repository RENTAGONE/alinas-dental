import "./globals.css";

export const metadata = {
  title: "Alina's Dental Grace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
