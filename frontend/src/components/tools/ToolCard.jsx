const CAT_COLORS = {
    '기획 및 스크립트': '#f59e0b',
    '영상 소스 생성': '#6366f1',
    '이미지 소스 생성': '#ec4899',
    '성우 / TTS': '#0ea5e9',
    BGM: '#10b981',
    '편집 / 숏폼 변환': '#ef4444',
    '업로드 최적화': '#f97316',
};

const ToolCard = ({tool, onDetail}) => {
    const cat = tool.categories?.[0];
    const catName = cat?.category_name || '';
    const desc = cat?.description || '';
    const catColor = CAT_COLORS[catName] || '#9c88ff';

    return (
        <div className="tool-card" onClick={() => onDetail(tool)}>
            {/* 상단: 썸네일 + 이름 + 뱃지 */}
            <div className="card-top">
                {tool.thumbnail ? (
                    <img className="card-thumb" src={tool.thumbnail} alt={tool.name} />
                ) : (
                    <div className="card-thumb-placeholder">🤖</div>
                )}
                <div className="card-title-wrap">
                    <div className="card-name">{tool.name}</div>
                    <div className="card-badges">
                        <span className="badge" style={{background: `${catColor}18`, color: catColor}}>
                            {catName}
                        </span>
                        <span className={`badge ${tool.free_plan ? 'badge-free' : 'badge-paid'}`}>
                            {tool.free_plan ? '무료' : '유료'}
                        </span>
                        <span className="badge badge-diff">{tool.difficulty}</span>
                    </div>
                </div>
            </div>

            {/* 설명 */}
            <p className="card-desc">{desc}</p>

            {/* 하단: 평점 + 자세히 보기 */}
            <div className="card-bottom">
                <div className="card-rating">
                    <span className="star">★</span>
                    {tool.rating ?? '-'}
                </div>
                <button
                    className="card-detail-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDetail(tool);
                    }}
                >
                    자세히 보기 →
                </button>
            </div>
        </div>
    );
};

export default ToolCard;
