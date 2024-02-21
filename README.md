Your Calender
=============

## Your Calender v1.44

Typescript, React로 구현한 반응형 Web Calender Application 입니다. 계정 가입을 통하여 사용자의 일정을 관리할 수 있습니다.

## 

## 프로젝트 구조



### 시작 가이드

## Installation

<pre>
<code>
1. git clone https://github.com/UngMon/React-Calender.git 
2. npm install
</code>
</pre>

## 기술 스택

Language
<div style={{display: flex}}>
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/tyoescript-3178C6?style=for-the-badge&logo=react&logoColor=black">
</div>

Library
<div style={{display: flex}}>
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=react&logoColor=black">
</div>

Database
<img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=react&logoColor=black">

## 추가 사항 

1. firebase Auth2.0 기능을 사용하기 위해 https://console.firebase.google.com/ 해당 링크로 접속합니다.
2. irebase 사이트에 로그인을 합니다.
3. 프로젝트 추가 버튼을 누르고 좌측 상단에 웹 앱 추가 버튼을 클릭합니다.
4. 이후 화면에 보이는 설치 가이드를 따라갑니다.
5. Firebase SDK 추가 페이지에서 프로젝트 auth 폴더의 firebase.js에 해당 key를 기입해주시면 됩니다.

## 기능 소개

* 로그인 기능, 비밀번호 재설정
= 이 프로젝트는 파이어베이스 OAuth2.0로 firebase 자체 회원가입, 소셜 로그인 기능이 구현 됐습니다. 자체 회원가입에서는 비밀번호 찾기 기능이 있습니다.
  사용자의 이메일에 비밀번호 재설정 메일을 발송합니다. 이메일을 확인하고 비밀번호를 재설정 할 수 있습니다.

* 일정 추가
= 해당 날짜를 클릭하면 일정 입력 모달이 등장합니다. 사용자가 생각하는 날짜와 시간 선택하여 일정을 자유롭게 생성할 수 있습니다. 또한 컬러를 선택하여 사용자의 취향대로 자유롭게 일정을 구분할 수 있습니다.

* 월(Month) 이동
= '<', '>'를 클릭하여 월을 이동할 수 있습니다. 마지막으로 마우스 휠을 움직이면 방향에 따라서 월을 이동할 수 있습니다.

* 드래그(Dragg)
= 사용자가 마우스를 클릭하고 움직이면 일정이 생성됩니다.

* 검색
= 일정의 제목을 입력하면 사용자의 일정을 탐색하여 

* 공휴일
= 한국천문연구원의 국경일 API를 사용하여 사용자에게 국경일, 공휴일 정보를 제공합니다.


