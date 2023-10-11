import React, { useState } from "react";
import { Dispatch, SetStateAction } from "react";
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
    const [command, ...args] = commandString.split(" ");

    if (command === "load_file") {
      // load code
    } else if (command === "view") {
      // view code
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
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button onClick={() => handleSubmit(commandString)}>
        Submitted {props.mode === "verbose" ? "Verbosely" : "Briefly"}
      </button>
    </div>
  );
}
