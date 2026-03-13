import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 툴 목록 조회 (카테고리 필터)
// GET /tools?category_id=1
export const getTools = async (category_id = null) => {
    const params = {};
    if (category_id) params.category_id = category_id;

    const res = await axios.get(`${BASE_URL}/api/tools`, {params});
    return res.data.data; // [{ id, name, description, category_name, free_plan, difficulty, rating, ... }]
};

// 툴 상세 조회 (모달용 - pros/cons 포함)
// GET /tools/:id
export const getToolById = async (id) => {
    const res = await axios.get(`${BASE_URL}/api/tools/${id}`);
    return res.data.data; // { id, name, description, pros, cons, category_name, ... }
};
