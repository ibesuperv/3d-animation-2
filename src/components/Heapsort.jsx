import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const algorithmSteps = [
  "Build Max Heap:\n    for i ← n/2 downto 1 do",
  "    Heapify at index i",
  "for i ← n downto 2 do",
  "    Swap H[1] with H[i]",
  "    Decrease heap size",
  "    Heapify at root (1)"
];

function buildTreeData(array, heapSize) {
  const nodes = array.slice(1, heapSize + 1).map((val, i) => ({
    id: i + 1,
    value: val,
    parent: Math.floor((i + 1) / 2) || null,
  }));
  const nodeMap = new Map(nodes.map(n => [n.id, { ...n, children: [] }]));
  let root = null;
  nodes.forEach(n => {
    if (n.parent) nodeMap.get(n.parent)?.children.push(nodeMap.get(n.id));
    else root = nodeMap.get(n.id);
  });
  return root;
}

export default function HeapSortVisualizer() {
  const [inputText, setInputText] = useState("5 10 15 25 30 40 50");
  const [array, setArray] = useState([null, 50, 40, 45, 30, 20, 25, 35, 10, 5]);
  const [heapSize, setHeapSize] = useState(9);
  const [animating, setAnimating] = useState(false);
  const [step, setStep] = useState(-1);
  const [highlight, setHighlight] = useState({ k: null, j: null, swap: false });
  const [sortedElements, setSortedElements] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const svgRef = useRef();
  const containerRef = useRef()

  useEffect(() => {
    const nums = inputText.trim().split(/\s+/).map(Number).filter(n => !isNaN(n));
    setArray([null, ...nums]);
    setHeapSize(nums.length);
    setSortedElements([]);
    setStatusMessage("");
  }, [inputText]);

  useEffect(() => {
    if (!array || array.length <= 1) return;
    const data = buildTreeData(array, heapSize);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([width - 40, height - 100]);
    treeLayout(root);

    svg.selectAll("line.link")
      .data(root.links())
      .enter()
      .append("line")
      .attr("x1", d => d.source.x + 20)
      .attr("y1", d => d.source.y + 30)
      .attr("x2", d => d.target.x + 20)
      .attr("y2", d => d.target.y + 30)
      .attr("stroke", d =>
        (highlight.k && highlight.j &&
          ((d.source.data.id === highlight.k && d.target.data.id === highlight.j))) ?
          (highlight.swap ? "green" : "red") : "#555"
      )
      .attr("stroke-width", d =>
        (highlight.k && highlight.j &&
          d.source.data.id === highlight.k && d.target.data.id === highlight.j) ? 4 : 2
      );

    const nodeGroup = svg.selectAll("g.node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x + 20},${d.y + 30})`);

    nodeGroup.append("circle")
      .attr("r", 20)
      .attr("fill", d => {
        if (highlight.k === d.data.id || highlight.j === d.data.id)
          return highlight.swap ? "green" : "red";
        return "#2ebbd1";
      })
      .attr("stroke", "black");

    nodeGroup.append("text")
      .text(d => d.data.value)
      .attr("text-anchor", "middle")
      .attr("dy", 6)
      .attr("fill", "white");
  }, [array, highlight, heapSize]);

  const delay = ms => new Promise(res => setTimeout(res, ms));

  const heapify = async (H, i, n) => {
    setStatusMessage(`Heapifying at index ${i}`);
    let k = i;
    const v = H[k];
    let heap = false;

    while (!heap && 2 * k <= n) {
      let j = 2 * k;
      if (j < n && H[j] < H[j + 1]) j++;
      setHighlight({ k, j, swap: false });
      setStatusMessage(`Comparing H[${k}] = ${v} with H[${j}] = ${H[j]}`);
      await delay(1500);
      if (v >= H[j]) {
        heap = true;
        setStatusMessage(`No swap needed, ${v} ≥ ${H[j]}`);
      } else {
        setStatusMessage(`Swapping H[${k}] = ${H[k]} and H[${j}] = ${H[j]}`);
        H[k] = H[j];
        setHighlight({ k, j, swap: true });
        setArray([null, ...H.slice(1)]);
        await delay(1500);
        k = j;
      }
    }
    H[k] = v;
    setArray([null, ...H.slice(1)]);
    await delay(1500);
    setStatusMessage(`Placed ${v} at position ${k}`);
  };

  const startHeapifyOnly = async () => {
    if (animating) return;
    setAnimating(true);
    setSortedElements([]);
    const H = [...array];
    const n = H.length - 1;
    setHeapSize(n);
    setStep(0);
    setStatusMessage("Building Max Heap...");
    for (let i = Math.floor(n / 2); i >= 1; i--) {
      setStep(1);
      await heapify(H, i, n);
    }
    setStep(-1);
    setHighlight({ k: null, j: null, swap: false });
    setStatusMessage("Heapify complete");
    setAnimating(false);
  };

  const startHeapSort = async () => {
    if (animating) return;
    setAnimating(true);
    const H = [...array];
    let n = H.length - 1;
    setHeapSize(n);
    const sorted = [];

    setStep(0);
    setStatusMessage("Building Max Heap...");
    for (let i = Math.floor(n / 2); i >= 1; i--) {
      setStep(1);
      await heapify(H, i, n);
    }

    for (let i = n; i > 1; i--) {
      setStep(2);
      setStatusMessage(`Swapping root with H[${i}]`);
      [H[1], H[i]] = [H[i], H[1]];
      setHighlight({ k: 1, j: i, swap: true });
      setArray([null, ...H.slice(1)]);
      await delay(1500);

      setStep(4);
      await heapify(H, 1, i - 1);
      setHeapSize(i - 1);
      sorted.unshift(H[i]);
      setSortedElements([...sorted]);
    }
    sorted.unshift(H[1]);
    setSortedElements([...sorted]);

    setStep(-1);
    setHighlight({ k: null, j: null, swap: false });
    setStatusMessage("Sorting complete");
    setAnimating(false);
  };

  return (
    <div className="bg-black w-screen h-screen flex flex-col items-center justify-center overflow-hidden relative">
      <h1 className="text-white text-3xl font-bold py-4">Heapify & Heap Sort Animation</h1>

      <div ref={containerRef} className="bg-white w-[96%] h-[88%] mx-auto relative rounded-lg shadow-inner overflow-hidden">
        <motion.div
          drag
          dragConstraints={containerRef}
          className="absolute bg-[#2ebbd1] cursor-pointer bottom-0 left-0 m-6 p-4 font-mono text-sm rounded-lg text-white w-72 shadow-lg"
        ><label className="font-bold">Input Array</label>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="w-full h-24 text-black p-2 text-xs rounded bg-white mb-2"
            disabled={animating}
          />
          <button
            onClick={startHeapifyOnly}
            className="w-full bg-blue-600 hover:bg-blue-700 rounded py-2 text-xs font-bold my-1"
            disabled={animating}
          >
            Heapify
          </button>
          <button
            onClick={startHeapSort}
            className="w-full bg-green-600 hover:bg-green-700 rounded py-2 text-xs font-bold"
            disabled={animating}
          >
            Heap Sort
          </button>
        </motion.div>

        <motion.div drag dragConstraints={containerRef} className="cursor-pointer absolute bg-[#d65775] top-0 right-0 m-6 p-2 font-mono text-xs rounded-lg text-white">
          <p className="font-bold mb-2">Algorithm</p>
          {algorithmSteps.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre px-2 py-1 rounded ${i === step ? "bg-black" : ""}`}
            >
              {line}
            </div>
          ))}
        </motion.div>

        <motion.div drag dragConstraints={containerRef} className="absolute top-6 left-6 bg-[#52bc69] p-3 rounded-lg text-white font-mono text-sm max-w-xs">
          <p className="font-bold">Time Complexity</p>
          <p>Heapify: O(n), Heap Sort: O(n log n)</p>
          <p className="font-bold mt-2">Space Complexity</p>
          <p>O(1)</p>

          {sortedElements.length > 0 && (
            <>
              <p className="font-bold mt-2">Sorted Output (Descending)</p>
              <p>{sortedElements.join(" ")}</p>
            </>
          )}
        </motion.div>

        <motion.div drag dragConstraints={containerRef} className="absolute bottom-6 cursor-pointer right-6 bg-gray-800 p-4 rounded-lg text-white font-mono text-sm max-w-xs">
          <p className="font-bold mb-2">Status</p>
          <p>{statusMessage}</p>
        </motion.div>

        {/* <svg ref={svgRef} width="100%" height="100%" className="bg-white border rounded" /> */}
        <div className="w-full h-full overflow-hidden">
          <svg
            ref={svgRef}
            className="w-full h-full border rounded shadow-lg bg-white"
            viewBox="0 0 800 800"
            preserveAspectRatio="xMidYMid meet"
          />
        </div>


      </div>
    </div>
  );
}
