import "./globals.css";
import Navbar from "./components/navbar";
import CustomCursor from "./components/custom-cursor";
import Expand from "./components/expand";
import ClientLoadingWrapper from "./components/clientloadingwrapper";
import { ScrollbarProvider } from "./contexts/ScrollbarContext";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "./lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Creative Studio for Brand Strategy & Digital Creation`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#2a4862",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased overflow-x-hidden font-bebas-neue">
        <ScrollbarProvider>
          <ClientLoadingWrapper>
            <Navbar />
            <CustomCursor />
            <Expand>{children}</Expand>
          </ClientLoadingWrapper>
        </ScrollbarProvider>
      </body>
    </html>
  );
}
