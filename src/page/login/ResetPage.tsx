import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthForm } from "@/hooks/useAuthForm";
import styles from "./ResetPage.module.css";

const ResetPage = () => {
  const navigate = useNavigate();

  // 이메일 state
  const { sendResetEmail } = useAuth();
  const { email, emailMessage, isEmail, onChangeEmail } = useAuthForm(false);

  const handleResetPassword = async () => {
    if (!isEmail) {
      alert("이메일을 제대로 입력해주세요!");
      return;
    }

    try {
      await sendResetEmail(email);
      alert("이메일 인증 링크를 보냈습니다!");
      navigate("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <section className={styles["reset-area"]}>
      <div className={styles["reset-box"]}>
        <div
          className={styles["back-page-button"]}
          onClick={() => navigate("/")}
        >
          {/* <FontAwesomeIcon icon={faArrowLeft} className={styles["arrow"]} /> */}
        </div>
        <div className={styles["reset-box-title"]}>
          <span>비밀번호 초기화</span>
        </div>
        <div className={styles["reset-box-ins"]}>
          <span>
            이메일을 인증을 완료하시면 패스워드가 변경됩니다. 아래 정확한
            이메일을 입력해주세요!
          </span>
        </div>
        <div className={styles["reset-form"]}>
          <div className={styles["reset-info-area"]}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="emial"
              placeholder="이메일"
              required
              value={email}
              onChange={onChangeEmail}
            />
            <p style={{ color: isEmail ? "lightgray" : "red" }}>
              {emailMessage}
            </p>
          </div>
        </div>
        <button
          type="button"
          className={styles.passwordChangeButton}
          onClick={handleResetPassword}
        >
          인증하기
        </button>
      </div>
    </section>
  );
};

export default ResetPage;
