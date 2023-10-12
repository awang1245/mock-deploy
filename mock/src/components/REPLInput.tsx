import React, { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { ControlledInput } from "./ControlledInput";
import { datasets } from "./mockedJson";
import ReactDOMServer from "react-dom/server";

interface REPLInputProps {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
  setCurrentDataset: Dispatch<SetStateAction<string[][]>>;
  currentDataset: string[][];
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
          `Successfully loaded file ${filePath}`,
        ]);
      } else {
        props.setHistory([
          ...props.history,
          `Error: File ${filePath} not found`,
        ]);
      }
    } else if (command === "view") {
      if (props.currentDataset.length > 0) {
        const tableRows = props.currentDataset.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ));
        props.setHistory([
          ...props.history,
          ReactDOMServer.renderToString(<table>{tableRows}</table>),
        ]);
      } else {
        props.setHistory([...props.history, "Error: No dataset loaded."]);
      }
    } else if (command === "search") {
      // Implement search functionality here
    } else if (command === "mode") {
      const newMode = args[0];
      if (newMode === "brief" || newMode === "verbose") {
        props.setMode(newMode);
        props.setHistory([...props.history, `Mode set to: ${newMode}`]);
      } else {
        props.setHistory([
          ...props.history,
          "Error: Invalid mode. Available modes are 'brief' and 'verbose'.",
        ]);
      }
    } else {
      props.setHistory([...props.history, "Error: Invalid command."]);
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
