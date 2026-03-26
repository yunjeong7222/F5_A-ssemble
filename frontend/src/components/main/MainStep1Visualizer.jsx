import React from 'react';
import styles from '../../styles/MainVisualizer.module.css';

const MainStep1Visualizer = () => {
    return (
        <div className={`${styles['vis-mockup-wrapper']} ${styles['vis-step1-wrapper']}`}>
            <div className={styles['vis-workflow-container']}>
                <div className={styles['wf-step1-section']}>
                    <h2 className={styles['wf-step1-title']}>
                        어떤 분야의 워크플로우를
                        <br />
                        만들고 싶으신가요?
                    </h2>
                    <p className={styles['wf-step1-desc']}>
                        목적을 입력하거나 직군을 선택하면 최적의 AI 툴 조합을 추천해드릴게요
                    </p>

                    <div className={styles['wf-input-wrap']}>
                        <div className={`${styles['wf-input-group']} ${styles['vis-fake-group']}`}>
                            <div className={`${styles['wf-input-field']} ${styles['vis-fake-input']}`}>
                                <span className={styles['vis-placeholder']}>
                                    예) 초보 영상 크리에이터인데, 무료 AI 툴로 고퀄리티 BGM과 자막을 만들고 싶어요
                                </span>
                                <span className={styles['vis-typing-text']}>
                                    여행 브이로그 편집할 건데 무료 AI 툴 추천해줘
                                </span>
                                <span className={styles['vis-cursor-blink']}></span>
                            </div>
                            <div className={`${styles['wf-submit-btn']} ${styles['vis-fake-btn']}`}>
                                AI 툴 추천받기 →
                            </div>
                        </div>
                    </div>

                    <div className={styles['wf-suggest-wrap']} style={{marginBottom: '20px'}}>
                        <span className={styles['wf-suggest-label']}>💡 이런 목적은 어때요?</span>
                        <div className={styles['wf-suggest-btn']}>유튜브 영상 편집</div>
                        <div className={styles['wf-suggest-btn']}>무료 BGM 생성</div>
                        <div className={styles['wf-suggest-btn']}>무료 이미지 생성</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainStep1Visualizer;
