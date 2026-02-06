// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// [수정] <React.StrictMode> 태그를 제거했습니다.
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
