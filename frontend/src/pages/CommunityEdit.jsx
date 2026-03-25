import {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {getPost, updatePost} from '../api/posts';
import {uploadFile} from '../utils/uploadFile';
import '../styles/Community.css';
import Alert from '../utils/alert';

const CommunityEdit = () => {
    const navigate = useNavigate();
    const {id} = useParams();

    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [uploadType, setUploadType] = useState('file');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [existingMediaUrl, setExistingMediaUrl] = useState(null);
    const [existingMediaType, setExistingMediaType] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getPost(id);
                const post = res.data;
                setPostTitle(post.title || '');

                const textAttachment = post.attachments?.find((a) => a.type === 'text');
                if (textAttachment) setPostContent(textAttachment.content || '');

                const mediaAttachment = post.attachments?.find((a) => ['image', 'video', 'youtube'].includes(a.type));
                if (mediaAttachment) {
                    if (mediaAttachment.type === 'youtube') {
                        setUploadType('youtube');
                        setYoutubeUrl(mediaAttachment.url);
                    } else {
                        setUploadType('file');
                        setExistingMediaUrl(mediaAttachment.url);
                        setExistingMediaType(mediaAttachment.type);
                        setPreviewUrl(mediaAttachment.url);
                    }
                }
            } catch (err) {
                console.error('게시글 불러오기 실패:', err);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id]);

    const getYoutubeId = (url) => {
        return url?.match(/[?&]v=([^&]+)/)?.[1] || url?.match(/youtu\.be\/([^?]+)/)?.[1] || null;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 50 * 1024 * 1024) {
            Alert.fire({icon: 'warning', title: '파일 크기는 50MB를 초과할 수 없습니다.'});
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setExistingMediaUrl(null);
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        setPreviewUrl(null);
        setExistingMediaUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async () => {
        if (!postTitle.trim()) return Alert.fire({icon: 'warning', title: '제목을 입력해주세요.'});
        if (!postContent.trim()) return Alert.fire({icon: 'warning', title: '설명을 작성해주세요.'});

        setIsSubmitting(true);
        try {
            let attachments = [];

            if (uploadType === 'youtube') {
                if (!getYoutubeId(youtubeUrl)) {
                    Alert.fire({icon: 'warning', title: '올바른 유튜브 URL을 입력해주세요.'});
                    return;
                }
                attachments.push({type: 'youtube', url: youtubeUrl});
            } else {
                if (selectedFile) {
                    const fileUrl = await uploadFile(selectedFile);
                    const fileType = selectedFile.type.startsWith('video/') ? 'video' : 'image';
                    attachments.push({type: fileType, url: fileUrl});
                } else if (existingMediaUrl) {
                    attachments.push({type: existingMediaType, url: existingMediaUrl});
                }
            }

            attachments.push({type: 'text', content: postContent});

            await updatePost(id, {title: postTitle, attachments});
            Alert.fire({icon: 'success', title: '게시글이 수정되었습니다.'});
            navigate(`/community/${id}`);
        } catch (err) {
            console.error('수정 실패:', err);
            Alert.fire({icon: 'error', title: '수정에 실패했습니다.'});
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading)
        return <div style={{textAlign: 'center', padding: '80px', color: 'var(--text-muted)'}}>불러오는 중...</div>;

    return (
        <div className="write-wrapper">
            <div className="write-container">
                <header className="write-header">
                    <h2 className="write-title">게시글 수정</h2>
                </header>

                <section className="write-section">
                    <label className="write-label">제목</label>
                    <input
                        type="text"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        className="write-input"
                    />
                </section>

                <section className="write-section">
                    <label className="write-label">미디어</label>
                    <div style={{display: 'flex', gap: 8, marginBottom: 12}}>
                        <button
                            onClick={() => setUploadType('file')}
                            className={`comm-filter-btn ${uploadType === 'file' ? 'active' : ''}`}
                        >
                            이미지 / 영상
                        </button>
                        <button
                            onClick={() => setUploadType('youtube')}
                            className={`comm-filter-btn ${uploadType === 'youtube' ? 'active' : ''}`}
                        >
                            유튜브 URL
                        </button>
                    </div>

                    {uploadType === 'file' && (
                        <>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, video/mp4"
                                style={{display: 'none'}}
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <div
                                onClick={previewUrl ? undefined : () => fileInputRef.current?.click()}
                                className={`write-upload-box ${previewUrl ? 'write-upload-filled' : 'write-upload-empty'}`}
                            >
                                {previewUrl ? (
                                    <>
                                        {(selectedFile?.type || existingMediaType) === 'video' ||
                                        selectedFile?.type?.startsWith('video/') ? (
                                            <video src={previewUrl} controls className="write-preview-media" />
                                        ) : (
                                            <img src={previewUrl} alt="미리보기" className="write-preview-media" />
                                        )}
                                        <button onClick={handleRemoveFile} className="write-remove-btn">
                                            ✕
                                        </button>
                                    </>
                                ) : (
                                    <div>
                                        <div className="write-upload-icon">↑</div>
                                        <p className="write-upload-text">이미지 또는 영상을 업로드하세요</p>
                                        <p className="write-upload-hint">PNG, JPG, MP4 · 최대 50MB</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {uploadType === 'youtube' && (
                        <div>
                            <input
                                type="text"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="write-input"
                                style={{marginBottom: 12}}
                            />
                            {getYoutubeId(youtubeUrl) && (
                                <div
                                    style={{borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '16/9'}}
                                >
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYoutubeId(youtubeUrl)}`}
                                        style={{width: '100%', height: '100%', border: 'none'}}
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <section className="write-section">
                    <label className="write-label">워크플로우 설명</label>
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="write-textarea-desc"
                    />
                </section>

                <div className="write-footer">
                    <button onClick={() => navigate(-1)} className="write-btn-cancel">
                        취소
                    </button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="write-btn-submit">
                        {isSubmitting ? '수정 중...' : '수정하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommunityEdit;
