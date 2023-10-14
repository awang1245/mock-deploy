import React, { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { ControlledInput } from "./ControlledInput";
import { datasets } from "./mockedJson";
import { searchSet } from "./mockedJson";
import { History } from "./REPL";

/**
 * This is the class that deals with all the command inputs of the program.
 *
 * Two different datasets are used to mock the full load, view, and search functionality
 * of our application, but datasets and searchsets contain identical keys file paths so that
 * they are synced.
 *
 * Importantly, history is of type History so it can handle commands, messages, and datasets
 * for output.
 */
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

/**
 * This function sets appropriate fields to values depending on the command called.
 * It also handles all the edge cases depending on the commands inputted.
 * @param props
 * @returns submitted command and output values to be updated in the html.
 */
export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");

  function handleSubmit(commandString: string) {
    //splits the first value in commandString into the command, and the rest as a string array of args
    const [command, ...args] = commandString.split(" ");
    //joining the arg array together so it is compatible for search queries
    const query = args.join(" ");

    if (command === "load") {
      //datasets and searchSet have synced keys, so queries need to and should satisfy both
      if (
        Object.keys(datasets).indexOf(query) !== -1 &&
        Object.keys(searchSet).indexOf(query) !== -1
      ) {
        props.setCurrentViewDataset(datasets[query]);
        props.setCurrentSearchDataset(searchSet[query]);
        //keeping track of currently loaded filepath to keep user informed
        setFilePath(query);
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
      if (props.currentViewDataset === datasets[query]) {
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
            message:
              "Error: Please check your syntax and the dataset you loaded.",
          },
        ]);
      }
    } else if (command === "search") {
      if (
        props.currentViewDataset.length > 0 &&
        Object.keys(props.currentSearchDataset).length > 0
      ) {
        if (Object.keys(props.currentSearchDataset).indexOf(query) !== -1) {
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
              message:
                "Error: No search results matches the search value. Current dataset loaded: " +
                filePath,
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
      if (query === "brief" || query === "verbose") {
        props.setMode(query);
        props.setHistory([
          ...props.history,
          { command: commandString, message: "Mode set to " + query },
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
        { command: commandString, message: "Error: Invalid command" },
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
