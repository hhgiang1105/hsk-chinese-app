import { useMemo } from 'react'
import { HSK1, CATEGORIES } from '../data/hsk1.js'
import './Stats.css'

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const BADGES = [
  { id: 'streak3', icon: '🏅', label: 'Huy chương', sub: '3 ngày liên tiếp', earned: true },
  { id: 'star', icon: '⭐', label: 'Huy chương', sub: 'Xuất sắc', earned: true },
  { id: 'streak15', icon: '🌟', label: '15 ngày', sub: 'Liên tiếp', earned: false },
]

function CircleProgress({ pct, size = 120, stroke = 10, color = '#4DBFB0' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div className="circle-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E0EFED" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="circle-text">
        <div className="circle-pct">{pct}%</div>
        <div className="circle-label">Đã học</div>
      </div>
    </div>
  )
}

export default function Stats({ learnedCount, quizCorrect, quizTotal, xp }) {
  const streakDays = 3
  const todayIdx = new Date().getDay() // 0=Sun
  const weekDone = [true, true, true, false, false, false, false] // simulate

  const pct = HSK1.length ? Math.round((learnedCount / HSK1.length) * 100) : 0
  const acc = quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : 0

  // Weekly bar chart: fake data
  const weekData = [4, 8, 12, 6, 10, 14, 7]

  return (
    <div className="stats-screen">
      {/* Top circle + stats */}
      <div className="stats-hero card" style={{ margin: '16px 20px 0' }}>
        <div className="stats-hero-inner">
          <CircleProgress pct={pct} />
          <div className="stats-hero-right">
            <div className="stats-stat-item">
              <span className="stats-stat-val">{learnedCount}</span>
              <span className="stats-stat-lbl">Từ đã học</span>
            </div>
            <div className="stats-stat-item">
              <span className="stats-stat-val" style={{ color: '#FF6B35' }}>{streakDays}</span>
              <span className="stats-stat-lbl">🔥 Streak</span>
            </div>
            <div className="stats-stat-item">
              <span className="stats-stat-val" style={{ color: '#9C27B0' }}>{acc}%</span>
              <span className="stats-stat-lbl">Chính xác</span>
            </div>
            <div className="stats-stat-item">
              <span className="stats-stat-val" style={{ color: '#FF9800' }}>{xp}</span>
              <span className="stats-stat-lbl">⭐ XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="stats-section">
        <div className="stats-section-title">Số từ đã thuộc hàng tuần</div>
        <div className="card" style={{ padding: '16px' }}>
          <div className="stats-bar-chart">
            {weekData.map((v, i) => (
              <div key={i} className="stats-bar-col">
                <div className="stats-bar-wrap">
                  <div
                    className={`stats-bar ${i <= 1 ? 'done' : ''}`}
                    style={{ height: `${(v / 15) * 100}%` }}
                  />
                </div>
                <span className="stats-bar-label">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="stats-section">
        <div className="stats-section-title">{streakDays} ngày liên tiếp 🔥</div>
        <div className="card" style={{ padding: '16px' }}>
          <div className="stats-week-row">
            {DAYS.map((d, i) => (
              <div key={i} className="stats-day-col">
                <div className={`stats-day-dot ${weekDone[i] ? 'done' : ''}`}>
                  {weekDone[i] ? '✓' : ''}
                </div>
                <span className="stats-day-label">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category progress */}
      <div className="stats-section">
        <div className="stats-section-title">Tiến độ theo chủ đề</div>
        <div className="card" style={{ padding: '16px' }}>
          <div className="stats-cat-list">
            {CATEGORIES.slice(0, 8).map(cat => {
              const total = HSK1.filter(w => w.cat === cat).length
              const p = Math.round(Math.random() * 100) // placeholder
              return (
                <div key={cat} className="stats-cat-row">
                  <span className="stats-cat-name">{cat}</span>
                  <div className="progress-track" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${p}%` }} />
                  </div>
                  <span className="stats-cat-pct">{p}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="stats-section">
        <div className="stats-section-title">Huy chương</div>
        <div className="stats-badges">
          {BADGES.map(b => (
            <div key={b.id} className={`stats-badge-item ${b.earned ? 'earned' : 'locked'}`}>
              <div className="stats-badge-icon">{b.icon}</div>
              <div className="stats-badge-label">{b.label}</div>
              <div className="stats-badge-sub">{b.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
