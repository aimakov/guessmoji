import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { ChakraProvider, extendTheme, localStorageManager, Box } from "@chakra-ui/react";
import { NextUIProvider } from "@nextui-org/react";

import { customTheme } from "@/settings/theme";
import "../styles/globals.css";

const theme = extendTheme(customTheme);

const satoshi = localFont({
  src: "../public/fonts/Satoshi/Fonts/WEB/fonts/Satoshi-Variable.woff2",
  display: "fallback",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <ChakraProvider theme={theme} colorModeManager={localStorageManager}>
        {/* <CSSReset /> */}
        <Box className={satoshi.className}>
          <Component {...pageProps} />
        </Box>
      </ChakraProvider>
    </NextUIProvider>
  );
}
