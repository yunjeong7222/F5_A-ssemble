const getYoutubeId = (url) =>
  url?.match(/[?&]v=([^&]+)/)?.[1] ||
  url?.match(/youtu\.be\/([^?]+)/)?.[1] || null;

  const EmbedPreview = ({ attachments = [] }) => {
  const media =
    attachments.find(a => a.type === 'video') ||
    attachments.find(a => a.type === 'youtube') ||
    attachments.find(a => a.type === 'image' && !a.url?.startsWith('/icons/category-'));

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
            img.style.objectFit = ratio < 1 ? 'contain' : 'cover';
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
      <div className="detail-hero-box">
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
