import React, { useRef, useEffect } from "react";
import TypingAnimation from "../../UI/TypingAnimation";
import styles from "../../styles/ChatbotSection.module.scss";
import { FaPhoneAlt, FaVideo } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BsFillSendFill } from "react-icons/bs";
import Loader from "./Loader";
const Chatbot = React.memo(
  ({
    onFormChange,
    onFormSubmit,
    onFormClear,
    onClose,
    data,
    chatbotWidth,
    chatbotHeight,
  }: PropsForm) => {
    const formRef: any = useRef();
    const userInputRef: any = useRef();
    const handleChange = (event: any) => {
      onFormChange(event.target.value);
    };
    const handleSubmit = (event: any) => {
      event.preventDefault();
      onFormSubmit(userInputRef.current.value);
      userInputRef.current.value = "";
    };
    const handleClose = () => {
      onClose();
    };

    const handleScroll = () => {
      const middleDiv = document.getElementById("middle");
      middleDiv?.scrollTo({
        top: middleDiv.scrollHeight,
        behavior: "smooth",
      });
    };

    useEffect(() => {
      handleScroll();
    }, [data]);

    useEffect(() => {
      const appElement = document.getElementById("chatbotapp");
      const loaderElement = document.getElementById("chatbotloader");
      const timer = setTimeout(() => {
        if (appElement) {
          appElement.style.opacity = "1";
          appElement.style.maxHeight = "none";
          appElement.style.overflow = "none";
        }
        if (loaderElement) {
          loaderElement.style.display = "none";
        }
      }, 1500);
      return () => clearTimeout(timer);
    }, []);

    const cell = data ? (
      data.map((item, index) => {
        const currentDate = new Date(item.date);
        const previousItem = data[index - 1];
        const previousDate = previousItem ? new Date(previousItem.date) : null;
        const showDate =
          currentDate.toDateString() !== previousDate?.toDateString();

        let formattedDate = "";

        if (showDate) {
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);

          if (currentDate.toDateString() === today.toDateString()) {
            formattedDate = "Today";
          } else if (currentDate.toDateString() === yesterday.toDateString()) {
            formattedDate = "Yesterday";
          } else {
            formattedDate = currentDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });
          }
        }

        return (
          <div key={item.key}>
            {showDate && (
              <div className={styles.dateContainer}>{formattedDate}</div>
            )}

            {item?.userInput?.length && item?.userInput?.length > 0 ? (
              <article className={styles.msgContainer}>
                <div className={styles.outgoing}>
                  <div className={styles.bubble}>{item.userInput}</div>
                </div>
              </article>
            ) : null}

            {item?.response?.length && item?.response?.length > 0 ? (
              <article className={styles.msgContainer}>
                <div className={styles.incoming}>
                  {item.response.split(/(\?|\.)/).map((segment, index) =>
                    segment.length > 1 ? (
                      <div key={index} className={styles.bubble}>
                        {segment}
                      </div>
                    ) : null
                  )}
                </div>
              </article>
            ) : data.indexOf(item) === data.length - 1 ? (
              <article className={styles.msgContainer}>
                <div className={styles.typing}>
                  <div className={styles.bubble}>
                    <TypingAnimation />
                  </div>
                </div>
              </article>
            ) : null}
          </div>
        );
      })
    ) : (
      <></>
    );

    return (
      <>
        <div id="chatbox" className={`${styles.chatbox} ${styles.modal}`}>
          <div id="chatbotloader">
            <Loader startTop={false} />
          </div>
          <div
            id="chatbotapp"
            style={{
              opacity: 0,
              maxHeight: 0,
              overflow: "hidden",
            }}
          >
            <div className={styles.topbar}>
              <div className={styles.avatar}></div>
              <div className={styles.name}>LUX</div>
              <div className={styles.icons}>
                <FaPhoneAlt className={styles.fas} />
                <FaVideo className={styles.fas} />
                <button className={styles.exitbutton} onClick={onClose}>
                  <IoMdClose className={` ${styles.cross} `} />
                </button>
              </div>
            </div>
            {/* top bar finish, Middle starts */}
            <div id="middle" className={styles.middle}>
              {/* <div className={styles.voldemort}> */}
              {cell}
              <div className={styles.bottomref}>
                <div className={styles.outgoing} ref={formRef}></div>
              </div>
              {/* </div> */}
            </div>
            <div className={`${styles.bottombar} ${styles.chatinput}`}>
              <form onSubmit={handleSubmit}>
                <div className={styles.chat}>
                  <input
                    type="text"
                    required
                    autoComplete="on"
                    placeholder="Type a message..."
                    ref={userInputRef}
                  />

                  <button type="submit">
                    <BsFillSendFill className={styles.fas} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
);
export interface Interaction {
  id: number;
  key: number;
  userInput: string;
  response: string;
  date: string;
}
interface PropsForm {
  onClose: any;
  onFormChange: any;
  onFormSubmit: any;
  onFormClear: any;
  data: Interaction[];
  chatbotWidth: any;
  chatbotHeight: any;
}

export default Chatbot;
