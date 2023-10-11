import "../styles/main.css";

interface REPLHistoryProps {
  history: string[];
  mode: string;
}

export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {props.history.map((command, index) => (
        <p key={index}>
          {props.mode === "verbose" && <span>Command: {command}</span>}
          <br />
          Output: {command}
        </p>
      ))}
    </div>
  );
}
