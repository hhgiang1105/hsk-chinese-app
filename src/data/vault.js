// The Kanji Vault — Hầm Trú Ẩn Hán Tự
// Quản lý từ đã thuộc, memory decay, mastery badges

const VAULT_KEY = 'hsk_kanji_vault'

export function loadVault() {
  try { return JSON.parse(localStorage.getItem(VAULT_KEY) || '{}') }
  catch { return {} }
}

export function saveVault(data) {
  localStorage.setItem(VAULT_KEY, JSON.stringify(data))
}

// Thêm từ vào vault khi đánh dấu "Dễ" hoặc "Ổn"
export function addToVault(vault, word, rating) {
  const now = Date.now()
  const existing = vault[word.id]
  return {
    ...vault,
    [word.id]: {
      word,
      addedAt: existing?.addedAt || now,
      lastReviewed: now,
      memoryStrength: rating === 'easy' ? 1.0 : 0.75,
      reviewCount: (existing?.reviewCount || 0) + 1,
      status: 'mastered', // 'mastered' | 'learning' | 'skipped'
      rating,
    }
  }
}

// Tính memory strength dựa trên thời gian
export function calcMemoryStrength(entry) {
  if (!entry.lastReviewed) return 0
  const daysSince = (Date.now() - entry.lastReviewed) / (1000 * 60 * 60 * 24)
  const decayRate = 30 // giảm 50% sau 30 ngày
  const decay = Math.pow(0.5, daysSince / decayRate)
  return Math.max(0.05, entry.memoryStrength * decay)
}

// Refresh entry khi người dùng review lại
export function refreshEntry(vault, wordId) {
  const entry = vault[wordId]
  if (!entry) return vault
  return {
    ...vault,
    [wordId]: {
      ...entry,
      lastReviewed: Date.now(),
      memoryStrength: 1.0,
      reviewCount: (entry.reviewCount || 0) + 1,
    }
  }
}

// Resurrect — đưa từ về learning
export function resurrectWord(vault, wordId) {
  const entry = vault[wordId]
  if (!entry) return vault
  return {
    ...vault,
    [wordId]: { ...entry, status: 'learning', memoryStrength: 0.3 }
  }
}

// Mastery badges
export const MASTERY_BADGES = [
  {
    id: 'novice',    count: 10,   icon: '🌱', name: 'Mầm Hán Tự',
    desc: '10 từ đầu tiên', pandaSkin: '🐼', pandaItem: 'Mũ học sinh',
  },
  {
    id: 'learner',   count: 50,   icon: '📖', name: 'Tân Thủ Giang Hồ',
    desc: '50 từ đã thuộc', pandaSkin: '🎓', pandaItem: 'Kính học giả',
  },
  {
    id: 'scholar',   count: 100,  icon: '🏮', name: 'Học Giả Hán Học',
    desc: '100 từ đã thuộc', pandaSkin: '👘', pandaItem: 'Áo học giả',
  },
  {
    id: 'master',    count: 300,  icon: '⚡', name: 'Cao Thủ Ngôn Ngữ',
    desc: '300 từ đã thuộc', pandaSkin: '🧧', pandaItem: 'Dải lụa đỏ',
  },
  {
    id: 'grandmaster', count: 699, icon: '👑', name: 'Bậc Thầy Hán Tự',
    desc: 'Thuộc toàn bộ HSK', pandaSkin: '🏆', pandaItem: 'Vương miện vàng',
  },
]

export function getEarnedBadges(masteredCount) {
  return MASTERY_BADGES.filter(b => masteredCount >= b.count)
}

export function getNextBadge(masteredCount) {
  return MASTERY_BADGES.find(b => masteredCount < b.count)
}

// Crystal glow color based on memory strength
export function getCrystalStyle(strength) {
  if (strength >= 0.8) return { color: '#4DBFB0', glow: 'rgba(77,191,176,0.6)', label: '💎 Hoàn hảo' }
  if (strength >= 0.6) return { color: '#5B9CF6', glow: 'rgba(91,156,246,0.5)', label: '🔵 Tốt' }
  if (strength >= 0.4) return { color: '#FF9800', glow: 'rgba(255,152,0,0.5)',   label: '🟡 Phai mờ' }
  if (strength >= 0.2) return { color: '#FF6B6B', glow: 'rgba(255,107,107,0.4)', label: '🔴 Cần ôn' }
  return { color: '#9E9E9E', glow: 'rgba(158,158,158,0.3)', label: '⬛ Quên rồi' }
}
