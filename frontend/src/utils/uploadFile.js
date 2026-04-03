import supabase from '../config/supabase';

const extractVideoThumbnail = (videoFile) =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(videoFile);
    video.src = url;
    video.muted = true;
    video.currentTime = 1;

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        resolve(new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.85);
    });

    video.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('영상 로드 실패'));
    });

    video.load();
  });

export const uploadFile = async (file) => {
  const isVideo = file.type.startsWith('video/');
  const uploadTarget = isVideo ? await extractVideoThumbnail(file) : file;

  const ext = uploadTarget.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `posts/${fileName}`;

  const { error } = await supabase.storage
    .from('community')
    .upload(filePath, uploadTarget);

  if (error) throw new Error('파일 업로드 실패: ' + error.message);

  const { data } = supabase.storage
    .from('community')
    .getPublicUrl(filePath);

  // 영상이었어도 이미지로 변환됐으니 'image' 반환
  return { url: data.publicUrl, type: 'image' };
};