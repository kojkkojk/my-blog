// src/pages/CategoryManagerPage.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  containerStyle,
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

  // 1. 저장된 카테고리 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      const docRef = doc(db, 'settings', 'config'); // 'settings' 컬렉션의 'config' 문서 사용
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().categoryList) {
        setCategories(docSnap.data().categoryList);
      } else {
        // 처음이라 데이터가 없으면 기본값으로 세팅
        const defaultCats = ['일반', '여행', '개발', '기타'];
        setCategories(defaultCats);
        await setDoc(docRef, { categoryList: defaultCats });
      }
    };
    fetchCategories();
  }, []);

  // 2. 카테고리 추가
  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim()))
      return alert('이미 있는 게시판입니다.');

    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    setNewCategory('');

    // DB에 저장
    await updateDoc(doc(db, 'settings', 'config'), { categoryList: updated });
  };

  // 3. 카테고리 삭제
  const handleDelete = (target) => {
    if (window.confirm(`'${target}' 게시판을 정말 삭제하시겠습니까?`)) {
      const updated = categories.filter((c) => c !== target);
      setCategories(updated);
      updateDoc(doc(db, 'settings', 'config'), { categoryList: updated });
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={titleStyle}>📂 게시판 메뉴 관리</h1>
      <Link to="/" style={linkStyle}>
        &larr; 홈으로 돌아가기
      </Link>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="새 게시판 이름 (예: 맛집)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{ ...inputStyle, marginBottom: 0 }}
        />
        <button onClick={handleAdd} style={{ ...buttonStyle, width: '100px' }}>
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
  );
}

export default CategoryManagerPage;
