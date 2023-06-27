import styles from "../../styles/Footer.module.scss";
import { FcContacts } from "react-icons/fc";
import { MdLocationPin } from "react-icons/md";
import { RiUserFollowFill } from "react-icons/ri";
import {
  AiFillGithub,
  AiFillInstagram,
  AiFillTwitterCircle,
} from "react-icons/ai";

const Footer = () => {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerColumn}>
            <h3>
              <MdLocationPin />
              <span> About Us</span>
            </h3>
            <p>Indian Institute of Technology, Roorkee</p>
            <p>Uttarakhand-247667, India</p>
          </div>

          <div className={styles.footerColumn}>
            <h3>
              {" "}
              <FcContacts />
              <span> Contact Us</span>
            </h3>
            <p>Phone: +91 1234567890</p>
            <p>Email: healthgpt@gmail.com</p>
          </div>

          <div className={styles.footerColumn}>
            <h3>
              <RiUserFollowFill />
              <span> Follow Us</span>
            </h3>
            <div className={styles.socialIcons}>
              <a href="#">
                <AiFillGithub size={25} />
              </a>
              <a href="#">
                <AiFillTwitterCircle size={25} />
              </a>
              <a href="#">
                <AiFillInstagram size={25} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>
            &copy; {new Date().getFullYear()} HealthGPT. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
