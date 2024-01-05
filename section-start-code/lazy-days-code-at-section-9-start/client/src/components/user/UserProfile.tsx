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

import { MUTATION_KEY, usePatchUser } from "./hooks/usePatchUser";
import { useUser } from "./hooks/useUser";
import { UserAppointments } from "./UserAppointments";

import { useLoginData } from "@/auth/AuthContext";

export function UserProfile() {
  const { userId } = useLoginData();
  const { user } = useUser();
  const patchUser = usePatchUser();
  const navigate = useNavigate();

  useEffect(() => {
    // use login data for redirect, for base app that doesn't
    //   retrieve user data from the server yet
    if (!userId) {
      navigate("/signin");
    }
  }, [userId, navigate]);

  const pendingData = useMutationState({
    filters: { mutationKey: [MUTATION_KEY], status: "pending" },
    select: (mutation) => {
      return mutation.state.variables as User;
    },
  });

  // take the first item in the pendingData array
  //   we know there will be only one mutation that matches the filter
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
          <Heading>
            Information for {pendingUser ? pendingUser.name : user?.name}
          </Heading>
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
          <Formik
            enableReinitialize
            initialValues={{
              name: user?.name ?? "",
              address: user?.address ?? "",
              phone: user?.phone ?? "",
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
