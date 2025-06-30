import PROJECT_URLS from "../utils/projectUrls";


export default function DNAProject() {
  return (
    <div className="w-screen h-screen pt-20 bg-[#1B1B1B]">
      <iframe
        src={PROJECT_URLS.dnaEncoding}
        className="w-full h-full"
        title="DNA Encoding"
      />
    </div>
  );
}
