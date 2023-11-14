/* eslint-disable max-lines-per-function */
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { ReactElement } from 'react';
import { Redirect } from 'react-router-dom';

import { usePatchUser } from './hooks/usePatchUser';
import { useUser } from './hooks/useUser';
import { UserAppointments } from './UserAppointments';

export function UserProfile(): ReactElement {
  const { user } = useUser();
  const patchUser = usePatchUser();

  if (!user) {
    return <Redirect to="/signin" />;
  }

  const formElements = ['name', 'address', 'phone'];
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
              name: user?.name ?? '',
              address: user?.address ?? '',
              phone: user?.phone ?? '',
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
