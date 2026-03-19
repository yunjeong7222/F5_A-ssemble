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
                    .slice(0, 5);
                setTopTools(top6);
            })
            .catch(console.error);
    }, []);

    return (
        <section>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h2 style={{color: ' #fff'}}>AI툴 TOP 5</h2>
                <button
                    style={{
                        fontSize: '13px',
                        color: 'var(--primary)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate('/tools')}
                >
                    더 많은 툴 보기 →
                </button>
            </div>
            <div style={{display: 'flex', gap: 24}}>
                {topTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} showDescription={false} showDetail={false} />
                ))}
            </div>
        </section>
    );
}