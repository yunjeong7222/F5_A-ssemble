import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 카테고리 전체 조회
// GET /categories
export const getCategories = async () => {
    const res = await axios.get(`${BASE_URL}/api/categories`);
    return res.data.data; // [{ id, name, display_order }]
};
