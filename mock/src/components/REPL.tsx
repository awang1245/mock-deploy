import React, { useState } from "react";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";
import { datasets } from "./mockedJson";

export interface History {
  command: string;
  //? means optional value
  message?: string;
  dataset?: string[][];
}

export default function REPL() {
  const [history, setHistory] = useState<History[]>([]);
  const [mode, setMode] = useState<string>("brief");
  const [currentDataset, setCurrentDataset] = useState<string[][]>([]);

  return (
    <div className="repl">
      <REPLHistory history={history} mode={mode} />
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
