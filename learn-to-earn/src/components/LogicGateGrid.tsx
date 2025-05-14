import { useState, useEffect } from "react";
import LogicGateTile from "./LogicGateTile";
import "../style/LogicGateGrid.css";

export default function LogicGateGrid() {
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const [output, setOutput] = useState(false);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    const result = inputA && inputB; // AND gate logic
    setOutput(result);
    setIsWin(result);
  }, [inputA, inputB]);

  return (
    <div className="logic-grid">
      <div className="row">
        <LogicGateTile
          type="input"
          inputValue={inputA}
          onToggle={() => setInputA((prev) => !prev)}
        />
        <LogicGateTile
          type="input"
          inputValue={inputB}
          onToggle={() => setInputB((prev) => !prev)}
        />
      </div>
      <div className="row">
        <LogicGateTile type="gate" gateType="AND" />
      </div>
      <div className="row">
        <LogicGateTile type="output" computedOutput={output} />
      </div>
      {isWin && <h2 className="win-text">🎉 You Win!</h2>}
    </div>
  );
}
