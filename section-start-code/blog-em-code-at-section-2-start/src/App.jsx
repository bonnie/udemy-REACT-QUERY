import { QueryClient, QueryProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { Posts } from "./Posts";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    // provide React Query client to App
    <QueryProvider client={queryClient}>
      <div className="App">
        <h1>Blog Posts</h1>
        <Posts />
        <ReactQueryDevtools />
      </div>
    </QueryProvider>
  );
}

export default App;
