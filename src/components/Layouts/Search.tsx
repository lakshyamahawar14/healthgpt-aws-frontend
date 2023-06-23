import { useRef, useEffect } from "react";
import styles from "../../styles/Search.module.scss";
import React from "react";
import { useRecoilState } from "recoil";
import { blogsSearchQuery, postsSearchQuery } from "../../config/atoms";

const Search = React.memo((props: any) => {
  const [blogsSearchText, setBlogsSearchText] =
    useRecoilState(blogsSearchQuery);
  const [postsSearchText, setPostsSearchText] =
    useRecoilState(postsSearchQuery);
  let search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.isBlogSearch) {
      search.current!.value = blogsSearchText;
    } else {
      search.current!.value = postsSearchText;
    }
  }, [props.isBlogSearch, blogsSearchText, postsSearchText]);

  const handleSearch = () => {
    const searchText = search.current?.value;

    if (!searchText || searchText === "") {
      alert("Please enter the search query");
      return;
    }

    if (props.isBlogSearch) {
      setBlogsSearchText(searchText);
    } else {
      setPostsSearchText(searchText);
    }

    props.onSearch(searchText);
  };

  return (
    <>
      {/* {console.log("isBlogSearch", props.isBlogSearch)} */}
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
