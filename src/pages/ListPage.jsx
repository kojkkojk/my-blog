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
  listItemStyle,
  dateTextStyle,
  tagContainerStyle,
  tagStyle, // [NEW] 리스트 스타일 복구
} from '../styles';

function ListPage({ user, currentCategory }) {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(9);

  // [NEW] 보기 방식 상태 (기본값: 'grid')
  const [viewMode, setViewMode] = useState('grid');

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

  const getThumbnailUrl = (post) => {
    if (post.imageUrls && post.imageUrls.length > 0) return post.imageUrls[0];
    if (post.imageUrl) return post.imageUrl;
    if (post.content) {
      const imgMatch = post.content.match(/src=["']([^"']+)["']/);
      if (imgMatch && imgMatch[1]) return imgMatch[1];
    }
    return null;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}.`;
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

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* [NEW] 보기 방식 전환 버튼 */}
          <div
            style={{
              background: '#f8f9fa',
              padding: '5px',
              borderRadius: '5px',
              display: 'flex',
              gap: '5px',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              style={{
                border: 'none',
                background: viewMode === 'grid' ? '#333' : 'transparent',
                color: viewMode === 'grid' ? 'white' : '#888',
                cursor: 'pointer',
                borderRadius: '4px',
                padding: '5px 10px',
              }}
            >
              ▦ 바둑판
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                border: 'none',
                background: viewMode === 'list' ? '#333' : 'transparent',
                color: viewMode === 'list' ? 'white' : '#888',
                cursor: 'pointer',
                borderRadius: '4px',
                padding: '5px 10px',
              }}
            >
              ≡ 리스트
            </button>
          </div>

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
            <option value={9}>9개씩</option>
            <option value={15}>15개씩</option>
            <option value={30}>30개씩</option>
          </select>
        </div>
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
        <>
          {/* A. 그리드(바둑판) 보기 모드 */}
          {viewMode === 'grid' && (
            <div style={instagramGridStyle}>
              {currentPosts.map((post) => {
                const thumb = getThumbnailUrl(post);
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
                          <span
                            style={{ fontSize: '24px', marginBottom: '10px' }}
                          >
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
          )}

          {/* B. 리스트 보기 모드 */}
          {viewMode === 'list' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
            >
              {currentPosts.map((post) => {
                const thumb = getThumbnailUrl(post);
                return (
                  <div key={post.id} style={listItemStyle}>
                    <Link
                      to={`/post/${post.id}`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          marginRight: '20px',
                          flexShrink: 0,
                          backgroundColor: '#eee',
                        }}
                      >
                        {thumb ? (
                          <img
                            src={thumb}
                            alt="thumb"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '20px',
                            }}
                          >
                            📝
                          </div>
                        )}
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#999',
                            marginBottom: '2px',
                            display: 'block',
                          }}
                        >
                          {post.category || '기타'}
                        </span>
                        <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                          {post.title}
                        </h3>
                        <span style={dateTextStyle}>
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </Link>
                    <div
                      style={{
                        marginLeft: '100px',
                        ...tagContainerStyle,
                        marginTop: '5px',
                      }}
                    >
                      {post.tags &&
                        post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              ...tagStyle,
                              fontSize: '11px',
                              padding: '2px 8px',
                              backgroundColor:
                                selectedTag === tag ? '#333' : '#f0f2f5',
                              color: selectedTag === tag ? 'white' : '#666',
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedTag(tag);
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
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
