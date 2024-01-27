import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/PostSection.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { LoggedInstate } from "../../config/atoms";
import { topPathsArray } from "../../config/constant";
import Loader from "../Layouts/Loader";
import Success from "../Layouts/Success";
import Error from "../Layouts/Error";

const PostPage = () => {
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const [post, setPost] = useState<{
    username: string;
    postId: string;
    date: string;
    title: string;
    description: string;
    comments: Array<{ username: string; comment: string }>;
    tags: string[];
  }>();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  let comment = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const url = new URLSearchParams(location.search).get("url");

  const getPost = async (postId: string | null) => {
    try {
      const res = await axios.get(
        `http://13.235.81.90:4500/api/v1/forum/post?postId=${postId}`
      );
      return res.data.data.post;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!url) {
      navigate(topPathsArray.homePath, { replace: true });
    }

    const postId = url;

    getPost(postId).then((response) => {
      setPost(response);
    });
  }, []);

  const addComment = async (
    userId: any,
    accessToken: any,
    postId: any,
    username: any,
    comment: any
  ) => {
    axios
      .post(`http://13.235.81.90:4500/api/v1/forum/post/comments`, {
        userId: userId,
        accessToken: accessToken,
        postId: postId,
        comment: {
          username: username,
          comment: comment,
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
    if (comment.current?.value === "") {
      setErrorMessage("Please fill the form");
      return;
    }

    const userId = localStorage.getItem("UserId");
    const accessToken = localStorage.getItem("AccessToken");
    const username = localStorage.getItem("UserName");
    const postId = url;
    const commentText = comment.current?.value;

    addComment(userId, accessToken, postId, username, commentText).then(() => {
      const timer = setTimeout(() => {
        getPost(postId).then((response) => {
          setPost(response);
          setSuccessMessage("Comment Added Successfully");
        });
      }, 2000);

      return () => clearTimeout(timer);
    });
  };

  const handleTagClick = (tag: any) => {
    navigate(
      `${topPathsArray.forumPath}?search=${encodeURIComponent(tag.slice(1))}`
    );
  };

  return (
    <>
      <div className={styles.main}>
        {!post?.username ? (
          <Loader startTop={true} />
        ) : (
          <div className={styles.postContainer}>
            <div className={styles.headingsContainers}>
              <h1 className={styles.headings}>{post.username}'s Post</h1>
            </div>
            <div className={`${styles.cards} ${styles.postcard}`}>
              <div className={styles.postcardtop}>
                <span className={styles.usernames}>{post.username}</span>
                <span className={styles.dates}>{post.date}</span>
              </div>
              <div className={styles.titles}>{post.title}</div>
              <div className={styles.descriptions}>{post.description}</div>
              <div className={styles.postcardbottom}>
                catagory:{" "}
                <div className={styles.tagsContainers}>
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={styles.tags}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.commentsTitle}>
                <p>Comments</p>
              </div>
              <div className={styles.comments}>
                {post.comments.length > 0 ? (
                  post.comments.map((comment, index) => (
                    <p key={index}>
                      {comment.username}:{" "}
                      <span key={index} className={styles.comment}>
                        {comment.comment}
                      </span>
                    </p>
                  ))
                ) : (
                  <p>No Comments</p>
                )}
              </div>
            </div>
            <div className={styles.headingsContainers}>
              <h2 className={styles.headings}>Add a Comment</h2>
            </div>
            <div className={styles.addpostContainer}>
              <div className={styles.addpostCard}>
                <div
                  className={`${styles.postInputs} ${styles.inputsContainers}`}
                >
                  {" "}
                  <label className={styles.labels}>
                    Comment<span className={styles.spans}>*</span>
                  </label>{" "}
                  <textarea
                    required
                    name="comment"
                    placeholder="Comment here..."
                    ref={comment}
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
        )}
      </div>
    </>
  );
};

export default PostPage;
