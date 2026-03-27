const getYoutubeId = (url) =>
  url?.match(/[?&]v=([^&]+)/)?.[1] ||
  url?.match(/youtu\.be\/([^?]+)/)?.[1] || null;

// attachments 배열에서 미디어(image/video/youtube) 첫 번째 항목을 렌더링
const EmbedPreview = ({ attachments = [] }) => {
  const media = attachments.find(a => 
    ['image', 'video', 'youtube'].includes(a.type) &&
    !a.url?.startsWith('/icons/category-')  // 플레이스홀더 제외
  );

  if (!media) {
    return (
      <div className="detail-hero-box">
        <span className="detail-hero-text">첨부된 미디어가 없습니다.</span>
      </div>
    );
  }

  if (media.type === 'image') {
  return (
    <div className="detail-hero-box">
      <img
        src={media.url}
        alt="결과물 이미지"
        style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-md)' }}
        onLoad={(e) => {
          const img = e.target;
          const ratio = img.naturalWidth / img.naturalHeight;
          if (ratio < 1) {
            // 세로 이미지 — 여백 있어도 전체 보여줌
            img.style.objectFit = 'contain';
          } else {
            // 가로 이미지 — 꽉 채움
            img.style.objectFit = 'cover';
          }
        }}
      />
    </div>
  );
}

  if (media.type === 'video') {
    return (
      <div className="detail-hero-box">
        <video
          src={media.url}
          controls
          style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
        />
      </div>
    );
  }

  if (media.type === 'youtube') {
    const videoId = getYoutubeId(media.url);
    if (!videoId) return null;
    return (
      <div className="detail-hero-box" >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 'var(--radius-md)' }}
          allowFullScreen
        />
    </div>
    );
  }

  return null;
};

export default EmbedPreview;