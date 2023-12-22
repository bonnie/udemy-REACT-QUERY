import { Posts } from "./Posts";
import "./App.css";

function App() {
  return (
    // provide React Query client to App
    <div className="App">
      <h1>Blog &apos;em Ipsum</h1>
      <Posts />
    </div>
  );
}

export default App;
