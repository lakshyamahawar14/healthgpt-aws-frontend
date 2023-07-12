import axios from "axios";
import styles from "../../styles/LoginSection.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";
import { useRecoilState, useResetRecoilState } from "recoil";
import {
  LoggedInstate,
  numMessagesState,
  blogs,
  tests,
  posts,
  blogsSearchQuery,
  postsSearchQuery,
} from "../../config/atoms";
import Error from "../Layouts/Error";
import Success from "../Layouts/Success";

export const LoginPage = React.memo((props: any) => {
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const resetMessages = useResetRecoilState(numMessagesState);
  const resetBlogs = useResetRecoilState(blogs);
  const resetTests = useResetRecoilState(tests);
  const resetPosts = useResetRecoilState(posts);
  const resetBlogsSearchQuery = useResetRecoilState(blogsSearchQuery);
  const resetPostsSearchQuery = useResetRecoilState(postsSearchQuery);

  let email = useRef<HTMLInputElement>(null);
  let password = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const handleSubmit = (event: any) => {
    if (email.current?.value !== "" && password.current?.value !== "") {
      try {
        axios
          .get(
            `http://13.235.81.90:5000/api/v1/auth/login?email=${email.current?.value}&password=${password.current?.value}`
          )
          .then((userCredential) => {
            if (userCredential.data.status === "failure") {
              setErrorMessage("Invalid Email/Password");
              return;
            }

            localStorage.setItem(
              "ProfilePic",
              userCredential.data.data.user.providerData[0].photoURL
            );
            setSuccessMessage("Logging In...");
            setLoggedIn(true);
            localStorage.setItem("IsLoggedIn", "true");
            localStorage.setItem(
              "AccessToken",
              userCredential.data.data.user.stsTokenManager.accessToken
            );
            localStorage.setItem("UserId", userCredential.data.data.user.uid);
            localStorage.setItem(
              "UserName",
              userCredential.data.data.user.displayName
            );

            resetMessages();
            resetBlogs();
            resetTests();
            resetPosts();
            resetBlogsSearchQuery();
            resetPostsSearchQuery();

            const timer = setTimeout(() => {
              navigate(topPathsArray.homePath, { replace: true });
            }, 1500);

            return () => clearTimeout(timer);
          })
          .catch((error) => {
            const errorMsg = error.message;
            setErrorMessage(errorMsg);
          });
      } catch (error) {
        setErrorMessage("Internal Server Error!");
      }
    } else {
      setErrorMessage("Please Fill the Form!");
    }
  };
  const handleForgotPassword = () => {
    if (email.current && email.current.value.length > 0) {
      try {
        axios
          .get(
            `http://13.235.81.90:5000/api/v1/auth/reset?email=${email.current.value}`
          )
          .then(() => {
            alert("Password Reset Link sent to your registered email!");
          })
          .catch((error) => {
            console.log(error.message);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={`${styles.main} ${styles.login}`}>
        <div className={styles.container}>
          <div className={styles.colleft}>
            <div className={styles.logintext}>
              <h2>Welcome!</h2>
              <p>
                Create your account.
                <br />
                For Free!
              </p>{" "}
              <a
                className={`${styles.signupButton}`}
                onClick={props.handleRegister}
              >
                Sign Up
              </a>
            </div>
          </div>
          <div className={styles.colright}>
            <div className={styles.loginform}>
              <h1>Login</h1>
              <div className={styles.inputsContainers}>
                {" "}
                <label className={styles.labels}>
                  Email address<span className={styles.spans}>*</span>
                </label>{" "}
                <input
                  type="text"
                  required
                  name="email"
                  placeholder="E-mail"
                  ref={email}
                  className={styles.inputs}
                />
              </div>
              <div className={styles.inputsContainers}>
                {" "}
                <label className={styles.labels}>
                  Password<span className={styles.spans}>*</span>
                </label>{" "}
                <input
                  ref={password}
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={styles.inputs}
                />
              </div>
              <div
                className={`${styles.buttonsContainers} ${styles.loginButtonContainer}`}
              >
                <input
                  type="submit"
                  name="login"
                  value="Login"
                  onClick={handleSubmit}
                  className={styles.buttons}
                />
                {(errorMessage.length > 0 || successMessage.length > 0) &&
                  (successMessage.length > 0 ? (
                    <Success successMessage={successMessage} />
                  ) : (
                    <Error errorMessage={errorMessage} />
                  ))}
              </div>
              {/* <p> */}{" "}
              <p id={styles.forgotPassword} onClick={handleForgotPassword}>
                Forgot password?
              </p>{" "}
              {/* </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
