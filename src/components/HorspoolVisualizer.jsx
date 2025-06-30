import React, { useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Header from "../home-components/Header";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const horspoolAlgorithmLines = [
  "Build shift table from pattern",
  "Initialize shift = 0",
  "while shift <= text.length - pattern.length do",
  "\tSet j = pattern.length - 1",
  "\twhile j >= 0 and pattern[j] == text[shift + j] do",
  "\t\tDecrement j by 1",
  "\tif j < 0 then",
  "\t\tPattern found at shift",
  "\t\tshift += 1",
  "\telse",
  "\t\tshift += shiftTable[text[shift + pattern.length - 1]] or pattern.length",
  "end while",
];

export default function HorspoolVisualizer() {
  const [text, setText] = useState("HERE IS A SIMPLE EXAMPLE");
  const [pattern, setPattern] = useState("EXAMPLE");
  const [currentShift, setCurrentShift] = useState(0);
  const [comparisonIndex, setComparisonIndex] = useState(null);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [status, setStatus] = useState("");
  const [animating, setAnimating] = useState(false);
  const [mismatchIndex, setMismatchIndex] = useState(null);
  const [highlightLine, setHighlightLine] = useState(null);
  const [shiftTable, setShiftTable] = useState(null);
  const containerRef = useRef();

  // Build Horspool shift table
  const buildShiftTable = (pattern) => {
    setHighlightLine(1);
    const m = pattern.length;
    const table = {};
    for (let i = 0; i < m - 1; i++) {
      table[pattern[i]] = m - 1 - i;
    }
    setShiftTable(table);
    return table;
  };

  const startSearch = async () => {
    setAnimating(true);
    setCurrentShift(0);
    setComparisonIndex(null);
    setMismatchIndex(null);
    setMatchedIndices([]);
    setStatus("");
    setHighlightLine(2);

    const m = pattern.length;
    const n = text.length;
    const shiftTbl = buildShiftTable(pattern);

    let shift = 0;
    let matches = [];

    while (shift <= n - m) {
      setHighlightLine(3);
      setCurrentShift(shift);
      let j = m - 1;
      setHighlightLine(4);

      while (j >= 0) {
        setHighlightLine(5);
        setComparisonIndex(j);
        setMismatchIndex(null);
        setStatus(
          `Comparing pattern[${j}] (${pattern[j]}) with text[${shift + j}] (${
            text[shift + j]
          })`
        );

        await delay(700);

        if (pattern[j] !== text[shift + j]) {
          setMismatchIndex(j);
          setStatus(
            `Mismatch at pattern[${j}] (${pattern[j]}) and text[${
              shift + j
            }] (${text[shift + j]})`
          );
          setHighlightLine(9);
          await delay(700);

          const shiftAmount = shiftTbl[text[shift + m - 1]] || m;
          setStatus(`Shift pattern by ${shiftAmount} positions`);
          setHighlightLine(10);
          await delay(700);

          shift += shiftAmount;
          break;
        }
        setHighlightLine(6);
        j--;
        await delay(500);
      }

      if (j < 0) {
        setHighlightLine(7);
        setStatus(`Pattern found at index ${shift}`);
        matches.push(shift);
        setMatchedIndices([...matches]);
        await delay(1000);
        setHighlightLine(8);
        shift += 1;
      }
    }
    setStatus("Search Complete");
    setComparisonIndex(null);
    setMismatchIndex(null);
    setAnimating(false);
    setHighlightLine(null);
  };

  return (
    <>
      <div className="bg-black w-screen h-screen flex flex-col items-center justify-center overflow-hidden relative">
        <p className="text-white text-center py-4 text-3xl font-bold">
          Horspool Algorithm
        </p>

        <div
          ref={containerRef}
          className="bg-white w-[96%] h-[88%] mx-auto relative rounded-lg shadow-inner overflow-hidden"
        >
          {/* Algorithm */}
          <motion.div
            drag
            dragConstraints={containerRef}
            className="cursor-pointer absolute bg-[#d65775] top-0 right-0 m-6 p-2 font-mono text-xs rounded-lg text-white w-auto h-auto overflow-auto"
          >
            <p className="font-bold mb-2 text-base">Algorithm</p>
            {horspoolAlgorithmLines.map((line, i) => (
              <div
                key={i}
                className={`text-xs transition-colors duration-300 px-2 py-[1px] rounded whitespace-pre ${
                  i === highlightLine ? "bg-black" : "hover:bg-orange-500"
                }`}
              >
                {line}
              </div>
            ))}
          </motion.div>

          {/* analysis  */}
          <motion.div
            drag
            dragConstraints={containerRef}
            className="cursor-pointer absolute bg-[#52bc69] top-0 left-0 m-6 p-2 font-mono text-sm rounded-lg text-white"
          >
            <div className="font-bold mb-2 text-sm">Horspool Analysis</div>
            <p>Time Complexity (Best): O(n / m)</p>
            <p>Time Complexity (Average): O(n)</p>
            <p>Time Complexity (Worst): O(mn)</p>
            <p>Space Complexity: O(σ)</p>
          </motion.div>

          {/* ShiftTable */}

          <motion.div
            drag
            dragConstraints={containerRef}
            className="absolute bg-[#2ebbd1] bottom-0 left-0 m-6 p-4 font-mono text-sm rounded-lg text-white w-72 shadow-lg cursor-pointer"
          >
            <p className="font-bold mb-2 text-base">Shift Table</p>

            {!shiftTable && (
              <p className="italic text-gray-300">
                Shift table will be shown here after building.
              </p>
            )}
            {shiftTable && (
              <table className="w-full table-auto border-collapse border border-black text-center text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-black bg-black px-2 py-1">
                      Character
                    </th>
                    <th className="border border-black bg-black px-2 py-1">
                      Shift Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(shiftTable).map(([char, val]) => (
                    <tr className="bg-white text-black" key={char}>
                      <td className="border border-black px-2 py-1 font-bold">
                        {char}
                      </td>
                      <td className="border border-black px-2 py-1">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>

          {/* Animation */}

          <div className="absolute min-w-[50%] h-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Horspool String Matching Visualization
            </h2>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Text:</label>
              <input
                type="text"
                value={text}
                disabled={animating}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                className="w-full border p-2 rounded bg-transparent"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 font-semibold">Pattern:</label>
              <input
                type="text"
                value={pattern}
                disabled={animating}
                onChange={(e) => setPattern(e.target.value.toUpperCase())}
                className="w-full border p-2 rounded bg-transparent"
              />
            </div>
            <button
              disabled={animating || pattern.length === 0 || text.length === 0}
              onClick={startSearch}
              className={`mb-8 w-full py-3 rounded text-white font-bold ${
                animating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-slate-200 hover:text-gray-500 transition-colors duration-300"
              }`}
            >
              Start Search
            </button>

            {/* Visualization */}
            <div className="relative font-mono text-xl tracking-wider select-none">
              <div style={{ whiteSpace: "pre" }}>
                {text.split("").map((ch, i) => {
                  const isMatchStart = matchedIndices.some(
                    (start) => i >= start && i < start + pattern.length
                  );
                  const isComparing =
                    currentShift + comparisonIndex === i &&
                    comparisonIndex !== null;
                  const isMismatch = isComparing && mismatchIndex !== null;
                  return (
                    <span
                      key={i}
                      style={{
                        display: "inline-block",
                        width: 28,
                        height: 36,
                        lineHeight: "36px",
                        textAlign: "center",
                        backgroundColor: isMatchStart
                          ? "#a7d41e"
                          : isMismatch
                          ? "red"
                          : isComparing
                          ? "#ff9827"
                          : "transparent",
                        color: isMismatch ? "white" : "black",
                        fontWeight: isComparing ? "bold" : "normal",
                        // boxShadow: isComparing ? "0 0 8px 2px rgba(253, 230, 138, 0.8)" : "none",
                        borderBottom: "2px solid #ccc",
                        borderRadius: 4,
                        transition: "background-color 0.3s, box-shadow 0.3s",
                      }}
                    >
                      {ch}
                    </span>
                  );
                })}
              </div>

              {/* Pattern */}
              <div
                style={{
                  position: "absolute",
                  // top: 44,
                  // left: 0,
                  whiteSpace: "pre",
                  transition: "left 0.7s ease",
                  left: currentShift * 28,
                  display: "flex",
                }}
              >
                {pattern.split("").map((ch, i) => {
                  const isComparing = i === comparisonIndex;
                  const isMismatch = isComparing && mismatchIndex !== null;
                  return (
                    <span
                      key={i}
                      style={{
                        display: "inline-block",
                        width: 28,
                        height: 36,
                        lineHeight: "36px",
                        textAlign: "center",
                        backgroundColor: isMismatch
                          ? "#red"
                          : isComparing
                          ? "#ff9827"
                          : "transparent",
                        color: isMismatch ? "#b91c1c" : "#92400e",
                        fontWeight: isComparing ? "bold" : "normal",
                        boxShadow: isComparing
                          ? "0 0 8px 2px rgba(253, 230, 138, 0.8)"
                          : "none",
                        border: "2px solid transparent",
                        borderRadius: 4,
                        transition: "background-color 0.3s, box-shadow 0.3s",
                      }}
                    >
                      {ch}
                    </span>
                  );
                })}
              </div>
            </div>

    
            <div className="mt-10 p-4 bg-gray-100 rounded font-mono text-lg min-h-[64px]">
              {status}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
