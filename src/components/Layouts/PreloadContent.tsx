import { useEffect } from "react";

const styles = [
  "../../styles/Loader.module.scss",
  "../../styles/Header.module.scss",
  "../../styles/MidSection.module.scss",
  "../../styles/AssessmentSection.module.scss",
  "../../styles/BlogSection.module.scss",
  "../../styles/AuthSection.module.scss",
  "../../styles/LoginSection.module.scss",
  "../../styles/SignupSection.module.scss",
  "../../styles/ChatbotSection.module.scss",
];

const images = [
  "src/assets/images/luxlogobot.svg",
  "src/assets/images/luxlogofinal.svg",
  "src/assets/images/chatBotTheme.svg",
  "src/assets/images/OurStoryIllustration.svg",
];

function PreloadContent() {
  useEffect(() => {
    styles.forEach((style) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = style;
      document.head.appendChild(link);
    });

    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  return null;
}

export default PreloadContent;
