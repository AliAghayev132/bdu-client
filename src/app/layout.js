import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://bdu.info.az'),
  title: {
    default: "Bakı Dövlət Universiteti",
    template: "%s | Bakı Dövlət Universiteti",
  },
  description: "Azərbaycanın ən qədim və nüfuzlu ali təhsil müəssisəsi",
  applicationName: "Bakı Dövlət Universiteti",
  openGraph: {
    siteName: "Bakı Dövlət Universiteti",
    type: "website",
    locale: "az_AZ",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/icon1.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/favicon/apple-icon.png" },
    ],
    shortcut: [
      "/favicon/favicon.ico",
    ],
  },
  appleWebApp: {
    capable: true,
    title: "BDU",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/favicon/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={`${montserrat.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
