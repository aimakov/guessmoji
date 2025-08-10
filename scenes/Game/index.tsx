import React, { useState, useEffect, useMemo } from "react";
import { Flex, Button, Text } from "@chakra-ui/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useReward } from "react-rewards";
import { ThreeDot } from "react-loading-indicators";
import { TwitterShareButton } from "react-share";
import { FaSquareXTwitter } from "react-icons/fa6";

import { fontSizes } from "@/settings/constants/paddings";
import { hintIndices } from "@/settings/constants/supabase";
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
  const [isGameLoading, setIsGameLoading] = useState(true);
  const [gameStage, setGameStage] = useState<number>(2);
  const [movieToGuess, setMovieToGuess] = useState<Movie | null>(null);
  const [allMoviesNames, setAllMoviesNames] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  const { reward, isAnimating } = useReward("rewardId", "confetti");
  const { errorToast, warningToast } = useToast();

  const autocompleteItems = useMemo(() => {
    return allMoviesNames.map((movieName: string) => ({ key: movieName, label: movieName }));
  }, [allMoviesNames]);

  const getMovies = async () => {
    const { data, error } = await supabase.from("movies").select("movieName");
    if (error) throw error;

    setAllMoviesNames(data?.map((movie) => movie.movieName) as string[]);
  };

  const getSettings = async () => {
    const { data, error } = await supabase.from("settings").select("website, hashtags, firstHint, secondHint").single();
    if (error) throw error;

    setSettings(data as Settings);
  };

  const getRandomMovie = async () => {
    try {
      setIsGameLoading(true);
      const { data, error } = await supabase.rpc("get_random_movie");
      if (error) throw error;

      setMovieToGuess({ ...data, emojiArray: JSON.parse(data.emojiArray) } as Movie);
      setIsGameLoading(false);
    } catch (error) {
      const message = (error as Error).message;
      errorToast({ description: message });
    }
  };

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

        setTimeout(() => {
          setGameFinished(true);
          setHasWon(true);
          setSuccessModalOpen(true);
        }, 1000);
      }
    } else {
      handleSkip();
    }

    setMovieName("");
  };

  const handleSkip = (isSkipped = false) => {
    if (gameStage === 6) {
      errorToast({ title: "You've lost!", description: "" });

      setTimeout(() => {
        setGameFinished(true);
        setSuccessModalOpen(true);
        setHasWon(false);
      }, 1000);
    } else {
      setGameStage((prev) => prev + 1);
      if (!isSkipped) errorToast({ title: "Wrong answer", description: "" });
    }
  };

  useEffect(() => {
    getRandomMovie();
    getMovies();
    getSettings();
  }, []);

  return (
    <>
      {gameFinished && (
        <SuccessModal
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          movieId={movieToGuess?.id ?? ""}
          movieName={movieToGuess?.movieName ?? ""}
          emojiArray={movieToGuess?.emojiArray ?? []}
          hasWon={hasWon}
        />
      )}

      <Flex width={"320px"} flexDirection={"column"} mx={"auto"} height={"100%"} flex={1} justifyContent={"center"} alignItems={"center"}>
        <Text mb={4} fontSize={fontSizes["4xl"]} fontWeight={"bold"}>
          Guess the Movie
        </Text>
        {isGameLoading ? (
          <Flex height={"50px"} justifyContent={"center"} alignItems={"center"}>
            <ThreeDot color={brandColors.brand.cream} size="medium" text="" textColor="" />
          </Flex>
        ) : (
          <Flex gap={1}>
            {(movieToGuess?.emojiArray ?? []).map((emoji: string, index: number) => (
              <Flex key={index}>
                <Flex>
                  <EmojiCard emoji={emoji} gameFinished={gameFinished} isOpen={index < gameStage} />
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}

        {gameStage > (settings?.firstHint ?? hintIndices.firstHint) && (
          <Text fontSize={fontSizes["sm"]} fontWeight={"bold"} mt={1} mr={"auto"} ml={1}>
            Hint #1 (Genres):{" "}
            <Text as={"span"} fontWeight={"normal"}>
              {movieToGuess?.genres}
            </Text>
          </Text>
        )}

        {gameStage > (settings?.secondHint ?? hintIndices.secondHint) && (
          <Text fontSize={fontSizes["sm"]} fontWeight={"bold"} mr={"auto"} ml={1}>
            Hint #2 (Lead actor/voice actor):{" "}
            <Text as={"span"} fontWeight={"normal"}>
              {" "}
              {movieToGuess?.leadActor}
            </Text>
          </Text>
        )}

        <Flex justifyContent={"center"} width={"100%"} my={6}>
          <Autocomplete
            className="max-w-xs"
            label="Enter a movie"
            isClearable={false}
            inputValue={movieName}
            onInputChange={(value) => setMovieName(value)}
            classNames={{ popoverContent: `${movieName.length > 0 ? "" : "hidden"}` }}
            defaultItems={autocompleteItems}
          >
            {(movie) => <AutocompleteItem key={movie.key}>{movie.label}</AutocompleteItem>}
          </Autocomplete>
        </Flex>

        {gameFinished ? (
          <Flex width={"100%"} gap={2}>
            {hasWon && (
              <TwitterShareButton
                url={`\n\nTry it on: ${settings?.website}    `}
                title={`I've guessed "${movieToGuess?.movieName}" based on ${gameStage} emojis!\n\n${movieToGuess?.emojiArray
                  ?.slice(0, gameStage)
                  .join(" ")}${"🟥".repeat(movieToGuess?.emojiArray?.length! - gameStage)}`}
                hashtags={settings?.hashtags}
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                  background: `linear-gradient(to right, ${brandColors.brand.orange} 0%, ${brandColors.brand.purple}  100%)`,
                  padding: "15px 30px !important",
                  letterSpacing: "0.5px",
                  boxShadow: "0px 3px 12px 5px rgba(0,0,0,0.1)",
                  border: "none !important",
                  borderRadius: "50px",
                  fontWeight: 700,
                  height: "unset !important",
                  minHeight: "unset !important",
                  transitionProperty: "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, background",
                }}
              >
                <Text>Share on </Text> <FaSquareXTwitter />
              </TwitterShareButton>
            )}
            <Button onClick={handleResetGame} variant={"outline"} width={"50%"} mx={"auto"}>
              Reset
            </Button>
          </Flex>
        ) : (
          <Flex flexDirection={"column"} gap={4} width={"100%"}>
            <Button onClick={checkAnswer} variant={"primary"} width={"100%"}>
              Check
              <span id="rewardId" />
            </Button>
            <Button onClick={() => handleSkip(true)} variant={"outline"} width={"50%"} mx={"auto"}>
              Skip
            </Button>
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default Game;
