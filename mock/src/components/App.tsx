import "../styles/App.css";
import REPL from "./REPL";

/**
 * This is the highest level component
 */

function App() {
  return (
    <div className="App">
      <p className="App-header">
        <link
          rel="stylesheet"
          href="https://use.typekit.net/swv5ywc.css"
        ></link>
        <h1>Hi! Welcome to Mock</h1>
      </p>
      <REPL />
    </div>
  );
}

export default App;
