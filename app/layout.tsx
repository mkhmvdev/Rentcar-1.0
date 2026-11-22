import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteEffects } from "@/components/SiteEffects";
import { PageTransition } from "@/components/PageTransition";
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "MORENT | Avtomobil ijarasi",
  description: "O'zbekiston bo'ylab qulay va ishonchli avtomobil ijarasi.",
  metadataBase: new URL("https://morent.uz"),
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "MORENT | Avtomobil ijarasi",
    description: "Qulay, xavfsiz va arzon avtomobil ijara platformasi.",
    url: "https://morent.uz",
    siteName: "MORENT",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MORENT | Avtomobil ijarasi",
    description: "Avtomobil ijarasi uchun qulay platforma.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const yandexId = process.env.NEXT_PUBLIC_YANDEX_METRIC_ID;
  return (
    <html
      lang="uz"
      className={`${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PageTransition>{children}</PageTransition>
        <SiteEffects />
        <Script src="/register-sw.js" strategy="afterInteractive" />
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}')`}</Script>
          </>
        )}
        {yandexId && <Script id="yandex-metrica" strategy="afterInteractive">{`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym('${yandexId}','init',{clickmap:true,trackLinks:true,accurateTrackBounce:true})`}</Script>}
      </body>
    </html>
  );
}
