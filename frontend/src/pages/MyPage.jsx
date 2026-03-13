import { useState } from 'react';
import { updateProfile } from '../api/users';
import supabase from '../config/supabase';
import useAuthStore from '../store/authStore';

export default function MyPage() {
  const { user, login, token } = useAuthStore();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleTest = async () => {
    try {
      let profile_url = null;

      if (file) {
        const ext = file.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${ext}`;

        const { error } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, { upsert: true });

        if (error) throw error;

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        profile_url = data.publicUrl;
      }

      const res = await updateProfile({ profile_url, bio: '테스트' });
      login(res.data.data, token);
      setMessage('성공! DB에 저장됐는지 확인해봐');
    } catch (err) {
      setMessage(err.message || '실패');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Supabase + DB 연동 테스트</h2>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleTest} style={{ marginLeft: 12 }}>업로드 테스트</button>
      {message && <p style={{ color: '#22c55e', marginTop: 12 }}>{message}</p>}
    </div>
  );
}