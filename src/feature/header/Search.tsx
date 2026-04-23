import { useState } from "react";
import "./Search.css";

const Search = () => {
  const [openSearch, setOpenSearch] = useState<boolean>(false);

  return (
    <div className="search">
      <button
        type="button"
        className="search__icon"
        onClick={() => setOpenSearch(true)}
      >
        <span className="material-symbols-outlined">search</span>
      </button>
      {openSearch && (
        <div className="search__modal-overlay">
          <div className="search__modal-header">
            <form className="search__modal-form">
              <button
                type="button"
                className="search__modal-back"
                onClick={() => setOpenSearch(false)}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {/* <span className="material-symbols-outlined">search</span> */}
              <label htmlFor="keyword" />
              <input id="keyword" type="text" />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
