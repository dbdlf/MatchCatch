import { delay } from './index';

export const authApi = {
  // 로그인
  login: async (userId, password) => {
    await delay(1000); 
    console.log(`로그인 시도: 아이디 ${userId}`);
    
    // 브라우저 임시 저장소(가짜 DB)에서 가입된 유저 목록 가져오기
    const savedUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
    
    // 입력한 아이디와 비밀번호가 일치하는 유저 찾기
    const matchedUser = savedUsers.find(
      user => user.userId === userId && user.password === password
    );

    // 하드코딩된 기본 테스트 계정('chacha', '1234')이거나, 방금 가입한 계정이면 로그인 통과
    if ((userId === 'chacha' && password === '1234') || matchedUser) {
      return {
        success: true,
        access_token: "fake-jwt-token-12345",
        user_id: matchedUser ? matchedUser.id : 1,
        username: userId
      };
    } else {
      // 명세서에 맞게 에러 문구 수정
      throw new Error("아이디 또는 비밀번호가 틀렸습니다."); 
    }
  },

  // 회원가입
  register: async (userData) => {
    await delay(1000);
    console.log("회원가입 데이터 전송:", userData);
    
    // 브라우저 임시 저장소에 새 유저 정보 저장 (프론트엔드 테스트용 가짜 DB)
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