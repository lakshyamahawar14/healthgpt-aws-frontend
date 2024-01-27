import styles from "../styles/TypingAnimation.module.scss";
const TypingAnimation = () => {
  return (
    <div className={styles.cap}>
      <span className={styles.inside}></span>
      <span className={styles.inside}></span>
      <span className={styles.inside}></span>
    </div>
  );
};
export default TypingAnimation;
