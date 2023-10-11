import { useState } from "react";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";

export default function REPL() {
  const [history, setHistory] = useState<string[]>([]);
  const [mode, setMode] = useState<string>("brief"); // Track the current mode (brief or verbose)

  return (
    <div className="repl">
      {/* This is where your REPLHistory might go... */}
      <REPLHistory history={history} mode={mode} />
      <hr />
      <REPLInput
        history={history}
        setHistory={setHistory}
        mode={mode}
        setMode={setMode}
      />
    </div>
  );
}
