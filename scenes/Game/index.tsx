import React, { useState, useEffect, useMemo, useRef } from "react";
import { Flex, Button, Text } from "@chakra-ui/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useReward } from "react-rewards";

import { fontSizes } from "@/settings/constants/paddings";
import { EmojiCard, SuccessModal } from "./components";
import { useToast } from "@/hooks";
import { supabase } from "@/services/supabase";
import { Movie } from "@/settings/types";

const Game = () => {
  const [gameFinished, setGameFinished] = useState(false);
  const [movieName, setMovieName] = useState("");
  const [gameStage, setGameStage] = useState<number>(2);
  const [movieToGuess, setMovieToGuess] = useState<Movie | null>(null);
  const [allMoviesNames, setAllMoviesNames] = useState<string[]>([]);

  const { reward, isAnimating } = useReward("rewardId", "confetti");
  const { successToast, errorToast, warningToast } = useToast();

  const autocompleteItems = useMemo(() => {
    return allMoviesNames.map((movieName: string) => ({ key: movieName, label: movieName }));
  }, [allMoviesNames]);

  const getMovies = async () => {
    const { data, error } = await supabase.from("movies").select("movieName");
    if (error) throw error;

    setAllMoviesNames(data?.map((movie) => movie.movieName) as string[]);
  };

  const getRandomMovie = async () => {
    try {
      const { data, error } = await supabase.rpc("get_random_movie");
      if (error) throw error;

      setMovieToGuess(data[0] as Movie);
      console.log(data[0].movieName);
    } catch (error) {
      const message = (error as Error).message;
      errorToast({ description: message });
    }
  };

  const checkAnswer = () => {
    if (movieName.length === 0) {
      warningToast({ title: "Please enter a movie name", description: "" });
      return;
    }

    if (movieName === movieToGuess?.movieName) {
      if (!isAnimating) {
        reward();
        setMovieName("");

        setTimeout(() => {
          setGameFinished(true);
        }, 1000);
      }
    } else {
      errorToast({ title: "Wrong answer", description: "" });
      setMovieName("");
      if (gameStage === 6) {
        setGameFinished(true);
      } else {
        setGameStage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    getRandomMovie();
    getMovies();
  }, []);

  return (
    <>
      <SuccessModal
        isOpen={gameFinished}
        onClose={() => setGameFinished(false)}
        movieName={movieToGuess?.movieName ?? ""}
        emojiArray={movieToGuess?.emojiArray ?? []}
      />
      <Flex width={"320px"} flexDirection={"column"} mx={"auto"} height={"100%"} flex={1} justifyContent={"center"} alignItems={"center"}>
        <Text mb={4} fontSize={fontSizes["4xl"]} fontWeight={"bold"}>
          Guess the Movie
        </Text>
        <Flex gap={1} mb={6}>
          {movieToGuess?.emojiArray?.map((emoji, index) => (
            <Flex key={index}>
              <Flex onClick={() => console.log("clicked")}>
                <EmojiCard emoji={emoji} isOpen={index < gameStage} />
              </Flex>
            </Flex>
          ))}
        </Flex>

        <Flex justifyContent={"center"} width={"100%"} mb={6}>
          <Autocomplete
            className="max-w-xs"
            label="Enter a movie"
            isClearable={false}
            inputValue={movieName}
            onInputChange={(value) => setMovieName(value)}
            classNames={{ popoverContent: `${movieName.length > 0 ? "" : "hidden"}` }}
          >
            {autocompleteItems.map((movie) => (
              <AutocompleteItem key={movie.key}>{movie.label}</AutocompleteItem>
            ))}
          </Autocomplete>
        </Flex>

        <Button onClick={checkAnswer} variant={"primary"} width={"100%"}>
          Check
          <span id="rewardId" />
        </Button>

        {/* <Button
        onClick={() => {
          getRandomMovie();
          setGameStage(2);
        }}
      >
        Refresh
      </Button>
      <Button isDisabled={gameStage === movieToGuess?.emojiArray?.length} onClick={() => setGameStage((prev) => prev + 1)}>
        Open emoji
      </Button> */}
      </Flex>
    </>
  );
};

export default Game;
