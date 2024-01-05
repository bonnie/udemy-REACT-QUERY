import { Box, Button, Flex, HStack, Icon, Link } from "@chakra-ui/react";
import { ReactNode } from "react";
import { GiFlowerPot } from "react-icons/gi";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useLoginData } from "@/auth/AuthContext";
import { useAuthActions } from "@/auth/useAuthActions";
import { useUser } from "@/components/user/hooks/useUser";

const Links = ["Treatments", "Staff", "Calendar"];

const NavLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link
    as={RouterLink}
    px={2}
    py={1}
    rounded="md"
    color="olive.200"
    _hover={{
      textDecoration: "none",
      color: "olive.500",
    }}
    to={to}
  >
    {children}
  </Link>
);

export function Navbar() {
  // use login data for signin / signout button, for
  //   base app that doesn't retrieve user data from the server yet
  const { userId } = useLoginData();
  const { user } = useUser();
  const { signout } = useAuthActions();
  const navigate = useNavigate();

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
          {userId ? (
            <>
              {user && <NavLink to={`/user/${user.id}`}>{user.email}</NavLink>}
              <Button onClick={() => signout()}>Sign out</Button>
            </>
          ) : (
            <Button onClick={() => navigate("/signin")}>Sign in</Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
