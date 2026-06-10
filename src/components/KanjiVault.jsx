import { useState, useMemo } from 'react'
import {
  loadVault, saveVault, calcMemoryStrength, refreshEntry,
  resurrectWord, getEarnedBadges, getNextBadge, getCrystalStyle,
  MASTERY_BADGES
} from '../data/vault.js'
import { CATEGORIES, HSK1 } from '../data/hsk1.js'
import './KanjiVault.css'

const FILTERS_TIME   = ['Tất cả', 'Tuần này', 'Tháng này']
const FILTERS_STATUS = ['Tất cả', 'Hoàn hảo', 'Phai mờ', 'Cần ôn', 'Hồi sinh']

function speak(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'zh-CN'; u.rate = 0.8
    speechSynthesis.speak(u)
  }
}

// ── Main ─────────────────────────────────────────────
export default function KanjiVault({ onResurrect }) {
  const [vault, setVault]           = useState(loadVault)
  const [search, setSearch]         = useState('')
  const [filterCat, setFilterCat]   = useState('Tất cả')
  const [filterTime, setFilterTime] = useState('Tất cả')
  const [filterStatus, setFilterStatus] = useState('Tất cả')
  const [selected, setSelected]     = useState(null)
  const [showBlitz, setShowBlitz]   = useState(false)
  const [tab, setTab]               = useState('vault')

  const entries = useMemo(() =>
    Object.values(vault).map(e => ({ ...e, currentStrength: calcMemoryStrength(e) }))
  , [vault])

  const masteredEntries = entries.filter(e => e.status === 'mastered')
  const masteredCount   = masteredEntries.length
  const earnedBadges    = getEarnedBadges(masteredCount)
  const nextBadge       = getNextBadge(masteredCount)
  const avgStrength     = masteredCount > 0
    ? Math.round(masteredEntries.reduce((s, e) => s + e.currentStrength, 0) / masteredCount * 100)
    : 0
  const weakWords = masteredEntries
    .filter(e => e.currentStrength < 0.6)
    .slice(0, 5)

  const filtered = useMemo(() => {
    const now = Date.now()
    const oneWeek  = 7  * 86400000
    const oneMonth = 30 * 86400000
    return entries.filter(e => {
      if (search) {
        const q = search.toLowerCase()
        if (!e.word.h.includes(q) && !e.word.p.toLowerCase().includes(q) && !e.word.m.toLowerCase().includes(q)) return false
      }
      if (filterCat !== 'Tất cả' && (e.word.cat || e.word.c) !== filterCat) return false
      if (filterTime === 'Tuần này'  && (now - e.addedAt) > oneWeek)  return false
      if (filterTime === 'Tháng này' && (now - e.addedAt) > oneMonth) return false
      if (filterStatus === 'Hoàn hảo' && e.currentStrength < 0.8)   return false
      if (filterStatus === 'Phai mờ'  && (e.currentStrength < 0.4 || e.currentStrength >= 0.8)) return false
      if (filterStatus === 'Cần ôn'   && e.currentStrength >= 0.4)   return false
      if (filterStatus === 'Hồi sinh' && e.status !== 'learning')    return false
      return true
    })
  }, [entries, search, filterCat, filterTime, filterStatus])

  function handleRefresh(wordId) {
    const updated = refreshEntry(vault, wordId)
    setVault(updated); saveVault(updated)
  }

  function handleResurrect(wordId) {
    const updated = resurrectWord(vault, wordId)
    setVault(updated); saveVault(updated)
    setSelected(null)
    onResurrect && onResurrect(wordId)
  }

  function handleBlitzFinish(score) {
    let updated = vault
    weakWords.forEach(e => { updated = refreshEntry(updated, e.word.id) })
    setVault(updated); saveVault(updated)
    setShowBlitz(false)
  }

  return (
    <div className="kv-screen">
      {/* Header */}
      <div className="kv-header">
        <div className="kv-header-bg" />
        <div className="kv-header-content">
          <div className="kv-header-title">🏛️ Hầm Trú Ẩn Hán Tự</div>
          <div className="kv-header-sub">THE KANJI VAULT</div>
          <div className="kv-stats-row">
            {[
              { val: masteredCount, lbl: 'Đã thuộc' },
              { val: `${avgStrength}%`, lbl: 'Trí nhớ TB' },
              { val: weakWords.length, lbl: 'Cần ôn' },
              { val: earnedBadges.length, lbl: 'Huy hiệu' },
            ].map((s, i) => (
              <div key={i} className="kv-stat">
                <div className="kv-stat-val">{s.val}</div>
                <div className="kv-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="kv-tabs">
        <button className={`kv-tab ${tab==='vault'?'active':''}`} onClick={() => setTab('vault')}>
          💎 Kho báu ({masteredCount})
        </button>
        <button className={`kv-tab ${tab==='badges'?'active':''}`} onClick={() => setTab('badges')}>
          🏅 Huy hiệu ({earnedBadges.length}/{MASTERY_BADGES.length})
        </button>
      </div>

      {/* VAULT TAB */}
      {tab === 'vault' && (
        <>
          {/* Blitz banner */}
          {weakWords.length > 0 && (
            <div className="kv-blitz-banner" onClick={() => setShowBlitz(true)}>
              <div className="kv-blitz-icon">⚡</div>
              <div className="kv-blitz-text">
                <div className="kv-blitz-title">Thử thách Rã Đông!</div>
                <div className="kv-blitz-sub">{weakWords.length} từ đang phai mờ — Quiz để sạc đầy</div>
              </div>
              <div className="kv-blitz-arrow">›</div>
            </div>
          )}

          {/* Next badge progress */}
          {nextBadge && masteredCount > 0 && (
            <div className="kv-next-badge">
              <span className="kv-next-badge-icon">{nextBadge.icon}</span>
              <div className="kv-next-badge-info">
                <div className="kv-next-badge-name">{nextBadge.name}</div>
                <div className="kv-next-badge-prog-wrap">
                  <div className="kv-next-badge-prog">
                    <div className="kv-next-badge-fill"
                      style={{ width:`${Math.min(100,(masteredCount/nextBadge.count)*100)}%` }} />
                  </div>
                  <span className="kv-next-badge-count">{masteredCount}/{nextBadge.count}</span>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="kv-search-wrap">
            <span className="kv-search-icon">🔍</span>
            <input className="kv-search" type="text"
              placeholder="Tìm chữ Hán, pinyin, tiếng Việt..."
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button className="kv-clear" onClick={() => setSearch('')}>✕</button>}
          </div>

          {/* Filters */}
          <div className="kv-filters">
            <div className="kv-filter-row">
              {FILTERS_TIME.map(f => (
                <button key={f} className={`kv-filter-btn ${filterTime===f?'active':''}`}
                  onClick={() => setFilterTime(f)}>{f}</button>
              ))}
            </div>
            <div className="kv-filter-row">
              {FILTERS_STATUS.map(f => (
                <button key={f} className={`kv-filter-btn ${filterStatus===f?'active':''}`}
                  onClick={() => setFilterStatus(f)}>{f}</button>
              ))}
            </div>
            <div className="kv-filter-row">
              {['Tất cả', ...CATEGORIES.slice(0,8)].map(c => (
                <button key={c} className={`kv-filter-btn ${filterCat===c?'active':''}`}
                  onClick={() => setFilterCat(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div className="kv-count">{filtered.length} từ vựng</div>

          {/* Crystal grid */}
          {filtered.length === 0 ? (
            <div className="kv-empty">
              {masteredCount === 0 ? (
                <>
                  <div style={{fontSize:56,marginBottom:12}}>🏛️</div>
                  <div style={{fontSize:16,fontWeight:800,color:'var(--text)'}}>Hầm trú ẩn đang trống</div>
                  <div style={{fontSize:13,color:'var(--text3)',marginTop:6,lineHeight:1.6}}>
                    Học thẻ ghi nhớ và đánh dấu "Dễ" hoặc "Ổn"<br/>để tích lũy pha lê vào đây!
                  </div>
                </>
              ) : (
                <><div style={{fontSize:40,marginBottom:8}}>🔍</div><div>Không tìm thấy từ nào</div></>
              )}
            </div>
          ) : (
            <div className="kv-grid">
              {filtered.map(entry => {
                const st = getCrystalStyle(entry.currentStrength)
                return (
                  <div key={entry.word.id} className="kv-crystal"
                    style={{'--crystal-color':st.color,'--crystal-glow':st.glow}}
                    onClick={() => setSelected(entry)}
                  >
                    <div className="kv-crystal-inner">
                      <div className="kv-crystal-shine" />
                      <div className="kv-crystal-hanzi hanzi">{entry.word.h}</div>
                      <div className="kv-crystal-pinyin">{entry.word.p}</div>
                      <div className="kv-crystal-bar">
                        <div className="kv-crystal-fill"
                          style={{width:`${entry.currentStrength*100}%`,background:st.color}} />
                      </div>
                    </div>
                    {entry.status === 'learning' && <div className="kv-resurrect-badge">↩</div>}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* BADGES TAB */}
      {tab === 'badges' && (
        <div className="kv-badges-screen">
          <div className="kv-badges-intro">
            Tích lũy từ vựng để mở khóa trang phục cho <strong>Gấu trúc Bao</strong> 🐼
          </div>
          <div className="kv-badges-list">
            {MASTERY_BADGES.map(badge => {
              const earned = masteredCount >= badge.count
              const pct = Math.min(100,(masteredCount/badge.count)*100)
              return (
                <div key={badge.id} className={`kv-badge-card ${earned?'earned':'locked'}`}>
                  <div className="kv-badge-icon-wrap">
                    <div className="kv-badge-icon">{earned ? badge.icon : '🔒'}</div>
                    {earned && <div className="kv-badge-glow" />}
                  </div>
                  <div className="kv-badge-info">
                    <div className="kv-badge-name">{badge.name}</div>
                    <div className="kv-badge-desc">{badge.desc}</div>
                    <div className="kv-badge-reward">🐼 Phần thưởng: <span>{badge.pandaItem}</span></div>
                    {!earned && (
                      <div className="kv-badge-prog-wrap">
                        <div className="kv-badge-prog-bar">
                          <div className="kv-badge-prog-fill" style={{width:`${pct}%`}} />
                        </div>
                        <span className="kv-badge-prog-text">{masteredCount}/{badge.count}</span>
                      </div>
                    )}
                  </div>
                  {earned && <div className="kv-badge-earned-mark">✓</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      {selected && (
        <CrystalModal
          entry={selected}
          onClose={() => setSelected(null)}
          onRefresh={() => { handleRefresh(selected.word.id); setSelected(null) }}
          onResurrect={() => handleResurrect(selected.word.id)}
        />
      )}
      {showBlitz && (
        <BlitzQuiz
          words={weakWords}
          onFinish={handleBlitzFinish}
          onClose={() => setShowBlitz(false)}
        />
      )}
    </div>
  )
}

// ── Crystal Detail Modal ─────────────────────────────
function CrystalModal({ entry, onClose, onRefresh, onResurrect }) {
  const [revealed, setRevealed] = useState(false)
  const strength  = calcMemoryStrength(entry)
  const style     = getCrystalStyle(strength)
  const daysSince = Math.floor((Date.now() - entry.lastReviewed) / 86400000)

  return (
    <div className="kv-modal-overlay" onClick={onClose}>
      <div className="kv-modal" onClick={e => e.stopPropagation()}>
        <button className="kv-modal-close" onClick={onClose}>✕</button>

        <div className="kv-modal-crystal"
          style={{'--crystal-color':style.color,'--crystal-glow':style.glow}}>
          <div className="kv-modal-hanzi hanzi">{entry.word.h}</div>
          <div className="kv-modal-strength-label">{style.label}</div>
        </div>

        <div className="kv-modal-meter">
          <div className="kv-modal-meter-label">Độ bền trí nhớ</div>
          <div className="kv-modal-meter-bar">
            <div className="kv-modal-meter-fill" style={{width:`${strength*100}%`,background:style.color}} />
          </div>
          <div className="kv-modal-meter-val">{Math.round(strength*100)}%</div>
        </div>

        <div className="kv-modal-info">
          <div className="kv-modal-pinyin">{entry.word.p}</div>
          {!revealed ? (
            <button className="kv-modal-reveal" onClick={() => setRevealed(true)}>
              👆 Nhấn để xem nghĩa
            </button>
          ) : (
            <div className="fade-up">
              <div className="kv-modal-meaning">{entry.word.m}</div>
              <div className="kv-modal-example hanzi">{entry.word.ex}</div>
              {entry.word.exv && <div className="kv-modal-exv">🇻🇳 {entry.word.exv}</div>}
            </div>
          )}
          <div className="kv-modal-meta">
            <span>📅 {daysSince} ngày trước</span>
            <span>🔄 Đã ôn {entry.reviewCount||1} lần</span>
            <span>{entry.word.cat}</span>
          </div>
        </div>

        <div className="kv-modal-actions">
          <button className="kv-modal-btn speak" onClick={() => speak(entry.word.h)}>🔊 Nghe</button>
          <button className="kv-modal-btn refresh" onClick={onRefresh}>⚡ Sạc</button>
          <button className="kv-modal-btn resurrect" onClick={onResurrect}>↩ Hồi sinh</button>
        </div>
      </div>
    </div>
  )
}

// ── Blitz Quiz ───────────────────────────────────────
function BlitzQuiz({ words, onFinish, onClose }) {
  const [qi, setQi]       = useState(0)
  const [score, setScore] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [done, setDone]   = useState(false)

  if (!words || words.length === 0) {
    return (
      <div className="kv-blitz-overlay">
        <div className="kv-blitz-modal" style={{textAlign:'center',padding:'2rem'}}>
          <div style={{fontSize:48}}>🎉</div>
          <div style={{fontSize:16,fontWeight:800,marginTop:12}}>Không có từ nào cần ôn!</div>
          <button className="btn-primary" style={{marginTop:20,width:'100%'}} onClick={onClose}>Đóng</button>
        </div>
      </div>
    )
  }

  const word = words[qi]?.word
  if (!word) return null

  // Generate 4 options
  const distractors = HSK1.filter(w => w.id !== word.id && w.m !== word.m)
    .sort(() => Math.random()-0.5).slice(0,3).map(w => w.m)
  const opts = [word.m, ...distractors].sort(() => Math.random()-0.5)

  function choose(opt) {
    if (chosen) return
    setChosen(opt)
    const correct = opt === word.m
    if (correct) setScore(s => s+1)
    setTimeout(() => {
      if (qi+1 >= words.length) setDone(true)
      else { setQi(q => q+1); setChosen(null) }
    }, 900)
  }

  if (done) {
    return (
      <div className="kv-blitz-overlay">
        <div className="kv-blitz-modal">
          <div className="kv-blitz-result">
            <div className="kv-blitz-result-emoji">{score>=4?'🔥':score>=2?'⚡':'💪'}</div>
            <div className="kv-blitz-result-score">{score}/{words.length}</div>
            <div className="kv-blitz-result-text">
              {score>=4?'Xuất sắc! Pha lê đã sáng trở lại!':score>=2?'Khá tốt! Tiếp tục ôn nhé!':'Cần ôn thêm nha!'}
            </div>
            <div className="kv-blitz-result-reward">⚡ {words.length} pha lê đã được sạc đầy!</div>
            <button className="btn-primary" style={{marginTop:16,width:'100%'}} onClick={() => onFinish(score)}>
              Hoàn thành!
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="kv-blitz-overlay">
      <div className="kv-blitz-modal">
        <div className="kv-blitz-header">
          <button className="kv-blitz-close" onClick={onClose}>✕</button>
          <div className="kv-blitz-title">⚡ Blitz Quiz</div>
          <div className="kv-blitz-prog">{qi+1}/{words.length}</div>
        </div>
        <div className="kv-blitz-q-label">Nghĩa của từ này là gì?</div>
        <div className="kv-blitz-hanzi hanzi">{word.h}</div>
        <div className="kv-blitz-pinyin">{word.p}</div>
        <div className="kv-blitz-options">
          {opts.map((opt, i) => {
            const isCorrect = opt === word.m
            const state = chosen ? (isCorrect?'correct':opt===chosen?'wrong':'dim') : ''
            return (
              <button key={i} className={`kv-blitz-opt ${state}`} onClick={() => choose(opt)}>
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
