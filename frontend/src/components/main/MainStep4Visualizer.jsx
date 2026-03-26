import React from 'react';
import styles from '../../styles/MainVisualizer.module.css';

const MainStep4Visualizer = () => {
    return (
        <div className={`${styles['vis-mockup-wrapper']} ${styles['vis-step4-wrapper']}`}>
            <div className={styles['vis-comm-global-header']}>
                <div className={styles['vis-comm-logo']}>AIssemble</div>
                <div className={styles['vis-comm-actions']}>
                    <div className={styles['vis-btn-outline']}>내 워크플로우</div>
                    <div className={styles['vis-btn-primary']}>+ 게시글 작성</div>
                </div>
            </div>

            <div className={styles['vis-comm-board']}>
                <div className={styles['vis-comm-grid-header']}>
                    <div className={styles['vis-comm-tabs']}>
                        <span className={`${styles['vis-tab']} ${styles['active']}`}>전체</span>
                        <span className={styles['vis-tab']}>좋아요한 글</span>
                    </div>
                    <div className={styles['vis-comm-filters']}>
                        <span className={`${styles['vis-filter']} ${styles['active']}`}>최신순</span>
                        <span className={styles['vis-filter']}>인기순</span>
                    </div>
                </div>

                <div className={styles['vis-comm-grid']}>
                    <div className={`${styles['vis-post-card']} ${styles['vis-anim-new-post']}`}>
                        <div className={styles['vis-post-thumb']}>
                            <img
                                src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=400&q=80"
                                alt="여행 브이로그"
                                style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                            />
                        </div>
                        <div className={styles['vis-post-content']}>
                            <h4 className={styles['vis-post-title']}>
                                초보 영상 크리에이터를 위한 여행 브이로그 올인원
                            </h4>
                            <p className={styles['vis-post-desc']}>
                                기획부터 편집까지 한 번에 끝내는 워크플로우입니다. 무료 툴로만 구성했습니다.
                            </p>
                            <div className={styles['vis-post-tags']}>
                                <span className={styles['vis-tag']}>Claude</span>
                                <span className={styles['vis-tag']}>Vrew</span>
                                <span className={styles['vis-tag']}>CapCut AI</span>
                            </div>
                            <div className={styles['vis-post-meta']}>
                                <span>작성자: 뉴비크리에이터</span>
                                <span>좋아요 0</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles['vis-post-card']}>
                        <div className={styles['vis-post-thumb']}>
                            <img
                                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80"
                                alt="쇼츠 제작"
                                style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                            />
                        </div>
                        <div className={styles['vis-post-content']}>
                            <h4 className={styles['vis-post-title']}>정보성 쇼츠 10분만에 대량 생산하는 방법</h4>
                            <p className={styles['vis-post-desc']}>
                                대본 작성부터 컷편집까지 반자동화하는 루틴 공유합니다.
                            </p>
                            <div className={styles['vis-post-tags']}>
                                <span className={styles['vis-tag']}>ChatGPT</span>
                                <span className={styles['vis-tag']}>Vrew</span>
                            </div>
                            <div className={styles['vis-post-meta']}>
                                <span>작성자: 숏폼마스터</span>
                                <span>좋아요 128</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles['vis-post-card']}>
                        <div className={styles['vis-post-thumb']}>
                            <img
                                src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80"
                                alt="영화 리뷰"
                                style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                            />
                        </div>
                        <div className={styles['vis-post-content']}>
                            <h4 className={styles['vis-post-title']}>분위기 있는 영화 리뷰 채널 BGM 및 더빙 조합</h4>
                            <p className={styles['vis-post-desc']}>
                                저작권 걱정 없이 고퀄리티 사운드와 더빙을 입히는 워크플로우.
                            </p>
                            <div className={styles['vis-post-tags']}>
                                <span className={styles['vis-tag']}>Claude</span>
                                <span className={styles['vis-tag']}>ElevenLabs</span>
                                <span className={styles['vis-tag']}>Suno</span>
                            </div>
                            <div className={styles['vis-post-meta']}>
                                <span>작성자: 시네마리뷰</span>
                                <span>좋아요 85</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${styles['vis-modal-overlay']} ${styles['vis-anim-modal']}`}>
                <div className={styles['vis-modal-window']}>
                    <h3 className={styles['vis-modal-title']}>나만의 워크플로우 공유하기</h3>

                    <div className={styles['vis-modal-tools']}>
                        <span className={styles['vis-modal-tool-badge']}>Claude</span>
                        <span className={styles['vis-modal-tool-arrow']}>→</span>
                        <span className={styles['vis-modal-tool-badge']}>Vrew</span>
                        <span className={styles['vis-modal-tool-arrow']}>→</span>
                        <span className={styles['vis-modal-tool-badge']}>CapCut AI</span>
                    </div>

                    <div className={styles['vis-modal-input-wrap']}>
                        <div className={styles['vis-modal-label']}>제목</div>
                        <div className={styles['vis-modal-input']}>
                            <span className={styles['vis-anim-type-title']}>
                                초보 영상 크리에이터를 위한 여행 브이로그 올인원
                            </span>
                            <span className={styles['vis-cursor-title']}></span>
                        </div>
                    </div>

                    <div className={styles['vis-modal-input-wrap']}>
                        <div className={styles['vis-modal-label']}>설명</div>
                        <div className={styles['vis-modal-textarea-container']}>
                            <div className={styles['vis-modal-textarea']}>
                                <span className={styles['vis-anim-type-desc-1']}>
                                    기획부터 편집까지 한 번에 끝내는 워크플로우입니다.
                                </span>
                                <span className={styles['vis-cursor-desc-1']}></span>
                                <br />
                                <span className={styles['vis-anim-type-desc-2']}>무료 툴로만 구성했습니다.</span>
                                <span className={styles['vis-cursor-desc-2']}></span>
                            </div>

                            <div className={styles['vis-modal-img-wrap']}>
                                <div
                                    className={`${styles['vis-modal-img-placeholder']} ${styles['vis-anim-img-click']}`}
                                >
                                    <span className={styles['vis-icon']}>+</span>
                                    <span>이미지 첨부</span>
                                </div>
                                <div className={`${styles['vis-modal-img-uploaded']} ${styles['vis-anim-img-show']}`}>
                                    <img
                                        src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=400&q=80"
                                        alt="첨부된 이미지"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles['vis-modal-submit']} ${styles['vis-anim-submit-btn']}`}>게시하기</div>
                </div>
            </div>
        </div>
    );
};

export default MainStep4Visualizer;
