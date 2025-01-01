import { useColorMode as CHUseColorMode } from "@chakra-ui/react";

const useColorMode = () => {
  const { colorMode, toggleColorMode } = CHUseColorMode();

  return { isDarkMode: colorMode === "dark", toggleColorMode };
};

export default useColorMode;
