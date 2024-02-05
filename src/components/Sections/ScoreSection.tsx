import axios from "axios";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/ScoreSection.module.scss";
import { useRecoilState } from "recoil";
import { LoggedInstate } from "../../config/atoms";
import { useEffect, useState } from "react";
import { topPathsArray } from "../../config/constant";
import Loader from "../Layouts/Loader";
import { Bar } from "react-chartjs-2";

const ScorePage = () => {
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const [score, setScore] = useState<
    { url: string; name: string; score: number }[]
  >([]);
  const location = useLocation();
  const url = new URLSearchParams(location.search).get("url") as string;
  const navigate = useNavigate();
  Chart.register(ArcElement);
  Chart.register(CategoryScale);
  Chart.register(LinearScale);
  Chart.register(BarElement);

  const getScore = async (userId: any, accessToken: any, url: any) => {
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
      if (isLoggedIn) {
        navigate(topPathsArray.homePath, { replace: true });
      } else {
        navigate(topPathsArray.loginPath, { replace: true });
      }
      return () => {};
    }

    const userId = localStorage.getItem("UserId");
    const accessToken = localStorage.getItem("AccessToken");
    getScore(userId, accessToken, url).then((score) => {
      if (!score || (score && score[0].score === -1)) {
        navigate(`${topPathsArray.testPath}?url=${encodeURIComponent(url)}`, {
          replace: true,
        });
        return () => {};
      }
      setScore(score);
    });
  }, []);

  const chartData = {
    labels: [...score.map((s) => s.name), "Others"],
    datasets: [
      {
        data: [
          ...score.map((s) => s.score),
          100 - score.reduce((sum, s) => sum + s.score, 0),
        ],
        backgroundColor: [
          "rgba(255, 0, 0, 0.8)",
          "rgba(0, 255, 0, 0.8)",
          "rgba(0, 0, 255, 0.8)",
          "rgba(255, 255, 0, 0.8)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "#f5fb8d",
        anchor: "end",
        align: "start",
        font: {
          weight: "bold",
        },
        formatter: (value: any, context: any) => `${value}%`,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => `${value}%`,
          color: "#f5fb8d",
          font: {
            weight: "bold",
          },
        },
      },
      x: {
        ticks: {
          color: "#f5fb8d",
          font: {
            weight: "bold",
          },
        },
      },
    },
    tooltips: {
      enabled: true,
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const percentage = dataset.data[tooltipItem.index];
          const label = data.labels[tooltipItem.index];
          return `${label}: ${percentage}%`;
        },
      },
    },
  };

  const handleClick = () => {
    navigate(`${topPathsArray.trackerPath}?url=${encodeURIComponent(url)}`, {
      replace: true,
    });
  };

  return (
    <>
      <div className={styles.main}>
        {!score ? (
          <Loader startTop={false} />
        ) : (
          <>
            <div className={styles.scoreContainer}>
              <div className={styles.headingsContainers}>
                <h1 className={styles.headings}>
                  {url
                    ? url.slice(1).charAt(0).toUpperCase() + url.slice(2)
                    : ""}{" "}
                  Test Score
                </h1>
              </div>
              <div className={styles.chartContainer}>
                <Bar data={chartData} options={chartOptions} />
              </div>
              <div className={styles.buttonsContainers}>
                <input
                  type="submit"
                  name="tracker"
                  value="Tracker"
                  onClick={handleClick}
                  className={styles.buttons}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ScorePage;
