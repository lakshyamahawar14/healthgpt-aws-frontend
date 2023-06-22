import { useRef } from "react";
import styles from "../../styles/Search.module.scss";
import React from "react";

const Search = React.memo((props: any) => {
  let search = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (search.current?.value !== "") {
      props.onSearch(search.current?.value);
    } else {
      alert("Please enter the search query");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <div className={styles.searchQuery}>
            <input
              type="text"
              id="search"
              placeholder="Search here..."
              ref={search}
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
