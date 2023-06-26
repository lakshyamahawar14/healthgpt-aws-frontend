import { HomePage } from "./components/Sections/HomeSection";
import { AuthPage } from "./components/Sections/AuthSection";
import { BlogPage } from "./components/Sections/BlogSection";
import { topPathsArray } from "./config/constant";
import { Route, Routes } from "react-router-dom";
import AssessmentPage from "./components/Sections/AssessmentSection";
import TestPage from "./components/Sections/TestSection";
import ScorePage from "./components/Sections/ScoreSection";
import TrackerPage from "./components/Sections/TrackerSection";
import "./styles/_scrollbar.scss";
import ForumPage from "./components/Sections/ForumSection";
import Header from "./components/Layouts/Header";
import { useRecoilState, useResetRecoilState } from "recoil";
import {
  LoggedInstate,
  blogs,
  numMessagesState,
  posts,
  tests,
} from "./config/atoms";
import Loader from "./components/Layouts/Loader";
import PostPage from "./components/Sections/PostSection";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);
  const resetMessages = useResetRecoilState(numMessagesState);
  const resetBlogs = useResetRecoilState(blogs);
  const resetTests = useResetRecoilState(tests);
  const resetPosts = useResetRecoilState(posts);

  useEffect(() => {
    const userId = localStorage.getItem("UserId");
    const accessToken = localStorage.getItem("AccessToken");

    if (userId) {
      axios
        .get(
          `http://13.235.81.90:5000/api/v1/auth/login/verify?userId=${userId}&accessToken=${accessToken}`
        )
        .then((response) => {
          if (response.data.status === "failure") {
            alert("You have been Logged-Out. Please Login Again");
            localStorage.setItem("UserId", "");
            localStorage.setItem("AccessToken", "");
            localStorage.setItem("IsLoggedIn", "false");
            localStorage.setItem("UserName", "");
            setLoggedIn(false);
            resetMessages();
            resetBlogs();
            resetTests();
            resetPosts();
          }
        });

      const timer = setTimeout(() => {
        setShowLoader(false);
        const appElement = document.getElementById("app");
        if (appElement) {
          appElement.style.opacity = "1";
        }
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowLoader(false);
        const appElement = document.getElementById("app");
        if (appElement) {
          appElement.style.opacity = "1";
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {showLoader ? (
        <>
          <Loader startTop={false} />
        </>
      ) : (
        <>
          <div id="app" style={{ opacity: 0 }}>
            <Header />
            <Routes>
              <Route path={topPathsArray.homePath} element={<HomePage />} />
              <Route
                path={topPathsArray.assessmentPath}
                element={<AssessmentPage />}
              />
              <Route path={topPathsArray.testPath} element={<TestPage />} />
              <Route path={topPathsArray.scorePath} element={<ScorePage />} />
              <Route
                path={topPathsArray.trackerPath}
                element={<TrackerPage />}
              />
              <Route path={topPathsArray.blogPath} element={<BlogPage />} />
              <Route path={topPathsArray.forumPath} element={<ForumPage />} />
              <Route path={topPathsArray.postPath} element={<PostPage />} />
              <Route
                path={topPathsArray.signupPath}
                element={<AuthPage signup={true} />}
              />
              <Route
                path={topPathsArray.loginPath}
                element={<AuthPage login={true} />}
              />
            </Routes>
          </div>
        </>
      )}
    </>
  );
}

export default App;
