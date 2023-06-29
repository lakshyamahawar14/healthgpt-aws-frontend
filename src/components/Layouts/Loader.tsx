import React from "react";
import styles from "../../styles/Loader.module.scss";
import loader from "../../assets/images/luxlogobot.svg";

const Loader = React.memo((props: any) => {
  return (
    <>
      {props.startTop ? (
        <div id="loader" className={styles.topContainer}>
          <div className={styles.loaderContainer}>
            <img className={styles.loader} src={loader} alt="loader" />
          </div>
        </div>
      ) : (
        <div id="loader" className={styles.midContainer}>
          <div className={styles.loaderContainer}>
            <img className={styles.loader} src={loader} alt="loader" />
          </div>
        </div>
      )}
    </>
  );
});

export default Loader;
