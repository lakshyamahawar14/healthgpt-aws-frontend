import { MidSection } from "./MidSection";
import styles from "../../styles/HomeSection.module.scss";
import Footer from "../Layouts/Footer";
import React from "react";

export const HomePage = React.memo((props: any) => {
  return (
    <>
      <MidSection />
      <Footer />
    </>
  );
});
