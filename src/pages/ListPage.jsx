// src/pages/ListPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import {
  pageBtnStyle,
  activeFilterTagStyle,
  instagramGridStyle,
  instagramItemStyle,
  instagramImageStyle,
} from '../styles';

function ListPage({ user, currentCategory }) {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(9);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = posts;
    if (currentCategory && currentCategory !== '전체')
      result = result.filter((post) => post.category === currentCategory);
    if (selectedTag)
      result = result.filter(
        (post) => post.tags && post.tags.includes(selectedTag),
      );
    setFilteredPosts(result);
    setCurrentPage(1);
  }, [posts, currentCategory, selectedTag]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // [강화된 썸네일 찾기 함수]
  const getThumbnailUrl = (post) => {
    // 1. 기존 방식: 별도로 저장된 이미지 목록(imageUrls)이 있으면 그걸 씀
    if (post.imageUrls && post.imageUrls.length > 0) return post.imageUrls[0];

    // 2. 예전 데이터 호환
    if (post.imageUrl) return post.imageUrl;

    // 3. [NEW] 본문 내용(HTML)을 뒤져서 첫 번째 이미지 태그의 주소(src)를 추출!
    // 정규표현식을 사용해 <img ... src="주소" ... > 패턴을 찾습니다.
    if (post.content) {
      const imgMatch = post.content.match(/src=["']([^"']+)["']/);
      if (imgMatch && imgMatch[1]) {
        return imgMatch[1]; // 찾아낸 이미지 주소 반환
      }
    }

    return null; // 진짜 아무것도 없으면 null (텍스트 카드 표시)
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #333',
          paddingBottom: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '24px' }}>
          {currentCategory}
          {selectedTag && (
            <span
              style={{ fontSize: '16px', color: '#007bff', marginLeft: '10px' }}
            >
              #{selectedTag}
            </span>
          )}
        </h2>

        <select
          value={postsPerPage}
          onChange={(e) => {
            setPostsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            cursor: 'pointer',
          }}
        >
          <option value={9}>9개씩 보기</option>
          <option value={18}>18개씩 보기</option>
          <option value={27}>27개씩 보기</option>
        </select>
      </div>

      {selectedTag && (
        <div style={activeFilterTagStyle} onClick={() => setSelectedTag(null)}>
          <span>
            🔍 '<strong>#{selectedTag}</strong>' 태그 검색 해제
          </span>
          <span>❌</span>
        </div>
      )}

      {currentPosts.length > 0 ? (
        <div style={instagramGridStyle}>
          {currentPosts.map((post) => {
            const thumb = getThumbnailUrl(post); // 강화된 함수 사용
            return (
              <Link
                to={`/post/${post.id}`}
                key={post.id}
                style={{ textDecoration: 'none' }}
              >
                <div style={instagramItemStyle}>
                  {thumb ? (
                    <img
                      src={thumb}
                      alt="thumb"
                      style={instagramImageStyle}
                      onMouseOver={(e) =>
                        (e.target.style.transform = 'scale(1.1)')
                      }
                      onMouseOut={(e) =>
                        (e.target.style.transform = 'scale(1.0)')
                      }
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#e9ecef',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px',
                        boxSizing: 'border-box',
                        color: '#495057',
                      }}
                    >
                      <span style={{ fontSize: '24px', marginBottom: '10px' }}>
                        📝
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {post.title}
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      fontSize: '12px',
                      padding: '5px',
                      textAlign: 'center',
                    }}
                  >
                    {post.title}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
          작성된 글이 없습니다.
        </div>
      )}

      <div
        style={{
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {totalPages > 1 &&
          Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                ...pageBtnStyle,
                backgroundColor: currentPage === i + 1 ? '#333' : 'white',
                color: currentPage === i + 1 ? 'white' : '#333',
              }}
            >
              {i + 1}
            </button>
          ))}
      </div>
    </div>
  );
}
export default ListPage;
