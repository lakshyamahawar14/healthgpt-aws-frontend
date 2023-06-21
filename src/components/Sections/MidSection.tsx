import styles from "../../styles/MidSection.module.scss";
import AccessIcon from "../../assets/icons/icon-access-anywhere";
import IconSecurity from "../../assets/icons/icon-security";
import CollabrationIcon from "../../assets/icons/icon-collaboration";
import AnyFileIcon from "../../assets/icons/icon-any-file";
import StayProdIllustration from "../../assets/images/OurStoryIllustration.svg";
import iconArrow from "../../assets/images/icon-arrow.svg";
import bgQuotes from "../../assets/images/bg-quotes.png";
import profile1 from "../../assets/images/profile-1.jpg";
import profile2 from "../../assets/images/profile-2.jpg";
import profile3 from "../../assets/images/profile-3.jpg";
import ChatBotAnimation from "../../UI/ChatBotAnimation";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { topPathsArray } from "../../config/constant";
import Header from "../Layouts/Header";
import Loader from "../Layouts/Loader";
import { LoggedInstate, FirstLaunch } from "../../config/atoms";
import { useRecoilState } from "recoil";
import PreloadContent from "../Layouts/PreloadContent";
import Footer from "../Layouts/Footer";

export const MidSection = (props: any) => {
  const [firstLaunch, setFirstLaunch] = useRecoilState(FirstLaunch);
  const [isLoggedIn, setLoggedIn] = useRecoilState(LoggedInstate);

  const navigate = useNavigate();

  const redirectToRegister = () => {
    navigate(topPathsArray.signupPath);
  };

  const [isLoading, setIsLoading] = useState(firstLaunch);

  useEffect(() => {
    if (!isLoading) {
      return () => {};
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      firstLaunch && setFirstLaunch(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <Loader startTop={false} />
          {firstLaunch && <PreloadContent />}
        </>
      ) : (
        <div id="midsection">
          <section className={styles.top}>
            <Header />
            <div className={styles.centered}>
              <ChatBotAnimation />
              <p> Mental Health Support For Everyone.</p>
              <button
                onClick={isLoggedIn ? props.onShowChat : redirectToRegister}
              >
                Chat with Lux
              </button>
            </div>
          </section>
          <section id={styles.blue}>
            <article className={styles.article1}>
              <div className={styles.blocks}>
                <div className={styles.img}>
                  <AccessIcon />
                </div>
                <span className={styles.bold}> Access anywhere</span>

                <p>
                  The ability to use a smartphone, tablet, or computer to access
                  Lux means you can use it anywhere.
                </p>
              </div>
              <div id={styles.security} className={styles.blocks}>
                <div className={styles.img}>
                  {" "}
                  <IconSecurity />
                </div>
                <span className={styles.bold}> Security you can trust</span>

                <p>
                  {" "}
                  2-factor authentication and user-controlled encryption are
                  just a couple of the security features we allow to help secure
                  your files.
                </p>
              </div>
              <div className={styles.blocks}>
                <div className={styles.img}>
                  {" "}
                  <CollabrationIcon />
                </div>
                <span className={styles.bold}> Verified Experts</span>

                <p>
                  Masters or higher degree, solid practice experience & 2 step
                  background verification.
                </p>
              </div>
              <div className={styles.blocks}>
                <div className={styles.img}>
                  {" "}
                  <AnyFileIcon />
                </div>
                <span className={styles.bold}> Discussion Forum</span>

                <p>
                  Ask anything & initiate discussions with a community of
                  like-minded users and psychologists
                </p>
              </div>
            </article>
            <article className={styles.article2}>
              <div className={styles.block2}>
                {/* <div className={styles.illustration}> */}
                <img className={styles.img} src={StayProdIllustration} alt="" />
                {/* </div> */}
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
                <a href="">
                  {" "}
                  See how Lux works <img src={iconArrow} alt="" />
                </a>
              </div>
            </article>

            <article className={styles.article3}>
              <div className={styles.box1}>
                <img className={styles.quotes} src={bgQuotes} alt="" />
                <p>
                  We have long believed that mental well-being should be treated
                  as seriously as physical health. By accelerating our
                  relationship with Wysa, we are providing early mental
                  well-being support at scale and, through this, hope to
                  alleviate some of the pressure people are feeling during this
                  incredibly challenging time.
                </p>

                <span>
                  <img className={styles.pic} src={profile1} alt="" />
                  <p className={styles.p1}> Dr. Robert Morris</p>
                  <p className={styles.p2}>
                    Chief Technology Strategist, Ministry of Health
                    Transformation Office
                  </p>
                </span>
              </div>

              <div className={styles.box2}>
                <p>
                  We are often inundated with information when all we really
                  need is a chance to be listened to. Think of this as a
                  constant companion and trusted friend, who listens to us and
                  guides us through our challenges in a privacy-preserving &
                  non-judgmental manner. If needed, it will guide us on how to
                  reach out for help.
                </p>

                <span>
                  <img className={styles.pic} src={profile2} alt="" />
                  <p className={styles.p1}> Richard di Benedetto</p>
                  <p className={styles.p2}>President Aetna International</p>
                </span>
              </div>

              <div className={styles.box3}>
                <p>
                  These self-help techniques are important because anxiety is
                  common among the population. Unfortunately, anxiety often goes
                  undiagnosed, and then untreated for long periods of time, it
                  helps everyone build skills to manage their mental health in
                  the new normal.
                </p>

                <span>
                  {" "}
                  <img className={styles.pic} src={profile3} alt="" />
                  <p className={styles.p1}> Iva Boyd</p>
                  <p className={styles.p2}>Founder & CEO, Huddle</p>
                </span>
              </div>
            </article>
          </section>
          <Footer />
        </div>
      )}
    </>
  );
};
