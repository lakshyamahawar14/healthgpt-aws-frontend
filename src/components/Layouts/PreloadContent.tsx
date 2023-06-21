import "../../styles/Loader.module.scss";
import "../../styles/AssessmentSection.module.scss";
import "../../styles/AuthSection.module.scss";
import "../../styles/BlogSection.module.scss";
import "../../styles/ChatbotSection.module.scss";
import "../../styles/Error.module.scss";
import "../../styles/Success.module.scss";
import "../../styles/MidSection.module.scss";
import "../../styles/Skipper.module.scss";
import "../../styles/Search.module.scss";
import "../../styles/AuthSection.module.scss";
import "../../styles/LoginSection.module.scss";
import "../../styles/SignupSection.module.scss";
import "../../styles/ScoreSection.module.scss";
import "../../styles/BlogSection.module.scss";
import "../../styles/HomeSection.module.scss";
import "../../styles/Header.module.scss";
import "../../styles/TestSection.module.scss";
import "../../styles/TypingAnimation.module.scss";
import { Img } from "react-image";
import AssessmentPage from "../Sections/AssessmentSection";
import { BlogPage } from "../Sections/BlogSection";

const images = [
  "src\\assets\\images\\luxlogobot.svg",
  "src\\assets\\images\\luxlogofinal.svg",
  "src\\assets\\images\\chatBotTheme.svg",
  "src\\assets\\images\\profile-1.jpg",
  "src\\assets\\images\\profile-2.jpg",
  "src\\assets\\images\\profile-3.jpg",
  "src\\assets\\images\\OurStoryIllustration.svg",
  "src\\assets\\images\\wave3.svg",
  "src\\assets\\images\\Github.svg",
  "src\\assets\\images\\Facebook.svg",
  "src\\assets\\images\\Instagram.svg",
];

function PreloadContent() {
  return (
    <>
      {images.map((image, index) => (
        <Img key={index} src={image} alt="" />
      ))}
      <AssessmentPage />
      <BlogPage />
    </>
  );
}

export default PreloadContent;
