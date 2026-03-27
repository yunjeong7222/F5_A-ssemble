import {useState, useEffect, useMemo} from 'react';
import ToolCard from '../components/tools/ToolCard';
import ToolFilter from '../components/tools/ToolFilter';
import ToolModal from '../components/tools/ToolModal';
import {getTools, getToolById} from '../api/tools';
import {getCategories} from '../api/categories';
import '../styles/Tools.css';

const Tools = () => {
    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('전체');
    const [activeSort, setActiveSort] = useState('기본순');
    const [activeFree, setActiveFree] = useState('전체');
    const [selectedTool, setSelectedTool] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // 최초 마운트 시 카테고리 + 전체 툴 목록
    useEffect(() => {
        getCategories().then(setCategories);
        getTools().then(setTools);
    }, []);

    // 카테고리 탭 클릭 시
    const handleCategoryChange = async (cat) => {
        setActiveCategory(cat);
        const id = categories.find((c) => c.name === cat)?.id;
        const data = await getTools(id || null);
        setTools(data);
    };

    // 카드 클릭 시 → 상세 API 호출 후 모달 오픈
    const handleDetail = async (tool) => {
        const detail = await getToolById(tool.id);
        console.log('tool detail:', detail);
        setSelectedTool(detail);
    };

    // 필터링 + 정렬 + 검색 조건 추가
    const filtered = useMemo(() => {
        const result = tools.filter((t) => {
            const freeMatch =
                activeFree === '전체' ||
                (activeFree === '무료' && t.free_plan) ||
                (activeFree === '유료' && !t.free_plan);

            const searchMatch = t.name.toLowerCase().includes(searchQuery.toLowerCase());

            return freeMatch && searchMatch;
        });

        if (activeSort === '평점순') {
            result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        }

        return result;
    }, [tools, activeSort, activeFree, searchQuery]);

    return (
        <div className="tools-page">
            <div className="tools-header">
                <h1>AI 툴 탐색</h1>
                <p>카테고리별 AI 툴을 탐색하고 나에게 맞는 워크플로우를 만들어보세요</p>
            </div>

            <ToolFilter
                categories={categories.map((c) => c.name)}
                activeCategory={activeCategory}
                activeSort={activeSort}
                activeFree={activeFree}
                totalCount={filtered.length}
                onCategoryChange={handleCategoryChange}
                onSortChange={setActiveSort}
                onFreeChange={setActiveFree}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {filtered.length > 0 ? (
                <div className="tool-grid" key={`${activeCategory}-${activeFree}-${activeSort}`}>
                    {filtered.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} onDetail={handleDetail} />
                    ))}
                </div>
            ) : (
                <div className="tools-empty">
                    <div className="empty-icon">🔍</div>
                    <p>조건에 맞는 툴이 없어요</p>
                </div>
            )}

            <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
        </div>
    );
};

export default Tools;