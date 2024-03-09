import { useState } from "react";
import "./App.css";
import { InfinitePeople } from "./people/InfinitePeople";
import { InfiniteSpecies } from "./species/InfiniteSpecies";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
  const [category, setCategory] = useState("people");
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Infinite SWAPI</h1>
        <button onClick={() => setCategory("people")}>People</button>
        <button onClick={() => setCategory("species")}>Species</button>
        {category === "people" ? <InfinitePeople /> : <InfiniteSpecies />}
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
