import React, { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { ControlledInput } from "./ControlledInput";
import { datasets } from "./mockedJson";
import { searchSet } from "./mockedJson";
import { History } from "./REPL";

interface REPLInputProps {
  history: History[];
  setHistory: Dispatch<SetStateAction<History[]>>;
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
  currentViewDataset: string[][];
  setCurrentViewDataset: Dispatch<SetStateAction<string[][]>>;
  currentSearchDataset: { [key: string]: string[][] };
  setCurrentSearchDataset: Dispatch<
    SetStateAction<{ [key: string]: string[][] }>
  >;
}

export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");

  function handleSubmit(commandString: string) {
    const [command, ...args] = commandString.split(" ");
    const query = args.join(" ");

    if (command === "load") {
      if (datasets[query]) {
        props.setCurrentViewDataset(datasets[query]);
        props.setCurrentSearchDataset(searchSet[query]);
        props.setHistory([
          ...props.history,
          {
            command: commandString,
            message: `Successfully loaded file ${query}`,
          },
        ]);
      } else {
        props.setHistory([
          ...props.history,
          {
            command: commandString,
            message: `Error: File ${query} not found`,
          },
        ]);
      }
    } else if (command === "view") {
      if (props.currentViewDataset == datasets[query]) {
        props.setHistory([
          ...props.history,
          { command: commandString, dataset: props.currentViewDataset },
        ]);
      } else if (props.currentViewDataset.length === 0) {
        props.setHistory([
          ...props.history,
          { command: commandString, message: "Error: No dataset loaded." },
        ]);
      } else if (args.length === 0) {
        props.setHistory([
          ...props.history,
          {
            command: commandString,
            message: "Error: Please specify the dataset to view.",
          },
        ]);
      } else {
        props.setHistory([
          ...props.history,
          {
            command: commandString,
            message: "Error: This dataset is not loaded to be viewed.",
          },
        ]);
      }
    } else if (command === "search") {
      if (
        props.currentViewDataset.length > 0 &&
        Object.keys(props.currentSearchDataset).length > 0
      ) {
        // if (
        //   Object.keys(searchPeopleSet).indexOf(query) != -1 ||
        //   Object.keys(searchMovieSet).indexOf(query) != -1
        // )
        if (Object.keys(props.currentSearchDataset).indexOf(query) !== -1) {
          //const result = searchPeopleSet[query] || searchMovieSet[query];
          const result = props.currentSearchDataset[query];
          props.setHistory([
            ...props.history,
            { command: commandString, dataset: result },
          ]);
        } else if (args.length === 0) {
          props.setHistory([
            ...props.history,
            {
              command: commandString,
              message: "Error: Please indicate the column and value to search",
            },
          ]);
        } else {
          props.setHistory([
            ...props.history,
            {
              command: commandString,
              message: "Error: No search results matches the search value.",
            },
          ]);
        }
      } else {
        props.setHistory([
          ...props.history,
          { command: commandString, message: "Error: No dataset loaded." },
        ]);
      }
    } else if (command === "mode") {
      const newMode = query;
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
