import React, { useMemo } from "react";
import { Flex, Text } from "@chakra-ui/react";

import { brandColors } from "@/settings/theme";
import { useDarkMode } from "@/hooks";
import { fontSizes } from "@/settings/constants/paddings";

type Props = {
  emoji: string;
  gameFinished?: boolean;
  isOpen: boolean;
  onClick?: () => void;
};

const EmojiCard = ({ emoji, gameFinished, isOpen }: Props) => {
  const { isDarkMode } = useDarkMode();

  const bgColor = useMemo(() => {
    // if (gameFinished) return brandColors.brand.green;

    if (isDarkMode) {
      if (isOpen) return brandColors.brand.light;
      else return brandColors.brand.red;
    } else {
      if (isOpen) return brandColors.brand.lavender;
      else return brandColors.brand.red;
    }
  }, [isDarkMode, isOpen, gameFinished]);

  return (
    <Flex width={50} height={50} justifyContent={"center"} alignItems={"center"} bg={bgColor} borderRadius={10} cursor={"pointer"}>
      {(isOpen || gameFinished) && <Text fontSize={fontSizes["2xl"]}>{emoji}</Text>}
    </Flex>
  );
};

export default EmojiCard;
