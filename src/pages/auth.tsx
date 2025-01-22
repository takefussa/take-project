import { Box, Heading } from "@chakra-ui/react";

export default function AuthPage() {
  return (
    <Box textAlign="center" mt="20%">
      <Heading>Unauthorized</Heading>
      <p>Please login to access this page.</p>
    </Box>
  );
}
