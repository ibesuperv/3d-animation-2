import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const algorithmSteps = [
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

export default function BFSTraversal() {
  const svgRef = useRef();
  const containerRef = useRef();

  const [visitedNodes, setVisitedNodes] = useState([]);
  const [visitedEdges, setVisitedEdges] = useState([]);
  const [highlightLine, setHighlightLine] = useState(-1);
  const [sourceNode, setSourceNode] = useState("A");
  const [animating, setAnimating] = useState(false);
  const [inputText, setInputText] = useState("A B\nA C\nC D\nC E\nB A");
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [bfsOrder, setBfsOrder] = useState([]);

  // Parse graph edges
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

  // Render graph with D3
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

    svg.selectAll("line.link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", d => getOffset(d, true).x)
      .attr("y1", d => getOffset(d, true).y)
      .attr("x2", d => getOffset(d, false).x)
      .attr("y2", d => getOffset(d, false).y)
      .attr("stroke", d =>
        visitedEdges.includes(`${d.source}-${d.target}`) ? "red" : "#000"
      )
      .attr("stroke-width", 6)
      .attr("marker-end", d =>
        visitedEdges.includes(`${d.source}-${d.target}`)
          ? "url(#arrow-visited)"
          : "url(#arrow-default)"
      );

    function getOffset(d, isSource) {
      const sourceNode = nodes.find(n => n.id === d.source);
      const targetNode = nodes.find(n => n.id === d.target);
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

    const nodeGroups = svg.selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
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
      .attr("fill", d => visitedNodes.includes(d.id) ?"white":"black")
      .attr("font-weight", "bold");
  }, [nodes, links, visitedNodes, visitedEdges]);

  const delay = ms => new Promise(res => setTimeout(res, ms));

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

  const startBFS = async () => {
    if (!nodes.find(n => n.id === sourceNode)) {
      alert("Invalid source node");
      return;
    }

    setAnimating(true);
    setVisitedNodes([]);
    setVisitedEdges([]);
    setHighlightLine(-1);
    setBfsOrder([]);
    await delay(300);
    await bfs(sourceNode);
    setAnimating(false);
  };

  return (
    <div className="bg-black w-dvw h-dvh flex flex-col items-center justify-center overflow-hidden">
      <p className="text-white text-center py-4 text-3xl font-bold">GRAPH TRAVERSAL - BFS</p>

      <div ref={containerRef} className="bg-white w-[96%] h-[88%] mx-auto relative rounded-lg shadow-inner overflow-hidden">
        {/* Left panel */}
        <motion.div
          drag
          dragConstraints={containerRef}
          className="absolute bg-[#2ebbd1] cursor-pointer bottom-0 left-0 m-6 p-4 font-mono text-sm rounded-lg text-white w-72 shadow-lg"
        >
          <div className="font-bold text-base mb-2">Input Edges</div>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="w-full h-32 resize-none rounded-md bg-white text-gray-800 p-2 text-xs leading-tight focus:outline-none focus:ring-2 focus:ring-white mb-4"
            placeholder="A B\nA C\nC D"
          />
          <div className="font-bold text-base mb-2">Starting Node</div>
          <input
            type="text"
            value={sourceNode}
            onChange={e => setSourceNode(e.target.value.toUpperCase())}
            maxLength={1}
            className="w-full mb-3 rounded-md bg-white text-gray-800 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Enter Source Node"
          />
          <button
            onClick={startBFS}
            disabled={animating}
            className={`w-full py-2 mt-1 rounded-md text-xs font-semibold transition-all duration-200 shadow-md ${
              animating ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {animating ? "Running..." : "Start BFS"}
          </button>
        </motion.div>

        {/* Top-Left panel */}
        <motion.div drag dragConstraints={containerRef} className="cursor-pointer absolute bg-[#52bc69] top-0 left-0 m-6 p-2 font-mono text-sm rounded-lg text-white">
          <div className="font-bold mb-2 text-sm">BFS analysis</div>
          <p>Time Complexity: O(V + E)</p>
          <p>Space Complexity: O(V)</p>
          {!animating && bfsOrder.length > 0 && (
            <p className="mt-2 text-black"><strong>BFS Traversal Order:</strong> {bfsOrder.join(" → ")}</p>
          )}
        </motion.div>

        {/* Graph */}
        <div className="w-full h-full overflow-hidden">
          <svg
            ref={svgRef}
            className="w-full h-full border rounded shadow-lg bg-white"
            viewBox="0 0 800 800"
            preserveAspectRatio="xMidYMid meet"
          />
        </div>

        {/* Right panel */}
        <motion.div drag dragConstraints={containerRef} className="cursor-pointer absolute bg-[#d65775] bottom-0 right-0 m-6 p-2 font-mono text-xs rounded-lg text-white">
          <div className="font-bold mb-2">BFS(u)</div>
          {algorithmSteps.map((line, i) => (
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
      </div>
    </div>
  );
}
