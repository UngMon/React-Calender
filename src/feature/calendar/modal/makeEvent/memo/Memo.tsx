import { useEffect, useRef, useState } from "react";
import "./Memo.css";

const Memo = () => {
  const [text, setText] = useState<string>("");
  const textRef = useRef<HTMLTextAreaElement>(null);

  // 💡 높이를 자동으로 맞추는 로직을 함수로 분리
  const adjustHeight = () => {
    if (textRef.current) {
      textRef.current.style.height = "0px"; // 높이 초기화
      textRef.current.style.height = `${textRef.current.scrollHeight}px`; // 스크롤 높이만큼 꽉 채움
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    adjustHeight();
  };

  return (
    <div className="memo-container">
      <div className="memo-icon">
        <span className="material-symbols-outlined">text_snippet</span>
      </div>
      <div className="memo">
        <textarea
          ref={textRef}
          name="memo"
          className="memo__text"
          placeholder="내용을 입력하세요"
          onChange={(e) => handleChange(e)}
          maxLength={300}
        />
        <div className="memo__count">
          <span style={{ color: text.length >= 300 ? "red" : "inherit" }}>
            {text.length}
          </span>
          /<span>300</span>
        </div>
      </div>
    </div>
  );
};

export default Memo;
