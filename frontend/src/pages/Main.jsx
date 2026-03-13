import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
 
export default function Main() {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
 
  useEffect(() => {
    api.get('/api/tools')
      .then(r => setTools(r.data.data ?? []))
      .catch(console.error);
  }, []);
 
  return (
    <div>
 
      {/* ── 1. 히어로 섹션 ── */}
      <section>
        <h1>AI 툴, 혼자 쓰면 절반의 효과만 납니다</h1>
        <p>직군별 AI 툴 조합 레시피로 복사 가능한 프롬프트와 실제 결과물을 확인하세요.</p>
        <button onClick={() => navigate('/workflow')}>워크플로우 만들기</button>
        <button onClick={() => navigate('/tools')}>툴 탐색하기</button>
      </section>
 
      <hr />

      {/* ── 2. AI 툴 슬라이드 ── */}
    <section style={{ overflow: 'hidden' }}>
        <h2>지금 주목받는 AI 툴</h2>
        <button onClick={() => navigate('/tools')}>전체 보기</button>
        <div style={{
            display: 'flex',
            gap: 12,
            overflowX: 'scroll',
            paddingBottom: 8,
        }}>
            {tools.slice(0, 7).map(tool => (
            <div key={tool.id} style={{
                border: '1px solid #ccc',
                padding: 12,
                minWidth: 160,
                flexShrink: 0,
            }}>
                <div>{tool.name}</div>
                <div>{tool.categories?.[0]?.category_name}</div>
                <div>★ {tool.rating}</div>
            </div>
            ))}
        </div>
    </section>
        
    
      <hr />
 
      {/* ── 3. 주목받는 워크플로우 ── */}
      {/* TODO: 팀원과 GET /api/workflows 엔드포인트 추가 후 연결 */}
      <section>
        <h2>지금 주목받는 워크플로우</h2>
        <button onClick={() => navigate('/workflow')}>전체 보기</button>
        <p>워크플로우 목록 영역 (API 확정 후 연결)</p>
      </section>
 
      <hr />
 
      {/* ── 4. HOW IT WORKS ── */}
      <section>
        <h2>4단계로 AI 마스터가 됩니다</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { num: 1, title: '레시피 탐색',    desc: '직군별로 정리된 AI 툴 조합 레시피를 탐색하세요.' },
            { num: 2, title: '프롬프트 복사',   desc: '각 단계 프롬프트를 클립보드에 바로 복사하세요.' },
            { num: 3, title: '바로 실행',       desc: 'AI 툴로 이동해서 프롬프트를 붙여넣고 실행하세요.' },
            { num: 4, title: '나만의 레시피',   desc: '워크플로우를 저장하고 커스터마이징하세요.' },
          ].map(item => (
            <div key={item.num} style={{ border: '1px solid #ccc', padding: 16, flex: 1 }}>
              <div>0{item.num}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
 
      <hr />
 
      {/* ── 5. CTA 배너 ── */}
      <section>
        <h2>지금 바로 시작하세요 🚀</h2>
        <p>무료로 모든 레시피를 탐색하고 나만의 AI 워크플로우를 만들어보세요.</p>
        <button onClick={() => navigate('/workflow')}>무료로 시작하기</button>
        <button onClick={() => navigate('/tools')}>레시피 둘러보기</button>
      </section>
 
    </div>
  );
}
