import { delay } from './index';

const getMockMatches = () => {
  const stored = JSON.parse(localStorage.getItem('mockMatches'));
  if (stored) return stored;
  
  // 처음 실행 시 보여줄 기본 더미 데이터
  const initialMatches = [
    { match_id: 1, lost_item_id: "dummy_1", found_item_id: "dummy_search_4", status: "PENDING" },
    { match_id: 2, lost_item_id: "dummy_2", found_item_id: "dummy_search_2", status: "ACCEPTED" }
  ];
  localStorage.setItem('mockMatches', JSON.stringify(initialMatches));
  return initialMatches;
};

const saveMockMatches = (matches) => localStorage.setItem('mockMatches', JSON.stringify(matches));

export const matchApi = {
  // 매칭 요청 (분실자가 습득물에 요청)
  createMatch: async (lostItemId, foundItemId) => {
    await delay(800);
    const matches = getMockMatches();
    
    const newMatch = {
      match_id: Date.now(),
      lost_item_id: lostItemId,
      found_item_id: foundItemId,
      status: "PENDING" // 매칭 대기
    };
    
    matches.push(newMatch);
    saveMockMatches(matches);
    return newMatch;
  },

  // 매칭 요청 수락 (습득자가 수락)
  acceptMatch: async (matchId) => {
    await delay(800);
    const matches = getMockMatches();
    const index = matches.findIndex(m => m.match_id === matchId);
    if (index > -1) {
      matches[index].status = "ACCEPTED";
      saveMockMatches(matches);
    }
    return { match_id: matchId, status: "ACCEPTED" };
  },

  // 매칭 요청 거절 (습득자가 거절)
  rejectMatch: async (matchId) => {
    await delay(800);
    const matches = getMockMatches();
    const index = matches.findIndex(m => m.match_id === matchId);
    if (index > -1) {
      matches[index].status = "REJECTED";
      saveMockMatches(matches);
    }
    return { match_id: matchId, status: "REJECTED" };
  },

  // 매칭 목록 조회
  getMatches: async () => {
    await delay(600);
    return getMockMatches();
  },

  // 매칭 상태 상세 조회
  getMatchDetail: async (matchId) => {
    await delay(300);
    const matches = getMockMatches();
    const match = matches.find(m => m.match_id === matchId);
    return match || {
      match_id: matchId,
      status: "ACCEPTED",
      created_at: new Date().toISOString()
    };
  },

  // 인도 완료 처리
  deliverMatch: async (matchId) => {
    await delay(1000);
    const matches = getMockMatches();
    const index = matches.findIndex(m => m.match_id === matchId);
    if (index > -1) {
      matches[index].status = "DELIVERED";
      saveMockMatches(matches);
    }
    return { match_id: matchId, status: "DELIVERED" };
  },

  // 후기 작성
  writeReview: async (reviewData) => {
    await delay(800);
    const isPositive = reviewData.review_type === 'POSITIVE';
    return {
      review_id: Date.now(),
      match_id: reviewData.match_id,
      target_user_id: reviewData.target_user_id,
      review_type: reviewData.review_type,
      updated_temperature: isPositive ? 41.5 : 31.5 
    };
  }
};