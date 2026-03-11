import api from "../config/axios";

export const getTools = () => api.get("/api/tools");