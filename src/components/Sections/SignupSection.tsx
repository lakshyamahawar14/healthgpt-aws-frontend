import axios from "axios";
import styles from "../../styles/SignupSection.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import {
  LoggedInstate,
  blogs,
  numMessagesState,
  posts,
  tests,
} from "../../config/atoms";
import Success from "../Layouts/Success";
import Error from "../Layouts/Error";

export const SignupPage = React.memo((props: any) => {
  const setLoggedIn = useSetRecoilState(LoggedInstate);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const resetMessages = useResetRecoilState(numMessagesState);
  const resetBlogs = useResetRecoilState(blogs);
  const resetTests = useResetRecoilState(tests);
  const resetPosts = useResetRecoilState(posts);

  let email = useRef<HTMLInputElement>(null);
  let userName = useRef<HTMLInputElement>(null);
  let password = useRef<HTMLInputElement>(null);
  let age = useRef<HTMLInputElement>(null);
  let gender = useRef<HTMLSelectElement>(null);
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (
      email.current?.value !== "" &&
      password.current?.value !== "" &&
      userName.current?.value !== "" &&
      age.current?.value !== "" &&
      gender.current?.value !== ""
    ) {
      try {
        axios
          .post(`http://13.235.81.90:5000/api/v1/auth/signup`, {
            email: email.current?.value,
            username: userName.current?.value,
            password: password.current?.value,
            age: age.current?.value,
            gender: gender.current?.value,
          })
          .then((userCred) => {
            if (userCred.data.status === "failure") {
              setErrorMessage(userCred.data.message);
              return;
            }
            setSuccessMessage("Sign-Up Successful");
            axios
              .get(
                `http://13.235.81.90:5000/api/v1/auth/login?email=${email.current?.value}&password=${password.current?.value}`
              )
              .then((userCredential) => {
                setSuccessMessage("Logging In...");
                setLoggedIn(true);
                localStorage.setItem("LoggedIn", "true");
                localStorage.setItem(
                  "AccessToken",
                  userCredential.data.data.user.stsTokenManager.accessToken
                );
                localStorage.setItem(
                  "UserId",
                  userCredential.data.data.user.uid
                );

                resetMessages();
                resetBlogs();
                resetTests();
                resetPosts();

                const timer = setTimeout(() => {
                  navigate(topPathsArray.homePath, { replace: true });
                }, 1500);

                return () => clearTimeout(timer);
              });
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={`${styles.wrapper} ${styles.signup}`}>
        <div className={styles.container}>
          <div className={styles.colleft}>
            <div className={styles.signuptext}>
              <h2>Welcome!</h2>
              <p>
                Already have an <br />
                account?
              </p>{" "}
              <a className={styles.btn} onClick={props.handleRegister}>
                Log In
              </a>
            </div>
          </div>
          <div className={styles.colright}>
            <div className={styles.signupform}>
              <h2>Sign Up</h2>
              <p>
                <label>
                  Username <span>*</span>
                </label>
                <input
                  ref={userName}
                  type="text"
                  required
                  name="username"
                  placeholder="Username"
                />
              </p>
              <p>
                {" "}
                <label>
                  Email address<span>*</span>
                </label>{" "}
                <input
                  type="text"
                  required
                  name="email"
                  placeholder="E-mail"
                  ref={email}
                />
              </p>
              <p>
                {" "}
                <label>
                  Create Password<span>*</span>
                </label>
                <input
                  required
                  ref={password}
                  type="password"
                  name="password"
                  placeholder="Create Password"
                />
              </p>
              <label>
                Age
                <span>*</span>
              </label>
              <p>
                <input ref={age} type="text" name="Age" placeholder="Age" />
              </p>
              <label>
                Gender <span>*</span>
              </label>
              <p>
                <select ref={gender} className={styles.select}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </p>
              <p>
                <input
                  type="submit"
                  name="SignUp"
                  value="Sign Up"
                  onClick={handleSubmit}
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
      </div>
    </>
  );
});
