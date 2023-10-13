import React, { useState } from "react";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";

export interface History {
  command: string;
  message?: string;
  dataset?: string[][];
}

export default function REPL() {
  const [history, setHistory] = useState<History[]>([]);
  const [mode, setMode] = useState<string>("brief");
  const [currentViewDataset, setCurrentViewDataset] = useState<string[][]>([]);
  const [currentSearchDataset, setCurrentSearchDataset] = useState<{
    [key: string]: string[][];
  }>({});

  return (
    <div className="repl">
      <REPLHistory history={history} mode={mode} />
      <REPLInput
        history={history}
        setHistory={setHistory}
        mode={mode}
        setMode={setMode}
        setCurrentViewDataset={setCurrentViewDataset}
        currentViewDataset={currentViewDataset}
        setCurrentSearchDataset={setCurrentSearchDataset}
        currentSearchDataset={currentSearchDataset}
      />
    </div>
  );
}
