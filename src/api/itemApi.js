import { delay } from './index';

// 브라우저 저장소를 가상 DB로 사용하기 위한 헬퍼 함수
const getMockItems = () => JSON.parse(localStorage.getItem('mockItems')) || [];
const saveMockItems = (items) => localStorage.setItem('mockItems', JSON.stringify(items));

export const itemApi = {
  // 습득물 등록 (가상 DB에 저장)
  registerFoundItem: async (formData) => {
    await delay(800); 
    const items = getMockItems();
    const newItem = {
      id: `found_${Date.now()}`,
      mode: 'found',
      status: 'REGISTERED',
      title: '습득물 (제목 없음)',
      content: formData.description,
      location: formData.found_location,
      time: formData.found_time,
      imageUrl: formData.image || "https://via.placeholder.com/400",
      keywords: "AI, 자동, 추출, 키워드", 
      author: { id: "차차", temperature: 36.5 }
    };
    items.push(newItem);
    saveMockItems(items); 
    
    return { success: true, found_item_id: newItem.id, status: "REGISTERED" };
  },

  // 분실물 등록 (가상 DB에 저장)
  registerLostItem: async (formData) => {
    await delay(800); 
    const items = getMockItems();
    const newItem = {
      id: `lost_${Date.now()}`,
      mode: 'lost',
      status: 'REGISTERED',
      title: formData.title,
      content: formData.description,
      keywords: Array.isArray(formData.keywords) ? formData.keywords.join(', ') : formData.keywords,
      location: formData.lost_location,
      time: formData.lost_time,
      imageUrl: formData.image || "https://via.placeholder.com/400",
      author: { id: "차차", temperature: 36.5 }
    };
    items.push(newItem);
    saveMockItems(items); 
    
    return { success: true, lost_item_id: newItem.id, status: "REGISTERED" };
  },

  // 특정 게시글 상세 조회
  getItemDetail: async (itemId) => {
    await delay(500);
    const items = getMockItems();
    const foundItem = items.find(item => item.id === itemId);
    if (!foundItem) throw new Error("게시글을 찾을 수 없습니다.");
    return foundItem;
  },

  // 유사 습득물 조회 (가상 DB에서 습득물만 필터링)
  getSimilarFoundItems: async (lostItemId) => {
    await delay(1200); 
    const items = getMockItems();
    const foundItems = items.filter(item => item.mode === 'found');
    
    return foundItems.map((item, index) => ({
      id: item.id,
      title: item.title,
      content: item.content, 
      keywords: item.keywords,
      img: item.imageUrl,
      // 💡 핵심 해결 포인트: 원래 아이템에 점수가 있으면 그걸 유지하고, 새로 등록된 애들만 임의로 점수 부여!
      similarity_score: item.similarity_score || Math.max(95 - (index * 5), 10),
      location: item.location
    }));
  },

  // 습득물 수정 (가상 DB 업데이트)
  editFoundItem: async (itemId, formData) => {
    await delay(800);
    const items = getMockItems();
    const index = items.findIndex(item => item.id === itemId);
    if (index > -1) {
      items[index] = { ...items[index], ...formData }; 
      saveMockItems(items);
    }
    return { success: true, item_id: itemId };
  },

  // 분실물 수정 (가상 DB 업데이트)
  editLostItem: async (itemId, formData) => {
    await delay(800);
    const items = getMockItems();
    const index = items.findIndex(item => item.id === itemId);
    if (index > -1) {
      items[index] = { ...items[index], ...formData }; 
      saveMockItems(items);
    }
    return { success: true, item_id: itemId };
  }
};