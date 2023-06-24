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
import { useRecoilState } from "recoil";
import { FirstLaunch } from "./config/atoms";
import Loader from "./components/Layouts/Loader";
import PreloadContent from "./components/Layouts/PreloadContent";
import PostPage from "./components/Sections/PostSection";

function App() {
  const [firstLaunch, setFirstLaunch] = useRecoilState(FirstLaunch);

  return (
    <>
      {firstLaunch ? (
        <>
          <Loader startTop={false} />
          <PreloadContent />
        </>
      ) : (
        <>
          <Header />
          <Routes>
            <Route path={topPathsArray.homePath} element={<HomePage />} />
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
        </>
      )}
    </>
  );
}

export default App;
