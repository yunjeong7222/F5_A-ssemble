import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../config/supabase';
import '../styles/auth.css';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const signupData = location.state;

  // state 없으면 (직접 URL 접근 등) 회원가입으로 리다이렉트
  useEffect(() => {
    if (!signupData) navigate('/signup', { replace: true });
  }, []);

  const defaultImg = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  const [profileImg, setProfileImg]     = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    let profileUrl = null;

    try {
      // 사진 선택한 경우에만 Supabase 업로드
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}_profile.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, selectedFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        profileUrl = data.publicUrl;
      }

      alert('🎉 회원가입이 완료되었습니다! 로그인 후 서비스를 이용해주세요.');

      // 로그인 페이지로 이동 — profile_url을 state로 전달
      // 로그인 성공 후 자동으로 DB에 저장됨
      navigate('/login', {
        state: { profileUrl },
        replace: true,
      });
    } catch (err) {
      console.error('에러 발생:', err);
      alert('프로필 사진 처리 중 오류가 발생했습니다.');
      navigate('/login', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!signupData) return null;

  return (
    <div className="auth-page">
      <div className="setup-step-bar">
        <div className="setup-step-item">
          <div className="setup-step-circle setup-step-circle--done">✓</div>
          <span className="setup-step-label setup-step-label--done">기본 정보</span>
        </div>
        <div className="setup-step-divider" />
        <div className="setup-step-item">
          <div className="setup-step-circle setup-step-circle--active">2</div>
          <span className="setup-step-label setup-step-label--active">프로필 설정</span>
        </div>
      </div>

      <div className="setup-complete-badge">
        <span className="setup-complete-badge-inner">✓ 기본 정보 입력 완료</span>
      </div>

      <h2 className="setup-title">프로필을 꾸며보세요</h2>
      <p className="setup-subtitle">나중에 언제든지 변경할 수 있어요</p>

      {/* 아바타 업로드 */}
      <div className="setup-avatar-wrapper">
        <div className="setup-avatar-circle">
          <img src={profileImg || defaultImg} alt="Profile" className="setup-avatar-img" />
        </div>
      </div>

      <div className="setup-avatar-actions">
        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handlePhotoSelect}
          accept="image/*"
        />
        <button
          type="button"
          className="auth-btn-primary"
          style={{ width: 'auto', padding: '10px 20px' }}
          onClick={() => fileInputRef.current.click()}
        >
          사진 선택
        </button>
        <button
          type="button"
          className="auth-btn-outline"
          style={{ width: 'auto', padding: '10px 20px' }}
          onClick={() => {
            setProfileImg(null);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        >
          삭제
        </button>
      </div>

      <p className="setup-avatar-hint">JPG, PNG, WebP - 최대 5MB</p>

      {/* 가입 정보 확인 카드 */}
      <div className="setup-info-card">
        <p className="setup-info-card-title">가입 정보 확인</p>
        <div className="setup-info-row">
          <span className="setup-info-key">이메일</span>
          <span className="setup-info-value">{signupData.email}</span>
        </div>
        <div className="setup-info-row">
          <span className="setup-info-key">닉네임</span>
          <span className="setup-info-value">{signupData.nickname}</span>
        </div>
        <div className="setup-info-row">
          <span className="setup-info-key">마케팅 수신</span>
          <span className={`setup-info-value${signupData.marketingAgreed ? ' setup-info-value--ok' : ' setup-info-value--off'}`}>
            {signupData.marketingAgreed ? '✅ 동의' : '동의 안함'}
          </span>
        </div>
      </div>

      <button
        className="auth-btn-primary setup-submit-btn"
        onClick={handleComplete}
        disabled={isSubmitting}
      >
        {isSubmitting ? '처리 중...' : '🎉 가입 완료하기'}
      </button>

      <button className="auth-btn-outline" onClick={() => navigate(-1)}>
        ← 이전으로
      </button>

      <div className="auth-redirect">
        이미 계정이 있으신가요?
        <span className="auth-redirect-link" onClick={() => navigate('/login')}>
          로그인 →
        </span>
      </div>
    </div>
  );
};

export default ProfileSetup;
