import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-box">
        <div className="not-found-box__img">
          <img src="/images/404.png" alt="404" />
        </div>
        <h2>원하시는 페이지를 찾을 수 없습니다</h2>
        <p>
          찾으시려는 페이지의 주소가 잘못 입력되었거나,
          <br /> 주소가 변경 또는 삭제되어 현재 사용할 수 없습니다.
          <br /> 입력하신 주소를 다시 한번 확인해 주세요.
        </p>
        <Link to="/" replace={true}>
          <span>홈으로 돌아가기</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
