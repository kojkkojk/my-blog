// src/styles.js

// --- 기본 스타일 ---
export const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0',
  fontFamily: "'Helvetica Neue', sans-serif",
  backgroundColor: '#ffffff',
  minHeight: '100vh',
  color: '#333',
};
export const cardStyle = {
  background: '#ffffff',
  padding: '30px',
  borderRadius: '15px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0',
};
export const inputStyle = {
  width: '100%',
  padding: '15px',
  fontSize: '16px',
  marginBottom: '15px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxSizing: 'border-box',
};
export const textareaStyle = {
  width: '100%',
  height: '200px',
  padding: '15px',
  fontSize: '16px',
  marginBottom: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxSizing: 'border-box',
  resize: 'none',
};
export const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
};
export const linkStyle = {
  textDecoration: 'none',
  color: '#666',
  fontSize: '14px',
  marginBottom: '10px',
  display: 'inline-block',
};
export const pageBtnStyle = {
  padding: '8px 14px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  background: 'white',
  cursor: 'pointer',
  fontSize: '14px',
};
export const deleteBtnStyle = {
  ...buttonStyle,
  width: 'auto',
  padding: '8px 20px',
  backgroundColor: '#ff4d4f',
  marginLeft: '10px',
};
export const titleStyle = {
  color: '#000000',
  textAlign: 'center',
  marginBottom: '30px',
  fontWeight: 'bold',
};
export const dateTextStyle = {
  fontSize: '13px',
  color: '#999',
  fontWeight: '400',
};

// --- [복구됨] 리스트형 보기 스타일 ---
export const listItemStyle = {
  background: '#ffffff',
  padding: '15px',
  borderRadius: '12px',
  border: '1px solid #eee',
  boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
  marginBottom: '15px',
};

// --- 태그/탭/필터 스타일 ---
export const tagContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '10px',
};
export const tagStyle = {
  backgroundColor: '#f0f2f5',
  color: '#666',
  padding: '4px 10px',
  borderRadius: '15px',
  fontSize: '12px',
  fontWeight: '500',
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
};
export const tagInputStyle = { ...inputStyle, marginBottom: '5px' };
export const tabContainerStyle = {
  display: 'flex',
  gap: '10px',
  marginBottom: '20px',
  borderBottom: '1px solid #eee',
  paddingBottom: '10px',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
};
export const tabButtonStyle = {
  padding: '8px 16px',
  borderRadius: '20px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};
export const selectStyle = {
  width: '100%',
  padding: '15px',
  fontSize: '16px',
  marginBottom: '15px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: 'white',
};
export const activeFilterTagStyle = {
  backgroundColor: '#e6f7ff',
  color: '#1890ff',
  border: '1px solid #1890ff',
  padding: '5px 10px',
  borderRadius: '5px',
  fontSize: '14px',
  display: 'inline-flex',
  alignItems: 'center',
  marginBottom: '20px',
  gap: '5px',
  cursor: 'pointer',
};
export const backButtonStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  backgroundColor: '#333',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '30px',
  fontWeight: 'bold',
  fontSize: '15px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  transition: '0.3s',
};

// --- 인스타그램 스타일 그리드 ---
export const instagramGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  marginTop: '20px',
};

export const instagramItemStyle = {
  position: 'relative',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: '#f0f0f0',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
};

export const instagramImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
};

// --- 레이아웃 스타일 ---
export const layoutHeaderStyle = {
  width: '100%',
  height: '300px',
  // [변경] backgroundImage는 이제 App.jsx에서 직접 넣으므로 여기서는 기본값만 둠
  backgroundColor: '#333',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 20px',
  boxSizing: 'border-box',
  position: 'relative',
};
export const headerOverlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  zIndex: 1,
};
export const headerContentStyle = {
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '10px',
};
export const layoutBodyStyle = {
  display: 'flex',
  minHeight: 'calc(100vh - 200px)',
};
export const layoutSidebarStyle = {
  width: '250px',
  backgroundColor: '#f8f9fa',
  padding: '30px 20px',
  borderRight: '1px solid #eee',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  flexShrink: 0,
};
export const layoutMainStyle = {
  flex: 1,
  padding: '40px',
  backgroundColor: '#fff',
  width: '100%',
  boxSizing: 'border-box',
};
export const menuLinkStyle = {
  display: 'block',
  padding: '12px 15px',
  textDecoration: 'none',
  color: '#333',
  borderRadius: '8px',
  fontSize: '15px',
  transition: 'background 0.2s',
  cursor: 'pointer',
};
