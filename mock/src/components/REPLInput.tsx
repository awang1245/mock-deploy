import React, { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { ControlledInput } from "./ControlledInput";
import { datasets } from "./mockedJson";
import { History } from "./REPL";

interface REPLInputProps {
  history: History[];
  setHistory: Dispatch<SetStateAction<History[]>>;
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
  currentDataset: string[][];
  setCurrentDataset: Dispatch<SetStateAction<string[][]>>;
}

export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");

  function handleSubmit(commandString: string) {
    const [command, ...args] = commandString.split(" ");

    if (command === "load") {
      const filePath = args[0];
      if (datasets[filePath]) {
        props.setCurrentDataset(datasets[filePath]);
        props.setHistory([
          ...props.history,
          {
            command: commandString,
            message: `Successfully loaded file ${filePath}`,
          },
        ]);
      } else {
        props.setHistory([
          ...props.history,
          {
            command: commandString,
            message: `Error: File ${filePath} not found`,
          },
        ]);
      }
    } else if (command === "view") {
      if (props.currentDataset.length > 0) {
        props.setHistory([
          ...props.history,
          { command: commandString, dataset: props.currentDataset },
        ]);
      } else {
        props.setHistory([
          ...props.history,
          { command: commandString, message: "Error: No dataset loaded." },
        ]);
      }
    } else if (command === "search") {
      //search
    } else if (command === "mode") {
      const newMode = args[0];
      if (newMode === "brief" || newMode === "verbose") {
        props.setMode(newMode);
        props.setHistory([
          ...props.history,
          { command: commandString, message: "Mode set to " + newMode },
        ]);
      } else {
        props.setHistory([
          ...props.history,
          {
            command: commandString,
            message:
              "Error: Invalid mode. Available modes are 'brief' and 'verbose'.",
          },
        ]);
      }
    } else {
      props.setHistory([
        ...props.history,
        { command: commandString, message: "Error: Invalid command." },
      ]);
    }

    setCommandString("");
  }

  return (
    <div className="repl-input">
      <legend id="command-instruct">Enter a command:</legend>
      <div className="input-button-flex">
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
        {/* Add mode buttons */}
        <button
          className="submit-button"
          onClick={() => handleSubmit(commandString)}
        >
          Submitted {props.mode === "verbose" ? "Verbosely" : "Briefly"}
        </button>
      </div>
    </div>
  );
}
