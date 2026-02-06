// src/pages/CategoryManagerPage.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  inputStyle,
  buttonStyle,
  deleteBtnStyle,
  linkStyle,
  titleStyle,
} from '../styles';
import { Link } from 'react-router-dom';

function CategoryManagerPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  // [NEW] 헤더 이미지 주소 관리
  const [headerUrl, setHeaderUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'settings', 'config');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.categoryList) setCategories(data.categoryList);
        // 저장된 헤더 이미지가 있으면 불러오기
        if (data.headerImage) setHeaderUrl(data.headerImage);
      } else {
        const defaultCats = ['일반', '여행', '개발', '기타'];
        setCategories(defaultCats);
        await setDoc(docRef, { categoryList: defaultCats });
      }
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim()))
      return alert('이미 있는 게시판입니다.');
    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    setNewCategory('');
    await updateDoc(doc(db, 'settings', 'config'), { categoryList: updated });
  };

  const handleDelete = (target) => {
    if (window.confirm(`'${target}' 게시판을 정말 삭제하시겠습니까?`)) {
      const updated = categories.filter((c) => c !== target);
      setCategories(updated);
      updateDoc(doc(db, 'settings', 'config'), { categoryList: updated });
    }
  };

  // [NEW] 헤더 이미지 저장 함수
  const handleSaveHeader = async () => {
    await updateDoc(doc(db, 'settings', 'config'), { headerImage: headerUrl });
    alert('헤더 이미지가 변경되었습니다!');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={titleStyle}>⚙️ 블로그 설정</h1>
      <Link to="/" style={linkStyle}>
        &larr; 홈으로 돌아가기
      </Link>

      {/* 1. 헤더 이미지 설정 구역 */}
      <div
        style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '40px',
          border: '1px solid #eee',
        }}
      >
        <h3 style={{ marginTop: 0 }}>🖼️ 헤더 배경 이미지 변경</h3>
        <p style={{ fontSize: '14px', color: '#666' }}>
          인터넷 이미지 주소(URL)를 입력하세요.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="https://..."
            value={headerUrl}
            onChange={(e) => setHeaderUrl(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0 }}
          />
          <button
            onClick={handleSaveHeader}
            style={{
              ...buttonStyle,
              width: '100px',
              backgroundColor: '#28a745',
            }}
          >
            저장
          </button>
        </div>
      </div>

      {/* 2. 게시판 메뉴 관리 구역 */}
      <div
        style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #eee',
        }}
      >
        <h3 style={{ marginTop: 0 }}>📂 게시판 메뉴 관리</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="새 게시판 이름"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0 }}
          />
          <button
            onClick={handleAdd}
            style={{ ...buttonStyle, width: '100px' }}
          >
            추가
          </button>
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {categories.map((cat, idx) => (
            <li
              key={idx}
              style={{
                background: 'white',
                border: '1px solid #eee',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>{cat}</span>
              <button
                onClick={() => handleDelete(cat)}
                style={{
                  ...deleteBtnStyle,
                  padding: '5px 10px',
                  fontSize: '12px',
                }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CategoryManagerPage;
