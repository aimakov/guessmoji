const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

import { Theme } from "emoji-picker-react";
import React, { useState, useRef, useMemo, useCallback } from "react";
import { Icon, Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Text, useOutsideClick } from "@chakra-ui/react";
import { createSwapy } from "swapy";
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";

import dynamic from "next/dynamic";

import { useDarkMode, useToast } from "@/hooks";
import { brandColors, themeColors } from "@/settings/theme";
import EmojiCard from "./EmojiCard";
import { fontSizes } from "@/settings/constants/paddings";
import { supabase } from "@/services/supabase";
import { MOVIES_COLUMNS, SUPABASE_TABLES } from "@/settings/constants/supabase";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  movieId: string;
  movieName: string;
  emojiArray: string[];
  hasWon: boolean;
};

const SuccessModal = ({ isOpen, onClose, movieId, movieName, emojiArray, hasWon }: Props) => {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [emojiToReplace, setEmojiToReplace] = useState<string>("");
  const [replacements, setReplacements] = useState<{ [emoji: string]: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const swapy = useRef<any>(null);

  const { isDarkMode } = useDarkMode();
  const { errorToast, warningToast, successToast } = useToast();

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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const toSubmit = Object.values(swapy.current.slotItemMap().asArray).map((entry: any) => entry.item);
      const stringToSubmit = JSON.stringify(toSubmit);
      const stringEmojiArray = JSON.stringify(emojiArray);

      if (stringEmojiArray === stringToSubmit) {
        warningToast({ title: "These emojis are the same.", description: "" });
        return;
      }
      const { data: movieSuggestionsData, error: movieSuggestionsError } = await supabase
        .from(SUPABASE_TABLES.movies)
        .select("emojiSuggestions")
        .eq("id", movieId)
        .single();
      if (movieSuggestionsError) throw movieSuggestionsError;

      if (movieSuggestionsData.emojiSuggestions === null) {
        const updates = {
          [stringEmojiArray]: 1,
          [stringToSubmit]: 1,
        };

        const { error: movieSuggestionsUpdateError } = await supabase
          .from(SUPABASE_TABLES.movies)
          .update({ emojiSuggestions: updates })
          .eq(MOVIES_COLUMNS.id, movieId);
        if (movieSuggestionsUpdateError) throw movieSuggestionsUpdateError;
      } else {
        let newEmojiSuggestions = { ...movieSuggestionsData.emojiSuggestions };

        let updates: { emojiSuggestions?: { [emojiString: string]: number }; emojiArray?: string[] } = {};

        if (Object.keys(newEmojiSuggestions).includes(stringToSubmit)) {
          const updateToSubmitAmount = newEmojiSuggestions[stringToSubmit] + 1;
          newEmojiSuggestions[stringToSubmit] = updateToSubmitAmount;

          updates.emojiSuggestions = newEmojiSuggestions;

          if (updateToSubmitAmount > newEmojiSuggestions[stringEmojiArray]) {
            updates.emojiArray = toSubmit;
          }
        } else {
          updates.emojiSuggestions = { ...newEmojiSuggestions, [stringToSubmit]: 1 };
        }

        const { error: updateMovieDetailsError } = await supabase.from(SUPABASE_TABLES.movies).update(updates).eq("id", movieId);
        if (updateMovieDetailsError) throw updateMovieDetailsError;
      }

      successToast({ title: "Thank you for your contribution!", description: "" });
      onClose();
    } catch (error) {
      const message = (error as Error).message;
      errorToast({ title: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerRef = useCallback((node: HTMLDivElement) => {
    if (node !== null && emojisToShow.length > 0) {
      swapy.current = createSwapy(node as HTMLElement);
    }

    return () => {
      swapy.current?.destroy();
    };
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent mx={2} bg={isDarkMode ? themeColors.bgDark : themeColors.bgLight}>
        <ModalHeader>{hasWon ? "You've correctly guessed the movie!" : "The movie name was:"}</ModalHeader>
        <ModalBody>
          <Flex justifyContent={"center"}>
            {emojiPickerOpen && (
              <Flex position={"fixed"} top={0} left={0} right={0} bottom={0} justifyContent={"center"} alignItems={"center"} zIndex={10} bg={"rgba(0,0,0,0.7)"}>
                {emojiPickerOpen && (
                  <Icon
                    _hover={{ cursor: "pointer" }}
                    onClick={() => setEmojiPickerOpen(false)}
                    fontSize="2xl"
                    color={isDarkMode ? themeColors.textLight : themeColors.textDark}
                    zIndex={30}
                    right={[5, 10]}
                    top={[5, 10]}
                    position={"absolute"}
                  >
                    <IoClose />
                  </Icon>
                )}
                <EmojiPicker
                  skinTonesDisabled
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
            )}
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

          <Flex gap={1} justifyContent={"center"} ref={containerRef} mb={4} width={"100%"}>
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
          <Button mr={3} onClick={handleSubmit} isLoading={isSubmitting}>
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose} isDisabled={isSubmitting}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SuccessModal;
