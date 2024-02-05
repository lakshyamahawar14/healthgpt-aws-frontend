import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/BlogSection.module.scss";
import Search from "../Layouts/Search";
import Loader from "../Layouts/Loader";
import Skipper from "../Layouts/Skipper";
import { blogsSearchQuery } from "../../config/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { blogs } from "../../config/atoms";
import NoData from "../Layouts/NoData";

export const BlogPage = () => {
  const [blogsArray, setBlogsArray] = useRecoilState(blogs);
  const [searchNum, setSearchNum] = useState(6);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  // const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const searchText = useRecoilValue(blogsSearchQuery);
  const [showNoData, setshowNoData] = useState(false);
  // const location = useLocation();
  // const searchUrl = new URLSearchParams(location.search).get("search");

  const getBlogs = async (searchQuery: any, numberOfResults: any) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/news/news?searchQuery=${searchQuery}&numberOfResults=${numberOfResults}`
      );
      return res.data.data.articles;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (blogsArray.length !== 0 || searchText === "") {
      return () => {};
    }

    if (pageNum !== 1 && next === false && prev === false) {
      return () => {};
    }

    getBlogs(searchText, searchNum).then((response) => {
      if (next === true) {
        response = response.slice(-6);
        setNext(false);
      } else if (prev === true) {
        response = response.slice(-6);
        setPrev(false);
      }
      if (response.length === 0) {
        setshowNoData(true);
      } else {
        setshowNoData(false);
      }
      setBlogsArray(response);
    });
  }, [searchText, next, prev, blogsArray.length, pageNum, searchNum, setBlogsArray]);

  const handleOnNext = (props: any) => {
    setBlogsArray([]);
    setshowNoData(false);
    setSearchNum(searchNum + props);
    setPageNum(pageNum + 1);
    setNext(true);
  };

  const handleOnPrev = (props: any) => {
    if (pageNum === 1) {
      return;
    }
    setBlogsArray([]);
    setshowNoData(false);
    setSearchNum(searchNum - props);
    setPageNum(pageNum - 1);
    setPrev(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.blogContainer}>
          <Search isBlogSearch={true} isPostSearch={false} />
          {blogsArray.length === 0 && !showNoData ? (
            <Loader startTop={true} />
          ) : (
            <>
              <div id="blogs" className={styles.blogsContainer}>
                <div className={styles.headingsContainers}>
                  <h1 className={styles.headings}>Recommended Blogs</h1>
                </div>
                {showNoData && <NoData />}
                {!showNoData && (
                  <>
                    <div className={styles.cardsContainers}>
                      {blogsArray.length > 0 &&
                        blogsArray.map((blog, index) => (
                          <a
                            key={index}
                            href={blog.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.cards} ${styles.blogcard}`}
                          >
                            {/* <img src={'https://www.healthkart.com/connect/wp-content/uploads/2021/09/900x500_banner_HK-Connect_How-to-Improve-Heart-Health-_-Points-To-Keep-In-Mind.jpg'} alt={blog.title} /> */}
                            <div className={styles.titles}>{blog.title}</div>
                            <div className={styles.descriptions}>
                              {blog.description}
                            </div>
                            <div className={styles.dates}>
                              {blog.date || ""}
                            </div>
                          </a>
                        ))}
                    </div>
                    <Skipper
                      onNext={handleOnNext}
                      onPrev={handleOnPrev}
                      page={pageNum}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
