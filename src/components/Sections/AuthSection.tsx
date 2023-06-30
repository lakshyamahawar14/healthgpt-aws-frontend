import { useState } from "react";
import { LoginPage } from "./LoginSection";
import { SignupPage } from "./SignupSection";
import styles from "../../styles/AuthSection.module.scss";
import { useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";
import React from "react";

export const AuthPage = React.memo((props: any) => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const navigate = useNavigate();

  const showLogin = () => {
    setIsRegistered(true);
    navigate(topPathsArray.loginPath);
  };
  const showSignup = () => {
    setIsRegistered(false);
    navigate(topPathsArray.signupPath);
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.authContainer}>
          {isRegistered ? (
            props.login ? (
              <LoginPage handleRegister={showSignup} />
            ) : (
              <SignupPage handleRegister={showLogin} />
            )
          ) : props.signup ? (
            <SignupPage handleRegister={showLogin} />
          ) : (
            <LoginPage handleRegister={showSignup} />
          )}
        </div>
      </div>
    </>
  );
});
