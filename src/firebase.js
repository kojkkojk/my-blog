// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // 로그인 기능 추가

// [중요] 아래 내용을 파이어베이스 콘솔 -> 프로젝트 설정 -> 내 앱 -> SDK 설정 및 구성에서 복사해서 교체하세요.

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCGsNi5G4XefQjAwjunmWEnW_BLcl39ORA',
  authDomain: 'bblogs-2be1a.firebaseapp.com',
  projectId: 'bblogs-2be1a',
  storageBucket: 'bblogs-2be1a.firebasestorage.app',
  messagingSenderId: '660254522535',
  appId: '1:660254522535:web:ff7de8a874d4cbf3596f82',
  measurementId: 'G-KE7Q2RQG74',
};

// 파이어베이스 초기화
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app); // 내보내기
