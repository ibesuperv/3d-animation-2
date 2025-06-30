import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function PrimMST() {
  // Add missing closing brace '}' to algorithm steps
  const algorithmSteps = [
    "function Prim(start): {",
    "  Initialize visited set and MST = []",
    "  Add all edges from start to a min-heap",
    "  while heap not empty:",
    "    pick edge with min weight",
    "    if target not visited:",
    "      mark target visited",
    "      add edge to MST",
    "      add new edges from target to heap",
    "}",
  ];

  const svgRef = useRef();
  const containerRef = useRef();

  const [visitedNodes, setVisitedNodes] = useState([]);
  const [visitedEdges, setVisitedEdges] = useState([]);
  const [highlightLine, setHighlightLine] = useState(-1);
  const [sourceNode, setSourceNode] = useState("A");
  const [inputText, setInputText] = useState(
    "A B 4\nA C 2\nB C 5\nB D 10\nC D 3"
  );
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const nodeSet = new Set();
    const edges = [];

    inputText.split("\n").forEach((line) => {
      const [src, tgt, w] = line.trim().split(" ");
      if (src && tgt && w) {
        nodeSet.add(src);
        nodeSet.add(tgt);
        // Push only one edge per undirected edge (sorted)
        if (src < tgt) {
          edges.push({ source: src, target: tgt, weight: +w });
        }
      }
    });

    const centerX = 400,
      centerY = 400,
      radius = 300;
    const nodeArr = Array.from(nodeSet).map((id, i) => ({
      id,
      x: centerX + radius * Math.cos((2 * Math.PI * i) / nodeSet.size),
      y: centerY + radius * Math.sin((2 * Math.PI * i) / nodeSet.size),
    }));

    setNodes(nodeArr);
    setLinks(edges);
  }, [inputText]);

  useEffect(() => {
    if (nodes.length === 0 || links.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.append("defs").html(`
      <marker id="arrow-default" viewBox="0 0 10 10" refX="19" refY="5"
        markerWidth="10" markerHeight="5" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#000"></path>
      </marker>
    `);

    // Map node id to node for quick access
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    svg
      .selectAll("line.link")
      .data(links)
      .enter()
      .append("line")
      .attr("key", (d) => d.source + d.target)
      .attr("x1", (d) => nodeMap.get(d.source).x)
      .attr("y1", (d) => nodeMap.get(d.source).y)
      .attr("x2", (d) => nodeMap.get(d.target).x)
      .attr("y2", (d) => nodeMap.get(d.target).y)
      .attr("stroke", (d) =>
        visitedEdges.some(
          (e) =>
            (e.source === d.source && e.target === d.target) ||
            (e.source === d.target && e.target === d.source)
        )
          ? "red"
          : "#000"
      )
      .attr("stroke-width", 4);

    svg
      .selectAll("text.weight")
      .data(
        // eslint-disable-next-line no-unused-vars
        links.filter((d, i, arr) => {
          // To avoid duplicate labels on undirected edges,
          // pick edges where source < target (alphabetically)
          return d.source < d.target;
        })
      )
      .enter()
      .append("text")
      .attr("x", (d) => {
        const sourceNode = nodes.find((n) => n.id === d.source);
        const targetNode = nodes.find((n) => n.id === d.target);

        // Vector from source to target
        const dx = targetNode.x - sourceNode.x;
        // eslint-disable-next-line no-unused-vars
        const dy = targetNode.y - sourceNode.y;

        // Position factor (0.6 means 60% from source to target)
        const factor = 0.6;

        return sourceNode.x + dx * factor;
      })
      .attr("y", (d) => {
        const sourceNode = nodes.find((n) => n.id === d.source);
        const targetNode = nodes.find((n) => n.id === d.target);
        // eslint-disable-next-line no-unused-vars
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;

        const factor = 0.6;

        return sourceNode.y + dy * factor;
      })
      .text((d) => d.weight)
      .attr("fill", "black")
      .attr("font-size", 16)
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("dy", "6")
      .style("pointer-events", "none")
      .style("user-select", "none")
      .style("paint-order", "stroke")
      .style("stroke", "white")
      .style("stroke-width", "3px");

    const nodeGroups = svg
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("key", (d) => d.id)
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    nodeGroups
      .append("circle")
      .attr("r", 30)
      .attr("fill", (d) => (visitedNodes.includes(d.id) ? "#2ebbd1" : "white"))
      .attr("stroke", "black")
      .attr("stroke-width", 4);

    nodeGroups
      .append("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", 6)
      .attr("font-size", 18)
      .attr("fill", (d) => (visitedNodes.includes(d.id) ? "white" : "black"));
  }, [nodes, links, visitedNodes, visitedEdges]);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const prim = async (start) => {
    const visited = new Set();
    const mst = [];
    const edgeHeap = [];

    setHighlightLine(1);
    await delay(400);
    visited.add(start);
    setVisitedNodes([start]);

    setHighlightLine(2);
    await delay(400);

    // Push edges from start node
    edgeHeap.push(
      ...links.filter((l) => l.source === start || l.target === start)
    );
    edgeHeap.sort((a, b) => a.weight - b.weight);

    await delay(400);

    setHighlightLine(3);
    while (edgeHeap.length > 0) {
      await delay(400);
      setHighlightLine(4);

      // Remove edges that target or source already visited to avoid duplicates
      // Also pick edge with one end in visited, the other not
      let minEdgeIndex = -1;
      for (let i = 0; i < edgeHeap.length; i++) {
        const e = edgeHeap[i];
        // Edge connects visited to non-visited node?
        if (
          (visited.has(e.source) && !visited.has(e.target)) ||
          (visited.has(e.target) && !visited.has(e.source))
        ) {
          minEdgeIndex = i;
          break;
        }
      }
      if (minEdgeIndex === -1) break; // no valid edge found

      const minEdge = edgeHeap.splice(minEdgeIndex, 1)[0];

      const nextNode = visited.has(minEdge.source)
        ? minEdge.target
        : minEdge.source;

      if (visited.has(nextNode)) continue;

      visited.add(nextNode);
      mst.push(minEdge);
      setVisitedNodes([...visited]);
      setVisitedEdges((prev) => [...prev, minEdge]);

      setHighlightLine(5);
      await delay(400);

      // Add new edges from the newly visited node
      edgeHeap.push(
        ...links.filter(
          (l) =>
            (l.source === nextNode || l.target === nextNode) &&
            !visited.has(l.source === nextNode ? l.target : l.source)
        )
      );

      edgeHeap.sort((a, b) => a.weight - b.weight);

      setHighlightLine(6);
      await delay(400);
    }

    setHighlightLine(-1);
  };

  const startPrim = async () => {
    if (!nodes.find((n) => n.id === sourceNode)) {
      alert("Invalid source node");
      return;
    }

    setAnimating(true);
    setVisitedNodes([]);
    setVisitedEdges([]);
    await delay(300);
    await prim(sourceNode);
    setAnimating(false);
  };

  return (
    <div className="bg-black w-dvw h-dvh flex flex-col items-center justify-center overflow-hidden">
      <p className="text-white text-center py-4 text-3xl font-bold">
        GRAPH - PRIM'S MST
      </p>

      <div
        ref={containerRef}
        className="bg-white w-[96%] h-[88%] mx-auto relative rounded-lg shadow-inner overflow-hidden"
      >
        {/* Input panel */}
        <motion.div
          drag
          dragConstraints={containerRef}
          className="absolute bg-[#2ebbd1] bottom-0 left-0 m-6 p-4 font-mono text-sm rounded-lg text-white w-72"
        >
          <div className="font-bold text-base mb-2">Input (Format: A B 4)</div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-32 resize-none rounded-md bg-white text-gray-800 p-2 text-xs mb-4"
          />
          <div className="font-bold text-base mb-2">Starting Node</div>
          <input
            value={sourceNode}
            onChange={(e) => setSourceNode(e.target.value.toUpperCase())}
            className="w-full mb-3 rounded-md bg-white text-gray-800 p-2 text-xs"
          />
          <button
            onClick={startPrim}
            disabled={animating}
            className={`w-full py-2 mt-1 rounded-md text-xs font-semibold ${
              animating
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {animating ? "Running..." : "Start Prim’s"}
          </button>
        </motion.div>

        {/* Analysis panel */}
        <motion.div
          drag
          dragConstraints={containerRef}
          className="cursor-pointer absolute bg-[#52bc69] top-0 left-0 m-6 p-2 font-mono text-sm rounded-lg text-white"
        >
          <div className="font-bold mb-2 text-sm">Prim's Analysis</div>
          <p>Time: O(E log V) with heap</p>
          <p>Space: O(V + E)</p>
        </motion.div>

        {/* Graph */}
        <svg
          ref={svgRef}
          className="w-full h-full border rounded bg-white"
          viewBox="0 0 800 800"
        />

        {/* Algorithm steps */}
        <motion.div
          drag
          dragConstraints={containerRef}
          className="cursor-pointer absolute bg-[#d65775] bottom-0 right-0 m-6 p-2 font-mono text-xs rounded-lg text-white"
        >
          <div className="font-bold mb-2">Prim(start)</div>
          {algorithmSteps.map((line, i) => (
            <div
              key={i}
              className={`px-2 py-[1px] rounded ${
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
