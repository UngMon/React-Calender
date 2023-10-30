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
      const prevIndex = count === 0 ? images.length - 1 : count - 1;
      const nextIndex = count === images.length - 1 ? 0 : count + 1;
      imageRef.current[prevIndex]!.style.zIndex = "0";
      imageRef.current[prevIndex]!.style.opacity = "0";
      imageRef.current[count]!.style.zIndex = "1";
      imageRef.current[count]!.style.opacity = "1";
      imageRef.current[nextIndex]!.style.zIndex = "5";
      imageRef.current[nextIndex]!.style.opacity = "1";
      setCount(count < images.length - 1 ? count + 1 : 0);
    }, 4000);
  }, [count]);

  return (
    <div className="images">
      {images.map((item, index) => (
        <div
          key={index}
          className="image"
          ref={(el) => (imageRef.current![index] = el)}
          style={{
            zIndex: index === 0 ? "1" : index === 1 ? "5" : "0",
            opacity: index === 0 ? "1" : index === 1 ? "1" : 0,
          }}
        >
          <img src={item.url} alt={item.description} />
        </div>
      ))}
    </div>
  );
};

export default StartImages;
