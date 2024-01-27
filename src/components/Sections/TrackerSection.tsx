import { useRecoilState } from "recoil";
import styles from "../../styles/TrackerSection.module.scss";
import { LoggedInstate } from "../../config/atoms";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";
import axios from "axios";
import Loader from "../Layouts/Loader";

const TrackerPage = () => {
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const [tasks, setTasks] = useState<
    {
      id: number;
      title: string;
      description: string;
      done: boolean;
    }[]
  >();

  const navigate = useNavigate();
  const location = useLocation();
  const url = new URLSearchParams(location.search).get("url") as string;

  const getScore = async (userId: any, accessToken: any, url: string) => {
    try {
      const res = await axios.get(
        `http://13.235.81.90:4000/api/v1/db/score?userId=${userId}&accessToken=${accessToken}&url=${url}`
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

  const getTasks = async (userId: any, accessToken: any, url: any) => {
    try {
      const res = await axios.get(
        `http://13.235.81.90:7000/api/v1/assessment/tasks?userId=${userId}&accessToken=${accessToken}&url=${url}`
      );
      return res.data.data.tasks;
    } catch (error) {
      console.log(error);
    }
  };

  const updateTask = async (
    userId: any,
    accessToken: any,
    url: any,
    taskId: any,
    done: any
  ) => {
    try {
      const res = await axios.post(
        `http://13.235.81.90:7000/api/v1/assessment/tasks`,
        {
          userId: userId,
          accessToken: accessToken,
          url: url,
          taskId: taskId,
          done: done,
        }
      );
      return res.data.status;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !url) {
      if (isLoggedIn) {
        navigate(topPathsArray.homePath, { replace: true });
      } else {
        navigate(topPathsArray.loginPath, { replace: true });
      }
      return () => {};
    }
    const userId = localStorage.getItem("UserId");
    const accessToken = localStorage.getItem("AccessToken");

    if (userId || accessToken) {
      getScore(userId, accessToken, url).then((response) => {
        if (!response || (response && response[0].score === -1)) {
          navigate(`${topPathsArray.testPath}?url=%2F${url?.slice(1)}`, {
            replace: true,
          });
          return () => {};
        }
        getTasks(userId, accessToken, url).then((response) => {
          setTasks(response);
        });
      });
    }
  }, []);

  const handleCheckboxChange = (taskId: number) => {
    setTasks((prevTasks: any) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[taskId].done = !updatedTasks[taskId].done;
      const userId = localStorage.getItem("UserId");
      const accessToken = localStorage.getItem("AccessToken");
      const done = updatedTasks[taskId].done;
      updateTask(userId, accessToken, url, taskId, done);
      return updatedTasks;
    });
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.trackerContainer}>
          <div className={styles.headingsContainers}>
            <h1 className={styles.headings}>
              {url ? url.slice(1).charAt(0).toUpperCase() + url.slice(2) : ""}{" "}
              Tracker
            </h1>
          </div>
          {!tasks ? (
            <Loader startTop={true} />
          ) : (
            <>
              <div className={styles.tasks}>
                {tasks?.map((task, index) => (
                  <div key={index} className={styles.taskcard}>
                    <p className={styles.titles}>{task.title}</p>
                    <p className={styles.descriptions}>{task.description}</p>
                    <div className={styles.checkboxContainer}>
                      <label>Done</label>
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => handleCheckboxChange(task.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TrackerPage;
