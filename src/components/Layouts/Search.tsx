import { useRef, useEffect } from "react";
import styles from "../../styles/Search.module.scss";
import React from "react";
import { useRecoilState } from "recoil";
import { blogsSearchQuery, postsSearchQuery } from "../../config/atoms";
import { topPathsArray } from "../../config/constant";
import { useLocation } from "react-router-dom";

const Search = React.memo((props: any) => {
  const [blogsSearchText, setBlogsSearchText] =
    useRecoilState(blogsSearchQuery);
  const [postsSearchText, setPostsSearchText] =
    useRecoilState(postsSearchQuery);
  let search = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const searchUrl = new URLSearchParams(location.search).get("search");

  useEffect(() => {
    if (searchUrl) {
      search.current!.value = searchUrl;
      handleSearch();
    } else {
      if (props.isBlogSearch) {
        search.current!.value = blogsSearchText;
      } else {
        search.current!.value = postsSearchText;
      }
    }
  }, []);

  const handleSearch = () => {
    const searchText = search.current?.value;

    if (!searchText || searchText === "") {
      alert("Please enter the search query");
      return;
    }

    if (props.isBlogSearch) {
      if (!searchUrl) {
        const newUrl = `${topPathsArray.blogPath}?search=${encodeURIComponent(
          searchText
        )}`;
        window.history.replaceState(null, "", newUrl);
      }
    } else if (props.isPostSearch) {
      if (!searchUrl) {
        const newUrl = `${topPathsArray.forumPath}?search=${encodeURIComponent(
          searchText
        )}`;
        window.history.replaceState(null, "", newUrl);
      }
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
