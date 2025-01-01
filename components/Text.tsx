import React from "react";
import { Text as ChakraText } from "@chakra-ui/react";

type Props = {
  children: string;
  customStyles?: any;
};

const Text = ({ children, customStyles }: Props) => {
  return <ChakraText {...customStyles}>{children}</ChakraText>;
};

export default Text;
