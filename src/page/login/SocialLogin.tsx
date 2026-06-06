import style from "./LoginPage.module.css";

interface SocialLoginProps {
  onSocialLogin: (provider: "google" | "facebook") => void;
}

const SocialLogin = ({ onSocialLogin }: SocialLoginProps) => (
  <div className={style["social-login-area"]}>
    <span>소셜 로그인</span>
    <div className={style["social-icons"]}>
      <img
        className={style["social-Logo"]}
        onClick={() => onSocialLogin("google")}
        width="40" height="40" src="./images/Google.jpeg" alt="Google"
      />
      <img
        className={style["social-Logo"]}
        onClick={() => onSocialLogin("facebook")}
        width="35" height="35" src="./images/Facebook_Logo.png" alt="Facebook"
      />
    </div>
  </div>
);

export default SocialLogin;