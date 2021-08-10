import { Box, Button, Flex, HStack, Icon, Link } from '@chakra-ui/react';
import { ReactElement, ReactNode } from 'react';
import { GiFlowerPot } from 'react-icons/gi';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import { useAuth } from '../../auth/useAuth';
import { useUser } from '../user/hooks/useUser';

const Links = ['Treatments', 'Staff', 'Calendar'];

const NavLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link
    as={RouterLink}
    px={2}
    py={1}
    rounded="md"
    color="olive.200"
    _hover={{
      textDecoration: 'none',
      color: 'olive.500',
    }}
    to={to}
  >
    {children}
  </Link>
);

export function Navbar(): ReactElement {
  const { user } = useUser();
  const { signout } = useAuth();
  const history = useHistory();

  return (
    <Box bg="gray.900" px={4}>
      <Flex h={16} alignItems="center" justify="space-between">
        <HStack spacing={8} alignItems="center">
          <NavLink to="/">
            <Icon w={8} h={8} as={GiFlowerPot} />
          </NavLink>
          <HStack as="nav" spacing={4}>
            {Links.map((link) => (
              <NavLink key={link} to={`/${link}`}>
                {link}
              </NavLink>
            ))}
          </HStack>
        </HStack>
        <HStack>
          {user ? (
            <>
              <NavLink to={`/user/${user.id}`}>{user.email}</NavLink>
              <Button onClick={() => signout()}>Sign out</Button>
            </>
          ) : (
            <Button onClick={() => history.push('signin')}>Sign in</Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
