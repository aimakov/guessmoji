const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

import { Theme } from "emoji-picker-react";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Icon, Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Text } from "@chakra-ui/react";
import { createSwapy } from "swapy";
import { MdEdit } from "react-icons/md";
import dynamic from "next/dynamic";

import { useDarkMode, useToast } from "@/hooks";
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
  const [emojiToReplace, setEmojiToReplace] = useState<string>("");
  const [replacements, setReplacements] = useState<{ [emoji: string]: string }[]>([]);

  const container = useRef<HTMLDivElement>(null);
  const swapy = useRef<any>(null);
  const { isDarkMode } = useDarkMode();
  const { errorToast } = useToast();

  const emojisToShow = useMemo(() => {
    if (replacements.length > 0) {
      let temp = [...emojiArray];

      replacements.forEach((obj: any) => {
        for (const emoji in obj) {
          const index = temp.indexOf(emoji);
          if (index !== -1) {
            temp[index] = obj[emoji];
          }
        }
      });
      return temp;
    }

    return emojiArray;
  }, [emojiArray, replacements]);

  const handleEmojiReplace = (emojiToReplaceWith: string) => {
    try {
      if (emojisToShow.includes(emojiToReplaceWith)) {
        throw new Error("This emoji already exists.");
      }

      setReplacements((prev) => [...prev, { [emojiToReplace]: emojiToReplaceWith }]);
    } catch (error) {
      const message = (error as Error).message;
      errorToast({ title: message });
    } finally {
      setEmojiPickerOpen(false);
    }
  };

  const handleSubmit = () => {
    console.log(
      "submit: ",
      Object.values(swapy.current.slotItemMap().asArray).map((entry: any) => entry.item)
    );
  };

  useEffect(() => {
    if (container.current && emojisToShow.length > 0) {
      swapy.current = createSwapy(container.current);
    }

    return () => {
      swapy.current?.destroy();
    };
  }, [container.current, emojisToShow, swapy.current]);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={isDarkMode ? themeColors.bgDark : themeColors.bgLight}>
        <ModalHeader>You've correctly guessed the movie!</ModalHeader>
        <ModalBody>
          <Flex id="EmojiPickerContainer" justifyContent={"center"}>
            {emojiPickerOpen && (
              <Button
                position={"absolute"}
                zIndex={3}
                onClick={() => {
                  setEmojiPickerOpen(false);
                }}
              >
                Close
              </Button>
            )}
            <EmojiPicker
              open={emojiPickerOpen}
              style={{ position: "absolute", zIndex: 20 }}
              onEmojiClick={(emojiData) => {
                handleEmojiReplace(emojiData.emoji);
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

          <Flex gap={1} justifyContent={"center"} ref={container} mb={4}>
            {emojisToShow?.map((emoji, index) => (
              <Flex data-swapy-slot={emoji} key={index}>
                <Flex data-swapy-item={emoji} position={"relative"} flexDirection={"column"} alignItems={"center"} gap={1}>
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
