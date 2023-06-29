import { useNavigate } from "react-router-dom";
import styles from "../../styles/ChatSection.module.scss";
import { ChatbotPage } from "./ChatbotSection";
import { topPathsArray } from "../../config/constant";
import { useEffect } from "react";

const ChatPage = (props: any) => {
  const navigate = useNavigate();
  const handleBotClose = () => {
    navigate(topPathsArray.homePath, { replace: true });
  };

  useEffect(() => {
    const headerElement = document.getElementsByTagName("header")[0];
    if (headerElement) {
      headerElement.style.display = "none";
    }

    return () => {
      if (headerElement) {
        headerElement.style.display = "flex";
      }
    };
  }, []);

  return (
    <>
      <div className={styles.main}>
        <ChatbotPage onClose={handleBotClose} />
      </div>
    </>
  );
};

export default ChatPage;
