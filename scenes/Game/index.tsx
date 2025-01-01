import React, { useState, useEffect } from "react";
import { Flex, Button, Text, Input } from "@chakra-ui/react";

import { fontSizes } from "@/settings/constants/paddings";
import { EmojiCard } from "./components";
import { useDebounce } from "@/hooks";
import { findSimilarStrings } from "@/settings/helpers";

type Props = {};

const Game = (props: Props) => {
  const [movieName, setMovieName] = useState("");

  const debouncedMovieName = useDebounce(movieName, 500);

  useEffect(() => {
    console.log(debouncedMovieName);
  }, [debouncedMovieName]);

  const predefinedArray = ["apple", "application", "apricot", "banana", "grape"];
  const input = "apply";
  const threshold = 0.35;

  console.log(findSimilarStrings(debouncedMovieName, predefinedArray, threshold));

  return (
    <Flex width={"320px"} flexDirection={"column"} mx={"auto"} height={"100%"} flex={1} justifyContent={"center"} alignItems={"center"}>
      <Text mb={4} fontSize={fontSizes["4xl"]} fontWeight={"bold"}>
        Guess the Movie
      </Text>
      <Flex gap={1} mb={14}>
        <EmojiCard emoji={"🚀"} isOpen={true} />
        <EmojiCard emoji={"😁"} isOpen={true} />
        <EmojiCard emoji={"🚀"} isOpen={false} />
        <EmojiCard emoji={"🚀"} isOpen={false} />
        <EmojiCard emoji={"🚀"} isOpen={false} />
        <EmojiCard emoji={"🚀"} isOpen={false} />
      </Flex>
      <Flex justifyContent={"center"} width={"100%"}>
        <Input value={movieName} onChange={(e) => setMovieName(e.target.value)} />
      </Flex>
    </Flex>
  );
};

export default Game;
