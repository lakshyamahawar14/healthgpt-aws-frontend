import React, { useRef, useEffect } from "react";
import styles from "../../styles/ChatbotSection.module.scss";
import TypingAnimation from "../../UI/TypingAnimation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faVideo,
  faPaperPlane,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
const Chatbot = React.memo(
  ({ onFormChange, onFormSubmit, onFormClear, onClose, data }: PropsForm) => {
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
    const scrollToBottom = () => {
      formRef?.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [data]);

    const cell = data ? (
      data.map((item) => {
        return (
          <div key={item.key}>
            {item?.userInput?.length && item?.userInput?.length > 0 ? (
              <article className={styles.msgContainer}>
                <div className={styles.outgoing}>
                  <div className={styles.bubble}>{item.userInput}</div>
                </div>
              </article>
            ) : (
              <></>
            )}

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
            ) : (
              <></>
            )}
          </div>
        );
      })
    ) : (
      <></>
    );
    return (
      <>
        <div id="chatbox" className={`${styles.chatbox} ${styles.modal}`}>
          <div className={styles.topbar}>
            <div className={styles.avatar}></div>
            <div className={styles.name}>LUX</div>
            <div className={styles.icons}>
              <FontAwesomeIcon icon={faPhone} className={styles.fas} />
              <FontAwesomeIcon icon={faVideo} className={styles.fas} />
              <button className={styles.exitbutton} onClick={onClose}>
                <FontAwesomeIcon
                  icon={faTimes}
                  className={` ${styles.cross} `}
                />
              </button>
            </div>
          </div>
          {/* top bar finish, Middle starts */}
          <div className={styles.middle}>
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
                  <FontAwesomeIcon icon={faPaperPlane} className={styles.fas} />
                </button>
              </div>
            </form>
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
}
interface PropsForm {
  onClose: any;
  onFormChange: any;
  onFormSubmit: any;
  onFormClear: any;
  data: Interaction[];
}

export default Chatbot;
