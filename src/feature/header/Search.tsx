import { useState } from "react";
import "./Search.css";

const Search = () => {
  const [openSearch, setOpenSearch] = useState<boolean>(false);

  return (
    <div className="search">
      {openSearch ? (
        <div className="search__icon" onClick={() => setOpenSearch(true)}>
          <span className="material-symbols-outlined">search</span>
        </div>
      ) : (
        <div className="search__modal">
          <div className="search__modal-ui">
            <span>{"<-"}</span>
            <span>검색</span>
          </div>
          <form className="search__modal-form">
            <span className="material-symbols-outlined">search</span>
            <input type="text" />
          </form>
        </div>
      )}
    </div>
  );
};

export default Search;
