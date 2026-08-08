import type { Metadata } from "next";

import "./globals.css";

import { AuthProvider } from "../app/hooks/useAuth";

import { Toaster } from "../app/components/ui/sonner";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "InvoiceBill",

  description:
    "Modern GST tax invoice management portal for businesses.",

  openGraph: {
    title: "InvoiceBill",

    description:
      "Modern GST tax invoice management portal for businesses.",

    images: [
      './public/favicon.ico',
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "InvoiceBill",

    description:
      "Modern GST tax invoice management portal for businesses.",

    images: [
      // "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8062198a-d6d4-4577-ba30-42b7657478a8/id-preview-f64198af--93df1424-6a87-42a3-9079-7fb7fe5de641.lovable.app-1777471013412.png",
    ],
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <AuthProvider>
          {children}

          <Toaster
            richColors
            position="top-right"
          />
        </AuthProvider>
      </body>
    </html>
  );
}