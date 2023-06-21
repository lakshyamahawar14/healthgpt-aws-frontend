import { useRecoilState } from "recoil";
import styles from "../../styles/TrackerSection.module.scss";
import { LoggedInstate } from "../../config/atoms";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";

const TrackerPage = () => {
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(topPathsArray.loginPath, { replace: true });
    }
  }, []);

  return (
    <>
      <div className={styles.trackerContainer}>Tracker</div>
    </>
  );
};

export default TrackerPage;
