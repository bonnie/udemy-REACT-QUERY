import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
} from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { useAuth } from '../../auth/useAuth';
import { useUser } from './hooks/useUser';

// eslint-disable-next-line max-lines-per-function
export function Signin(): ReactElement {
  const [email, setEmail] = useState('test');
  const [password, setPassword] = useState('test');
  const [dirty, setDirty] = useState({ email: false, password: false });
  const auth = useAuth();
  const { user } = useUser();

  if (user) {
    return <Redirect to={`/user/${user.id}`} />;
  }

  return (
    <>
      <Flex minH="84vh" align="center" justify="center">
        <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
          <Stack align="center">
            <Heading>Sign in to your account</Heading>
          </Stack>
          <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
            <Stack spacing={4}>
              <FormControl
                id="email"
                isRequired
                isInvalid={!email && dirty.email}
              >
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() =>
                    setDirty((prevDirty) => ({ ...prevDirty, email: true }))
                  }
                />
                <FormErrorMessage>Email may not be blank</FormErrorMessage>
              </FormControl>
              <FormControl
                id="password"
                isRequired
                isInvalid={!password && dirty.password}
              >
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() =>
                    setDirty((prevDirty) => ({ ...prevDirty, password: true }))
                  }
                />
                <FormErrorMessage>Password may not be blank</FormErrorMessage>
              </FormControl>
              <HStack spacing={2} width="100%">
                <Button
                  variant="outline"
                  type="submit"
                  isDisabled={!email || !password}
                  onClick={() => auth.signup(email, password)}
                >
                  Sign up
                </Button>
                <Button
                  type="submit"
                  isDisabled={!email || !password}
                  onClick={() => auth.signin(email, password)}
                >
                  Sign in
                </Button>
              </HStack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
