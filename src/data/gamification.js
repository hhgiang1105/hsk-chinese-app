// Gamification system data

export const PANDA_STAGES = [
  { level: 0, name: 'Gấu trúc sơ sinh', emoji: '🐼', description: 'Mới bắt đầu hành trình!', minXP: 0 },
  { level: 1, name: 'Gấu trúc tập học', emoji: '🐼', hat: '🎓', description: 'Đang chăm chỉ học bài', minXP: 100 },
  { level: 2, name: 'Gấu trúc học giỏi', emoji: '🐼', hat: '👒', description: 'Tiến bộ vượt bậc!', minXP: 300 },
  { level: 3, name: 'Gấu trúc HSK Pro', emoji: '🐼', hat: '🏆', description: 'Bậc thầy tiếng Trung!', minXP: 700 },
]

export const DAILY_MISSIONS = [
  { id: 'learn10',   label: 'Học 10 từ mới',        icon: '📚', xp: 30,  target: 10,  type: 'learn' },
  { id: 'quiz5',     label: 'Trả lời đúng 5 câu',   icon: '✅', xp: 25,  target: 5,   type: 'quiz_correct' },
  { id: 'streak1',   label: 'Học ít nhất 1 phút',   icon: '⏱️', xp: 20,  target: 1,   type: 'session' },
  { id: 'flashcard5',label: 'Lật 5 thẻ ghi nhớ',    icon: '🃏', xp: 15,  target: 5,   type: 'flashcard' },
  { id: 'listen1',   label: 'Hoàn thành 1 bài nghe', icon: '🎧', xp: 35,  target: 1,   type: 'listen' },
]

export const ACHIEVEMENTS = [
  { id: 'first_word',   label: 'Từ đầu tiên',    icon: '🌱', desc: 'Học từ đầu tiên',         condition: s => s.learned >= 1 },
  { id: 'ten_words',    label: 'Chăm chỉ',       icon: '📖', desc: 'Học 10 từ',               condition: s => s.learned >= 10 },
  { id: 'fifty_words',  label: 'Nỗ lực',         icon: '💪', desc: 'Học 50 từ',               condition: s => s.learned >= 50 },
  { id: 'hundred_words',label: 'HSK Ready',      icon: '🎯', desc: 'Học 100 từ',              condition: s => s.learned >= 100 },
  { id: 'streak3',      label: '3 ngày liên tiếp',icon: '🔥', desc: 'Học 3 ngày liên tiếp',   condition: s => s.streak >= 3 },
  { id: 'streak7',      label: 'Tuần hoàn hảo',  icon: '🌟', desc: 'Học 7 ngày liên tiếp',   condition: s => s.streak >= 7 },
  { id: 'streak30',     label: 'Kiên trì',       icon: '💎', desc: 'Học 30 ngày liên tiếp',  condition: s => s.streak >= 30 },
  { id: 'quiz_ace',     label: 'Quiz Ace',       icon: '🏅', desc: 'Đạt 100% một bài quiz',   condition: s => s.perfectQuiz >= 1 },
  { id: 'xp500',        label: '500 XP',         icon: '⚡', desc: 'Tích lũy 500 XP',         condition: s => s.xp >= 500 },
  { id: 'xp2000',       label: '2000 XP',        icon: '👑', desc: 'Tích lũy 2000 XP',        condition: s => s.xp >= 2000 },
]

const MISSIONS_KEY = 'hsk_missions'
const STREAK_KEY   = 'hsk_streak'

export function loadMissions() {
  try {
    const raw = JSON.parse(localStorage.getItem(MISSIONS_KEY) || '{}')
    const today = new Date().toDateString()
    if (raw.date !== today) {
      // Reset daily missions
      return { date: today, progress: {} }
    }
    return raw
  } catch { return { date: new Date().toDateString(), progress: {} } }
}

export function saveMissions(data) {
  localStorage.setItem(MISSIONS_KEY, JSON.stringify(data))
}

export function incrementMission(missionData, type, amount = 1) {
  const progress = { ...missionData.progress }
  DAILY_MISSIONS.forEach(m => {
    if (m.type === type) {
      progress[m.id] = Math.min((progress[m.id] || 0) + amount, m.target)
    }
  })
  return { ...missionData, progress }
}

export function isMissionDone(missionData, missionId) {
  const m = DAILY_MISSIONS.find(x => x.id === missionId)
  if (!m) return false
  return (missionData.progress[missionId] || 0) >= m.target
}

export function loadStreak() {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"count":0,"lastDate":null}') }
  catch { return { count: 0, lastDate: null } }
}

export function updateStreak(streakData) {
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  if (streakData.lastDate === today) return streakData
  const count = streakData.lastDate === yesterday ? streakData.count + 1 : 1
  const updated = { count, lastDate: today }
  localStorage.setItem(STREAK_KEY, JSON.stringify(updated))
  return updated
}

export function getPandaStage(xp) {
  let stage = PANDA_STAGES[0]
  for (const s of PANDA_STAGES) {
    if (xp >= s.minXP) stage = s
  }
  return stage
}
