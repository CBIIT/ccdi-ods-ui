import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Open_Sans, Poppins, Lato, Inter, Nunito_Sans, Nunito, Public_Sans, Rubik, Roboto } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OverlayWindow from "@/components/OverlayWindow";
import Script from "next/script";

/**
 * Font configurations for the application using Next.js built-in font optimization
 * These fonts are loaded and optimized at build time and injected via CSS variables
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Open Sans - Primary font for body text and general content (replaced with Inter)
const openSans = Open_Sans({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Poppins - Used for headings and emphasized text
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

// Lato - Alternative body font with multiple weights
const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

// Inter - Modern sans-serif font for UI elements
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Nunito Sans - Used for navigation and buttons
const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

// Nunito - Alternative to Nunito Sans for specific UI components
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

// Public Sans - USWDS (U.S. Web Design System) compliant font
const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  title: "NCI Data Sharing Hub",
  description: "Explore the NCIs data sharing and data access policies, guidelines, and resources to support cancer research and open science.",
  metadataBase: new URL("https://datascience.cancer.gov"),
  alternates: {
    canonical: "/data-sharing"
  },
  openGraph: {
    title: "Data Sharing - NCI Data Science",
    description: "Explore the NCIs data sharing and data access policies, guidelines, and resources to support cancer research and open science.",
    url: "https://datascience.cancer.gov/data-sharing",
    siteName: "NCI Data Science",
    type: "website",
    images: [{
      url: "https://datascience.cancer.gov/sites/default/files/styles/cgov_social_media/public/2023-01/data-sharing-header.jpg"
    }]
  },
  twitter: {
    card: "summary",
    title: "Data Sharing - NCI Data Science",
    description: "Explore the NCIs data sharing and data access policies, guidelines, and resources to support cancer research and open science."
  },
  icons: {
    icon: [
      {
        url: "https://raw.githubusercontent.com/CBIIT/ccdi-ods-ui/refs/heads/dev2/public/favicon.ico",
        sizes: "32x32"
      }
    ]
  },
  other: {
    "x-ua-compatible": "IE=edge",
    "content-language": "en",
    "dcterms.subject": "NCI Data Sharing",
    "dcterms.type": "DataSharingLanding",
    "dcterms.coverage": "nciglobal,ncienterprise",
    "dcterms.isPartOf": "NCI Data Science",
    "cgdp.domain": "datascience",
    "MobileOptimized": "width",
    "HandheldFriendly": "true"
  },
  viewport: {
    width: "device-width",
    userScalable: true,
    initialScale: 1,
    minimumScale: 1
  }
};

// Add Adobe DTM script configuration
export const adobeDTM = {
  src: "https://assets.adobedtm.com/6a4249cd0a2c/785de09de161/launch-70d67a6a40a8.min.js",
  async: true
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script {...adobeDTM} />
        <script src="/js/session.js" async></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} ${poppins.variable} ${lato.variable} ${inter.variable} ${nunitoSans.variable} ${nunito.variable} ${publicSans.variable} ${rubik.variable} ${roboto.variable} antialiased bg-white min-h-screen`}
      >
        <Header />
        <OverlayWindow />
        {children}
        <Footer />
      </body>
    </html>
  );
}
