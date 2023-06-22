import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/BlogSection.module.scss";
import Header from "../Layouts/Header";
import Search from "../Layouts/Search";
import Loader from "../Layouts/Loader";
import Skipper from "../Layouts/Skipper";
import { FirstLaunch, LoggedInstate } from "../../config/atoms";
import { useRecoilState } from "recoil";
import { blogs } from "../../config/atoms";

export const BlogPage = () => {
  const [blogsArray, setBlogsArray] = useRecoilState(blogs);
  const [searchText, setSearchText] = useState("");
  const [searchNum, setSearchNum] = useState(6);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [firstLaunch, setFirstLaunch] = useRecoilState(FirstLaunch);
  const [isLoading, setIsLoading] = useState(firstLaunch);
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);

  const getBlogs = async (searchQuery: any, numberOfResults: any) => {
    try {
      const res = await axios.get(
        `http://13.235.81.90:8000/api/v1/news/news?searchQuery=${searchQuery}&numberOfResults=${numberOfResults}`
      );
      return res.data.data.articles;
    } catch (error) {
      console.log(error);
    }
  };

  const getSymptom = async (userId: any, accessToken: any) => {
    try {
      const res = await axios.get(
        `http://13.235.81.90:4000/api/v1/db/symptom?userId=${userId}&accessToken=${accessToken}`
      );
      return res.data.data.symptom;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (blogsArray.length !== 0) {
      return () => {};
    }

    setIsLoading(true);

    if (isLoggedIn) {
      let userId = localStorage.getItem("UserId");
      let accessToken = localStorage.getItem("AccessToken");
      getSymptom(userId, accessToken).then((response) => {
        response = response.toLowerCase().trim();
        if (response.length > 0 && !response.includes("no")) {
          setSearchText(response);
        } else {
          setSearchText("mental health");
        }
      });
    } else {
      setSearchText("mental health");
    }
  }, []);

  useEffect(() => {
    if (searchText === "") {
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
      setBlogsArray(response);
    });
  }, [searchText, next, prev]);

  const handleSearch = (searchQuery: any) => {
    if (searchQuery === searchText) {
      return;
    }
    setIsLoading(true);
    setSearchText(searchQuery);
  };

  useEffect(() => {
    if (blogsArray.length > 0 && isLoading === true) {
      setIsLoading(false);
      firstLaunch && setFirstLaunch(false);
    }
  }, [blogsArray]);

  const handleOnNext = (props: any) => {
    setIsLoading(true);
    setSearchNum(searchNum + props);
    setPageNum(pageNum + 1);
    setNext(true);
  };

  const handleOnPrev = (props: any) => {
    if (pageNum === 1) {
      return;
    }
    setIsLoading(true);
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
        <Header />
        <div className={styles.blogContainer}>
          <Search onSearch={handleSearch} />
          {isLoading ? (
            <Loader startTop={true} />
          ) : (
            blogsArray.length > 0 && (
              <>
                <div id="blogs" className={styles.blogsContainer}>
                  <p>Recommended Blogs</p>
                  <div className={styles.blogs}>
                    {blogsArray.map((blog, index) => (
                      <a
                        key={index}
                        href={blog.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.blogcard}
                      >
                        {/* <img src={'https://www.healthkart.com/connect/wp-content/uploads/2021/09/900x500_banner_HK-Connect_How-to-Improve-Heart-Health-_-Points-To-Keep-In-Mind.jpg'} alt={blog.title} /> */}
                        <div className={styles.title}>{blog.title}</div>
                        <div className={styles.description}>
                          {blog.description}
                        </div>
                        <div className={styles.author}>{blog.date || ""}</div>
                      </a>
                    ))}
                  </div>
                </div>
                <Skipper
                  onNext={handleOnNext}
                  onPrev={handleOnPrev}
                  page={pageNum}
                />
              </>
            )
          )}
        </div>
      </div>
    </>
  );
};
