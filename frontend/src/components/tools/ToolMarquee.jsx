import {useEffect, useState} from 'react';
import {getTools} from '../../api/tools';
import '../../styles/ToolMarquee.css';

export default function ToolMarquee() {
    const [tools, setTools] = useState([]);

    useEffect(() => {
        getTools()
            .then((data) => {
                // Fisher-Yates shuffle
                const shuffled = [...data].sort(() => Math.random() - 0.5);
                setTools(shuffled);
            })
            .catch(console.error);
    }, []);

    if (tools.length === 0) return null;

    const doubled = [...tools, ...tools];

    return (
        <div className="marquee-wrapper">
            <div className="marquee-track">
                {doubled.map((tool, i) => (
                    <div className="marquee-card" key={`${tool.id}-${i}`}>
                        {tool.thumbnail ? (
                            <img src={tool.thumbnail} alt={tool.name} className="marquee-thumb" />
                        ) : (
                            <div className="marquee-thumb-placeholder">{tool.name.charAt(0)}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
