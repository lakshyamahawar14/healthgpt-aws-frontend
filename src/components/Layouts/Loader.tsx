import React from "react";
import styles from "../../styles/Loader.module.scss";
import logo from "../../assets/images/luxlogobot.svg";

const Loader = React.memo((props: any) => {
  return (
    <>
      {props.startTop ? (
        <div id="loader" className={styles.topContainer}>
          <div className={styles.loaderContainer}>
            <img className={styles.logo} src={logo} alt="" />
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
