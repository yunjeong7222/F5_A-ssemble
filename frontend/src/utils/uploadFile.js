import supabase from '../config/supabase';

const extractVideoThumbnail = (videoFile) =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(videoFile);
    video.src = url;
    video.muted = true;

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(1, video.duration * 0.1);
    });

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

const uploadToSupabase = async (file, folder = 'posts') => {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from('community')
    .upload(filePath, file);

  if (error) throw new Error('업로드 실패: ' + error.message);

  const { data } = supabase.storage.from('community').getPublicUrl(filePath);
  return data.publicUrl;
};

export const uploadFile = async (file) => {
  const isVideo = file.type.startsWith('video/');

  if (isVideo) {
    // 영상 원본 + 썸네일 둘 다 업로드
    const [videoUrl, thumbnailFile] = await Promise.all([
      uploadToSupabase(file),
      extractVideoThumbnail(file),
    ]);
    const thumbnailUrl = await uploadToSupabase(thumbnailFile, 'thumbnails');

    return { type: 'video', url: videoUrl, thumbnailUrl };
  }

  // 이미지는 그대로
  const url = await uploadToSupabase(file);
  return { type: 'image', url, thumbnailUrl: null };
};