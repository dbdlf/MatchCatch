import { delay } from './index';

const getMockItems = () => JSON.parse(localStorage.getItem('mockItems')) || [];
const saveMockItems = (items) => localStorage.setItem('mockItems', JSON.stringify(items));

const MOCK_AI_RESULTS = [
  {
    title: '검정 가죽 반지갑',
    description: '검정색 가죽 소재의 반지갑으로, 카드 슬롯 3개와 지폐 칸이 있습니다. 뒷면에 긁힌 자국이 있습니다.',
    keywords: '지갑, 검정, 가죽, 반지갑, 카드지갑',
  },
  {
    title: '은색 에어팟 케이스',
    description: '애플 에어팟 2세대 흰색 충전 케이스입니다. 케이스 표면에 스티커 자국이 남아 있습니다.',
    keywords: '에어팟, 이어폰, 흰색, 애플, 충전케이스',
  },
  {
    title: '네이비 백팩',
    description: '네이비 컬러의 중형 백팩으로, 앞면에 작은 포켓이 2개 달려 있습니다. 왼쪽 어깨끈에 열쇠고리가 달려 있습니다.',
    keywords: '가방, 백팩, 네이비, 학생가방',
  },
  {
    title: '갤럭시 스마트폰',
    description: '삼성 갤럭시 시리즈로 보이는 검정색 스마트폰입니다. 투명 케이스가 씌워져 있으며 화면에 금이 가 있습니다.',
    keywords: '스마트폰, 핸드폰, 삼성, 갤럭시, 검정',
  },
  {
    title: '빨간 우산',
    description: '빨간색 접이식 우산으로, 손잡이 부분이 투명 플라스틱 소재입니다. 우산 끝에 흰색 고무 마개가 있습니다.',
    keywords: '우산, 빨강, 접이식, 장우산',
  },
];

export const analyzeImage = async (base64Image, mimeType) => {
  await delay(1000 + Math.random() * 500);
  const result = MOCK_AI_RESULTS[2];
  return { ...result };

};

const MOCK_LOCATIONS = [
  '대전 유성구 대학로 99 충남대학교',
  '대전 유성구 궁동 충남대 정문 앞',
  '대전 서구 둔산동 갤러리아 타임월드',
  '대전 중구 은행동 성심당 본점 근처',
  '대전 유성구 봉명동 유성온천역',
];

export const getMockLocationAndTime = async () => {
  await delay(600);
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const datetime = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const location = MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)];
  return { datetime, location };

};

export const itemApi = {
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
      imageUrl: formData.image || 'https://via.placeholder.com/400',
      keywords: 'AI, 자동, 추출, 키워드',
      author: { id: '차차', temperature: 36.5 },
    };
    items.push(newItem);
    saveMockItems(items);
    return { success: true, found_item_id: newItem.id, status: 'REGISTERED' };
  },

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
      imageUrl: formData.image || 'https://via.placeholder.com/400',
      author: { id: '차차', temperature: 36.5 },
    };
    items.push(newItem);
    saveMockItems(items);
    return { success: true, lost_item_id: newItem.id, status: 'REGISTERED' };
  },

  getItemDetail: async (itemId) => {
    await delay(500);
    const items = getMockItems();
    const found = items.find(item => item.id === itemId);
    if (!found) throw new Error('게시글을 찾을 수 없습니다.');
    return found;
  },

  getSimilarFoundItems: async (lostItemId) => {
    await delay(1200);
    return [
      {
        id: 'dummy_search_4',
        content: '노란색 장우산입니다. 손잡이 부분은 갈색입니다.',
        keywords: '노란색, 우산, 장우산, 갈색',
        img: '/images/yellow.jpeg',
        similarity_score: 95.5,
      },
      {
        id: 'dummy_search_1',
        content: '연두색 장우산입니다. 손잡이 부분은 갈색입니다.',
        keywords: '연두색, 우산, 장우산, 갈색',
        img: '/images/green.jpeg',
        similarity_score: 80.5,
      },
      {
        id: 'dummy_search_3',
        content: '회색 장우산입니다. 손잡이 부분은 검은색입니다.',
        keywords: '회색, 우산, 장우산, 검은색',
        img: '/images/grey.jpeg',
        similarity_score: 73.2,
      },
      {
        id: 'dummy_search_2',
        content: '흰색 단우산입니다. 남색 줄무늬가 있어요.',
        keywords: '흰색, 우산, 단우산, 남색, 줄무늬',
        img: '/images/white.jpeg',
        similarity_score: 35.0,
      },
    ];
  },

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

  editLostItem: async (itemId, formData) => {
    await delay(800);
    const items = getMockItems();
    const index = items.findIndex(item => item.id === itemId);
    if (index > -1) {
      items[index] = { ...items[index], ...formData };
      saveMockItems(items);
    }
    return { success: true, item_id: itemId };
  },
};