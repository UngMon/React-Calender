import { Link } from "react-router-dom";
import classes from "./StartPage.module.css";
const StartPage = () => {
  return (
    <div className={classes.section}>
          <h1 className={classes.h1}>
            <span>Y</span>
            <span>o</span>
            <span>u</span>
            <span>r</span>
            <span>C</span>
            <span>a</span>
            <span>l</span>
            <span>e</span>
            <span>n</span>
            <span>d</span>
            <span>e</span>
            <span>r</span>
          </h1>
        <Link to='/login'>시작하기</Link>
    </div>
  );
};

export default StartPage;
