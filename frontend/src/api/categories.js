import api from '../config/axios';

// 카테고리 전체 조회
// GET /categories
export const getCategories = async () => {
    const res = await api.get('/api/categories');
    return res.data.data;
};
