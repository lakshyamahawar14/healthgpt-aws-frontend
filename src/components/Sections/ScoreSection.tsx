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
import { FirstLaunch, LoggedInstate } from "../../config/atoms";
import { useEffect, useState } from "react";
import { topPathsArray } from "../../config/constant";
import Loader from "../Layouts/Loader";
import { Bar } from "react-chartjs-2";
import Header from "../Layouts/Header";

const ScorePage = () => {
  const [firstLaunch, setFirstLaunch] = useRecoilState(FirstLaunch);
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const [score, setScore] = useState<{ name: string; score: number }[]>([]);
  const location = useLocation();
  const url = new URLSearchParams(location.search).get("url");
  const navigate = useNavigate();
  Chart.register(ArcElement);
  Chart.register(CategoryScale);
  Chart.register(LinearScale);
  Chart.register(BarElement);

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
    getScore(userId, accessToken, url).then((score) => {
      setScore(score);
    });
  }, []);

  useEffect(() => {
    if (score.length === 0) {
      return () => {};
    }
  }, [score]);

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
        color: "black",
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
          color: "black",
          font: {
            weight: "bold",
          },
        },
      },
      x: {
        ticks: {
          color: "black",
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
    navigate(topPathsArray.trackerPath, { replace: true });
  };

  return (
    <>
      <div className={styles.main}>
        {!score ? (
          <Loader startTop={false} />
        ) : (
          <>
            <div className={styles.scoreContainer}>
              <div className={styles.scoreTitle}>
                <p>
                  {url
                    ? url.slice(1).charAt(0).toUpperCase() + url.slice(2)
                    : ""}{" "}
                  Test Score
                </p>
              </div>
              <div className={styles.chartContainer}>
                <Bar data={chartData} options={chartOptions} />
              </div>
              <div>
                <input
                  type="submit"
                  name="tracker"
                  value="Tracker"
                  onClick={handleClick}
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
