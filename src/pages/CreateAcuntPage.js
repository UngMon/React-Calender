import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";


const CreateAccount = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
  const createAccountHandler = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  return (
    <>
      <button onClick={createAccountHandler}></button>
    </>
  );
};

export default CreateAccount;
