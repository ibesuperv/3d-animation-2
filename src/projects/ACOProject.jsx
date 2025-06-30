import PROJECT_URLS from "../utils/projectUrls";

export default function ACOProject() {
  return (
    <div className="w-screen h-screen pt-20 bg-[#1B1B1B]">
      <iframe
        src={PROJECT_URLS.qosAco}
        className="w-full h-full"
        title="ACO QoS Routing"
      />
    </div>
  );
}
