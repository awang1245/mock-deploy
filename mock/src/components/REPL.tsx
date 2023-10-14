import React, { useState } from "react";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";

/**
 * This is our top level component for the REPL for our application.
 * It declares all the fields that may be updated depending on the command used.
 */
export interface History {
  command: string;
  //message and dataset are optional values
  message?: string;
  dataset?: string[][];
}

/**
 * This is the function to set default values to the fields.
 * @returns the modified fields depending on the commands made.
 */
export default function REPL() {
  //array of type History so that it can account for commands and messages or datasets
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
