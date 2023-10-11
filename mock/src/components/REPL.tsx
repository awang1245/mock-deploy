import React, { useState } from "react";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";
import { datasets } from "./mockedJson";

export default function REPL() {
  const [history, setHistory] = useState<string[]>([]);
  const [mode, setMode] = useState<string>("brief");
  const [currentDataset, setCurrentDataset] = useState<string[][]>([]);

  return (
    <div className="repl">
      <REPLHistory history={history} mode={mode} />
      <hr />
      <REPLInput
        history={history}
        setHistory={setHistory}
        mode={mode}
        setMode={setMode}
        setCurrentDataset={setCurrentDataset}
        currentDataset={currentDataset}
      />
    </div>
  );
}
