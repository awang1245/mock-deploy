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
 * props have been updated, and what mode it is on.
 * @param props
 * @returns Modified values
 */
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {props.history.map((item, index) => (
        <p key={index}>
          {props.mode === "verbose" && (
            <>
              <span>Command: {item.command}</span> <br />
            </>
          )}
          Output: {item.message && <span>{item.message}</span>}
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
