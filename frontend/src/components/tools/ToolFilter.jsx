const SORT_FILTERS = ['기본순', '평점순'];
const FREE_FILTERS = ['전체', '무료', '유료'];

const ToolFilter = ({
    categories,
    activeCategory,
    activeSort,
    activeFree,
    totalCount,
    searchQuery,
    onCategoryChange,
    onSortChange,
    onFreeChange,
    onSearchChange,
}) => {
    return (
        <>
            <div className="search-box">
                <input
                    className="search-input"
                    type="text"
                    placeholder="툴 이름으로 검색"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            {/* 카테고리 탭 */}
            <div className="category-tabs">
                {['전체', ...categories].map((cat) => (
                    <button
                        key={cat}
                        className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => onCategoryChange(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* 필터 바 */}
            <div className="filter-bar">
                <span className="filter-label">정렬</span>
                {SORT_FILTERS.map((s) => (
                    <button
                        key={s}
                        className={`filter-btn ${activeSort === s ? 'active' : ''}`}
                        onClick={() => onSortChange(s)}
                    >
                        {s}
                    </button>
                ))}

                <span className="filter-label" style={{marginLeft: 8}}>
                    요금
                </span>
                {FREE_FILTERS.map((f) => (
                    <button
                        key={f}
                        className={`filter-btn ${activeFree === f ? (f === '무료' ? 'active-green' : 'active') : ''}`}
                        onClick={() => onFreeChange(f)}
                    >
                        {f}
                    </button>
                ))}

                <span className="tool-count">총 {totalCount}개</span>
            </div>
        </>
    );
};

export default ToolFilter;
