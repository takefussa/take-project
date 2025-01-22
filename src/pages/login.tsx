import { Button, Box, Input, Heading, Center, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { sessionState } from "@/libs/states";
import supabase from "@/libs/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setSession = useSetRecoilState(sessionState);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);

    if (error) {
      setError("Invalid login credentials. Please try again.");
      return;
    }

    if (data.session) {
      setSession(data.session);
      router.replace("/");
    }
  };

  return (
    <Center height="100vh" bg="gray.100">
      <Box bg="white" p={8} rounded="lg" shadow="md" maxW="md" w="100%">
        <Heading mb={4}>Login</Heading>
        <Input
          placeholder="Email"
          type="email"
          mb={4}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          mb={4}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Box color="red.500" mb={4}>{error}</Box>}
        <Button
          colorScheme="blue"
          w="100%"
          onClick={handleLogin}
          isLoading={isLoading}
        >
          Login
        </Button>
      </Box>
    </Center>
  );
}
