// src/api/users.js
export const getProfile = () => {
  return {
    id: 1,
    email: "test@test.com",
    nickname: "레시피왕",
    profile_img: "https://via.placeholder.com/100",
    role: "user",
    created_at: "2025-01-01"
  }
}

export const updateProfile = (data) => {
  console.log("updateProfile 호출됨:", data)
  return { success: true }
}