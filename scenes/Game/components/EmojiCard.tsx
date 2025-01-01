import React from "react";
import { Flex, Text } from "@chakra-ui/react";

import { brandColors } from "@/settings/theme";
import { useDarkMode } from "@/hooks";
import { fontSizes } from "@/settings/constants/paddings";

type Props = {
  emoji: string;
  isOpen: boolean;
  onClick?: () => void;
};

const EmojiCard = ({ emoji, isOpen }: Props) => {
  const { isDarkMode } = useDarkMode();

  return (
    <Flex
      width={50}
      height={50}
      justifyContent={"center"}
      alignItems={"center"}
      bg={isDarkMode ? (isOpen ? brandColors.brand.light : brandColors.brand.red) : isOpen ? brandColors.brand.lavender : brandColors.brand.red}
      borderRadius={10}
      cursor={"pointer"}
    >
      {isOpen && <Text fontSize={fontSizes["2xl"]}>{emoji}</Text>}
    </Flex>
  );
};

export default EmojiCard;
