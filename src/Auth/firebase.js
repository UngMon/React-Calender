// import firebase from 'firebase'
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD3f38a_fCedPe2MjO8USVLnaPN6cNmVtQ",
  authDomain: "react-9501f.firebaseapp.com",
  databaseURL: "https://react-9501f-default-rtdb.firebaseio.com",
  projectId: "react-9501f",
  storageBucket: "react-9501f.appspot.com",
  messagingSenderId: "543649062366",
  appId: "1:543649062366:web:6b3f41a5cdc73cabe7114f",
  measurementId: "G-C79LVDWX47"
};

const firebaseApp = initializeApp(firebaseConfig);
// firebase app 관련 코드

const auth = getAuth(firebaseApp);
// 기본 이메일 로그인을 위한 코드



// const db = firebaseApp.firestore()
// 데이터베이스 관련 코드

export {auth, firebaseApp}
// export default db
// 위에서 설정한 변수들을 export 하는 코드

//npm install -g firebase-tools