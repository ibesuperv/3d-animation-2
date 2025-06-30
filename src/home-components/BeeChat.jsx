import { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import "./BeeChat.css";

const FACTS = {
  intro: "🧭 DFS can detect cycles and do topological sort!",
  recursion: "🔁 Recursion builds its own stack — use wisely!",
  heap: "📦 Heap Sort is always O(n log n) — no surprises!",
  horspool: "🔍 Horspool skips characters smartly with a shift table!",
  prim: "🌲 Prim's algorithm builds MSTs greedily but optimally!",
  contact: "🛠️  Learn with Projects",
  default: "👋 Hi there, learn with me!",
};

export default function BeeChat() {
  const [currentId, setCurrentId] = useState("default");
  const [typeKey, setTypeKey] = useState(0); // to force re-typing

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "intro",
        "recursion",
        "heap",
        "horspool",
        "prim",
        "contact",
      ];
      let found = "default";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= 100) {
            found = id;
            break;
          }
        }
      }

      if (found !== currentId) {
        setCurrentId(found);
        setTypeKey((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentId]);

  return (
    <div className="bee-chat">
      <div className="bee-bubble">
        <Typewriter
          key={typeKey}
          words={[FACTS[currentId] || FACTS.default]}
          loop={1}
          cursor
          cursorStyle="_"
          typeSpeed={35}
          deleteSpeed={0}
          delaySpeed={1000}
        />
      </div>
    </div>
  );
}
