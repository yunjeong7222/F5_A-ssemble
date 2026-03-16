import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getTools} from '../../api/tools';
import ToolCard from './ToolCard';

export default function MainToolSection() {
    const navigate = useNavigate();
    const [topTools, setTopTools] = useState([]);

    useEffect(() => {
        getTools()
            .then((data) => {
                const top6 = [...data]
                    .sort((a, b) => b.rating - a.rating) // 평점 높은 순
                    .slice(0, 6);
                setTopTools(top6);
            })
            .catch(console.error);
    }, []);

    return (
        <section>
            <h2>지금 주목받는 AI 툴</h2>
            <div style={{display: 'grid', gap: 24, gridTemplateColumns: 'repeat(3, 1fr)'}}>
                {topTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} showDescription={false} showDetail={false} />
                ))}
            </div>
            <button onClick={() => navigate('/tools')}>더 많은 툴 보기 →</button>
        </section>
    );
}
