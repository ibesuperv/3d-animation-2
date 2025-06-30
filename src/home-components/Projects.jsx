
export default function Projects() {

  return (
    <div className="section" id="contact">
      <div className="content-fit">
        <div className="number">06</div>
        <div className="des">
          <div className="title">LEARN BY PROJECTS</div>
          <table>
            <tbody>
              <tr
                className="hover:bg-[#44502266] transition duration-300 cursor-pointer"
                onClick={() => window.open("https://dnaencode.streamlit.app/", "_blank")}
              >
                <td>DNA Encoding</td>
                <td>String matching algorithm</td>
              </tr>
              <tr
                className="hover:bg-[#44502266] transition duration-300 cursor-pointer"
                onClick={() => window.open("https://huffmanimagecoding.streamlit.app/", "_blank")}
              >
                <td>Image compression</td>
                <td>Huffman coding and Tree</td>
              </tr>
              <tr
                className="hover:bg-[#44502266] transition duration-300 cursor-pointer"
                onClick={() => window.open("https://qos-aco.streamlit.app/", "_blank")}
              >
                <td>ACO based QoS routing</td>
                <td>ACO algorithm</td>
              </tr>
            </tbody>
          </table>
          <div className="sign">Varun b</div>
        </div>
      </div>
    </div>
  );
}
