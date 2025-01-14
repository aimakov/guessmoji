import React, { useState, useEffect, useMemo, useRef } from "react";
import { Flex, Button, Text } from "@chakra-ui/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useReward } from "react-rewards";
import { ThreeDot } from "react-loading-indicators";
import { TwitterShareButton } from "react-share";
import { FaSquareXTwitter } from "react-icons/fa6";

import { fontSizes } from "@/settings/constants/paddings";
import { EmojiCard, SuccessModal } from "./components";
import { useToast } from "@/hooks";
import { supabase } from "@/services/supabase";
import { Movie, Settings } from "@/settings/types";
import { brandColors } from "@/settings/theme";

const Game = () => {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [movieName, setMovieName] = useState("");
  const [gameStage, setGameStage] = useState<number>(2);
  const [movieToGuess, setMovieToGuess] = useState<Movie | null>(null);
  const [allMoviesNames, setAllMoviesNames] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

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

  const getSettings = async () => {
    const { data, error } = await supabase.from("settings").select("website, hashtags").single();
    if (error) throw error;

    setSettings(data as Settings);
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

  const shareResult = () => {};

  const handleResetGame = () => {
    setMovieName("");
    setGameFinished(false);
    setHasWon(false);
    setSuccessModalOpen(false);
    setGameStage(2);
    getRandomMovie();
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
          setHasWon(true);
          setSuccessModalOpen(true);
        }, 1000);
      }
    } else {
      errorToast({ title: "Wrong answer", description: "" });
      setMovieName("");
      if (gameStage === 6) {
        errorToast({ title: "You lost!", description: "" });
        setGameFinished(true);
        setHasWon(false);
      } else {
        setGameStage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    getRandomMovie();
    getMovies();
    getSettings();
  }, []);

  return (
    <>
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        movieId={movieToGuess?.id ?? ""}
        movieName={movieToGuess?.movieName ?? ""}
        emojiArray={movieToGuess?.emojiArray ?? []}
      />
      <Flex width={"320px"} flexDirection={"column"} mx={"auto"} height={"100%"} flex={1} justifyContent={"center"} alignItems={"center"}>
        <Text mb={4} fontSize={fontSizes["4xl"]} fontWeight={"bold"}>
          Guess the Movie
        </Text>
        {movieToGuess ? (
          <Flex gap={1} mb={6}>
            {movieToGuess?.emojiArray?.map((emoji, index) => (
              <Flex key={index}>
                <Flex onClick={() => console.log("clicked")}>
                  <EmojiCard emoji={emoji} gameFinished={gameFinished} isOpen={index < gameStage} />
                </Flex>
              </Flex>
            ))}
          </Flex>
        ) : (
          <Flex height={"50px"} mb={6} justifyContent={"center"} alignItems={"center"}>
            <ThreeDot color={brandColors.brand.cream} size="medium" text="" textColor="" />
          </Flex>
        )}
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

        {gameFinished ? (
          <Flex width={"100%"} gap={2}>
            {hasWon && (
              // <Button onClick={shareResult} variant={"primary"} width={"100%"}>
              //   Share
              // </Button>
              <TwitterShareButton
                url={`\n\nTry it on: ${settings?.website}    `}
                title={`I've guessed "${movieToGuess?.movieName}" based on ${gameStage} emojis!\n\n${movieToGuess?.emojiArray
                  ?.slice(0, gameStage)
                  .join(" ")}${"🟥".repeat(movieToGuess?.emojiArray?.length! - gameStage)}`}
                hashtags={settings?.hashtags}
                style={{ width: "50%" }}
              >
                <Button onClick={shareResult} variant={"primary"} width={"100%"} gap={2}>
                  <Text>Share on </Text> <FaSquareXTwitter />
                </Button>
              </TwitterShareButton>
            )}
            <Button onClick={handleResetGame} variant={"outline"} width={"50%"}>
              Reset
            </Button>
          </Flex>
        ) : (
          <Button onClick={checkAnswer} variant={"primary"} width={"100%"}>
            Check
            <span id="rewardId" />
          </Button>
        )}
      </Flex>
    </>
  );
};

export default Game;
