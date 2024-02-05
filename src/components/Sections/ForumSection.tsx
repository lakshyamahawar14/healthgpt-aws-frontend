import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "../../styles/ForumSection.module.scss";
import { LoggedInstate, posts, postsSearchQuery } from "../../config/atoms";
import Loader from "../Layouts/Loader";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";
import Success from "../Layouts/Success";
import Error from "../Layouts/Error";
import Search from "../Layouts/Search";
import Skipper from "../Layouts/Skipper";
import NoData from "../Layouts/NoData";

const ForumPage = () => {
  const [postsArray, setPostsArray] = useRecoilState(posts);
  const isLoggedIn= useRecoilValue(LoggedInstate);
  const [searchNum, setSearchNum] = useState(6);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const searchText = useRecoilValue(postsSearchQuery);
  const [showNoData, setshowNoData] = useState(false);
  let title = useRef<HTMLInputElement>(null);
  let description = useRef<HTMLTextAreaElement>(null);
  let tags = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  // const location = useLocation();
  // const searchUrl = new URLSearchParams(location.search).get("search");

  const getPosts = async (searchText: any, numberOfResults: any) => {
    try {
      const res = await axios.get(
        `http://localhost:4500/api/v1/forum/posts?searchQuery=${searchText}&numberOfResults=${numberOfResults}`
      );
      return res.data.data.communityposts;
    } catch (error) {
      console.log(error);
    }
  };

  const updatePosts = async (
    userId: any,
    accessToken: any,
    postId: any,
    username: any,
    date: any,
    title: any,
    description: any,
    tags: any
  ) => {
    axios
      .post(`http://localhost:4500/api/v1/forum/post`, {
        userId: userId,
        accessToken: accessToken,
        postObject: {
          userId: userId,
          postId: postId,
          username: username,
          date: date,
          title: title,
          description: description,
          tags: tags,
          comments: "",
        },
      })
      .then((response) => {})
      .catch((error) => {
        console.log(error.message);
      });
  };

  function truncateDescription(description: any, wordLimit: any) {
    if (!description) return "";

    const words = description.split(" ");
    if (words.length <= wordLimit) {
      return description;
    } else {
      const truncatedWords = words.slice(0, wordLimit);
      const truncatedDescription = truncatedWords.join(" ") + "...";
      return truncatedDescription;
    }
  }

  const handlePost = () => {
    if (!isLoggedIn) {
      navigate(topPathsArray.loginPath, { replace: true });
      return;
    }
    if (title.current?.value === "" || description.current?.value === "") {
      setErrorMessage("Please fill the form");
      return;
    }
    const userId = localStorage.getItem("UserId");
    const accessToken = localStorage.getItem("AccessToken");
    const username = localStorage.getItem("UserName");

    let tagsText = tags.current?.value;
    let tagsArray: (string | undefined)[] = [];

    if (tagsText === "") {
      tagsArray.push("/general");
    } else {
      tagsText?.split(" ").forEach((tag) => {
        if (tagsArray.length === 3) {
          return;
        }
        if (tag.charAt(0) !== "/") {
          tag = "/" + tag;
        }
        tagsArray.push(tag);
      });
    }

    const currentDate = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    updatePosts(
      userId,
      accessToken,
      1,
      username,
      currentDate,
      title.current?.value,
      description.current?.value,
      tagsArray
    ).then(() => {
      const timer = setTimeout(() => {
        getPosts(searchText, searchNum).then((response) => {
          if (response.length === 0) {
            setshowNoData(true);
          } else {
            setshowNoData(false);
          }
          setPostsArray(response);
          setSuccessMessage("Post Added Successfully");
        });
      }, 2000);

      return () => clearTimeout(timer);
    });
  };

  useEffect(() => {
    if (postsArray.length !== 0) {
      return () => {};
    }

    if (pageNum !== 1 && next === false && prev === false) {
      return () => {};
    }

    setPostsArray([]);

    getPosts(searchText, searchNum).then((response) => {
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
      setPostsArray(response);
    });
  }, [searchText, next, prev, postsArray.length, pageNum, setPostsArray, searchNum]);

  const handleOnNext = (props: any) => {
    setPostsArray([]);
    setshowNoData(false);
    setSearchNum(searchNum + props);
    setPageNum(pageNum + 1);
    setNext(true);
  };

  const handleOnPrev = (props: any) => {
    if (pageNum === 1) {
      return;
    }
    setPostsArray([]);
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
        <Search isBlogSearch={false} isPostSearch={true} />
        {postsArray.length === 0 && !showNoData ? (
          <Loader startTop={true} />
        ) : (
          <>
            <div className={styles.forumContainer}>
              <div className={styles.headingsContainers}>
                <h1 className={styles.headings}>Community Posts</h1>
              </div>
              {showNoData && <NoData />}
              {!showNoData && (
                <>
                  <div className={styles.cardsContainers}>
                    {postsArray.length > 0 &&
                      postsArray.map((post, index) => {
                        return (
                          <Link
                            key={index}
                            className={styles.cards}
                            style={{ textDecoration: "none" }}
                            to={{
                              pathname: `${topPathsArray.postPath}`,
                              search: `?url=${encodeURIComponent(post.postId)}`,
                            }}
                          >
                            <div className={styles.postcardtop}>
                              <span className={styles.usernames}>
                                {post.username}
                              </span>
                              <span className={styles.dates}>{post.date}</span>
                            </div>
                            <div className={styles.titles}>{post.title}</div>
                            <div className={styles.descriptions}>
                              {truncateDescription(post.description, 50)}
                            </div>

                            <div className={styles.postcardbottom}>
                              catagory:{" "}
                              <div className={styles.tagsContainers}>
                                {post.tags.map((tag, index) => {
                                  return (
                                    <span key={index} className={styles.tags}>
                                      {tag}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                  <Skipper
                    onNext={handleOnNext}
                    onPrev={handleOnPrev}
                    page={pageNum}
                  />
                </>
              )}
              <div className={styles.headingsContainers}>
                <h2 className={styles.headings}>Add a Community Post</h2>
              </div>
              <div className={styles.addforumContainer}>
                <div className={styles.addforumCard}>
                  <div
                    className={`${styles.postInputs} ${styles.inputsContainers}`}
                  >
                    {" "}
                    <label className={styles.labels}>
                      Post Title<span className={styles.spans}>*</span>
                    </label>{" "}
                    <input
                      type="text"
                      required
                      name="title"
                      placeholder="Title here..."
                      ref={title}
                      className={styles.inputs}
                    />
                  </div>
                  <div
                    className={`${styles.postInputs} ${styles.inputsContainers}`}
                  >
                    {" "}
                    <label className={styles.labels}>Post Tags</label>{" "}
                    <input
                      type="text"
                      required
                      name="tags"
                      placeholder="/general"
                      ref={tags}
                      className={styles.inputs}
                    />
                  </div>
                  <div
                    className={`${styles.postInputs} ${styles.inputsContainers}`}
                  >
                    {" "}
                    <label className={styles.labels}>
                      Description<span className={styles.spans}>*</span>
                    </label>{" "}
                    <textarea
                      required
                      name="title"
                      placeholder="Description here..."
                      ref={description}
                      className={styles.textareas}
                    />
                  </div>
                  <div className={styles.buttonsContainers}>
                    <input
                      type="submit"
                      name="post"
                      value="Post"
                      onClick={handlePost}
                      className={styles.buttons}
                    />
                    {(errorMessage.length > 0 || successMessage.length > 0) &&
                      (successMessage.length > 0 ? (
                        <Success successMessage={successMessage} />
                      ) : (
                        <Error errorMessage={errorMessage} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ForumPage;
