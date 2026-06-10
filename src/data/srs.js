// SM-2 Spaced Repetition Algorithm
// Based on SuperMemo SM-2: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2

const SRS_KEY = 'hsk_srs_data'

export function loadSRS() {
  try { return JSON.parse(localStorage.getItem(SRS_KEY) || '{}') }
  catch { return {} }
}

export function saveSRS(data) {
  localStorage.setItem(SRS_KEY, JSON.stringify(data))
}

// quality: 0-5 (0=hard fail, 3=ok, 5=easy)
export function updateSRS(data, wordId, quality) {
  const now = Date.now()
  const card = data[wordId] || { ef: 2.5, interval: 1, rep: 0, nextReview: now, history: [] }

  let { ef, interval, rep } = card

  if (quality < 3) {
    rep = 0
    interval = 1
  } else {
    if (rep === 0) interval = 1
    else if (rep === 1) interval = 6
    else interval = Math.round(interval * ef)
    rep += 1
  }

  // Update EF (Easiness Factor)
  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (ef < 1.3) ef = 1.3

  const nextReview = now + interval * 24 * 60 * 60 * 1000

  const updated = {
    ...card,
    ef: Math.round(ef * 100) / 100,
    interval,
    rep,
    nextReview,
    lastReview: now,
    history: [...(card.history || []).slice(-20), { quality, date: now }]
  }

  return { ...data, [wordId]: updated }
}

// Get words due for review today
export function getDueWords(data, allWords) {
  const now = Date.now()
  return allWords.filter(w => {
    const card = data[w.id]
    if (!card) return true // never reviewed = always due
    return card.nextReview <= now
  })
}

// Get stats
export function getSRSStats(data) {
  const cards = Object.values(data)
  const now = Date.now()
  return {
    total: cards.length,
    due: cards.filter(c => c.nextReview <= now).length,
    learning: cards.filter(c => c.rep < 3).length,
    mature: cards.filter(c => c.rep >= 3).length,
    avgEF: cards.length ? Math.round(cards.reduce((s, c) => s + c.ef, 0) / cards.length * 100) / 100 : 2.5
  }
}

// Map rating button to SM2 quality score
export function ratingToQuality(r) {
  if (r === 'hard') return 1
  if (r === 'ok')   return 3
  if (r === 'easy') return 5
  return 3
}
