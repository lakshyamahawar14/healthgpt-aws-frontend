import styles from "../../styles/MidSection.module.scss";
import OurStoryIllustration from "../../assets/images/OurStoryIllustration.png";
// import profile1 from "../../assets/images/profile-1.jpg";
// import profile2 from "../../assets/images/profile-2.jpg";
// import profile3 from "../../assets/images/profile-3.jpg";
import ChatBotAnimation from "../../UI/ChatBotAnimation";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";
import { LoggedInstate } from "../../config/atoms";
import { useRecoilState } from "recoil";
import { MdSecurity, MdVerified, MdDevices } from "react-icons/md";
import { GoCommentDiscussion } from "react-icons/go";
import React from "react";

export const MidSection = React.memo((props: any) => {
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);

  const navigate = useNavigate();

  const redirectToRegister = () => {
    navigate(topPathsArray.loginPath, { replace: true });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div id="midsection">
        <section className={styles.main}>
          <div className={styles.centered}>
            <div className={styles.chatbotTheme}>
              <div className={styles.theme}>
                <ChatBotAnimation />
              </div>
            </div>

            {/* <ChatBotAnimation /> */}
            <h1 className={styles.mainheading}>
              {" "}
              Mental Health Support For Everyone.
            </h1>
            <div className={styles.buttonsContainers}>
              <button
                className={styles.buttons}
                onClick={
                  isLoggedIn
                    ? () => {
                        navigate(topPathsArray.chatbotPath, { replace: true });
                      }
                    : redirectToRegister
                }
              >
                Chat with Lux
              </button>
            </div>
          </div>
        </section>
        <section className={styles.blackBackground}>
          <article className={styles.article1}>
            <div className={styles.blocks}>
              <div className={styles.img}>
                <MdDevices size={100} />
              </div>
              <span className={styles.bold}> Access anywhere</span>

              <p>
                The ability to use a smartphone, tablet, or computer to access
                web application means you can use HealthGPT from any device.
              </p>
            </div>
            <div id={styles.security} className={styles.blocks}>
              <div className={styles.img}>
                {" "}
                <MdSecurity size={100} />
              </div>
              <span className={styles.bold}> Security you can trust</span>

              <p>
                {" "}
                We keep our users' data private and anonymous. 2-factor
                authentication and user-controlled encryptions are couple of
                security features.
              </p>
            </div>
            <div className={styles.blocks}>
              <div className={styles.img}>
                {" "}
                <MdVerified size={100} />
              </div>
              <span className={styles.bold}> Verified Experts</span>

              <p>
                Our psychologists and psychiatrists have Masters or higher
                degree and solid practice experience. Feel free to consult them
                about your mental health.
              </p>
            </div>
            <div className={styles.blocks}>
              <div className={styles.img}>
                {" "}
                <GoCommentDiscussion size={100} />
              </div>
              <span className={styles.bold}> Discussion Forum</span>

              <p>
                Ask anything & initiate discussions with a community of
                like-minded users. Take help from other users and provide help
                to other users.
              </p>
            </div>
          </article>
        </section>
        <section className={styles.blackBackground}>
          <article className={styles.article2}>
            <div className={`${styles.block2} ${styles.chatbotTheme}`}>
              {useMemo(
                () => (
                  <img
                    className={styles.img}
                    src={OurStoryIllustration}
                    alt={"our_story"}
                  />
                ),
                []
              )}
            </div>
            <div className={styles.block2}>
              {" "}
              <span>Our Story</span>
              <p>
                In an effort to make the world more mentally resilient, we
                developed Lux - an AI chatbot that leverages evidence-based
                cognitive-behavioral techniques (CBT) to make you feel heard.
                Blended with professional human support, Lux provides 24/7
                high-quality mental health support.
              </p>
              <a
                onClick={() =>
                  navigate(
                    `${topPathsArray.postPath}?url=NNlKQM0UeLNwBEhYRLobS9CQYuG21`
                  )
                }
              >
                {" "}
                See how Lux works
              </a>
            </div>
          </article>
        </section>
        {/* <section className={styles.blackBackground}>
          <article className={styles.article3}>
            <div className={`${styles.box1} ${styles.box}`}>
              <p>
                We have long believed that mental well-being should be treated
                as seriously as physical health. By accelerating our
                relationship with Wysa, we are providing early mental well-being
                support at scale and, through this, hope to alleviate some of
                the pressure people are feeling during this incredibly
                challenging time.
              </p>

              <span>
                <img className={styles.pic} src={profile1} alt="" />
                <p className={styles.p1}> Dr. Robert Morris</p>
                <p className={styles.p2}>
                  Chief Technology Strategist, Ministry of Health Transformation
                  Office
                </p>
              </span>
            </div>

            <div className={`${styles.box2} ${styles.box}`}>
              <p>
                We are often inundated with information when all we really need
                is a chance to be listened to. Think of this as a constant
                companion and trusted friend, who listens to us and guides us
                through our challenges in a privacy-preserving & non-judgmental
                manner. If needed, it will guide us on how to reach out for
                help.
              </p>

              <span>
                <img className={styles.pic} src={profile2} alt="" />
                <p className={styles.p1}> Richard di Benedetto</p>
                <p className={styles.p2}>President Aetna International</p>
              </span>
            </div>

            <div className={`${styles.box3} ${styles.box}`}>
              <p>
                These self-help techniques are important because anxiety is
                common among the population. Unfortunately, anxiety often goes
                undiagnosed, and then untreated for long periods of time, it
                helps everyone build skills to manage their mental health in the
                new normal.
              </p>

              <span>
                {" "}
                <img className={styles.pic} src={profile3} alt="" />
                <p className={styles.p1}> Iva Boyd</p>
                <p className={styles.p2}>Founder & CEO, Huddle</p>
              </span>
            </div>
          </article>
        </section> */}
      </div>
    </>
  );
});
