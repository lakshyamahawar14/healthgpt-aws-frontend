import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";
import { useRecoilState, useResetRecoilState } from "recoil";
import {
  LoggedInstate,
  numMessagesState,
  blogs,
  tests,
} from "../../config/atoms";
import axios from "axios";
import logo from "../../assets/images/luxlogobot.svg";
import styles from "../../styles/Header.module.scss";

const Header = () => {
  const resetMessages = useResetRecoilState(numMessagesState);
  const resetBlogs = useResetRecoilState(blogs);
  const resetTests = useResetRecoilState(tests);
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const logOutHandler = () => {
    setIsLoggingOut(true);
    let userId = localStorage.getItem("UserId");
    let accessToken = localStorage.getItem("AccessToken");
    try {
      axios
        .get(
          `http://192.168.9.234:5000/api/v1/auth/signout?userId=${userId}&accessToken=${accessToken}`
        )
        .then(() => {
          setLoggedIn(false);
          localStorage.setItem("IsLoggedIn", "false");
          localStorage.setItem("UserId", "");
          localStorage.setItem("AccessToken", "");
        })
        .catch((error) => {
          setLoggedIn(false);
          localStorage.setItem("IsLoggedIn", "false");
          localStorage.setItem("UserId", "");
          localStorage.setItem("AccessToken", "");
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

    const timer = setTimeout(() => {
      setIsLoggingOut(false);
      navigate(topPathsArray.homePath, { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading === true) {
      setIsLoading(false);
      document.getElementsByTagName("header")[0].style.display = "flex";
    }
  }, [isLoggedIn]);

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

  return (
    <>
      <header>
        <div className={styles.divLogo}>
          <img className={styles.logo} src={logo} alt="" />
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
            >
              <button className={styles.btn1}>Home</button>
            </Link>
          </div>
          <div className={styles.topbtn}>
            <Link
              style={{ textDecoration: "none" }}
              to={topPathsArray.assessmentPath}
            >
              <button className={styles.btn1}>Assessment</button>
            </Link>
          </div>
          <div className={styles.topbtn}>
            <Link
              style={{ textDecoration: "none" }}
              to={topPathsArray.blogPath}
            >
              <button className={styles.btn1}> Blogs</button>
            </Link>
          </div>
          <div className={styles.topbtn}>
            <Link
              style={{ textDecoration: "none" }}
              to={topPathsArray.forumPath}
            >
              <button className={styles.btn1}> Community</button>
            </Link>
          </div>
          <div className={styles.topbtn}>
            {isLoggingOut ? (
              <button className={styles.btn1}>Logging Out</button>
            ) : isLoggedIn ? (
              <button className={styles.btn1} onClick={logOutHandler}>
                Log Out
              </button>
            ) : (
              <Link
                to={topPathsArray.loginPath}
                style={{ textDecoration: "none" }}
              >
                <button className={styles.btn1}>Log In</button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
