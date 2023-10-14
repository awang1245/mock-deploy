import "../styles/main.css";
import { History } from "./REPL";

/**
 * This is the file that deals with all the command history of the program.
 */
interface REPLHistoryProps {
  history: History[];
  mode: string;
}

/**
 * This function populates what to display depending on what command has been called, what
 * optional props have been assigned a value, and what output mode it is on.
 * @param props
 * @returns Modified values
 */
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {props.history.map((item, index) => (
        <p key={index}>
          {/** If the mode is verbose, then include a line of output repeating the command back to the user */}
          {props.mode === "verbose" && (
            <>
              <span>Command: {item.command}</span> <br />
            </>
          )}
          {/** If the optional message field is filled, then Output: will contain a success/error message */}
          Output: {item.message && <span>{item.message}</span>}
          {/** If the optional dataset field is filled, then Output: will contain either a table of an entire
           * dataset for view, or specific rows for search */}
          {item.dataset && (
            <div className="view-table" aria-label="history-div">
              {item.dataset.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </div>
          )}
        </p>
      ))}
    </div>
  );
}
