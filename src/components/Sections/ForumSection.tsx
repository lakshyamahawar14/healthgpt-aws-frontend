import axios from "axios";
import { useRecoilState } from "recoil";
import styles from "../../styles/ForumSection.module.scss";
import Header from "../Layouts/Header";
import { FirstLaunch, LoggedInstate, posts } from "../../config/atoms";
import Loader from "../Layouts/Loader";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";
import Success from "../Layouts/Success";
import Error from "../Layouts/Error";
import Search from "../Layouts/Search";

const ForumPage = () => {
  const [postsArray, setPostsArray] = useRecoilState(posts);
  const [firstLaunch, setFirstLaunch] = useRecoilState(FirstLaunch);
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const [isLoading, setIsLoading] = useState(firstLaunch);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  let title = useRef<HTMLInputElement>(null);
  let description = useRef<HTMLTextAreaElement>(null);
  let tags = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const getPosts = async () => {
    try {
      const res = await axios.get(
        `http://13.235.81.90:4500/api/v1/forum/posts`
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
    tags: any
  ) => {
    axios
      .post(`http://13.235.81.90:4000/api/v1/db/posts`, {
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
      return;
    }
    const userId = localStorage.getItem("UserId");
    const accessToken = localStorage.getItem("AccessToken");

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

    updatePosts(
      userId,
      accessToken,
      1,
      "anonymous",
      "22 June, 2023",
      title.current?.value,
      description.current?.value,
      tagsArray
    ).then(() => {
      const timer = setTimeout(() => {
        getPosts().then((response) => {
          setPostsArray(response);
          setSuccessMessage("Post Added Successfully");
        });
      }, 2000);

      return () => clearTimeout(timer);
    });
  };

  const handleSearch = () => {
    console.log("implement filter here");
  };

  return (
    <>
      <div className={styles.main}>
        <Header />
        <Search onSearch={handleSearch} />
        {isLoading ? (
          <Loader startTop={true} />
        ) : (
          postsArray.length > 0 && (
            <>
              <div className={styles.forumContainer}>
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
                            {truncateDescription(post.description, 50)}
                          </div>

                          <div className={styles.postcardbottom}>
                            catagory:{" "}
                            <div className={styles.tags}>
                              {post.tags.map((tag, index) => {
                                return (
                                  <span key={index} className={styles.tag}>
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
                      <label>Post Tags</label>{" "}
                      <input
                        type="text"
                        required
                        name="tags"
                        placeholder="/general"
                        ref={tags}
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
                        name="post"
                        value="Post"
                        onClick={handlePost}
                      />
                      {(errorMessage.length > 0 || successMessage.length > 0) &&
                        (successMessage.length > 0 ? (
                          <Success successMessage={successMessage} />
                        ) : (
                          <Error errorMessage={errorMessage} />
                        ))}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>
    </>
  );
};

export default ForumPage;
