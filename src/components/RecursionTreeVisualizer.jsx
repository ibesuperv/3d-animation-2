import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";


const complexities = {
  fibonacci: {
    time: "O(2^n)",
    space: "O(n)",
  },
  factorial: {
    time: "O(n)",
    space: "O(n)",
  },
  gcd: {
    time: "O(log(min(a, b)))",
    space: "O(log(min(a, b)))",
  },
  toh: {
    time: "O(2^n)",
    space: "O(n)",
  },
};


const pseudocodeMap = {
  fibonacci: [
    "function fib(n):",
    "    if n <= 1:",
    "        return n",
    "    left = fib(n - 1)",
    "    right = fib(n - 2)",
    "    return left + right",
  ],
  factorial: [
    "function fact(n):",
    "    if n <= 1:",
    "        return 1",
    "    return n * fact(n - 1)",
  ],
  gcd: [
    "function gcd(a, b):",
    "    if b == 0:",
    "        return a",
    "    return gcd(b, a % b)",
  ],
  toh: [
    "function toh(n, from, to, aux):",
    "    if n == 1:",
    "        move disk from 'from' to 'to'",
    "        return",
    "    toh(n-1, from, aux, to)",
    "    move disk from 'from' to 'to'",
    "    toh(n-1, aux, to, from)",
  ],
};

