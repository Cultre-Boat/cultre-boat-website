import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../app/components/navbar";
import CustomCursor from "../app/components/custom-cursor";
import { bellotaText } from './fonts';
import VFXCanvas from '../app/components/VFXWrapper';
import Expand from '../app/components/expand';
import ClientLoadingWrapper from '../app/components/clientloadingwrapper';
import FullScreenScreenWaterEffect from "./components/FullScreenWaterEffect";


export const metadata = {
  title: "Cultre Boat",
  description: "Everybody loves a good story. We love to build them.We're a creative studio that specialises in brand strategy and digital creation. We enjoy a close working relationship with each of our clients and engaging in meaningful digital experiences.We're marketers, copywriters, thinkers, social media enthusiasts, visual designers and most importantly, communicators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" bbai-tooltip-injected="true" data-scroll-behavior="smooth">
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      <body
        className={`antialiased overflow-x-hidden font-bellota-light`}
        cz-shortcut-listen="true"
      >
        <ClientLoadingWrapper>
          <FullScreenScreenWaterEffect/>
          <Navbar />
          <CustomCursor />
          <Expand>{children}</Expand>
          {/* <VFXCanvas /> */}
        </ClientLoadingWrapper>
      </body>
    </html>
  );
}