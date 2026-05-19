import { delay } from './index';

export const itemApi = {
  // 습득물 등록
  registerFoundItem: async (formData) => {
    await delay(1000); 
    console.log("서버로 전송된 습득물 데이터:", formData);
    return {
      success: true,
      found_item_id: `found_${Date.now()}`,
      status: "REGISTERED"
    };
  },

  // 분실물 등록
  registerLostItem: async (formData) => {
    await delay(800); 
    console.log("서버로 전송된 분실물 데이터:", formData);
    return {
      success: true,
      lost_item_id: `lost_${Date.now()}`,
      status: "REGISTERED"
    };
  },

  // 유사 습득물 조회
  getSimilarFoundItems: async (lostItemId) => {
    await delay(1200); 
    console.log(`[${lostItemId}] 분실물 기반 유사 습득물 검색 완료`);
    
    return [
      { 
        id: 1, 
        title: "삼색 고양이 인형", 
        keywords: "인형, 삼색, 고양이, 꼬리 짧음", 
        img: "https://via.placeholder.com/100",
        similarity_score: 95.5,
        location: "정문 앞 커피숍"
      },
      { 
        id: 2, 
        title: "흰색 곰 인형", 
        keywords: "인형, 흰색, 곰, 리본", 
        img: "https://via.placeholder.com/100",
        similarity_score: 72.0,
        location: "인문대 1층 로비"
      }
    ];
  }

  // 습득물 수정
  editFoundItem: async (itemId, formData) => {
    await delay(800);
    console.log(`[PATCH /api/found-items/${itemId}] 습득물 수정 데이터:`, formData);
    return { success: true, item_id: itemId };
  },

  // 분실물 수정
  editLostItem: async (itemId, formData) => {
    await delay(800);
    console.log(`[PATCH /api/lost-items/${itemId}] 분실물 수정 데이터:`, formData);
    return { success: true, item_id: itemId };
  }
};