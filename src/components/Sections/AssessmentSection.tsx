import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../../styles/AssessmentSection.module.scss";
import { LoggedInstate, tests } from "../../config/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect } from "react";
import Loader from "../Layouts/Loader";
import { topPathsArray } from "../../config/constant";

const AssessmentPage = () => {
  const [testsArray, setTestsArray] = useRecoilState(tests);
  const isLoggedIn = useRecoilValue(LoggedInstate);

  const getTests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:7000/api/v1/assessment/"
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
  }, [setTestsArray, testsArray]);

  useEffect(() => {
    if (testsArray.length > 0) {
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
                <div className={styles.headingsContainers}>
                  <h1 className={styles.headings}>
                    General Cognitive Assessment Test
                  </h1>
                </div>
                <div className={styles.cardsContainers}>
                  <Link
                    className={styles.cards}
                    style={{ textDecoration: "none" }}
                    to={{
                      pathname: `${topPathsArray.testPath}`,
                      search: `?url=${encodeURIComponent(testsArray[0].url)}`,
                    }}
                  >
                    <div className={styles.titles}>{testsArray[0].title}</div>
                    <div className={styles.descriptions}>
                      {testsArray[0].description}
                    </div>
                  </Link>
                </div>
                <div className={styles.headingsContainers}>
                  <h2 className={styles.headings}>
                    Specialized Cognitive Assessment Tests
                  </h2>
                </div>
                <div className={styles.cardsContainers}>
                  {testsArray.map((test, index) => {
                    if (test.url === "/general") {
                      return null;
                    }
                    return (
                      <Link
                        key={index}
                        className={styles.cards}
                        style={{ textDecoration: "none" }}
                        to={
                          isLoggedIn
                            ? {
                                pathname: `${topPathsArray.testPath}`,
                                search: `?url=${encodeURIComponent(test.url)}`,
                              }
                            : {
                                pathname: topPathsArray.loginPath,
                              }
                        }
                      >
                        <div className={styles.titles}>{test.title}</div>
                        <div className={styles.descriptions}>
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
