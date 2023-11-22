import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useMutationState } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "@shared/types";

import { PATCH_USER_MUTATION_KEY, usePatchUser } from "./hooks/usePatchUser";
import { useUser } from "./hooks/useUser";
import { UserAppointments } from "./UserAppointments";

export function UserProfile() {
  const { user } = useUser();
  const patchUser = usePatchUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  // https://tanstack.com/query/v5/docs/react/guides/optimistic-updates#if-the-mutation-and-the-query-dont-live-in-the-same-component
  const pendingData = useMutationState<User>({
    filters: { mutationKey: [PATCH_USER_MUTATION_KEY], status: "pending" },
    select: (mutation) => {
      return mutation.state.variables as User;
    },
  });

  console.log("======> PENDING DATA", pendingData);
  const pendingUser = pendingData ? pendingData[0] : null;

  const formElements = ["name", "address", "phone"];
  interface FormValues {
    name: string;
    address: string;
    phone: string;
  }

  return (
    <Flex minH="84vh" textAlign="center" justify="center">
      <Stack spacing={8} mx="auto" w="xl" py={12} px={6}>
        <UserAppointments />
        <Stack textAlign="center">
          <Heading>Your information</Heading>
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
          <Formik
            enableReinitialize
            initialValues={{
              name: pendingUser ? pendingUser.name : user?.name ?? "",
              address: pendingUser ? pendingUser.address : user?.address ?? "",
              phone: pendingUser ? pendingUser.phone : user?.phone ?? "",
            }}
            onSubmit={(values: FormValues) => {
              patchUser({ ...user, ...values });
            }}
          >
            <Form>
              {formElements.map((element) => (
                <FormControl key={element} id={element}>
                  <FormLabel>{element}</FormLabel>
                  <Field name={element} as={Input} />
                </FormControl>
              ))}
              <Button mt={6} type="submit">
                Update
              </Button>
            </Form>
          </Formik>
        </Box>
      </Stack>
    </Flex>
  );
}
