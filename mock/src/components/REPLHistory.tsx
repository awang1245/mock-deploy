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
