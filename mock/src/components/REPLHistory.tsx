import "../styles/main.css";
import { History } from "./REPL";

interface REPLHistoryProps {
  history: History[];
  mode: string;
}

export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {props.history.map((item, index) => (
        <p key={index}>
          {props.mode === "verbose" && (
            <>
              {/*Map requires only one child, so empty fragment wraps the two elements to be one child. 
            Div works too but would add line*/}
              <span>Command: {item.command}</span> <br />
            </>
          )}
          Output: {item.message && <span>{item.message}</span>}
          {item.dataset && (
            <div className="view-table">
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
