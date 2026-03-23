import api from '../config/axios';

// 툴 목록 조회 (카테고리 필터)
// GET /tools?category_id=1
export const getTools = async (category_id = null) => {
    const params = {};
    if (category_id) params.category_id = category_id;

    const res = await api.get('/api/tools', {params});
    return res.data.data;
};

// 툴 상세 조회 (모달용 - pros/cons 포함)
// GET /tools/:id
export const getToolById = async (id) => {
    const res = await api.get(`/api/tools/${id}`);
    return res.data.data;
};

