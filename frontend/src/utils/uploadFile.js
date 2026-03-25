import supabase from '../config/supabase';

export const uploadFile = async (file) => {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `posts/${fileName}`;

  const { error } = await supabase.storage
    .from('community')
    .upload(filePath, file);

  if (error) throw new Error('파일 업로드 실패: ' + error.message);

  const { data } = supabase.storage
    .from('community')
    .getPublicUrl(filePath);

  return data.publicUrl;
};