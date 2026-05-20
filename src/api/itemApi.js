import { delay } from './index';

// 💡 브라우저 저장소를 가상 DB로 사용하기 위한 헬퍼 함수
const getMockItems = () => JSON.parse(localStorage.getItem('mockItems')) || [];
const saveMockItems = (items) => localStorage.setItem('mockItems', JSON.stringify(items));

export const itemApi = {
  // [FOUND-001] 습득물 등록 (가상 DB에 저장)
  registerFoundItem: async (formData) => {
    await delay(800); 
    const items = getMockItems();
    const newItem = {
      id: `found_${Date.now()}`,
      mode: 'found',
      status: 'REGISTERED',
      title: '습득물 (제목 없음)', // 명세서상 습득물은 제목이 없으므로 대체 텍스트 삽입
      content: formData.description,
      location: formData.found_location,
      time: formData.found_time,
      imageUrl: formData.image || "https://via.placeholder.com/400",
      keywords: "AI, 자동, 추출, 키워드", // 백엔드 AI가 추출했다고 가정
      author: { id: "차차", temperature: 36.5 }
    };
    items.push(newItem);
    saveMockItems(items); // DB 저장
    
    return { success: true, found_item_id: newItem.id, status: "REGISTERED" };
  },

  // [LOST-001] 분실물 등록 (가상 DB에 저장)
  registerLostItem: async (formData) => {
    await delay(800); 
    const items = getMockItems();
    const newItem = {
      id: `lost_${Date.now()}`,
      mode: 'lost',
      status: 'REGISTERED',
      title: formData.title,
      content: formData.description,
      keywords: formData.keywords.join(', '), // 배열을 문자열로 변환
      location: formData.lost_location,
      time: formData.lost_time,
      imageUrl: formData.image || "https://via.placeholder.com/400",
      author: { id: "차차", temperature: 36.5 }
    };
    items.push(newItem);
    saveMockItems(items); // DB 저장
    
    return { success: true, lost_item_id: newItem.id, status: "REGISTERED" };
  },

  // 💡 [NEW] 특정 게시글 상세 조회
  getItemDetail: async (itemId) => {
    await delay(500);
    const items = getMockItems();
    const foundItem = items.find(item => item.id === itemId);
    if (!foundItem) throw new Error("게시글을 찾을 수 없습니다.");
    return foundItem;
  },

  // [LOST-004] 유사 습득물 조회 (가상 DB에서 습득물만 필터링)
  getSimilarFoundItems: async (lostItemId) => {
    await delay(1200); 
    const items = getMockItems();
    const foundItems = items.filter(item => item.mode === 'found');
    
    // DB에 있는 습득물들을 검색 결과 포맷으로 변환하여 반환
    return foundItems.map((item, index) => ({
      id: item.id,
      title: item.title,
      keywords: item.keywords,
      img: item.imageUrl,
      similarity_score: 95 - (index * 5), // 가상의 유사도 점수
      location: item.location
    }));
  },

  // [PATCH] 습득물 수정 (가상 DB 업데이트)
  editFoundItem: async (itemId, formData) => {
    await delay(800);
    const items = getMockItems();
    const index = items.findIndex(item => item.id === itemId);
    if (index > -1) {
      items[index] = { ...items[index], ...formData }; // 기존 데이터 덮어쓰기
      saveMockItems(items);
    }
    return { success: true, item_id: itemId };
  },

  // [PATCH] 분실물 수정 (가상 DB 업데이트)
  editLostItem: async (itemId, formData) => {
    await delay(800);
    const items = getMockItems();
    const index = items.findIndex(item => item.id === itemId);
    if (index > -1) {
      items[index] = { ...items[index], ...formData }; // 기존 데이터 덮어쓰기
      saveMockItems(items);
    }
    return { success: true, item_id: itemId };
  }
};