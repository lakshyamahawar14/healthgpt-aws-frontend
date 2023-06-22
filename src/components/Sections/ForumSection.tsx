import axios from "axios";
import { useRecoilState } from "recoil";
import styles from "../../styles/ForumSection.module.scss";
import Header from "../Layouts/Header";
import { FirstLaunch, LoggedInstate, posts } from "../../config/atoms";
import Loader from "../Layouts/Loader";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";

const ForumPage = () => {
  const [postsArray, setPostsArray] = useRecoilState(posts);
  const [firstLaunch, setFirstLaunch] = useRecoilState(FirstLaunch);
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const [isLoading, setIsLoading] = useState(firstLaunch);
  let title = useRef<HTMLInputElement>(null);
  let description = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const getPosts = async () => {
    try {
      const res = await axios.get(
        `http://192.168.9.234:1000/api/v1/forum/posts`
      );
      return res.data.data.communityposts;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (postsArray.length !== 0) {
      return () => {};
    }
    setIsLoading(true);
    getPosts().then((response) => {
      setPostsArray(response);
    });
  }, []);

  useEffect(() => {
    if (postsArray.length > 0 && isLoading === true) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        firstLaunch && setFirstLaunch(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [postsArray]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updatePosts = async (
    userId: any,
    accessToken: any,
    postId: any,
    username: any,
    date: any,
    title: any,
    description: any,
    url: any
  ) => {
    axios
      .post(`http://192.168.9.234:4000/api/v1/db/posts`, {
        userId: userId,
        accessToken: accessToken,
        postObject: {
          userId: userId,
          postId: postId,
          username: username,
          date: date,
          title: title,
          description: description,
          url: url,
        },
      })
      .then((response) => {})
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handlePost = () => {
    if (!isLoggedIn) {
      navigate(topPathsArray.loginPath, { replace: true });
      return;
    }
    if (title.current?.value === "" || description.current?.value === "") {
      return;
    }
    const userId = localStorage.getItem("UserId");
    const accessToken = localStorage.getItem("AccessToken");
    updatePosts(
      userId,
      accessToken,
      1,
      "anonymous",
      "22 June, 2023",
      title.current?.value,
      description.current?.value,
      "/general"
    ).then(() => {
      const timer = setTimeout(() => {
        getPosts().then((response) => {
          setPostsArray(response);
        });
      }, 1500);

      return () => clearTimeout(timer);
    });
  };

  return (
    <>
      <div className={styles.main}>
        <Header />
        <div className={styles.forumContainer}>
          {isLoading ? (
            <Loader startTop={true} />
          ) : (
            postsArray.length > 0 && (
              <>
                <div className={styles.forumTitle}>
                  <p>Community Posts</p>
                </div>
                <div className={styles.posts}>
                  {postsArray.length > 0 &&
                    postsArray.map((post, index) => {
                      return (
                        <Link
                          key={index}
                          className={styles.postcard}
                          style={{ textDecoration: "none" }}
                          to={
                            isLoggedIn
                              ? {
                                  pathname: "/post",
                                  search: `?url=${encodeURIComponent(
                                    post.postId
                                  )}`,
                                }
                              : {
                                  pathname: topPathsArray.loginPath,
                                }
                          }
                        >
                          <div className={styles.postcardtop}>
                            <span className={styles.username}>
                              {post.username}
                            </span>
                            <span className={styles.date}>{post.date}</span>
                          </div>
                          <div className={styles.title}>{post.title}</div>
                          <div className={styles.description}>
                            {post.description}
                          </div>
                          <div className={styles.postcardbottom}>
                            catagory:{" "}
                            <span className={styles.url}>{post.url}</span>
                          </div>
                        </Link>
                      );
                    })}
                </div>
                <div className={styles.addforumTitle}>
                  <p>Add a Community Post</p>
                </div>
                <div className={styles.addforumContainer}>
                  <div className={styles.addforumCard}>
                    <p>
                      {" "}
                      <label>
                        Post Title<span>*</span>
                      </label>{" "}
                      <input
                        type="text"
                        required
                        name="title"
                        placeholder="Title here..."
                        ref={title}
                      />
                    </p>
                    <p>
                      {" "}
                      <label>
                        Description<span>*</span>
                      </label>{" "}
                      <textarea
                        required
                        name="title"
                        placeholder="Description here..."
                        ref={description}
                      />
                    </p>
                    <p>
                      <input
                        type="submit"
                        name="search"
                        value="Search"
                        onClick={handlePost}
                      />
                    </p>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ForumPage;
