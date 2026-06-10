// Bộ thủ (Radicals) database
// Mỗi chữ Hán được phân rã thành các bộ thủ với mnemonic và minh họa

export const RADICALS = {
  // Số 1-10 bộ thủ quan trọng nhất
  '一': { name: 'Nhất', meaning: 'Một', mnemonic: 'Một đường ngang — tưởng tượng mặt đất phẳng', emoji: '➖', strokes: 1 },
  '二': { name: 'Nhị', meaning: 'Hai', mnemonic: 'Hai đường ngang xếp chồng', emoji: '✌️', strokes: 2 },
  '三': { name: 'Tam', meaning: 'Ba', mnemonic: 'Ba vạch như ba bậc thang', emoji: '3️⃣', strokes: 3 },
  '人': { name: 'Nhân', meaning: 'Người', mnemonic: 'Người đang giang tay bước đi', emoji: '🚶', strokes: 2 },
  '亻': { name: 'Nhân đứng', meaning: 'Người (biến thể)', mnemonic: 'Người đứng thẳng ở cạnh trái chữ', emoji: '🧍', strokes: 2 },
  '口': { name: 'Khẩu', meaning: 'Miệng', mnemonic: 'Cái miệng vuông đang mở', emoji: '👄', strokes: 3 },
  '日': { name: 'Nhật', meaning: 'Mặt trời / Ngày', mnemonic: 'Mặt trời hình vuông với tia sáng ở giữa', emoji: '☀️', strokes: 4 },
  '月': { name: 'Nguyệt', meaning: 'Mặt trăng / Tháng', mnemonic: 'Mảnh trăng lưỡi liềm', emoji: '🌙', strokes: 4 },
  '水': { name: 'Thủy', meaning: 'Nước', mnemonic: 'Ba giọt nước đang chảy', emoji: '💧', strokes: 4 },
  '氵': { name: 'Tam thủy', meaning: 'Nước (biến thể)', mnemonic: 'Ba giọt nước bên trái', emoji: '🌊', strokes: 3 },
  '火': { name: 'Hỏa', meaning: 'Lửa', mnemonic: 'Ngọn lửa bùng lên với tàn lửa hai bên', emoji: '🔥', strokes: 4 },
  '灬': { name: 'Tứ điểm hỏa', meaning: 'Lửa (dưới)', mnemonic: 'Bốn tàn lửa bên dưới', emoji: '✨', strokes: 4 },
  '木': { name: 'Mộc', meaning: 'Cây / Gỗ', mnemonic: 'Cây có rễ ăn sâu xuống đất', emoji: '🌳', strokes: 4 },
  '土': { name: 'Thổ', meaning: 'Đất', mnemonic: 'Đất có mầm cây nhú lên', emoji: '🌱', strokes: 3 },
  '金': { name: 'Kim', meaning: 'Kim loại / Vàng', mnemonic: 'Mỏ vàng dưới lòng đất', emoji: '🥇', strokes: 8 },
  '钅': { name: 'Kim đứng', meaning: 'Kim loại (biến thể)', mnemonic: 'Kim loại bên trái chữ', emoji: '⚙️', strokes: 5 },
  '山': { name: 'Sơn', meaning: 'Núi', mnemonic: 'Ba đỉnh núi nhô lên', emoji: '⛰️', strokes: 3 },
  '女': { name: 'Nữ', meaning: 'Phụ nữ', mnemonic: 'Người phụ nữ đang quỳ', emoji: '👩', strokes: 3 },
  '子': { name: 'Tử', meaning: 'Con / Đứa trẻ', mnemonic: 'Đứa bé đang giang tay', emoji: '👶', strokes: 3 },
  '心': { name: 'Tâm', meaning: 'Trái tim / Tâm hồn', mnemonic: 'Trái tim với ba điểm là mạch đập', emoji: '❤️', strokes: 4 },
  '忄': { name: 'Thụ tâm', meaning: 'Trái tim (biến thể)', mnemonic: 'Trái tim đứng thẳng bên trái', emoji: '💗', strokes: 3 },
  '手': { name: 'Thủ', meaning: 'Tay', mnemonic: 'Bàn tay với năm ngón', emoji: '✋', strokes: 4 },
  '扌': { name: 'Tài thủ', meaning: 'Tay (biến thể)', mnemonic: 'Bàn tay đang với lấy', emoji: '🤚', strokes: 3 },
  '目': { name: 'Mục', meaning: 'Mắt', mnemonic: 'Con mắt nhìn thẳng', emoji: '👁️', strokes: 5 },
  '耳': { name: 'Nhĩ', meaning: 'Tai', mnemonic: 'Cái tai đang lắng nghe', emoji: '👂', strokes: 6 },
  '足': { name: 'Túc', meaning: 'Chân', mnemonic: 'Bàn chân đang bước', emoji: '🦶', strokes: 7 },
  '讠': { name: 'Ngôn', meaning: 'Lời nói', mnemonic: 'Miệng đang nói chuyện', emoji: '💬', strokes: 2 },
  '言': { name: 'Ngôn', meaning: 'Lời nói', mnemonic: 'Những lời nói thoát ra từ miệng', emoji: '🗣️', strokes: 7 },
  '走': { name: 'Tẩu', meaning: 'Đi / Chạy', mnemonic: 'Người đang chạy nhanh', emoji: '🏃', strokes: 7 },
  '马': { name: 'Mã', meaning: 'Ngựa', mnemonic: 'Con ngựa đang phi nước đại', emoji: '🐴', strokes: 3 },
  '鱼': { name: 'Ngư', meaning: 'Cá', mnemonic: 'Con cá bơi trong nước', emoji: '🐟', strokes: 8 },
  '鸟': { name: 'Điểu', meaning: 'Chim', mnemonic: 'Con chim đang bay', emoji: '🐦', strokes: 5 },
  '力': { name: 'Lực', meaning: 'Sức mạnh', mnemonic: 'Cánh tay gân guốc đang dùng sức', emoji: '💪', strokes: 2 },
  '刀': { name: 'Đao', meaning: 'Dao', mnemonic: 'Lưỡi dao sắc bén', emoji: '🔪', strokes: 2 },
  '刂': { name: 'Lập đao', meaning: 'Dao (biến thể)', mnemonic: 'Dao đứng bên phải chữ', emoji: '⚔️', strokes: 2 },
  '大': { name: 'Đại', meaning: 'Lớn', mnemonic: 'Người đứng giang rộng tay — to lớn', emoji: '🙆', strokes: 3 },
  '小': { name: 'Tiểu', meaning: 'Nhỏ', mnemonic: 'Ba điểm nhỏ li ti', emoji: '🔍', strokes: 3 },
  '白': { name: 'Bạch', meaning: 'Trắng', mnemonic: 'Mặt trời vừa mọc — ánh sáng trắng', emoji: '⬜', strokes: 5 },
  '黑': { name: 'Hắc', meaning: 'Đen', mnemonic: 'Bếp lửa bị bồ hóng che phủ', emoji: '⬛', strokes: 12 },
  '雨': { name: 'Vũ', meaning: 'Mưa', mnemonic: 'Mây với những giọt mưa rơi xuống', emoji: '🌧️', strokes: 8 },
}

