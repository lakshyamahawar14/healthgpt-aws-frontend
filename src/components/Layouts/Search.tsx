import { useRef } from "react";
import styles from "../../styles/Search.module.scss";
import { searchText } from "../../config/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import React from "react";

const Search = React.memo((props: any) => {
  let search = useRef<HTMLInputElement>(null);
  const setSearchText = useSetRecoilState(searchText);

  const handleSearch = () => {
    if (search.current?.value !== "") {
      props.onSearch(search.current?.value);
    } else {
      alert("Please enter the search query");
    }
  };

  const handleChange = () => {
    const inputElement = document.getElementById("search") as HTMLInputElement;
    const text = inputElement.value;
    setSearchText(text);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <div className={styles.searchQuery}>
            {/* <label htmlFor="search">Search:</label> */}
            <input
              type="text"
              id="search"
              placeholder="Search here..."
              ref={search}
              value={useRecoilValue(searchText)}
              onChange={handleChange}
            ></input>
            <input
              type="submit"
              name="search"
              value="Search"
              onClick={handleSearch}
            />
          </div>
        </div>
      </div>
    </>
  );
});

export default Search;
