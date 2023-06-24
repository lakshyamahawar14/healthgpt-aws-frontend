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

  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const url = new URLSearchParams(location.search).get("url");

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
      navigate(topPathsArray.loginPath, { replace: true });
    }
    const userId = localStorage.getItem("UserId");
    const accessToken = localStorage.getItem("AccessToken");

    if (userId || accessToken) {
      getScore(userId, accessToken, url).then((response) => {
        if (response && response[0].score === -1) {
          navigate(`/test?url=%2F${url?.slice(1)}`, {
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
          {!tasks ? (
            <Loader startTop={true} />
          ) : (
            <>
              <div className={styles.trackerTitle}>
                <p>
                  {url
                    ? url.slice(1).charAt(0).toUpperCase() + url.slice(2)
                    : ""}{" "}
                  Tracker
                </p>
              </div>
              <div className={styles.tasks}>
                {tasks?.map((task, index) => (
                  <div key={index} className={styles.taskcard}>
                    <p className={styles.title}>{task.title}</p>
                    <p className={styles.description}>{task.description}</p>
                    <label>
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => handleCheckboxChange(task.id)} // Pass the index to the event handler
                      />
                      Done
                    </label>
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
