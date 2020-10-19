import { Box } from "@chakra-ui/core";
import React from "react";

interface wrapperProps {
  variant?: "small" | "regular";
}

const Wrapper: React.FC<wrapperProps> = ({ children, variant }) => {
  return (
    <Box
      maxW={variant === "regular" ? "500px" : "300px"}
      w="100%"
      mt={8}
      mx="auto"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
