const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

import { Theme } from "emoji-picker-react";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Icon, Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text } from "@chakra-ui/react";
import { createSwapy, utils } from "swapy";
import { MdEdit } from "react-icons/md";
import dynamic from "next/dynamic";

import EmojiSwapy from "./EmojiSwapy";
import { useDarkMode } from "@/hooks";
import { brandColors, themeColors } from "@/settings/theme";
import EmojiCard from "./EmojiCard";
import { fontSizes } from "@/settings/constants/paddings";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  movieName: string;
  emojiArray: string[];
};

const SuccessModal = ({ isOpen, onClose, movieName, emojiArray }: Props) => {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [updatedEmojiArray, setUpdatedEmojiArray] = useState<string[]>([]);
  const [emojiToReplace, setEmojiToReplace] = useState<string>("");

  const container = useRef(null);
  const swapy = useRef<any>(null);
  const { isDarkMode } = useDarkMode();

  const handleEmojiReplace = (emojiToReplaceWith: string) => {
    let newData = [...updatedEmojiArray];

    const index = newData.indexOf(emojiToReplace);
    newData[index] = emojiToReplaceWith;

    setUpdatedEmojiArray(newData);
    setEmojiPickerOpen(false);
  };

  const handleSubmit = () => {
    console.log("submit: ", updatedEmojiArray);
  };

  useEffect(() => {
    if (emojiArray.length > 0) {
      setUpdatedEmojiArray(emojiArray);
    }
  }, [emojiArray]);

  useEffect(() => {
    if (container.current && emojiArray.length > 0) {
      swapy.current = createSwapy(container.current);

      swapy.current.onSwapEnd((event: any) => {
        if (event.hasChanged) {
          const newOrder = Object.values(event.slotItemMap.asArray).map((entry: any) => entry.item);
          console.log(newOrder);
          setUpdatedEmojiArray(newOrder);
        }
      });
    }

    return () => {
      swapy.current?.destroy();
    };
  }, [container.current, emojiArray]);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={isDarkMode ? themeColors.bgDark : themeColors.bgLight}>
        <ModalHeader>You've correctly guessed the movie!</ModalHeader>
        <ModalBody>
          <Flex id="EmojiPickerContainer" justifyContent={"center"}>
            <EmojiPicker
              open={emojiPickerOpen}
              style={{ position: "absolute", zIndex: 2 }}
              onEmojiClick={(emojiData) => {
                // setEmojiPickerOpen(false);
                handleEmojiReplace(emojiData.emoji);
                console.log("emoji clicked", emojiData.emoji);
              }}
              height={500}
              width={400}
              theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
            />
          </Flex>
          <Text
            textAlign={"center"}
            fontSize={fontSizes["2xl"]}
            fontWeight={"semibold"}
            mb={6}
            textColor={isDarkMode ? brandColors.brand.green : brandColors.brand.red}
          >
            {movieName}
          </Text>
          <Text mb={4} fontSize={fontSizes.md}>
            These are the movie emojis:
          </Text>
          {/* <EmojiSwapy
            emojiArray={updatedEmojiArray}
            setEmojiArray={setUpdatedEmojiArray}
            setEmojiToReplace={setEmojiToReplace}
            setEmojiPickerOpen={setEmojiPickerOpen}
          /> */}
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
                      setEmojiToReplace(emoji!);
                      setEmojiPickerOpen(true);
                      e.stopPropagation();
                    }}
                  >
                    <MdEdit />
                  </Icon>
                  <EmojiCard emoji={emoji!} isOpen />
                </Flex>
              </Flex>
            ))}
          </Flex>
          <Text fontSize={fontSizes.sm}>
            Re-arrange or replace them in a way that would better describe the movie.{" "}
            <Text as={"span"} fontWeight={"semibold"}>
              This will help to improve the game for everyone!
            </Text>
          </Text>
          {/* <Text fontSize={fontSizes.sm}>This will help to improve the game for everyone!</Text> */}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SuccessModal;
