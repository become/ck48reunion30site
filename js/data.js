/* ============================================================
   CK48 Reunion — Mock Data
   建中第48屆畢業30年重聚官方網站
   ============================================================ */

const CK48_DATA = {

  news: [
    {
      id: 1,
      title: "重聚官網正式上線",
      slug: "site-launch",
      date: "2026-05-01",
      category: "公告",
      summary: "建中第48屆30年重聚官方網站正式上線，歡迎各位同學前來查看活動資訊、報名及找同學。",
      coverEmoji: "🏫",
      content: `<p>親愛的建中第48屆同學們，</p>
        <p>建中第48屆30年重聚官方網站今日正式上線！本站集結了活動資訊、找同學功能、回憶照片與最新消息，歡迎各位同學踴躍使用。</p>
        <p>請各位同學協助轉發給班上同學，讓更多人知道這次難得的重聚機會。如有任何問題，歡迎透過臉書社團聯絡籌備委員會。</p>
        <p>三十再聚，少年依舊！</p>
        <p>— 建中第48屆30年重聚籌備委員會</p>`
    },
    {
      id: 3,
      title: "尋找失聯同學，請大家幫幫忙",
      slug: "find-missing-alumni",
      date: "2026-07-10",
      category: "找人進度",
      summary: "籌備委員會正在努力聯繫所有同學，目前仍有部分班級聯絡名單不完整，請大家協助轉傳。",
      coverEmoji: "🔍",
      content: `<p>各位同學，</p>
        <p>目前仍有幾個班級的聯絡名單不完整，以下班級特別需要協助找人。如果你有這些班級同學的聯絡方式，請透過本站「找同學」功能或臉書社團留言通知我們。</p>
        <p>我們希望能讓每一位同學都參加這次難得的30年重聚，請大家多多協助！</p>`
    },
  ],

  timeline: [
    {
      date: "2026-02-28",
      title: "選出48屆建中重聚總召",
      description: "經過多次討論，正式選出建中第48屆30年重聚總召集人，啟動籌備工作。",
      highlight: false
    },
    {
      date: "2026-03-21",
      title: "召開第一次籌備委員會",
      description: "建中第48屆30年重聚籌備委員會正式成立並召開第一次會議，展開重聚活動規劃作業。",
      highlight: false
    },
    {
      date: "2026-05-01",
      title: "官網正式上線",
      description: "重聚官方網站正式對外開放，歡迎同學瀏覽活動資訊並填寫意向表。",
      highlight: false
    },
    {
      date: "2026-07-01",
      title: "報名系統開放",
      description: "活動報名正式開放，同學可選擇參加重聚餐會、返校日或兩者皆參加。",
      highlight: false
    },
    {
      date: "2026-08-01",
      title: "紀念商品開始預購",
      description: "紀念T恤、帽子、馬克杯等限量商品開放預購，數量有限請儘早訂購。",
      highlight: false
    },
    {
      date: "2026-10-31",
      title: "報名截止",
      description: "活動報名截止，請尚未報名的同學儘速完成報名作業（額滿為止）。",
      highlight: false
    },
    {
      date: "2026-12-19",
      title: "重聚餐會 🎉",
      description: "建中第48屆30年重聚晚宴，於台北市五星級飯店舉行，歡迎所有同學共聚一堂。",
      highlight: true
    },
    {
      date: "2026-12-20",
      title: "返校日園遊會 🏫",
      description: "重回建中校園，參觀母校、班級大合照，重溫青春歲月。",
      highlight: true
    },
    {
      date: "",
      title: "故事持續進行中…",
      description: "三十年的情誼，故事未完待續。期待與你相見。",
      highlight: true
    }
  ],

  memoryPhotos: [
    { id: 1, title: "建中紅樓晨景", category: "校園點滴", emoji: "🏛️" },
    { id: 2, title: "47年前的畢業典禮", category: "經典收藏", emoji: "🎓" },
    { id: 3, title: "甲班全班合影", category: "校園點滴", emoji: "👥" },
    { id: 4, title: "合唱團公演", category: "社團活動", emoji: "🎵" },
    { id: 5, title: "校慶運動會", category: "校園點滴", emoji: "🏃" },
    { id: 6, title: "圖書館讀書時光", category: "校園點滴", emoji: "📚" },
    { id: 7, title: "畢業舞會", category: "經典收藏", emoji: "🌟" },
    { id: 8, title: "乙班班遊", category: "校園點滴", emoji: "🚌" },
    { id: 9, title: "籃球隊征戰", category: "社團活動", emoji: "🏀" },
    { id: 10, title: "校友投稿：30年後", category: "經典收藏", emoji: "📷" },
    { id: 11, title: "丙班同學聚餐", category: "校園點滴", emoji: "🍜" },
    { id: 12, title: "國樂社演奏會", category: "社團活動", emoji: "🎻" }
  ],

  eventPhotos: [
    { id: 1, title: "重聚餐會開場", category: "重聚餐會", emoji: "🥂" },
    { id: 2, title: "老師致詞", category: "重聚餐會", emoji: "🎤" },
    { id: 3, title: "同學重聚感言", category: "重聚餐會", emoji: "💬" },
    { id: 4, title: "返校日大合照", category: "大合照", emoji: "📸" },
    { id: 5, title: "校園巡禮", category: "返校日", emoji: "🏫" },
    { id: 6, title: "重聚餐會合影", category: "重聚餐會", emoji: "👨‍👩‍👧‍👦" },
    { id: 7, title: "各班合照留念", category: "大合照", emoji: "🎯" },
    { id: 8, title: "花絮：重逢歡笑", category: "花絮", emoji: "😄" }
  ],

  faq: [
    {
      question: "這次活動只有建中48屆可以參加嗎？",
      answer: "本次活動以建中第48屆校友為主辦對象。若您是48屆校友的配偶或重要他人，部分場次可酌情邀請同行，請透過報名表備註說明。"
    },
    {
      question: "活動費用如何計算？",
      answer: "重聚餐會每人費用約新台幣3,000至4,000元（含晚宴、活動費用），確切金額將於報名開放時公告。返校日活動免費，但大合照印刷費用另計。"
    },
    {
      question: "如何找到失聯的同班同學？",
      answer: "您可以透過本站「找同學」頁面進行驗證後，查詢班級同學的聯絡資訊。此外，也可以加入建中48屆校友臉書社團，在社群中尋找同學。"
    },
    {
      question: "報名後如何付款？",
      answer: "報名完成後，系統將發送確認信至您填寫的Email，並提供匯款帳號及截止日期。請於期限內完成繳費以確認報名資格。"
    },
    {
      question: "我住在海外，可以透過視訊方式參加嗎？",
      answer: "籌備委員會正在評估是否提供線上參與管道，若確定開放將另行公告。建議海外同學仍可考慮回台參加，這是難得的30年重聚！"
    },
    {
      question: "紀念商品可以在活動當天購買嗎？",
      answer: "部分商品將在活動現場販售，但數量有限。建議提前透過本站紀念商品頁面預購，以確保取得心儀商品。"
    },
    {
      question: "活動地點在哪裡？如何前往？",
      answer: "重聚餐會地點位於台北市中心，詳細地址及交通資訊將於確認場地後公告於「活動資訊」頁面。返校日於建中校園舉行。"
    },
    {
      question: "如果報名後臨時無法出席，可以退費嗎？",
      answer: "活動截止日期前取消報名，可退還已繳費用之80%。截止日期後因已支付場地及餐飲費用，恕無法退費，但可轉讓給其他48屆校友。"
    }
  ],

  products: [
    {
      id: 1,
      name: "CK48 紀念T恤",
      slug: "tshirt",
      price: 680,
      category: "服飾",
      emoji: "👕",
      description: "採用舒適棉質布料，印有CK48 Reunion標誌設計，正背面均有精緻圖案。",
      sizes: ["S", "M", "L", "XL", "2XL"],
      colors: ["深藍", "米白"]
    },
    {
      id: 2,
      name: "CK48 棒球帽",
      slug: "baseball-cap",
      price: 480,
      category: "服飾",
      emoji: "🧢",
      description: "可調式棒球帽，刺繡CK48標誌，一尺寸適合所有人。",
      colors: ["深藍", "酒紅"]
    },
    {
      id: 3,
      name: "建中48 紀念馬克杯",
      slug: "mug",
      price: 380,
      category: "紀念品",
      emoji: "☕",
      description: "陶瓷馬克杯，容量350ml，印有建中紅樓插圖及「三十再聚，少年依舊」字樣。"
    },
    {
      id: 4,
      name: "CK48 重聚紀念冊",
      slug: "yearbook",
      price: 1200,
      category: "紀念品",
      emoji: "📖",
      description: "精裝紀念冊，收錄各班同學近況、老師寄語、歷史照片及活動記錄，珍藏版限量發行。"
    },
    {
      id: 5,
      name: "校徽琺瑯徽章組",
      slug: "enamel-pins",
      price: 280,
      category: "紀念品",
      emoji: "📌",
      description: "精緻琺瑯徽章一組三枚，含建中校徽、CK48標誌及30週年紀念款設計。"
    },
    {
      id: 6,
      name: "CK48 環保帆布袋",
      slug: "tote-bag",
      price: 320,
      category: "其他",
      emoji: "👜",
      description: "厚實帆布材質，耐用大容量，印有CK48 Reunion圖樣，日常通勤好夥伴。"
    }
  ],

  classes: [
    "甲班", "乙班", "丙班", "丁班", "戊班",
    "己班", "庚班", "辛班", "壬班", "癸班",
    "子班", "丑班", "寅班", "卯班", "辰班"
  ]
};

// Utility: format date
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
}
