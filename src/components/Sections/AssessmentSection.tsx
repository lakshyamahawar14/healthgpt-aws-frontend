import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../../styles/AssessmentSection.module.scss";
import { FirstLaunch, LoggedInstate, tests } from "../../config/atoms";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import Loader from "../Layouts/Loader";
import { topPathsArray } from "../../config/constant";

const AssessmentPage = () => {
  const [testsArray, setTestsArray] = useRecoilState(tests);
  const [firstLaunch, setFirstLaunch] = useRecoilState(FirstLaunch);
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);

  const getTests = async () => {
    try {
      const res = await axios.get(
        "http://13.235.81.90:7000/api/v1/assessment/"
      );
      return res.data.data.tests;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (testsArray.length === 0) {
      getTests().then((response) => {
        setTestsArray(response);
      });
    }
  }, [testsArray]);

  useEffect(() => {
    if (testsArray.length > 0) {
      setFirstLaunch(false);
      window.scrollTo(0, 0);
    }
  }, [testsArray]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.assessmentContainer}>
          {testsArray.length === 0 ? (
            <Loader startTop={true} />
          ) : (
            testsArray.length > 0 && (
              <div className={styles.testsContainer}>
                <p>General Cognitive Assessment Test</p>
                <div className={styles.tests}>
                  <Link
                    className={styles.testcard}
                    style={{ textDecoration: "none" }}
                    to={{
                      pathname: "/test",
                      search: `?url=${encodeURIComponent(testsArray[0].url)}`,
                    }}
                  >
                    <div className={styles.title}>{testsArray[0].title}</div>
                    <div className={styles.description}>
                      {testsArray[0].description}
                    </div>
                  </Link>
                </div>
                <p>Specialized Cognitive Assessment Tests</p>
                <div className={styles.tests}>
                  {testsArray.map((test, index) => {
                    if (test.url === "/general") {
                      return null;
                    }
                    return (
                      <Link
                        key={index}
                        className={styles.testcard}
                        style={{ textDecoration: "none" }}
                        to={
                          isLoggedIn
                            ? {
                                pathname: "/test",
                                search: `?url=${encodeURIComponent(test.url)}`,
                              }
                            : {
                                pathname: topPathsArray.loginPath,
                              }
                        }
                      >
                        <div className={styles.title}>{test.title}</div>
                        <div className={styles.description}>
                          {test.description}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default AssessmentPage;
