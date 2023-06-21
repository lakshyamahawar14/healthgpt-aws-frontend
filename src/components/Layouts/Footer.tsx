import styles from "../../styles/Footer.module.scss";
import github from "../../assets/images/Github.svg";
import Instagram from "../../assets/images/Instagram.svg";
import Facebook from "../../assets/images/Facebook.svg";

const Footer = () => {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerColumn}>
            <h3>About Us</h3>
            <p>Indian Institute of Technology, Roorkee</p>
            <p>Uttarakhand-247667, India</p>
          </div>

          <div className={styles.footerColumn}>
            <h3>Contact</h3>
            <p>Phone: +91 1234567890</p>
            <p>Email: healthgpt@gmail.com</p>
          </div>

          <div className={styles.footerColumn}>
            <h3>Follow Us</h3>
            <div className={styles.socialIcons}>
              <a href="#">
                <img src={github} alt="Facebook" />
              </a>
              <a href="#">
                <img src={Instagram} alt="Twitter" />
              </a>
              <a href="#">
                <img src={Facebook} alt="Instagram" />
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
