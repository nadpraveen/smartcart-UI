import "./globals.css";

export const metadata = {
  title: "Smart Cart",
  description: "AI Grocery Planner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}