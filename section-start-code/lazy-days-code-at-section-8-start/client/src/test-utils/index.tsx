import { ChakraProvider } from "@chakra-ui/react";
import { render as RtlRender } from "@testing-library/react";
import { PropsWithChildren, ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

// ** FOR TESTING CUSTOM HOOKS ** //
// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
// export const createQueryClientWrapper = () => {
//   const queryClient = generateQueryClient();
//   return ({ children }: PropsWithChildren) => (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// };

// reference: https://testing-library.com/docs/react-testing-library/setup#custom-render
function customRender(ui: ReactElement) {
  return RtlRender(
    <ChakraProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </ChakraProvider>
  );
}

// re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";

// override render method
export { customRender as render };
