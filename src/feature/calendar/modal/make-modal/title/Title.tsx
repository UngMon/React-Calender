import { useState } from "react";
import './Title.css';

interface Props {
  titleRef: React.RefObject<HTMLInputElement | null>;
  defaultValue: string;
}

const Title = ({ titleRef, defaultValue }: Props) => {
  const [title, setTitle] = useState<string>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="form-title">
      <label htmlFor="text" />
      <input
        id="text"
        type="text"
        placeholder="제목 없음"
        ref={titleRef}
        value={title}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
};

export default Title;
