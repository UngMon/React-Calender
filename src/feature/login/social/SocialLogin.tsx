import { useAuth } from "@/hooks/useAuth";
import "./SocialLogin.css";

const SocialLogin = () => {
  console.log("SocialLogin");

  const loginWithSocial = useAuth().loginWithSocial;

  return (
    <div className="social-login">
      <div className="social-login__icons">
        <img
          onClick={() => loginWithSocial("google")}
          width="40"
          height="40"
          src="./images/Google.jpeg"
          alt="Google"
        />
        <img
          onClick={() => loginWithSocial("facebook")}
          width="35"
          height="35"
          src="./images/Facebook_Logo.png"
          alt="Facebook"
        />
      </div>
    </div>
  );
};

export default SocialLogin;
