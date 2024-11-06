import "@/styles/globals.css";
import type { AppProps } from "next/app";
import SidebarLayout from "@/components/layout";

export default function App({ Component, pageProps }: AppProps) {
  const useLayout = (Component as any).noLayout ? false : true;
  return useLayout ? (
    <SidebarLayout>
      <Component {...pageProps} />
    </SidebarLayout>
  ) : (
    <Component {...pageProps} />
  );
}
