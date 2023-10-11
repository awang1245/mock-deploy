import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}

export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");

  function handleSubmit(commandString: string) {
    // Add command to history based on mode (brief or verbose)
    if (props.mode === "verbose") {
      props.setHistory([
        ...props.history,
        `Command: ${commandString}`,
        `Output: ${commandString}`,
      ]);
    } else {
      props.setHistory([...props.history, commandString]);
    }

    setCommandString("");
  }

  return (
    <div className="repl-input">
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      {/* Add mode buttons */}
      <div className="buttons-flex">
        <button
          className="submit-button"
          onClick={() => handleSubmit(commandString)}
        >
          Submitted {props.mode === "verbose" ? "Verbosely" : "Briefly"}
        </button>
        <button onClick={() => props.setMode("brief")}>Brief Mode</button>
        <button onClick={() => props.setMode("verbose")}>Verbose Mode</button>
      </div>
    </div>
  );
}
