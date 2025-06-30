import { useEffect } from "react";
import Header from "./home-components/Header";
import Banner from "./home-components/Banner";
import Section from "./home-components/Section";
import ThreeContainer from "./home-components/ThreeContainer";
import { initThreeScene } from "./utils/ThreeScene";

import BeeChat from "./home-components/BeeChat";
import { useLocation } from "react-router-dom";
import Projects from "./home-components/Projects";

function Holder() {
  useEffect(() => {
    initThreeScene();
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 400);
      }
    }
  }, [location]);

  return (
    <div className="body">
      <Banner />

      <Section
        id="intro"
        number="01"
        title="Graph Traversals"
        text="Explore the fundamentals of graph traversal algorithms like Depth First Search (DFS) and Breadth First Search (BFS). Understand how nodes are visited and the traversal order using intuitive animations and real-time data structures."
      />

      <Section
        id="recursion"
        number="02"
        title="Recursion Trees"
        text="Visualize how recursive calls expand and shrink with animated recursion trees. Perfect for understanding algorithms like factorial, Fibonacci, and GCD through frame-by-frame call-stack simulation."
      />

      <Section
        id="heap"
        number="03"
        title="Heap Sort"
        text="Dive into the Heap Sort algorithm — see how elements are pushed into a heap structure and sorted step-by-step using heapify and removal operations. Watch both Max Heap and Min Heap behaviors unfold."
      />

      <Section
        id="horspool"
        number="04"
        title="Horspool String Matching"
        text="See how Horspool's efficient string matching algorithm skips unnecessary comparisons using shift tables. Ideal for pattern matching in large texts — animated with pattern alignment and comparisons."
      />

      <Section
        id="prim"
        number="05"
        title="Prim’s Algorithm"
        text="Understand how Prim’s Algorithm builds the Minimum Spanning Tree (MST) step-by-step by always choosing the smallest edge. Track visited nodes, cost updates, and the growing MST in real-time."
      />

      <Projects />
      <ThreeContainer />
      <BeeChat />
    </div>
  );
}

export default Holder;
