import { useState } from "react";
import StartImages from "@/feature/login/slide/SlideImages";
import styles from "./LoginPage.module.css";
import SocialLogin from "@/feature/login/social/SocialLogin";
import LoginWithEmail from "@/feature/login/email/LoginWithEmail";

const LoginPage = () => {
  return (
    <section className={styles["login-section"]}>
      <StartImages />
      <div className={styles["login__box"]}>
        <div className={styles.logo}>
          <span>Your Calender</span>
        </div>
        <LoginWithEmail />
        <SocialLogin />
      </div>
    </section>
  );
};

export default LoginPage;
