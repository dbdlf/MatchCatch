import { delay } from './index';

export const matchApi = {
  // 매칭 요청 (분실자가 습득물에 요청)
  createMatch: async (lostItemId, foundItemId) => {
    await delay(800);
    console.log(`매칭 요청: 분실물(${lostItemId}) -> 습득물(${foundItemId})`);
    return {
      match_id: Date.now(),
      status: "PENDING" // 매칭 대기
    };
  },

  // 매칭 요청 수락 (습득자가 수락)
  acceptMatch: async (matchId) => {
    await delay(800);
    console.log(`매칭 수락 완료: ${matchId}`);
    return {
      match_id: matchId,
      status: "ACCEPTED"
    };
  },

  // 매칭 요청 거절 (습득자가 거절)
  rejectMatch: async (matchId) => {
    await delay(800);
    console.log(`매칭 거절 완료: ${matchId}`);
    return {
      match_id: matchId,
      status: "REJECTED"
    };
  },

  // 매칭 목록 조회
  getMatches: async () => {
    await delay(600);
    return [
      { match_id: 1, lost_item_id: 10, found_item_id: 20, status: "PENDING" },
      { match_id: 2, lost_item_id: 11, found_item_id: 21, status: "ACCEPTED" }
    ];
  },

  // 매칭 상태 상세 조회
  getMatchDetail: async (matchId) => {
    await delay(300);
    return {
      match_id: matchId,
      status: "ACCEPTED",
      created_at: "2026-05-19T09:00:00Z"
    };
  },

  // 인도 완료 처리 (ChatDetailPage에서 '상태변경' 클릭 시)
  deliverMatch: async (matchId) => {
    await delay(1000);
    console.log(`인도 완료 처리: ${matchId}`);
    return {
      match_id: matchId,
      status: "DELIVERED"
    };
  },

  // 후기 작성
  writeReview: async (reviewData) => {
    await delay(800);
    console.log("서버로 전송된 후기 데이터:", reviewData);
    
    const isPositive = reviewData.review_type === 'POSITIVE';
    return {
      review_id: Date.now(),
      match_id: reviewData.match_id,
      target_user_id: reviewData.target_user_id,
      review_type: reviewData.review_type,
      updated_temperature: isPositive ? 41.5 : 31.5 // +5 또는 -5 온도 반영
    };
  }
};