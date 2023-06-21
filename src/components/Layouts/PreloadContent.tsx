import { useEffect } from "react";
// import "../../styles/Loader.module.scss";
// import "../../styles/Header.module.scss";
// import "../../styles/MidSection.module.scss";
// import "../../styles/AssessmentSection.module.scss";
// import "../../styles/BlogSection.module.scss";
// import "../../styles/AuthSection.module.scss";
// import "../../styles/LoginSection.module.scss";
// import "../../styles/SignupSection.module.scss";
// import "../../styles/ChatbotSection.module.scss";

// import "../../assets/images/luxlogobot.svg";
// import "../../assets/images/luxlogofinal.svg";
// import "../../assets/images/OurStoryIllustration.svg";

// const styles = [
//   // "../../styles/Loader.module.scss",
//   // "../../styles/Header.module.scss",
//   // "../../styles/MidSection.module.scss",
//   // "../../styles/AssessmentSection.module.scss",
//   // "../../styles/BlogSection.module.scss",
//   // "../../styles/AuthSection.module.scss",
//   // "../../styles/LoginSection.module.scss",
//   // "../../styles/SignupSection.module.scss",
//   // "../../styles/ChatbotSection.module.scss",
// ];

// const images = [
//   "src\\assets\\images\\luxlogobot.svg",
//   "src\\assets\\images\\luxlogofinal.svg",
//   "src\\assets\\images\\chatBotTheme.svg",
//   "src\\assets\\images\\profile-1.jpg",
//   "src\\assets\\images\\profile-2.jpg",
//   "src\\assets\\images\\profile-3.jpg",
//   "src\\assets\\images\\OurStoryIllustration.svg",
//   "src\\assets\\images\\Github.svg",
//   "src\\assets\\images\\Facebook.svg",
//   "src\\assets\\images\\Instagram.svg",
// ];

function PreloadContent() {
  useEffect(() => {
    // styles.forEach((style) => {
    //   const link = document.createElement("link");
    //   link.rel = "stylesheet";
    //   link.href = style;
    //   document.head.appendChild(link);
    // });
    // images.forEach((image) => {
    //   const img = new Image();
    //   img.src = image;
    // });
  }, []);

  return null;
}

export default PreloadContent;
