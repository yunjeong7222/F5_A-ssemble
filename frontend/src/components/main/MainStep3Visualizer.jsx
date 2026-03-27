import React from 'react';
import styles from '../../styles/MainVisualizer.module.css';

const MainStep3Visualizer = () => {
    return (
        <div className={`${styles['vis-mockup-wrapper']} ${styles['vis-step3-wrapper']}`}>
            <div className={styles['vis-workflow-container']}>
                <div style={{padding: '0 30px'}}>
                    <div className={styles['vis-banner']}>
                        <div className={styles['vis-banner-text']}>
                            <div className={styles['vis-banner-badge']}>
                                <span style={{color: '#4ade80'}}>✓</span> 워크플로우 생성 완료
                            </div>
                            <h2 className={styles['vis-banner-title']}>유튜브 영상 제작 올인원 워크플로우</h2>
                            <p className={styles['vis-banner-desc']}>약 2시간</p>
                        </div>

                        <div className={`${styles['vis-float-wrap']} ${styles['vis-anim-float']}`}>
                            <div className={styles['vis-float-time']}>
                                <div>
                                    <div style={{fontSize: '0.95rem', fontWeight: '800', color: 'white'}}>
                                        총 120분 완성
                                    </div>
                                    <div style={{fontSize: '0.7rem', color: '#64748b', fontWeight: '500'}}>
                                        단계별 시간 포함
                                    </div>
                                </div>
                            </div>

                            <div className={styles['vis-float-card']}>
                                <h3
                                    style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '800',
                                        color: 'white',
                                        margin: '0 0 16px 0',
                                    }}
                                >
                                    선택한 AI 워크플로우
                                </h3>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                    <div className={styles['vis-float-item']} style={{backgroundColor: '#fffbf4'}}>
                                        <div className={styles['vis-float-num']} style={{backgroundColor: '#f59e0b'}}>
                                            1
                                        </div>
                                        <div className={styles['vis-float-tool']} style={{color: '#f59e0b'}}>
                                            Claude
                                        </div>
                                        <div className={styles['vis-float-cat']}>기획 · 아이디어</div>
                                    </div>
                                    <div className={styles['vis-float-item']} style={{backgroundColor: '#dceef8'}}>
                                        <div className={styles['vis-float-num']} style={{backgroundColor: '#0ea5e9'}}>
                                            2
                                        </div>
                                        <div className={styles['vis-float-tool']} style={{color: '#0ea5e9'}}>
                                            Vrew
                                        </div>
                                        <div className={styles['vis-float-cat']}>성우/TTS</div>
                                    </div>
                                    <div className={styles['vis-float-item']} style={{backgroundColor: '#e1e1ff'}}>
                                        <div className={styles['vis-float-num']} style={{backgroundColor: '#6366f1'}}>
                                            3
                                        </div>
                                        <div className={styles['vis-float-tool']} style={{color: '#6366f1'}}>
                                            CapCut AI
                                        </div>
                                        <div className={styles['vis-float-cat']}>영상 소스 생성 및 편집</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles['vis-flow-box']}>
                        <h4 className={styles['vis-flow-title']}>WORKFLOW FLOW</h4>
                        <div className={styles['vis-flow-list']}>
                            <div className={`${styles['vis-flow-item']} ${styles['vis-anim-flow-1']}`}>
                                <img
                                    src="https://www.google.com/s2/favicons?domain=claude.ai&sz=64"
                                    alt="Claude"
                                    style={{width: '40px', height: '40px', borderRadius: '10px'}}
                                />
                                <div>
                                    <div style={{fontSize: '14px', fontWeight: '600', color: 'white'}}>Claude</div>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            color: '#f59e0b',
                                            marginTop: '3px',
                                        }}
                                    >
                                        기획 특화
                                    </div>
                                </div>
                            </div>
                            <div className={`${styles['vis-flow-arrow']} ${styles['vis-anim-flow-1']}`}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#cbd5e1"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </div>

                            <div className={`${styles['vis-flow-item']} ${styles['vis-anim-flow-2']}`}>
                                <img
                                    src="https://www.google.com/s2/favicons?domain=vrew.ai&sz=64"
                                    alt="Vrew"
                                    style={{width: '40px', height: '40px', borderRadius: '10px'}}
                                />
                                <div>
                                    <div style={{fontSize: '14px', fontWeight: '600', color: 'white'}}>Vrew</div>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            color: '#0ea5e9',
                                            marginTop: '3px',
                                        }}
                                    >
                                        성우 특화
                                    </div>
                                </div>
                            </div>
                            <div className={`${styles['vis-flow-arrow']} ${styles['vis-anim-flow-2']}`}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#cbd5e1"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </div>

                            <div className={`${styles['vis-flow-item']} ${styles['vis-anim-flow-3']}`}>
                                <img
                                    src="https://www.google.com/s2/favicons?domain=capcut.com&sz=64"
                                    alt="CapCut AI"
                                    style={{width: '40px', height: '40px', borderRadius: '10px'}}
                                />
                                <div>
                                    <div style={{fontSize: '14px', fontWeight: '600', color: 'white'}}>CapCut AI</div>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            color: '#6366f1',
                                            marginTop: '3px',
                                        }}
                                    >
                                        영상 소스 생성 및 편집 특화
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainStep3Visualizer;
