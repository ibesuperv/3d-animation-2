import { useNavigate } from 'react-router-dom';
import './Section.css';

const routeMap = {
  intro: '/bfsdfs',
  recursion: '/reursiontree',
  heap: '/heap',
  horspool: '/horspool',
  prim: '/prims',
};

export default function Section({ id, number, title, text, img }) {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    if (routeMap[id]) navigate(routeMap[id]);
  };

  return (
    <div className="section" id={id}>
      <div className="content-fit">
        <div className="number">{number}</div>
        <div className="des">
          <div className="title link-title" onClick={handleTitleClick}>
            {title}
          </div>
          <p>{text}</p>
        </div>
      </div>
      {img && (
        <img
          src={img}
          className="decorate"
          alt=""
          style={{ width: '70vw', bottom: 0, right: 0, zIndex: 101 }}
        />
      )}
    </div>
  );
}
