import React, { useEffect, useRef, useState } from "react";
import "./StartImages.css";
import { ListOrMore } from "../type/RefType";

const images = [
  {
    url: "",
    description: "",
  },
  { url: "", description: "" },
  { url: "", description: "" },
];

const StartImages = () => {
  const [count, setCount] = useState<number>(0);
  const imageRef = useRef<ListOrMore>({});

  useEffect(() => {
    setTimeout(() => {
      if (count <= 1) {
        imageRef.current[count]!.classList.add('fade-out');
        imageRef.current[count + 1]!.classList.remove('fade-out')
        setCount(count + 1);
      } else {
        imageRef.current[2]!.classList.add('fade-out');
        imageRef.current[0]!.classList.remove('fade-out')
        setCount(0);
      }
    }, 5000);
  }, [count]);

  return (
    <div className="images">
      {images.map((item, index) => (
        <div
          key={index}
          className="image"
          ref={(el) => (imageRef.current![index] = el)}
        >
          <img src={item.url} alt={item.description} />
        </div>
      ))}
    </div>
  );
};

export default StartImages;
