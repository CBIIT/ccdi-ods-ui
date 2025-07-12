import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Open_Sans, Poppins, Lato, Inter, Nunito_Sans, Nunito, Public_Sans, Rubik } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
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
        url: "https://www.cancer.gov/profiles/custom/cgov_site/themes/custom/cgov/static/images/design-elements/icons/favicons/favicon.ico",
        sizes: "32x32"
      },
      {
        url: "https://www.cancer.gov/profiles/custom/cgov_site/themes/custom/cgov/static/images/design-elements/icons/favicons/favicon.svg",
        type: "image/svg+xml"
      }
    ],
    apple: [
      {
        url: "https://www.cancer.gov/profiles/custom/cgov_site/themes/custom/cgov/static/images/design-elements/icons/favicons/apple-touch-icon.png"
      }
    ],
    other: [
      {
        rel: "manifest",
        url: "https://www.cancer.gov/profiles/custom/cgov_site/themes/custom/cgov/static/images/design-elements/icons/favicons/site.webmanifest"
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} ${poppins.variable} ${lato.variable} ${inter.variable} ${nunitoSans.variable} ${nunito.variable} ${publicSans.variable} ${rubik.variable} antialiased bg-white min-h-screen`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
