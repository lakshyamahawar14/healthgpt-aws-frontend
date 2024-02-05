import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../../styles/TestSection.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";
import { useRecoilValue } from "recoil";
import { LoggedInstate } from "../../config/atoms";
import Loader from "../Layouts/Loader";
import Success from "../Layouts/Success";
import Error from "../Layouts/Error";

const TestPage = () => {
  const isLoggedIn = useRecoilValue(LoggedInstate);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();
  const url = new URLSearchParams(location.search).get("url") as string;
  const navigate = useNavigate();

  const [test, setTest] = useState<{
    title: string;
    questions: Array<string>;
  }>();
  const [score, setScore] = useState([]);

  const getTest = async (path: any) => {
    try {
      const res = await axios.get(
        `http://localhost:7000/api/v1/assessment/test?url=${path}`
      );
      return res.data.data.test;
    } catch (error) {
      console.log(error);
    }
  };

  const getScore = async (userId: any, accessToken: any, url: string) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/db/score?userId=${userId}&accessToken=${accessToken}&url=${url}`
      );
      if (url === "/general") {
        const generalScore = res.data.data.score.scores;
        if (generalScore === "") {
          return [{ url: "/general", name: "general", score: -1 }];
        }
        return generalScore;
      }
      return [res.data.data.score];
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!url || !isLoggedIn) {
      navigate(topPathsArray.loginPath, { replace: true });
    }
    const userId = localStorage.getItem("UserId");
    const accessToken = localStorage.getItem("AccessToken");

    if (userId || accessToken) {
      getScore(userId, accessToken, url).then((score) => {
        if (score && score[0].score !== -1) {
          navigate(
            `${topPathsArray.scorePath}?url=${encodeURIComponent(url)}`,
            {
              replace: true,
            }
          );
          return () => {};
        }
        getTest(url).then((res) => {
          setTest(res);
        });
      });
    }
  }, [isLoggedIn, navigate, url]);

  const evaluateScore = async (url: any, responses: any) => {
    try {
      let requestUrl = `http://localhost:7000/api/v1/assessment/test/evaluate`;
      if (url === "/general") {
        requestUrl = `http://localhost:7000/api/v1/assessment/general/evaluate`;
      }
      const res = await axios.get(requestUrl, {
        params: {
          url: url,
          responses: responses,
        },
      });
      return res.data.data.score;
    } catch (error) {
      console.log(error);
    }
  };

  const updateScore = async (
    userId: any,
    accessToken: any,
    url: any,
    score: any
  ) => {
    try {
      const res = await axios.post(`http://localhost:4000/api/v1/db/score`, {
        userId: userId,
        accessToken: accessToken,
        url: url,
        scoreObj: score,
      });
      return res.data.message;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (score.length === 0) {
      return () => {};
    }

    const userId = localStorage.getItem("UserId");
    const accessToken = localStorage.getItem("AccessToken");

    if (!userId || !accessToken) {
      return () => {};
    }

    updateScore(userId, accessToken, url, score).then((response) => {
      navigate(`${topPathsArray.scorePath}?url=${encodeURIComponent(url)}`, {
        replace: true,
      });
    });
  }, [score]);

  const handleSubmit = () => {
    const unansweredQuestions = test?.questions.filter((_, index) => {
      const selectedOption = document.querySelector(
        `input[name=question_${index}]:checked`
      );
      return !selectedOption;
    });

    if (unansweredQuestions && unansweredQuestions.length > 0) {
      setErrorMessage("Please fill the form");
    } else {
      const answers = test?.questions.map((_, index) => {
        const selectedOption = document.querySelector(
          `input[name=question_${index}]:checked`
        ) as HTMLInputElement;
        return selectedOption?.value;
      });

      evaluateScore(url, answers).then((response) => {
        setScore(response);
        setSuccessMessage("Success");
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.test}>
          <div className={styles.testContainer}>
            {!test?.questions ? (
              <Loader startTop={true} />
            ) : (
              test?.questions && (
                <>
                  <div className={styles.headingsContainers}>
                    <h1 className={styles.headings}>{test?.title}</h1>
                  </div>
                  {test?.questions.map((question, index) => (
                    <div key={index} className={styles.questionContainer}>
                      <p>{question}</p>
                      <div className={styles.optionsContainer}>
                        <label className={styles.labels}>Yes</label>
                        <input
                          type="radio"
                          name={`question_${index}`}
                          value="yes"
                        />
                        <label className={styles.labels}>No</label>
                        <input
                          type="radio"
                          name={`question_${index}`}
                          value="no"
                        />
                      </div>
                    </div>
                  ))}
                  <div className={styles.buttonsContainers}>
                    <input
                      type="submit"
                      name="evaluate"
                      value="Evaluate"
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
                </>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TestPage;