export default function RecursionTreeVisualizer() {
  const canvasRef = useRef();
  const containerRef = useRef();
  const nodeIdRef = useRef(0);

  const [highlightLine, setHighlightLine] = useState(-1);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [moves, setMoves] = useState([]);
  const [n, setN] = useState(4);
  const [a, setA] = useState(48);
  const [b, setB] = useState(18);
  const [src, setSrc] = useState("A");
  const [dst, setDst] = useState("C");
  const [aux, setAux] = useState("B");
  const [type, setType] = useState("fibonacci");
  const [animating, setAnimating] = useState(false);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const generateTree = async (
    val1,
    val2 = null,
    val3 = null,
    val4 = null,
    depth = 0,
    x = 0,
    parent = null
  ) => {
    const id = nodeIdRef.current++;
    let label = "",
      // eslint-disable-next-line no-unused-vars
      returnVal = null;

    if (type === "fibonacci") label = `fib(${val1})`;
    else if (type === "factorial") label = `fact(${val1})`;
    else if (type === "gcd") label = `gcd(${val1}, ${val2})`;
    else if (type === "toh") label = `T(${val1},${val2},${val3},${val4})`;

    const node = { id, label, x, y: depth * 100 };
    setNodes((prev) => [...prev, node]);
    if (parent !== null) {
      setLinks((prev) => [...prev, { source: parent, target: id }]);
    }

    if (type === "fibonacci") {
      setHighlightLine(1);
      await delay(500);
      if (val1 <= 1) {
        setHighlightLine(2);
        await delay(500);
        node.returnVal = val1;
        const move = `fib(${val1}) = ${val1}`;
        setMoves((prev) => [...prev, move]);
        setNodes((prev) => [...prev]);
        return { id, value: val1 };
      }
      setHighlightLine(3);
      await delay(500);
      const left = await generateTree(
        val1 - 1,
        null,
        null,
        null,
        depth + 1,
        x - 120 / (depth + 1),
        id
      );
      setHighlightLine(4);
      await delay(500);
      const right = await generateTree(
        val1 - 2,
        null,
        null,
        null,
        depth + 1,
        x + 120 / (depth + 1),
        id
      );
      setHighlightLine(5);
      await delay(500);
      node.returnVal = left.value + right.value;
      const move = `fib(${val1}) = fib(${val1 - 1}) + fib(${val1 - 2}) = ${left.value} + ${right.value} = ${node.returnVal}`;
      setMoves((prev) => [...prev, move]);
    } else if (type === "factorial") {
      setHighlightLine(1);
      await delay(500);
      if (val1 <= 1) {
        setHighlightLine(2);
        await delay(500);
        node.returnVal = 1;
        const move = `fact(${val1}) = 1`;
        setMoves((prev) => [...prev, move]);
        setNodes((prev) => [...prev]);
        return { id, value: 1 };
      }
      setHighlightLine(3);
      await delay(500);
      const left = await generateTree(val1 - 1, null, null, null, depth + 1, x, id);
      node.returnVal = val1 * left.value;
      const move = `fact(${val1}) = ${val1} * fact(${val1 - 1}) = ${val1} * ${left.value} = ${node.returnVal}`;
      setMoves((prev) => [...prev, move]);
    } else if (type === "gcd") {
      setHighlightLine(1);
      await delay(500);
      if (val2 === 0) {
        setHighlightLine(2);
        await delay(500);
        node.returnVal = val1;
        const move = `gcd(${val1}, ${val2}) = ${val1}`;
        setMoves((prev) => [...prev, move]);
        setNodes((prev) => [...prev]);
        return { id, value: val1 };
      }
      setHighlightLine(3);
      await delay(500);
      const left = await generateTree(val2, val1 % val2, null, null, depth + 1, x, id);
      node.returnVal = left.value;
      const move = `gcd(${val1}, ${val2}) = gcd(${val2}, ${val1 % val2}) = ${node.returnVal}`;
      setMoves((prev) => [...prev, move]);
    } else if (type === "toh") {
      setHighlightLine(1);
      await delay(500);
      if (val1 === 1) {
        setHighlightLine(2);
        await delay(500);
        const move = `Move disk ${val1} from ${val2} to ${val3}`;
        setMoves((prev) => [...prev, move]);
        node.returnVal = `${val1}:${val2}-${val3}`;
        setNodes((prev) => [...prev]);
        setHighlightLine(3);
        return { id, value: move };
      }
      setHighlightLine(4);
      await delay(500);
      await generateTree(val1 - 1, val2, val4, val3, depth + 1, x - 150 / (depth + 1), id);
      setHighlightLine(5);
      await delay(500);
      const move = `Move disk ${val1} from ${val2} to ${val3}`;
      setMoves((prev) => [...prev, move]);
      node.returnVal = `${val1}:${val2}-${val3}`;
      setNodes((prev) => [...prev]);
      setHighlightLine(6);
      await delay(500);
      await generateTree(val1 - 1, val4, val3, val2, depth + 1, x + 150 / (depth + 1), id);
    }

    setNodes((prev) => [...prev]);
    return { id, value: node.returnVal };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(width / 2, 50);

    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 2;
    links.forEach(({ source, target }) => {
      const sourceNode = nodes.find((n) => n.id === source);
      const targetNode = nodes.find((n) => n.id === target);
      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
      }
    });

    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.fillStyle = node.returnVal !== undefined ? "#d1d5db" : "#f87171";
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      ctx.arc(node.x, node.y, 24, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.shadowColor = "transparent";

      ctx.fillStyle = "#000";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";

      // Find parent link for this node
      const parentLink = links.find(link => link.target === node.id);
      let labelOffsetY = 30; // default offset

      if (parentLink) {
        const parentNode = nodes.find(n => n.id === parentLink.source);
        if (parentNode && node.x > parentNode.x) {
          // This node is a right child
          labelOffsetY = 50; // move label higher only for right child
        }
      }

      ctx.fillText(node.label, node.x, node.y - labelOffsetY);

      ctx.fillStyle = node.returnVal !== undefined ? "#6b7280" : "#1d4ed8";
      ctx.font = "bold 16px monospace";
      const valText =
        typeof node.returnVal === "string"
          ? node.returnVal
          : node.returnVal !== undefined
            ? ` ${node.returnVal}`
            : "";
      ctx.fillText(valText, node.x, node.y + 6);
    });

    ctx.restore();
  }, [nodes, links]);

  const startAnimation = async () => {
    setAnimating(true);
    setNodes([]);
    setLinks([]);
    setMoves([]);
    nodeIdRef.current = 0;

    if (type === "gcd") await generateTree(a, b);
    else if (type === "toh") await generateTree(n, src, dst, aux);
    else await generateTree(n);

    setHighlightLine(-1);
    setAnimating(false);
  };

  return (
    <div className="bg-black w-screen h-screen flex flex-col items-center justify-center overflow-hidden relative">
      <p className="text-white text-center py-4 text-3xl font-bold">Recursion Tree</p>

      <div
        ref={containerRef}
        className="bg-white w-[96%] h-[88%] mx-auto relative rounded-lg shadow-inner overflow-hidden"
      >
        {/* Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

        {/* Controls */}
        <motion.div
          drag
          dragConstraints={containerRef}
          className="absolute bg-[#2ebbd1] bottom-0 left-0 m-6 p-4 font-mono text-sm rounded-lg text-black w-auto shadow-lg cursor-pointer z-10"
        >
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={animating}
            className="border px-2 py-1 rounded shadow text-black w-full mb-2"
          >
            <option value="fibonacci">Fibonacci</option>
            <option value="factorial">Factorial</option>
            <option value="gcd">GCD</option>
            <option value="toh">Tower of Hanoi</option>
          </select>

          {type === "gcd" ? (
            <>
              <label className="block mt-2 font-bold">GCD Inputs:</label>
              <div className="flex space-x-2">
                <input type="number" value={a} onChange={e => setA(Number(e.target.value))} disabled={animating} className="border px-4 py-1 rounded shadow w-20" />
                <input type="number" value={b} onChange={e => setB(Number(e.target.value))} disabled={animating} className="border px-4 py-1 rounded shadow w-20" />
              </div>
            </>
          ) : (
            <>
              <label className="block mt-2 font-bold">n:</label>
              <input type="number" min={1} max={5} value={n} onChange={e => setN(Math.min(5, Math.max(1, Number(e.target.value))))} disabled={animating} className="border px-4 py-1 rounded shadow w-20" />
              {type === "toh" && (
                <>
                  <label className="block mt-2 font-bold">Tower of Hanoi Pegs:</label>
                  <div className="flex items-center space-x-3 mt-1">
                    {["S", "D", "A"].map((label, i) => {
                      const setFunc = [setSrc, setDst, setAux][i];
                      const value = [src, dst, aux][i];
                      return (
                        <div key={label} className="flex flex-col items-center">
                          <label className="text-xs font-semibold">{label}</label>
                          <input value={value} onChange={e => setFunc(e.target.value.toUpperCase())} maxLength={1} className="border px-2 py-1 rounded shadow w-10 text-center" disabled={animating} />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          <button
            onClick={startAnimation}
            disabled={animating}
            className={`w-full py-2 mt-4 rounded-md text-xs font-semibold transition-all duration-200 shadow-md ${animating ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
          >
            {animating ? "Running..." : "Start"}
          </button>
        </motion.div>

        {/* Pseudocode Panel */}
        <motion.div
          drag
          dragConstraints={containerRef}
          className="cursor-pointer absolute bg-[#d65775] bottom-0 right-0 m-6 p-2 font-mono text-xs rounded-lg text-white z-10"
        >
          <div className="font-bold mb-2">{type.toUpperCase()}</div>
          <div style={{ whiteSpace: "pre" }}>
            {pseudocodeMap[type].map((line, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: i === highlightLine ? "#fbbf24" : "transparent",
                  fontWeight: i === highlightLine ? "bold" : "normal",
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Moves / Results (draggable) */}
        <motion.div
          drag
          dragConstraints={containerRef}
          className="absolute top-2 right-3 w-[22rem] max-h-[40%] overflow-y-auto bg-gray-900 text-white font-mono text-sm rounded-tl-lg p-4 shadow-lg cursor-pointer z-20"
        >
          <div className="font-bold mb-2">Moves / Results:</div>
          {moves.length === 0 ? (
            <p className="text-gray-400">No moves yet</p>
          ) : (
            moves.map((move, i) => (
              <p key={i} className="break-words">
                {move}
              </p>
            ))
          )}
        </motion.div>



        <motion.div drag dragConstraints={containerRef} className="cursor-pointer absolute bg-[#52bc69] top-0 left-0 m-6 p-2 font-mono text-sm rounded-lg text-white">
          <div className="font-bold mb-2 text-sm">{type.toUpperCase()}</div>
          <p>Time Complexity: {complexities[type].time}</p>
          <p>Space Complexity: {complexities[type].space}</p>
        </motion.div>

      </div>
    </div>
  );
}
