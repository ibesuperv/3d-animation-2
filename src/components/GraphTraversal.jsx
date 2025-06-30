import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const BFS_CODE = [
  "function BFS(start):",
  "    create a queue Q",
  "    mark start as visited",
  "    Q.enqueue(start)",
  "    while Q is not empty:",
  "        node = Q.dequeue()",
  "        for each neighbor of node:",
  "            if neighbor not visited:",
  "                mark as visited",
  "                Q.enqueue(neighbor)"
];

const DFS_CODE = [
  "function DFS(node):",
  "    mark node as visited",
  "    for each neighbor of node:",
  "        if neighbor not visited:",
  "            DFS(neighbor)"
];

function GraphInput({
  inputText,
  setInputText,
  sourceNode,
  setSourceNode,
  startTraversal,
  animating,
  traversalType,
  setTraversalType,
  reff,
}) {
  return (
    <motion.div
      drag
      dragConstraints={reff}
      className="absolute bg-[#2ebbd1] bottom-0 left-0 m-6 p-4 font-mono text-sm rounded-lg text-white w-72 shadow-lg cursor-pointer"
    >
      <div className="font-bold text-base mb-2">Input Edges</div>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full h-32 resize-none rounded-md bg-white text-gray-800 p-2 text-xs leading-tight focus:outline-none focus:ring-2 focus:ring-white mb-4"
        placeholder="A B\nA C\nC D"
      />

      <div className="font-bold text-base mb-2">Starting Node</div>
      <input
        type="text"
        value={sourceNode}
        onChange={(e) => setSourceNode(e.target.value.toUpperCase())}
        maxLength={1}
        className="w-full mb-3 rounded-md bg-white text-gray-800 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-white"
        placeholder="Enter Source Node"
      />

      <div className="mb-4">
        <div className="font-bold text-base mb-2">Traversal Type</div>
        <div className="flex justify-between gap-2">
          {["bfs", "dfs"].map((type) => (
            <button
              key={type}
              onClick={() => setTraversalType(type)}
              className={`flex-1 py-2 rounded-md text-xs font-semibold transition-colors duration-200 ${
                traversalType === type
                  ? "bg-white text-[#2ebbd1] border-2 border-white"
                  : "bg-[#1792a3] text-white hover:bg-[#147c8b]"
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={startTraversal}
        disabled={animating}
        className={`w-full py-2 rounded-md transition-all duration-200 shadow-md ${
          animating
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {animating ? "Running..." : `Start ${traversalType.toUpperCase()}`}
      </button>
    </motion.div>
  );
}

// --- GraphView: Renders graph nodes and edges with D3 ---
function GraphView({ nodes, links, visitedNodes, visitedEdges }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.append("defs").html(`
      <marker id="arrow-default" viewBox="0 0 10 10" refX="19" refY="5"
        markerWidth="10" markerHeight="5" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#000"></path>
      </marker>
      <marker id="arrow-visited" viewBox="0 0 10 10" refX="19" refY="5"
        markerWidth="10" markerHeight="5" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="red"></path>
      </marker>
    `);

    function getOffset(d, isSource) {
      const sourceNode = nodes.find(n => n.id === d.source);
      const targetNode = nodes.find(n => n.id === d.target);
      if (!sourceNode || !targetNode) return { x: 0, y: 0 };

      const dx = targetNode.x - sourceNode.x;
      const dy = targetNode.y - sourceNode.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) return { x: sourceNode.x, y: sourceNode.y };

      const offsetAmount = 8;
      const reverseExists = links.some(
        link => link.source === d.target && link.target === d.source
      );

      const offsetX = reverseExists ? (-dy / len) * offsetAmount : 0;
      const offsetY = reverseExists ? (dx / len) * offsetAmount : 0;

      return {
        x: (isSource ? sourceNode.x : targetNode.x) + offsetX,
        y: (isSource ? sourceNode.y : targetNode.y) + offsetY
      };
    }

    // Draw edges
    svg.selectAll("line.link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", d => getOffset(d, true).x)
      .attr("y1", d => getOffset(d, true).y)
      .attr("x2", d => getOffset(d, false).x)
      .attr("y2", d => getOffset(d, false).y)
      .attr("stroke", d => visitedEdges.includes(`${d.source}-${d.target}`) ? "red" : "#000")
      .attr("stroke-width", 6)
      .attr("marker-end", d =>
        visitedEdges.includes(`${d.source}-${d.target}`)
          ? "url(#arrow-visited)"
          : "url(#arrow-default)"
      );

    // Draw nodes
    const nodeGroups = svg.selectAll("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    nodeGroups.append("circle")
      .attr("r", 30)
      .attr("fill", d => visitedNodes.includes(d.id) ? "#2ebbd1" : "white")
      .attr("stroke", "black")
      .attr("stroke-width", 5);

    nodeGroups.append("text")
      .text(d => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", 6)
      .attr("font-size", 18)
      .attr("fill", d => visitedNodes.includes(d.id) ? "white" : "black")
      .attr("font-weight", "bold");
  }, [nodes, links, visitedNodes, visitedEdges]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full border rounded shadow-lg bg-white"
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid meet"
    />
  );
}

// --- AlgorithmCode: Displays BFS or DFS code with highlight ---
function AlgorithmCode({ codeLines, highlightLine,reff }) {
  return (
    <motion.div drag dragConstraints={reff} className="cursor-pointer absolute bg-[#d65775] bottom-0 right-0 m-6 p-2 font-mono text-xs rounded-lg text-white max-w-xs max-h-[250px] overflow-auto">
      <div className="font-bold mb-2">Algorithm</div>
      {codeLines.map((line, i) => (
        <div
          key={i}
          className={`transition-colors duration-300 px-2 py-[1px] rounded whitespace-pre ${
            i === highlightLine ? "bg-black" : "hover:bg-orange-500"
          }`}
        >
          {line}
        </div>
      ))}
    </motion.div>
  );
}

// --- AnalysisPanel: Shows complexity and traversal order ---
function AnalysisPanel({ traversalType, bfsOrder, dfsOrder, animating ,reff}) {
  const order = traversalType === "bfs" ? bfsOrder : dfsOrder;
  return (
    <motion.div drag dragConstraints={reff} className="cursor-pointer absolute bg-[#52bc69] top-0 left-0 m-6 p-2 font-mono text-sm rounded-lg text-white max-w-xs">
      <div className="font-bold mb-2 text-sm">{traversalType.toUpperCase()} Analysis</div>
      <p>Time Complexity: O(V + E)</p>
      <p>Space Complexity: O(V)</p>
      {!animating && order.length > 0 && (
        <p className="mt-2 text-black"><strong>{traversalType.toUpperCase()} Traversal Order:</strong> {order.join(" → ")}</p>
      )}
    </motion.div>
  );
}

// --- Main Component: Manages state and BFS/DFS traversal ---
export default function GraphTraversal() {
  const containerRef = useRef();

  const [inputText, setInputText] = useState("A B\nA C\nC D\nC E\nB A");
  const [sourceNode, setSourceNode] = useState("A");
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  const [visitedNodes, setVisitedNodes] = useState([]);
  const [visitedEdges, setVisitedEdges] = useState([]);
  const [highlightLine, setHighlightLine] = useState(-1);

  const [animating, setAnimating] = useState(false);

  const [bfsOrder, setBfsOrder] = useState([]);
  const [dfsOrder, setDfsOrder] = useState([]);

  const [traversalType, setTraversalType] = useState("bfs"); // "bfs" or "dfs"

  // Parse edges & nodes on inputText change
  useEffect(() => {
    const uniqueNodes = new Set();
    const edgeList = [];

    inputText.split("\n").forEach(line => {
      const [src, tgt] = line.trim().split(" ");
      if (src && tgt) {
        uniqueNodes.add(src);
        uniqueNodes.add(tgt);
        edgeList.push({ source: src, target: tgt });
      }
    });

    const centerX = 400;
    const centerY = 400;
    const radius = 300;

    const nodeArr = Array.from(uniqueNodes).map((id, index) => ({
      id,
      x: centerX + radius * Math.cos((2 * Math.PI * index) / uniqueNodes.size),
      y: centerY + radius * Math.sin((2 * Math.PI * index) / uniqueNodes.size)
    }));

    setNodes(nodeArr);
    setLinks(edgeList);
  }, [inputText]);

  const delay = ms => new Promise(res => setTimeout(res, ms));

  // BFS traversal animation
  const bfs = async (startNode) => {
    const visitedSet = new Set();
    const queue = [startNode];
    const order = [];

    setHighlightLine(1); await delay(400);
    setHighlightLine(2); await delay(400);

    visitedSet.add(startNode);
    setVisitedNodes([startNode]);
    order.push(startNode);
    await delay(400);

    setHighlightLine(3); await delay(400);

    while (queue.length > 0) {
      setHighlightLine(4); await delay(400);

      const current = queue.shift();
      setHighlightLine(5); await delay(400);

      const neighbors = links
        .filter(link => link.source === current && !visitedSet.has(link.target))
        .map(link => link.target);

      for (const neighbor of neighbors) {
        setHighlightLine(6); await delay(400);

        if (!visitedSet.has(neighbor)) {
          setHighlightLine(7);
          visitedSet.add(neighbor);
          setVisitedNodes(prev => [...prev, neighbor]);
          setVisitedEdges(prev => [...prev, `${current}-${neighbor}`]);
          order.push(neighbor);
          await delay(500);

          setHighlightLine(8);
          queue.push(neighbor);
          await delay(400);
        }
      }
    }

    setHighlightLine(-1);
    setBfsOrder(order);
  };

  // DFS traversal animation (recursive async)
  const dfs = async (node, visitedSet, order) => {
    setHighlightLine(1); // mark visited line
    visitedSet.add(node);
    setVisitedNodes(prev => [...prev, node]);
    order.push(node);
    await delay(600);

    const neighbors = links
      .filter(link => link.source === node && !visitedSet.has(link.target))
      .map(link => link.target);

    setHighlightLine(2); // for each neighbor line

    for (const neighbor of neighbors) {
      setHighlightLine(3); // if not visited line
      await delay(400);
      setVisitedEdges(prev => [...prev, `${node}-${neighbor}`]);
      await dfs(neighbor, visitedSet, order);
    }
  };

  const startTraversal = async () => {
    if (!nodes.find(n => n.id === sourceNode)) {
      alert("Invalid source node");
      return;
    }

    setAnimating(true);
    setVisitedNodes([]);
    setVisitedEdges([]);
    setHighlightLine(-1);
    setBfsOrder([]);
    setDfsOrder([]);
    await delay(300);

    if (traversalType === "bfs") {
      await bfs(sourceNode);
    } else {
      const visitedSet = new Set();
      const order = [];
      await dfs(sourceNode, visitedSet, order);
      setHighlightLine(-1);
      setDfsOrder(order);
    }

    setAnimating(false);
  };

  return (
    <div  className="bg-black w-screen h-screen flex flex-col items-center justify-center overflow-hidden relative">
      <p className="text-white text-center py-4 text-3xl font-bold">GRAPH TRAVERSAL - BFS & DFS</p>

      <div ref={containerRef} className="bg-white w-[96%] h-[88%] mx-auto relative rounded-lg shadow-inner overflow-hidden">
        <GraphInput
          drag dragConstraints={containerRef}
          inputText={inputText}
          setInputText={setInputText}
          sourceNode={sourceNode}
          setSourceNode={setSourceNode}
          startTraversal={startTraversal}
          animating={animating}
          traversalType={traversalType}
          setTraversalType={setTraversalType}
          reff={containerRef}
        />

        <AnalysisPanel
          traversalType={traversalType}
          bfsOrder={bfsOrder}
          dfsOrder={dfsOrder}
          animating={animating}
          reff={containerRef}
        />

        <GraphView
          nodes={nodes}
          links={links}
          visitedNodes={visitedNodes}
          visitedEdges={visitedEdges}
        />

        <AlgorithmCode
          codeLines={traversalType === "bfs" ? BFS_CODE : DFS_CODE}
          highlightLine={highlightLine}
          reff={containerRef}
        />
      </div>
    </div>
  );
}

