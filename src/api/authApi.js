import { delay } from './index';

export const authApi = {
  // 로그인
  login: async (userId, password) => {
    await delay(1000); 
    
    const savedUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
    
    const matchedUser = savedUsers.find(
      user => user.userId === userId && user.password === password
    );

    if ((userId === 'chacha' && password === '1234') || matchedUser) {
      return {
        success: true,
        access_token: "fake-jwt-token-12345",
        user_id: matchedUser ? matchedUser.id : 1,
        username: userId
      };
    } else {
      throw new Error("아이디 또는 비밀번호가 틀렸습니다."); 
    }
  },

  // 회원가입
  register: async (userData) => {
    await delay(1000);
    
    const savedUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
    
    const newUser = {
      id: Date.now(), 
      studentId: userData.studentId,
      userId: userData.username, 
      password: userData.password
    };
    
    savedUsers.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(savedUsers));

    return {
      success: true,
      user_id: newUser.id,
      student_id: userData.studentId,
      username: userData.username
    };
  }
};