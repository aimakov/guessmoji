import React from "react";
import { Flex, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { fontSizes } from "@/settings/constants/paddings";
import { APP_URLS } from "@/settings/constants/urls";

const Homepage = () => {
  const { push } = useRouter();
  return (
    <Flex width={"100%"} height={"100%"} flex={1} justifyContent={"center"} alignItems={"center"}>
      <Flex flexDirection={"column"} gap={10}>
        <Text fontSize={fontSizes["3xl"]} fontWeight={"bold"}>
          Welcome to GuessMoji
        </Text>
        <Button onClick={() => push(APP_URLS.GAME)} _hover={{ scale: 1.4 }} variant={"primary"} height={"50px"} width={"auto"}>
          <Text fontSize={fontSizes.lg} fontWeight={"semibold"}>
            Start playing!
          </Text>
        </Button>
      </Flex>
    </Flex>
  );
};

export default Homepage;
