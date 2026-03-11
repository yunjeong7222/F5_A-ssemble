import axios from 'axios'

const api = axios.create({
  // 현재 사용하는 서버 주소 입력 -> 배포시 변경
  baseURL : "http://localhost:3000"
});

export default api;