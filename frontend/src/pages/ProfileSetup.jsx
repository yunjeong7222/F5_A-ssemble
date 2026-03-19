import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../config/supabase'; 
import { updateProfile } from '../api/users'; 

const ProfileSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const signupData = location.state || {
    email: '정보 없음',
    nickname: '연주',
    marketingAgreed: false
  };

  const [profileImg, setProfileImg] = useState(null); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultImg = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; 

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
    let finalImageUrl = null;

    try {
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}_profile.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars') 
          .upload(fileName, selectedFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        finalImageUrl = publicUrlData.publicUrl;
      }
      
      alert('🎉 회원가입이 완료되었습니다! 로그인 후 서비스를 이용해주세요.');
      navigate('/login');
    } catch (err) {
      console.error("에러 발생:", err);
      alert('프로필 사진 처리 중 오류가 발생했습니다.');
      navigate('/login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '40px auto', padding: '40px', backgroundColor: '#fff', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', textAlign: 'center' }}>
      
      {/* 상단 스텝 바 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#9c88ff', color: 'white', fontSize: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>✓</div>
          <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>기본 정보</span>
        </div>
        <div style={{ width: '30px', height: '1px', backgroundColor: '#e2e8f0' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #9c88ff', color: '#9c88ff', fontSize: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>2</div>
          <span style={{ fontSize: '10px', color: '#9c88ff', marginTop: '4px', fontWeight: 'bold' }}>프로필 설정</span>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <span style={{ backgroundColor: '#e1fce7', color: '#10b981', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>✓ 기본 정보 입력 완료</span>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>프로필을 꾸며보세요</h2>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '40px' }}>나중에 언제든지 변경할 수 있어요</p>

      {/* 이미지 업로드 부분 */}
      <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 30px' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid #f3f0ff', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
          <img src={profileImg || defaultImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
        <input type="file" hidden ref={fileInputRef} onChange={handlePhotoSelect} accept="image/*" />
        <button onClick={() => fileInputRef.current.click()} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#9c88ff', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>사진 선택</button>
        <button onClick={() => { setProfileImg(null); setSelectedFile(null); }} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: '14px' }}>삭제</button>
      </div>
      <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '40px' }}>JPG, PNG, WebP - 최대 5MB</p>

      {/* 가입 정보 확인 카드 */}
      <div style={{ backgroundColor: '#fcfdfe', padding: '24px', borderRadius: '20px', border: '1px solid #edf2f7', textAlign: 'left', marginBottom: '30px' }}>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>가입 정보 확인</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', color: '#64748b' }}>이메일</span>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{signupData.email}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', color: '#64748b' }}>닉네임</span>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{signupData.nickname}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', color: '#64748b' }}>마케팅 수신</span>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: signupData.marketingAgreed ? '#10b981' : '#94a3b8' }}>
            {signupData.marketingAgreed ? '✅ 동의' : '동의 안함'}
          </span>
        </div>
      </div>

      {/* ✅ 버튼 및 하단 링크 수정 부분 */}
      <button 
        onClick={handleComplete} 
        disabled={isSubmitting}
        style={{ 
          width: '100%', padding: '16px', borderRadius: '14px', border: 'none', 
          backgroundColor: isSubmitting ? '#cbd5e1' : '#9c88ff', 
          color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginBottom: '12px', 
          boxShadow: '0 8px 20px rgba(156, 136, 255, 0.2)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
        }}
      >
        {isSubmitting ? '처리 중...' : '🎉 가입 완료하기'}
      </button>

      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', 
          backgroundColor: 'white', color: '#64748b', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
        }}
      >
        ← 이전으로
      </button>

      <div style={{ marginTop: '24px', fontSize: '13px', color: '#64748b' }}>
        이미 계정이 있으신가요? {' '}
        <span 
          onClick={() => navigate('/login')} 
          style={{ color: '#9c88ff', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none' }}
        >
          로그인 →
        </span>
      </div>

    </div>
  );
};

export default ProfileSetup;