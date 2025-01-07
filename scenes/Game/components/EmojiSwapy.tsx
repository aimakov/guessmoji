import React, { useLayoutEffect, useRef } from "react";
import { createSwapy, utils } from "swapy";
import { Flex, Icon } from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";

import EmojiCard from "./EmojiCard";
import { useDarkMode } from "@/hooks";
import { brandColors, themeColors } from "@/settings/theme";

type Props = {
  emojiArray: string[];
  setEmojiArray: React.Dispatch<React.SetStateAction<string[]>>;
  setEmojiToReplace: React.Dispatch<React.SetStateAction<string>>;
  setEmojiPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EmojiSwapy = ({ emojiArray, setEmojiArray, setEmojiToReplace, setEmojiPickerOpen }: Props) => {
  const container = useRef(null);
  const swapy = useRef<any>(null);

  const { isDarkMode } = useDarkMode();

  useLayoutEffect(() => {
    if (container.current && !swapy.current && emojiArray.length > 0) {
      swapy.current = createSwapy(container.current);

      swapy.current.onSwapEnd((event: any) => {
        const newOrder = Object.values(event.slotItemMap.asArray).map((entry: any) => entry.item);
        console.log("EmojySwapy: ", newOrder);
        setEmojiArray(newOrder);
      });
    }
  }, [container, emojiArray]);

  return (
    <Flex gap={1} justifyContent={"center"} ref={container} mb={4}>
      {emojiArray?.map((emoji, index) => (
        <Flex data-swapy-slot={emoji} key={index}>
          <Flex
            data-swapy-item={emoji}
            onClick={() => {
              console.log("clicked: ", index);
            }}
            position={"relative"}
            flexDirection={"column"}
            alignItems={"center"}
            gap={1}
          >
            <Icon
              fontSize="xl"
              color={isDarkMode ? themeColors.textLight : themeColors.textDark}
              _hover={{ color: brandColors.brand.red, cursor: "pointer" }}
              onClick={(e) => {
                setEmojiToReplace(emoji);
                setEmojiPickerOpen(true);
              }}
            >
              <MdEdit />
            </Icon>
            <EmojiCard emoji={emoji!} isOpen />
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};

export default EmojiSwapy;
