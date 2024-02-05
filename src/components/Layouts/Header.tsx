import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  LoggedInstate,
  numMessagesState,
  blogs,
  tests,
  posts,
  blogsSearchQuery,
  postsSearchQuery,
} from "../../config/atoms";
import axios from "axios";
import logo from "../../assets/images/luxlogobot.svg";
import styles from "../../styles/Header.module.scss";

const Header = React.memo(() => {
  const resetMessages = useResetRecoilState(numMessagesState);
  const resetBlogs = useResetRecoilState(blogs);
  const resetTests = useResetRecoilState(tests);
  const resetPosts = useResetRecoilState(posts);
  const resetBlogsSearchQuery = useResetRecoilState(blogsSearchQuery);
  const resetPostsSearchQuery = useResetRecoilState(postsSearchQuery);
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const setIsLoggingOut = useSetRecoilState(LoggedInstate);
  const [blogsSearchText, setBlogsSearchText] =
    useRecoilState(blogsSearchQuery);
  const postsSearchText =
    useRecoilValue(postsSearchQuery);
  const [showLogout, setShowLogout] = useState(false);

  const navigate = useNavigate();

  const logOutHandler = () => {
    setIsLoggingOut(true);
    let userId = localStorage.getItem("UserId");
    let accessToken = localStorage.getItem("AccessToken");
    try {
      axios
        .get(
          `http://localhost:5000/api/v1/auth/signout?userId=${userId}&accessToken=${accessToken}`
        )
        .then(() => {
          setLoggedIn(false);
          localStorage.setItem("IsLoggedIn", "false");
          localStorage.setItem("UserId", "");
          localStorage.setItem("AccessToken", "");
          localStorage.setItem("UserName", "");
        })
        .catch((error) => {
          setLoggedIn(false);
          localStorage.setItem("IsLoggedIn", "false");
          localStorage.setItem("UserId", "");
          localStorage.setItem("AccessToken", "");
          localStorage.setItem("UserName", "");
          console.log(error.message);
        });
    } catch (error) {
      setLoggedIn(false);
      localStorage.setItem("IsLoggedIn", "false");
      localStorage.setItem("UserId", "");
      localStorage.setItem("AccessToken", "");
      console.log(error);
    }

    resetMessages();
    resetBlogs();
    resetTests();
    resetPosts();
    resetBlogsSearchQuery();
    resetPostsSearchQuery();

    const timer = setTimeout(() => {
      setIsLoggingOut(false);
      navigate(topPathsArray.homePath, { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  };

  const handleMenu = () => {
    const burgerElement = document.getElementById("burger");
    const divbtnElement = document.getElementById("divbtn");
    if (burgerElement?.innerHTML === `<span>-<br>-<br>-</span>`) {
      burgerElement.innerHTML = `<span>×</span>`;
    } else if (burgerElement?.innerHTML === `<span>×</span>`) {
      burgerElement.innerHTML = `<span>-<br>-<br>-</span>`;
    }

    if (divbtnElement) {
      if (
        divbtnElement.style.display === "none" ||
        divbtnElement.style.display === ""
      ) {
        divbtnElement.style.display = "flex";
      } else {
        divbtnElement.style.display = "none";
      }
    }
  };

  const getSymptom = async (userId: any, accessToken: any) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/db/symptom?userId=${userId}&accessToken=${accessToken}`
      );
      return res.data.data.symptom;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      let userId = localStorage.getItem("UserId");
      let accessToken = localStorage.getItem("AccessToken");
      getSymptom(userId, accessToken).then((response) => {
        response = response.toLowerCase().trim();
        if (response.length > 0 && !response.includes("no")) {
          setBlogsSearchText(response);
        }
      });
    }
  }, [isLoggedIn, setBlogsSearchText]);

  const handleImageClick = () => {
    setShowLogout(() => !showLogout);
  };

  return (
    <>
      <header>
        <div className={styles.divLogo}>
          <img className={styles.logo} src={logo} alt="lux" />
          <p>LUX</p>
        </div>
        <div id="burger" className={styles.burger} onClick={handleMenu}>
          <span>
            -<br />-<br />-
          </span>
        </div>
        <div id="divbtn" className={styles.divbtn}>
          <div className={styles.topbtn}>
            <Link
              style={{ textDecoration: "none" }}
              to={topPathsArray.homePath}
              onClick={() => {
                if (window.innerWidth < 750) {
                  handleMenu();
                }
              }}
            >
              <button className={styles.btn1}>Home</button>
            </Link>
          </div>
          <div className={styles.topbtn}>
            <Link
              style={{ textDecoration: "none" }}
              to={topPathsArray.assessmentPath}
              onClick={() => {
                if (window.innerWidth < 750) {
                  handleMenu();
                }
              }}
            >
              <button className={styles.btn1}>Assessment</button>
            </Link>
          </div>
          <div className={styles.topbtn}>
            <Link
              style={{ textDecoration: "none" }}
              to={
                blogsSearchText.length !== 0
                  ? `${topPathsArray.blogPath}?search=${encodeURIComponent(
                      blogsSearchText
                    )}`
                  : topPathsArray.blogPath
              }
              onClick={() => {
                if (window.innerWidth < 750) {
                  handleMenu();
                }
              }}
            >
              <button className={styles.btn1}> Blogs</button>
            </Link>
          </div>
          <div className={styles.topbtn}>
            <Link
              style={{ textDecoration: "none" }}
              to={
                postsSearchText.length !== 0
                  ? `${topPathsArray.forumPath}?search=${encodeURIComponent(
                      postsSearchText
                    )}`
                  : topPathsArray.forumPath
              }
              onClick={() => {
                if (window.innerWidth < 750) {
                  handleMenu();
                }
              }}
            >
              <button className={styles.btn1}> Community</button>
            </Link>
          </div>
          <div className={styles.topbtn}>
            {/* {isLoggingOut ? (
              <button className={styles.btn1}>Logging Out</button>
            ) : isLoggedIn ? (
              <button className={styles.btn1} onClick={logOutHandler}>
                Log Out
              </button>
            ) : (
              <Link
                to={topPathsArray.loginPath}
                style={{ textDecoration: "none" }}
                onClick={() => {
                  if (window.innerWidth < 750) {
                    handleMenu();
                  }
                }}
              >
                <button className={styles.btn1}>Log In</button>
              </Link>
            )} */}
            {isLoggedIn ? (
              <>
                <div className={styles.profileContainer}>
                  <img
                    src={localStorage.getItem("ProfilePic") as string}
                    alt={localStorage.getItem("UserName") as string}
                    width={50}
                    onClick={handleImageClick}
                  />
                </div>
                {showLogout && (
                  <div
                    className={styles.logoutContainer}
                    onClick={() => {
                      logOutHandler();
                      handleImageClick();
                    }}
                  >
                    <p>Log Out</p>
                  </div>
                )}
              </>
            ) : (
              <Link
                to={topPathsArray.loginPath}
                style={{ textDecoration: "none" }}
                onClick={() => {
                  if (window.innerWidth < 750) {
                    handleMenu();
                  }
                }}
              >
                <button className={styles.btn1}>Log In</button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
});

export default Header;
