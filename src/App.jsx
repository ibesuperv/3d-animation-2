import { Route, Routes } from "react-router-dom";
import RecursionTreeVisualizer from "./components/RecursionTreeVisualizer";
import HeapSortVisualizer from "./components/Heapsort";
import HorspoolVisualizer from "./components/HorspoolVisualizer";
import PrimMST from "./components/Prims";
import Holder from "./Holder";
import GraphTraversal from "./components/GraphTraversal";
import "./styles/style.css";
import Header from "./home-components/Header";
import BackgroundMusic from "./home-components/BackgroundMusic";
import DNAProject from "./projects/DNAProject";
import HuffmanProject from "./projects/HuffmanProject";
import ACOProject from "./projects/ACOProject";

function App() {
  return (
    <>
      <BackgroundMusic />
      <Header />
      <Routes>
        <Route path="/" element={<Holder />} />
        <Route path="/reursiontree" element={<RecursionTreeVisualizer />} />
        <Route path="/bfsdfs" element={<GraphTraversal />} />
        <Route path="/heap" element={<HeapSortVisualizer />} />
        <Route path="/horspool" element={<HorspoolVisualizer />} />
        <Route path="/prims" element={<PrimMST />} />
        <Route path="/projects/dna" element={<DNAProject />} />
        <Route path="/projects/huffman" element={<HuffmanProject />} />
        <Route path="/projects/aco" element={<ACOProject />} />
      </Routes>
    </>
  );
}

export default App;
