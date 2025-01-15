import React from "react";
import { Flex } from "@chakra-ui/react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

import { paddings } from "@/settings/constants/paddings";
import { brandColors, themeColors } from "@/settings/theme";
import { useDarkMode } from "@/hooks";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { isDarkMode, toggleColorMode } = useDarkMode();

  return (
    <Flex padding={[paddings.lg, paddings["4xl"]]} flexDirection="column" height="100vh" bgColor={isDarkMode ? themeColors.bgDark : themeColors.bgLight}>
      <DarkModeSwitch
        checked={!isDarkMode}
        onChange={toggleColorMode}
        size={30}
        sunColor={brandColors.brand.yellow}
        moonColor={brandColors.brand.dark}
        style={{ position: "absolute", right: 30, top: 30 }}
      />
      {children}
    </Flex>
  );
};

export default Layout;
