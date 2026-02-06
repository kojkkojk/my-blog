// src/pages/PostEditorPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../firebase';
import {
  cardStyle,
  inputStyle,
  buttonStyle,
  linkStyle,
  titleStyle,
  tagContainerStyle,
  tagStyle,
  tagInputStyle,
  selectStyle,
} from '../styles';

// [NEW] 썬 에디터 불러오기
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // 스타일 파일

function PostEditorPage({ isEdit = false, categories = [] }) {
  const safeCategories = categories.length > 0 ? categories : ['일반'];
  const [category, setCategory] = useState(safeCategories[0]);

  // 에디터 내용 관리
  const [content, setContent] = useState('');

  // 제목, 태그 등
  const [title, setTitle] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [uploading, setUploading] = useState(false);

  // 이미지 관리를 위한 임시 저장소 (업로드된 이미지 URL들)
  const editorImageUrls = useRef([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit && id) {
      const getPost = async () => {
        const docSnap = await getDoc(doc(db, 'posts', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setContent(data.content || '');
          if (data.tags) setTags(data.tags);
          if (data.category) setCategory(data.category);
          // 기존 이미지들도 추적
          if (data.imageUrls) editorImageUrls.current = data.imageUrls;
        }
      };
      getPost();
    }
  }, [isEdit, id]);

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  // [중요] 썬 에디터용 이미지 업로드 처리 함수
  const handleImageUploadBefore = (files, info, uploadHandler) => {
    // 1. 파이어베이스에 업로드 시작
    const file = files[0];
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        // 2. 업로드 성공하면 다운로드 URL 받기
        return getDownloadURL(snapshot.ref);
      })
      .then((url) => {
        // 3. 에디터에 "이 주소로 이미지를 보여줘"라고 전달
        const response = {
          result: [
            {
              url: url,
              name: file.name,
              size: file.size,
            },
          ],
        };
        editorImageUrls.current.push(url); // 나중에 저장할 때 쓰려고 모아둠
        uploadHandler(response);
      })
      .catch((error) => {
        console.error('이미지 업로드 실패:', error);
        uploadHandler('오류 발생');
      });

    return undefined; // 기본 동작 막기
  };

  const handleSave = async () => {
    if (!title) return alert('제목을 입력해주세요.');
    if (!content || content === '<p><br></p>')
      return alert('내용을 입력해주세요.');

    setUploading(true);
    try {
      // 본문에 실제로 남아있는 이미지만 골라내기 (지운 이미지는 제외)
      const finalImageUrls = editorImageUrls.current.filter((url) =>
        content.includes(url),
      );

      const postData = {
        category,
        title,
        content,
        tags,
        imageUrls: finalImageUrls,
      };

      if (isEdit) await updateDoc(doc(db, 'posts', id), postData);
      else
        await addDoc(collection(db, 'posts'), {
          ...postData,
          createdAt: new Date(),
        });

      navigate('/');
    } catch (error) {
      console.error(error);
      alert('에러 발생');
    }
    setUploading(false);
  };

  return (
    <div>
      <h1 style={titleStyle}>{isEdit ? '✏️ 글 수정하기' : '📝 새 글 쓰기'}</h1>
      <Link to="/" style={linkStyle}>
        &larr; 돌아가기
      </Link>
      <div style={cardStyle}>
        <label
          style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
        >
          게시판 선택
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={selectStyle}
        >
          {safeCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        {/* 썬 에디터 영역 */}
        <div style={{ marginBottom: '20px' }}>
          <SunEditor
            setContents={content}
            onChange={setContent}
            onImageUploadBefore={handleImageUploadBefore} // 이미지 업로드 핸들러 연결
            height="400px"
            placeholder="내용을 작성하세요. 사진이나 동영상을 드래그하거나 버튼을 눌러 넣을 수 있습니다."
            setOptions={{
              buttonList: [
                ['undo', 'redo'],
                ['font', 'fontSize', 'formatBlock'],
                [
                  'bold',
                  'underline',
                  'italic',
                  'strike',
                  'subscript',
                  'superscript',
                ],
                ['fontColor', 'hiliteColor', 'textStyle'],
                ['removeFormat'],
                ['outdent', 'indent'],
                ['align', 'horizontalRule', 'list', 'lineHeight'],
                ['table', 'link', 'image', 'video'], // [VIDEO 버튼이 여기 있습니다]
                ['fullScreen', 'showBlocks', 'codeView'],
              ],
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="태그 입력 후 Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            style={tagInputStyle}
          />
          <div style={tagContainerStyle}>
            {tags.map((tag, idx) => (
              <span key={idx} style={tagStyle}>
                #{tag}{' '}
                <span
                  onClick={() => removeTag(tag)}
                  style={{
                    marginLeft: '5px',
                    cursor: 'pointer',
                    color: '#bbb',
                  }}
                >
                  ×
                </span>
              </span>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={uploading} style={buttonStyle}>
          {uploading ? '저장 중...' : '글 올리기'}
        </button>
      </div>
    </div>
  );
}
export default PostEditorPage;
