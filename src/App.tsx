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
import { useResetRecoilState,useSetRecoilState } from "recoil";
import {
  LoggedInstate,
  blogs,
  numMessagesState,
  posts,
  tests,
} from "./config/atoms";
import Loader from "./components/Layouts/Loader";
import PostPage from "./components/Sections/PostSection";
import { useEffect } from "react";
import axios from "axios";
import ChatPage from "./components/Sections/ChatSection";

function App() {
  const setLoggedIn = useSetRecoilState(LoggedInstate);
  const resetMessages = useResetRecoilState(numMessagesState);
  const resetBlogs = useResetRecoilState(blogs);
  const resetTests = useResetRecoilState(tests);
  const resetPosts = useResetRecoilState(posts);

  useEffect(() => {
    const appElement = document.getElementById("mainapp");
    const loaderElement = document.getElementById("mainloader");
    const timer = setTimeout(() => {
      if (appElement) {
        appElement.style.opacity = "1";
        appElement.style.maxHeight = "none";
        appElement.style.overflow = "none";
      }
      if (loaderElement) {
        loaderElement.style.display = "none";
      }
      window.scrollTo(0, 0);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("UserId");
    const accessToken = localStorage.getItem("AccessToken");

    if (userId) {
      axios
        .get(
          `http://localhost:5000/api/v1/auth/login/verify?userId=${userId}&accessToken=${accessToken}`
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
    }
  }, [resetBlogs, resetMessages, resetPosts, resetTests, setLoggedIn]);

  return (
    <>
      <div id="mainloader">
        <Loader startTop={false} />
      </div>
      <div
        id="mainapp"
        style={{
          opacity: 0,
          maxHeight: 0,
          overflow: "hidden",
        }}
      >
        <Header />
        <Routes>
          <Route path={topPathsArray.homePath} element={<HomePage />} />
          <Route path={topPathsArray.chatbotPath} element={<ChatPage />} />
          <Route
            path={topPathsArray.assessmentPath}
            element={<AssessmentPage />}
          />
          <Route path={topPathsArray.testPath} element={<TestPage />} />
          <Route path={topPathsArray.scorePath} element={<ScorePage />} />
          <Route path={topPathsArray.trackerPath} element={<TrackerPage />} />
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
  );
}

export default App;
