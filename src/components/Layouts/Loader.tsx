import React, { useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Loader.module.scss";
import logo from "../../assets/images/luxlogobot.svg";
import { useRecoilState, useResetRecoilState } from "recoil";
import {
  FirstLaunch,
  blogs,
  numMessagesState,
  posts,
  tests,
} from "../../config/atoms";
import { LoggedInstate } from "../../config/atoms";

const Loader = React.memo((props: any) => {
  const [firstLaunch, setFirstLaunch] = useRecoilState(FirstLaunch);
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const resetMessages = useResetRecoilState(numMessagesState);
  const resetBlogs = useResetRecoilState(blogs);
  const resetTests = useResetRecoilState(tests);
  const resetPosts = useResetRecoilState(posts);

  useEffect(() => {
    const userId = localStorage.getItem("UserId");
    const accessToken = localStorage.getItem("AccessToken");

    if (userId && firstLaunch) {
      axios
        .get(
          `http://13.235.81.90:5000/api/v1/auth/login/verify?userId=${userId}&accessToken=${accessToken}`
        )
        .then((response) => {
          if (response.data.status === "failure") {
            alert("You have been Logged-Out. Please Login Again");
            localStorage.setItem("UserId", "");
            localStorage.setItem("AccessToken", "");
            localStorage.setItem("IsLoggedIn", "false");
            localStorage.setItem("UserName", "");
            setLoggedIn(false);
            resetMessages();
            resetBlogs();
            resetTests();
            resetPosts();
          }
        });
      if (firstLaunch) {
        setTimeout(() => {
          setFirstLaunch(false);
        }, 1000);
      }
    } else {
      if (firstLaunch) {
        setTimeout(() => {
          setFirstLaunch(false);
        }, 1500);
      }
    }
  }, []);

  return (
    <>
      {props.startTop ? (
        <div id="loader" className={styles.topContainer}>
          <div className={styles.loaderContainer}>
            <img className={styles.logo} src={logo} alt="" />
            {/* <p>Loading...</p> */}
          </div>
        </div>
      ) : (
        <div id="loader" className={styles.midContainer}>
          <div className={styles.loaderContainer}>
            <img className={styles.logo} src={logo} alt="" />
            {/* <p>Loading...</p> */}
          </div>
        </div>
      )}
    </>
  );
});

export default Loader;
