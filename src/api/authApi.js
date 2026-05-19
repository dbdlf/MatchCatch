import { delay } from './index';

export const authApi = {
  // 로그인
  login: async (studentId, password) => {
    await delay(1000); 
    console.log(`로그인 시도: 학번 ${studentId}`);
    
    // 임시 성공 로직
    if (studentId === '20261234' && password === '1234') {
      return {
        success: true,
        access_token: "fake-jwt-token-12345",
        user_id: 1,
        username: "차차"
      };
    } else {
      throw new Error("학번 또는 비밀번호가 틀렸습니다.");
    }
  },

  // [AUTH-001] 회원가입
  register: async (userData) => {
    await delay(1000);
    console.log("회원가입 데이터 전송:", userData);
    
    return {
      success: true,
      user_id: 2,
      student_id: userData.studentId,
      username: userData.userId
    };
  }
};