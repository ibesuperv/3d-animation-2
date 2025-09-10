# 🐝 3D animation and algorithm learning platform

An interactive **3D animation and algorithm learning platform** built with **React** and **Vite**.  
It combines **beautiful 3D scenes** with **algorithm visualizations** and a **"Learn by Project" section**,  
helping users understand complex concepts through engaging visuals.


---
## 🎥 Demo
[▶️ Watch the Demo on Vimeo](https://vimeo.com/1115428609)

---

## ✨ Features
- ⚡ **Fast development** with [Vite](https://vitejs.dev/)
- 🖼️ **Interactive 3D scenes** powered by `Three.js`
- 🎨 **Modern UI** built with React & TailwindCSS
- 🔍 **Algorithm Visualizations**:
  - Graph Traversals (BFS, DFS)
  - Recursion Tree Visualization
  - Prim’s Algorithm
  - Horspool String Matching
  - Heap Sort
- 🧩 **Learn by Project Section**:
  - Huffman Coding
  - Ant Colony Optimization (QoS)
  - DNA Encoding
- 🔊 Immersive background music & animations
- 📱 Fully **responsive** for desktop and mobile

---

## 🛠️ Tech Stack
- **Frontend**: React + Vite
- **3D Rendering**: Three.js
- **Styling**: TailwindCSS
- **Other Tools**: ESLint, PostCSS

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/ibesuperv/3d-animation-2.git
cd 3d-animation-2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
### 4. Build for Production
```bash
npm run build
```

## 📂 Project Structure
```bash

3d-animation-2/
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── projects/
│   ├── Huffman_coding/
│   ├── QOS-ACO/
│   └── dnaEncoding/
├── public/
│   ├── bee-bg.mp3
│   ├── demon_bee_full_texture.glb
│   └── img/
│       ├── bg.png
│       ├── flower.png
│       ├── leaf.png
│       └── leaf1.png
└── src/
    ├── App.jsx
    ├── Holder.jsx
    ├── index.css
    ├── main.jsx
    ├── components/           # Algorithm Visualizations
    │   ├── BFSTraversal.jsx
    │   ├── GraphTraversal.jsx
    │   ├── Heapsort.jsx
    │   ├── HorspoolVisualizer.jsx
    │   ├── Prims.jsx
    │   └── RecursionTreeVisualizer.jsx
    ├── home-components/      # Home Page Sections
    │   ├── BackgroundMusic.jsx
    │   ├── Banner.jsx
    │   ├── BeeChat.css
    │   ├── BeeChat.jsx
    │   ├── Header.jsx
    │   ├── Projects.jsx
    │   ├── Section.css
    │   ├── Section.jsx
    │   └── ThreeContainer.jsx
    ├── projects/             # Learn by Project Section
    │   ├── ACOProject.jsx
    │   ├── DNAProject.jsx
    │   └── HuffmanProject.jsx
    ├── styles/
    │   └── style.css
    └── utils/
        ├── ThreeScene.js
        └── projectUrls.js

```
## 🔍 Algorithm Visualizations
- Graph Traversals (BFS/DFS)
- Recursion Tree
- Prim’s Algorithm
- Horspool String Matching
- Heap Sort

## 🧩 Learn by Project
The projects/ folder contains educational projects:
- Huffman_coding/ → Huffman coding implementation
- QOS-ACO/ → Ant Colony Optimization for QoS routing
- dnaEncoding/ → DNA sequence encoding
