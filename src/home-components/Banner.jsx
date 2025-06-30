export default function Banner() {
  return (
    <div className="section" id="banner">
      <div className="content-fit">
        <div className="title" data-before="ALGORITHMICALLY">
          VISUALIZE SMARTER
        </div>
      </div>
      <img
        src="/img/flower.png"
        className="decorate"
        alt=""
        style={{ width: "50vw", bottom: 0, right: 0 }}
      />
      <img
        src="/img/leaf.png"
        className="decorate"
        alt=""
        style={{ width: "30vw", bottom: 0, left: 0 }}
      />
    </div>
  );
}
