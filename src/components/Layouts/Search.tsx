import axios from "axios";
import { useRef, useEffect } from "react";
import styles from "../../styles/Search.module.scss";
import React from "react";
import { useRecoilState } from "recoil";
import {
  LoggedInstate,
  blogs,
  blogsSearchQuery,
  posts,
  postsSearchQuery,
} from "../../config/atoms";
import { topPathsArray } from "../../config/constant";
import { useLocation, useNavigate } from "react-router-dom";

const Search = React.memo((props: any) => {
  const [blogsSearchText, setBlogsSearchText] =
    useRecoilState(blogsSearchQuery);
  const [postsSearchText, setPostsSearchText] =
    useRecoilState(postsSearchQuery);
  const [blogsArray, setBlogsArray] = useRecoilState(blogs);
  const [postsArray, setPostsArray] = useRecoilState(posts);
  let search = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const searchUrl = new URLSearchParams(location.search).get("search");
  const navigate = useNavigate();

  useEffect(() => {
    if (searchUrl) {
      search.current!.value = searchUrl;
      if (props.isBlogSearch) {
        if (searchUrl !== blogsSearchText) {
          setBlogsArray([]);
          setBlogsSearchText(searchUrl);
        }
      } else {
        if (searchUrl !== postsSearchText) {
          setPostsArray([]);
          setPostsSearchText(searchUrl);
        }
      }
    }
  }, []);

  const handleManualNavigation = () => {
    const searchText = search.current!.value;

    if (!searchText || searchText === "") {
      alert("Please enter the search query");
      return;
    }

    if (props.isBlogSearch) {
      if (searchText === blogsSearchText) {
        return;
      }
      setBlogsArray([]);
      setBlogsSearchText(searchText);
      const newUrl = `${topPathsArray.blogPath}?search=${encodeURIComponent(
        searchText
      )}`;
      navigate(newUrl, { replace: true });
    } else {
      if (searchText === postsSearchText) {
        return;
      }
      setPostsArray([]);
      setPostsSearchText(searchText);
      const newUrl = `${topPathsArray.forumPath}?search=${encodeURIComponent(
        searchText
      )}`;
      navigate(newUrl, { replace: true });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <div className={styles.searchQuery}>
            <div className={styles.inputsContainers}>
              <input
                type="text"
                id="search"
                placeholder="Search here..."
                ref={search}
                className={styles.inputs}
              ></input>
            </div>
            <div className={styles.buttonsContainers}>
              <input
                type="submit"
                name="search"
                value="Search"
                onClick={handleManualNavigation}
                className={styles.buttons}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Search;
