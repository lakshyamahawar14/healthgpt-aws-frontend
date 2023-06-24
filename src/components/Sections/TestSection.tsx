import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../../styles/TestSection.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";
import { useRecoilState } from "recoil";
import { FirstLaunch, LoggedInstate } from "../../config/atoms";
import Loader from "../Layouts/Loader";
import Success from "../Layouts/Success";
import Error from "../Layouts/Error";

const TestPage = () => {
  const [firstLaunch, setFirstLaunch] = useRecoilState(FirstLaunch);
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();
  const url = new URLSearchParams(location.search).get("url");
  const navigate = useNavigate();

  const [test, setTest] = useState<{
    title: string;
    questions: Array<string>;
  }>();
  const [score, setScore] = useState([]);

  const getTest = async (path: any) => {
    try {
      const res = await axios.get(
        `http://13.235.81.90:7000/api/v1/assessment${path}`
      );
      return res.data.data.test;
    } catch (error) {
      console.log(error);
    }
  };

  const getScore = async (userId: any, accessToken: any, url: any) => {
    try {
      const res = await axios.get(
        `http://13.235.81.90:4000/api/v1/db/score?userId=${userId}&accessToken=${accessToken}&url=${url}`
      );
      const scoreType = url.slice(1) + "Score";
      return res.data.data[scoreType];
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
      getScore(userId, accessToken, url).then((response) => {
        if (response && response[0].score !== -1) {
          navigate(`score?url=%2F${url?.slice(1)}`, {
            replace: true,
          });
          return () => {};
        }
        getTest(url).then((res) => {
          setTest(res);
        });
      });
    }
  }, []);

  const evaluateScore = async (url: any, responses: any) => {
    try {
      let requestUrl = `http://13.235.81.90:7000/api/v1/assessment/evaluate`;
      if (url === "/general") {
        requestUrl = `http://13.235.81.90:7000/api/v1/assessment/general/evaluate`;
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
      const res = await axios.post(`http://13.235.81.90:4000/api/v1/db/score`, {
        userId: userId,
        accessToken: accessToken,
        url: url,
        score: score,
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
      navigate(`score?url=%2F${url?.slice(1)}`, {
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
                  <div className={styles.testTitle}>
                    <p>{test?.title}</p>
                  </div>
                  {test?.questions.map((question, index) => (
                    <div key={index} className={styles.questionContainer}>
                      <p>{question}</p>
                      <div className={styles.optionsContainer}>
                        <label>
                          <input
                            type="radio"
                            name={`question_${index}`}
                            value="yes"
                          />
                          Yes
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`question_${index}`}
                            value="no"
                          />
                          No
                        </label>
                      </div>
                    </div>
                  ))}
                  <div className={styles.button}>
                    <p>
                      <input
                        type="submit"
                        name="evaluate"
                        value="Evaluate"
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
