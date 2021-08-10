import { axiosInstance } from '../axiosInstance';
import { useCustomToast } from '../components/app/hooks/useCustomToast';
import { useUser } from '../components/user/hooks/useUser';

interface UseAuth {
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signout: () => void;
}

export function useAuth(): UseAuth {
  const SERVER_ERROR = 'There was an error contacting the server.';
  const toast = useCustomToast();
  const { clearUser, updateUser } = useUser();

  async function authServerCall(
    urlEndpoint: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      const { data, status } = await axiosInstance({
        url: urlEndpoint,
        method: 'POST',
        data: { email, password },
        headers: { 'Content-Type': 'application/json' },
      });

      if (status === 400) {
        toast({ title: data.message, status: 'warning' });
        return;
      }

      if (data?.user?.token) {
        toast({
          title: `Logged in as ${data.user.email}`,
          status: 'info',
        });

        // update stored user data
        updateUser(data.user);
      }
    } catch (errorResponse) {
      toast({
        title: errorResponse?.response?.data?.message || SERVER_ERROR,
        status: 'error',
      });
    }
  }

  async function signin(email: string, password: string): Promise<void> {
    authServerCall('/signin', email, password);
  }
  async function signup(email: string, password: string): Promise<void> {
    authServerCall('/user', email, password);
  }

  function signout(): void {
    // clear user from stored user data
    clearUser();
    toast({
      title: 'Logged out!',
      status: 'info',
    });
  }

  // Return the user object and auth methods
  return {
    signin,
    signup,
    signout,
  };
}
