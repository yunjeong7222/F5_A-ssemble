const CAT_COLORS = {
    '기획 및 스크립트': '#f59e0b',
    '영상 소스 생성': '#6366f1',
    '이미지 소스 생성': '#ec4899',
    '성우 / TTS': '#0ea5e9',
    BGM: '#10b981',
    '편집 / 숏폼 변환': '#ef4444',
    '업로드 최적화': '#f97316',
};

const ToolModal = ({tool, onClose}) => {
    if (!tool) return null;

    const cat = tool.categories?.[0];
    const catName = cat?.category_name || '';
    const desc = cat?.description || '';
    const prosList = cat?.pros
        ? String(cat.pros)
              .split(',')
              .map((s) => s.trim())
        : [];
    const consList = cat?.cons
        ? String(cat.cons)
              .split(',')
              .map((s) => s.trim())
        : [];
    const catColor = CAT_COLORS[catName] || '#9c88ff';

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal">
                {/* 헤더 */}
                <div className="modal-header">
                    <div className="modal-thumb">
                        {tool.thumbnail ? (
                            <img
                                src={tool.thumbnail}
                                alt={tool.name}
                                style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit'}}
                            />
                        ) : (
                            '🤖'
                        )}
                    </div>
                    <div className="modal-title-wrap">
                        <div className="modal-name">{tool.name}</div>
                        <div className="modal-badges">
                            <span className="badge" style={{background: `${catColor}18`, color: catColor}}>
                                {catName}
                            </span>
                            <span className={`badge ${tool.free_plan ? 'badge-free' : 'badge-paid'}`}>
                                {tool.free_plan ? '무료' : '유료'}
                            </span>
                            <span className="badge badge-diff">{tool.difficulty}</span>
                            <span className="badge badge-rating">★ {tool.rating}</span>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* 바디 */}
                <div className="modal-body">
                    <p className="modal-desc">{desc}</p>

                    {prosList.length > 0 && (
                        <div className="modal-section">
                            <h4>장점</h4>
                            <div className="pros-cons-list">
                                {prosList.map((p, i) => (
                                    <div key={i} className="pros-cons-item">
                                        <span className="dot-pro">✓</span>
                                        <span>{p}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {consList.length > 0 && (
                        <div className="modal-section">
                            <h4>단점</h4>
                            <div className="pros-cons-list">
                                {consList.map((c, i) => (
                                    <div key={i} className="pros-cons-item">
                                        <span className="dot-con">✗</span>
                                        <span>{c}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 푸터 */}
                <div className="modal-footer">
                    <a className="btn-primary" href={tool.url} target="_blank" rel="noreferrer">
                        공식 사이트 바로가기 →
                    </a>
                    <button className="btn-outline" onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ToolModal;
