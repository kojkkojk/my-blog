import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // 경로 주의 (../)
import { containerStyle, cardStyle, inputStyle, buttonStyle } from '../styles';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('관리자님 환영합니다!');
      navigate('/');
    } catch (error) {
      alert('로그인 실패');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center' }}>🔒 관리자 로그인</h2>
      <div style={{ ...cardStyle, maxWidth: '400px', margin: '20px auto' }}>
        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
export default LoginPage;
