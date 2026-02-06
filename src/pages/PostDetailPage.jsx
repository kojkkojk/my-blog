// src/pages/PostDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  cardStyle,
  buttonStyle,
  deleteBtnStyle,
  dateTextStyle,
  tagContainerStyle,
  tagStyle,
  backButtonStyle,
} from '../styles';

// [변경] SunEditor 스타일 불러오기
import 'suneditor/dist/css/suneditor.min.css';

function PostDetailPage({ user }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      const docSnap = await getDoc(doc(db, 'posts', id));
      if (docSnap.exists()) setPost({ id: docSnap.id, ...docSnap.data() });
    };
    getPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        navigate('/');
      } catch (error) {
        alert('오류 발생');
      }
    }
  };

  if (!post)
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>
    );

  // SunEditor는 본문 안에 이미지를 포함시키므로 별도의 imageList 렌더링이 굳이 필요 없지만,
  // 썸네일용으로 저장된 데이터를 위해 로직은 남겨둡니다. (화면엔 본문만 보여줌)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Link to="/" style={backButtonStyle}>
          &larr; 목록으로
        </Link>
        {user && (
          <div>
            <Link to={`/edit/${post.id}`}>
              <button
                style={{
                  ...buttonStyle,
                  width: 'auto',
                  padding: '8px 20px',
                  backgroundColor: '#6c757d',
                }}
              >
                수정
              </button>
            </Link>
            <button onClick={handleDelete} style={deleteBtnStyle}>
              삭제
            </button>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <span
          style={{ color: '#007bff', fontWeight: 'bold', fontSize: '14px' }}
        >
          [{post.category || '기타'}]
        </span>
        <h1
          style={{
            borderBottom: '2px solid #eee',
            paddingBottom: '10px',
            color: '#000',
            marginBottom: '5px',
          }}
        >
          {post.title}
        </h1>

        <div style={{ ...tagContainerStyle, marginBottom: '10px' }}>
          {post.tags &&
            post.tags.map((tag, idx) => (
              <span key={idx} style={tagStyle}>
                #{tag}
              </span>
            ))}
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <span style={dateTextStyle}>
            {post.createdAt
              ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
              : ''}
          </span>
        </div>

        {/* [중요] SunEditor 스타일 적용 클래스 추가 (sun-editor-editable) */}
        <div
          className="sun-editor-editable"
          style={{
            padding: 0,
            marginTop: '20px',
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#444',
            fontFamily: 'inherit',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
export default PostDetailPage;