// Phân rã từng chữ Hán thành bộ thủ
export const DECOMPOSITIONS = {
  '你': {
    radicals: ['亻', '尔'],
    story: '亻(người) + 尔(tiếng cổ nghĩa là bạn) → Người đang nói với bạn',
    components: [
      { char: '亻', pos: 'left', meaning: 'Người', color: '#4DBFB0' },
      { char: '尔', pos: 'right', meaning: 'Bạn (cổ)', color: '#FF9800' },
    ]
  },
  '好': {
    radicals: ['女', '子'],
    story: '女(phụ nữ) + 子(đứa trẻ) → Người mẹ có con — điều tốt đẹp nhất',
    components: [
      { char: '女', pos: 'left', meaning: 'Phụ nữ', color: '#E91E63' },
      { char: '子', pos: 'right', meaning: 'Đứa trẻ', color: '#9C27B0' },
    ]
  },
  '明': {
    radicals: ['日', '月'],
    story: '日(mặt trời) + 月(mặt trăng) → Cả ngày lẫn đêm đều sáng — sáng tỏ, rõ ràng',
    components: [
      { char: '日', pos: 'left', meaning: 'Mặt trời', color: '#FF9800' },
      { char: '月', pos: 'right', meaning: 'Mặt trăng', color: '#9C27B0' },
    ]
  },
  '妈': {
    radicals: ['女', '马'],
    story: '女(phụ nữ) + 马(ngựa) → Người phụ nữ mạnh mẽ như ngựa — đó là mẹ!',
    components: [
      { char: '女', pos: 'left', meaning: 'Phụ nữ', color: '#E91E63' },
      { char: '马', pos: 'right', meaning: 'Ngựa', color: '#795548' },
    ]
  },
  '爸': {
    radicals: ['父', '巴'],
    story: '父(cha) + 巴(mong đợi) → Người cha được mong đợi trở về',
    components: [
      { char: '父', pos: 'top', meaning: 'Cha', color: '#2196F3' },
      { char: '巴', pos: 'bottom', meaning: 'Mong đợi', color: '#FF9800' },
    ]
  },
  '说': {
    radicals: ['讠', '兑'],
    story: '讠(lời nói) + 兑(đổi, trao đổi) → Trao đổi lời nói với nhau',
    components: [
      { char: '讠', pos: 'left', meaning: 'Lời nói', color: '#4DBFB0' },
      { char: '兑', pos: 'right', meaning: 'Trao đổi', color: '#FF9800' },
    ]
  },
  '吃': {
    radicals: ['口', '乞'],
    story: '口(miệng) + 乞(xin) → Miệng đang xin ăn — ăn uống',
    components: [
      { char: '口', pos: 'left', meaning: 'Miệng', color: '#F44336' },
      { char: '乞', pos: 'right', meaning: 'Xin', color: '#FF9800' },
    ]
  },
  '喝': {
    radicals: ['口', '曷'],
    story: '口(miệng) + 曷(tại sao/kêu) → Miệng đang kêu khát — uống nước',
    components: [
      { char: '口', pos: 'left', meaning: 'Miệng', color: '#F44336' },
      { char: '曷', pos: 'right', meaning: 'Kêu gào', color: '#FF9800' },
    ]
  },
  '看': {
    radicals: ['手', '目'],
    story: '手(tay) + 目(mắt) → Tay che trán nhìn xa — nhìn xem',
    components: [
      { char: '手', pos: 'top', meaning: 'Tay che mắt', color: '#4DBFB0' },
      { char: '目', pos: 'bottom', meaning: 'Mắt', color: '#2196F3' },
    ]
  },
  '听': {
    radicals: ['口', '斤'],
    story: '口(miệng) + 斤(cái rìu) → Tập trung lắng nghe như tai rìu bén',
    components: [
      { char: '口', pos: 'left', meaning: 'Miệng/Tai', color: '#F44336' },
      { char: '斤', pos: 'right', meaning: 'Sắc bén', color: '#607D8B' },
    ]
  },
  '学': {
    radicals: ['⺍', '子'],
    story: '⺍(học) + 子(đứa trẻ) → Đứa trẻ đang học hành',
    components: [
      { char: '⺍', pos: 'top', meaning: 'Học hỏi', color: '#3F51B5' },
      { char: '子', pos: 'bottom', meaning: 'Đứa trẻ', color: '#9C27B0' },
    ]
  },
  '工': {
    radicals: ['工'],
    story: '工 — Hình ảnh cái thước thợ mộc — công việc, lao động',
    components: [
      { char: '工', pos: 'center', meaning: 'Thước thợ', color: '#795548' },
    ]
  },
  '休': {
    radicals: ['亻', '木'],
    story: '亻(người) + 木(cây) → Người tựa vào gốc cây để nghỉ ngơi',
    components: [
      { char: '亻', pos: 'left', meaning: 'Người', color: '#4DBFB0' },
      { char: '木', pos: 'right', meaning: 'Cây', color: '#4CAF50' },
    ]
  },
  '男': {
    radicals: ['田', '力'],
    story: '田(ruộng) + 力(sức mạnh) → Người dùng sức cày ruộng — đàn ông',
    components: [
      { char: '田', pos: 'top', meaning: 'Ruộng', color: '#8BC34A' },
      { char: '力', pos: 'bottom', meaning: 'Sức mạnh', color: '#F44336' },
    ]
  },
  '朋': {
    radicals: ['月', '月'],
    story: '月 + 月 → Hai mảnh trăng sánh đôi — bạn bè thân thiết',
    components: [
      { char: '月', pos: 'left', meaning: 'Trăng', color: '#9C27B0' },
      { char: '月', pos: 'right', meaning: 'Trăng', color: '#673AB7' },
    ]
  },
  '想': {
    radicals: ['相', '心'],
    story: '相(nhìn nhau) + 心(trái tim) → Tim nhớ mãi hình ảnh — suy nghĩ, nhớ nhung',
    components: [
      { char: '相', pos: 'top', meaning: 'Hình ảnh', color: '#2196F3' },
      { char: '心', pos: 'bottom', meaning: 'Trái tim', color: '#E91E63' },
    ]
  },
}

export function getDecomposition(char) {
  return DECOMPOSITIONS[char] || null
}

export function getRadical(char) {
  return RADICALS[char] || null
}
