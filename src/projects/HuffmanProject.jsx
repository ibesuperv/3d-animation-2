import PROJECT_URLS from "../utils/projectUrls";

export default function HuffmanProject() {
  return (
    <div className="w-screen h-screen pt-20 bg-[#1B1B1B]">
      <iframe
        src={PROJECT_URLS.huffmanImage}
        className="w-full h-full"
        title="Huffman Coding"
      />
    </div>
  );
}
