// src/App.jsx
import { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';

import ListPage from './pages/ListPage';
import LoginPage from './pages/LoginPage';
import PostDetailPage from './pages/PostDetailPage';
import PostEditorPage from './pages/PostEditorPage';
import CategoryManagerPage from './pages/CategoryManagerPage';

import {
  layoutHeaderStyle,
  layoutBodyStyle,
  layoutSidebarStyle,
  layoutMainStyle,
  menuLinkStyle,
  headerOverlayStyle,
  headerContentStyle,
} from './styles';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [categories, setCategories] = useState(['전체']);
  const [currentCategory, setCurrentCategory] = useState('전체');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubCat = onSnapshot(doc(db, 'settings', 'config'), (doc) => {
      if (doc.exists() && doc.data().categoryList) {
        setCategories(['전체', ...doc.data().categoryList]);
      } else {
        setCategories(['전체', '일반', '여행', '기타']);
      }
    });
    return () => unsubCat();
  }, []);

  if (loading) return null;

  const dynamicBodyStyle = {
    ...layoutBodyStyle,
    flexDirection: isMobile ? 'column' : 'row',
  };

  // [수정됨] 여기가 에러가 났던 부분입니다. 깔끔하게 고쳤습니다.
  const dynamicSidebarStyle = {
    ...layoutSidebarStyle,
    width: isMobile ? '100%' : '250px',
    // 모바일이면 오른쪽 선을 없애고 아래쪽에 선을 그음
    borderRight: isMobile ? 'none' : '1px solid #eee',
    borderBottom: isMobile ? '1px solid #eee' : 'none',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const dynamicMainStyle = {
    ...layoutMainStyle,
    padding: isMobile ? '20px' : '40px',
  };

  return (
    <BrowserRouter>
      <ScrollToTop />

      <header style={layoutHeaderStyle}>
        <div style={headerOverlayStyle}></div>
        <div style={headerContentStyle}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: 'white',
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            My Daily Blog
          </Link>
          <div>
            {user ? (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  관리자님
                </span>
                <button
                  onClick={() => signOut(auth)}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid white',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </header>

      <div style={dynamicBodyStyle}>
        <nav style={dynamicSidebarStyle}>
          {user && (
            <>
              <Link
                to="/upload"
                style={{
                  ...menuLinkStyle,
                  backgroundColor: '#28a745',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '10px',
                }}
              >
                + 새 글 쓰기
              </Link>
              <Link
                to="/category-manager"
                style={{
                  ...menuLinkStyle,
                  backgroundColor: '#6c757d',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '20px',
                  fontSize: '14px',
                }}
              >
                ⚙️ 메뉴 관리
              </Link>
            </>
          )}

          <div
            style={
              isMobile
                ? {
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '5px',
                    paddingBottom: '5px',
                  }
                : { display: 'flex', flexDirection: 'column', gap: '5px' }
            }
          >
            {categories.map((cat) => (
              <Link
                to="/"
                key={cat}
                onClick={() => setCurrentCategory(cat)}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    ...menuLinkStyle,
                    backgroundColor:
                      currentCategory === cat ? '#e9ecef' : 'transparent',
                    fontWeight: currentCategory === cat ? 'bold' : 'normal',
                    color: currentCategory === cat ? '#007bff' : '#333',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </div>
              </Link>
            ))}
          </div>
        </nav>

        <main style={dynamicMainStyle}>
          <Routes>
            <Route
              path="/"
              element={
                <ListPage user={user} currentCategory={currentCategory} />
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/post/:id" element={<PostDetailPage user={user} />} />
            <Route
              path="/my-secret-admin-entrance-99"
              element={<LoginPage />}
            />

            <Route
              path="/upload"
              element={
                user ? (
                  <PostEditorPage
                    categories={categories.filter((c) => c !== '전체')}
                  />
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route
              path="/edit/:id"
              element={
                user ? (
                  <PostEditorPage
                    isEdit={true}
                    categories={categories.filter((c) => c !== '전체')}
                  />
                ) : (
                  <LoginPage />
                )
              }
            />

            <Route
              path="/category-manager"
              element={user ? <CategoryManagerPage /> : <LoginPage />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
