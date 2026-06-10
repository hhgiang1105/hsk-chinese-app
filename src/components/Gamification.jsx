import { useState, useEffect } from 'react'
import {
  PANDA_STAGES, DAILY_MISSIONS, ACHIEVEMENTS,
  loadMissions, loadStreak, getPandaStage, isMissionDone
} from '../data/gamification.js'
import './Gamification.css'

export default function Gamification({ xp, learnedCount, streak }) {
  const [missions, setMissions] = useState(loadMissions)
  const [streakData] = useState(loadStreak)
  const [tab, setTab] = useState('home')
  const [pandaAnim, setPandaAnim] = useState(false)

  const stage = getPandaStage(xp)
  const nextStage = PANDA_STAGES.find(s => s.minXP > xp)
  const xpToNext = nextStage ? nextStage.minXP - xp : 0
  const xpPct = nextStage
    ? Math.round(((xp - stage.minXP) / (nextStage.minXP - stage.minXP)) * 100)
    : 100

  const stats = { learned: learnedCount, xp, streak: streak || streakData.count, perfectQuiz: 0 }
  const earnedAchievements = ACHIEVEMENTS.filter(a => a.condition(stats))

  const missionsDone = DAILY_MISSIONS.filter(m => isMissionDone(missions, m.id)).length
  const totalXPFromMissions = DAILY_MISSIONS
    .filter(m => isMissionDone(missions, m.id))
    .reduce((s, m) => s + m.xp, 0)

  function petPanda() {
    setPandaAnim(true)
    setTimeout(() => setPandaAnim(false), 600)
  }

  return (
    <div className="gami-screen">
      {/* Tab bar */}
      <div className="gami-tabs">
        <button className={`gami-tab ${tab === 'home' ? 'active' : ''}`} onClick={() => setTab('home')}>🐼 Gấu trúc</button>
        <button className={`gami-tab ${tab === 'missions' ? 'active' : ''}`} onClick={() => setTab('missions')}>
          📋 Nhiệm vụ
          {missionsDone < DAILY_MISSIONS.length && (
            <span className="gami-badge-dot">{DAILY_MISSIONS.length - missionsDone}</span>
          )}
        </button>
        <button className={`gami-tab ${tab === 'achievements' ? 'active' : ''}`} onClick={() => setTab('achievements')}>🏆 Thành tích</button>
      </div>

      {/* PANDA HOME */}
      {tab === 'home' && (
        <div className="gami-home fade-up">
          {/* Panda */}
          <div className="gami-panda-area">
            <div className="gami-panda-bg" />
            <button className={`gami-panda ${pandaAnim ? 'bounce' : ''}`} onClick={petPanda}>
              <span className="gami-panda-emoji">{stage.emoji}</span>
              {stage.hat && <span className="gami-panda-hat">{stage.hat}</span>}
            </button>
            <div className="gami-panda-speech">
              {pandaAnim ? '🎉 Cảm ơn bạn!' : `Xin chào! Hôm nay học ${learnedCount} từ rồi!`}
            </div>
            <div className="gami-panda-name">{stage.name}</div>
            <div className="gami-panda-tap">Nhấn để vuốt ve 🤗</div>
          </div>

          {/* XP Progress to next level */}
          <div className="gami-level-card card">
            <div className="gami-level-row">
              <div>
                <div className="gami-level-title">Level {PANDA_STAGES.indexOf(stage) + 1}</div>
                <div className="gami-level-desc">{stage.description}</div>
              </div>
              <div className="gami-xp-badge">⭐ {xp} XP</div>
            </div>
            <div className="progress-track" style={{ marginTop: 10 }}>
              <div className="progress-fill" style={{ width: `${xpPct}%` }} />
            </div>
            {nextStage && (
              <div className="gami-level-next">
                Cần thêm <strong>{xpToNext} XP</strong> để đạt <strong>{nextStage.name}</strong>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="gami-stats-row">
            <div className="gami-stat-item">
              <div className="gami-stat-val">🔥 {streak || streakData.count}</div>
              <div className="gami-stat-lbl">Streak</div>
            </div>
            <div className="gami-stat-item">
              <div className="gami-stat-val">📚 {learnedCount}</div>
              <div className="gami-stat-lbl">Từ đã học</div>
            </div>
            <div className="gami-stat-item">
              <div className="gami-stat-val">🏅 {earnedAchievements.length}</div>
              <div className="gami-stat-lbl">Thành tích</div>
            </div>
          </div>

          {/* Streak calendar */}
          <div className="gami-streak-card card">
            <div className="gami-streak-title">🔥 Chuỗi học tập</div>
            <div className="gami-streak-days">
              {['T2','T3','T4','T5','T6','T7','CN'].map((d, i) => (
                <div key={i} className="gami-day-col">
                  <div className={`gami-day-dot ${i < (streak || streakData.count) ? 'done' : ''}`}>
                    {i < (streak || streakData.count) ? '✓' : ''}
                  </div>
                  <div className="gami-day-lbl">{d}</div>
                </div>
              ))}
            </div>
            {(streak || streakData.count) >= 7 && (
              <div className="gami-streak-reward">
                🎁 Phần thưởng 7 ngày: Mũ mới cho gấu trúc!
              </div>
            )}
          </div>
        </div>
      )}

      {/* DAILY MISSIONS */}
      {tab === 'missions' && (
        <div className="gami-missions fade-up">
          <div className="gami-missions-header">
            <div className="gami-missions-title">Nhiệm vụ hôm nay</div>
            <div className="gami-missions-sub">{missionsDone}/{DAILY_MISSIONS.length} hoàn thành · +{totalXPFromMissions} XP</div>
          </div>
          <div className="gami-missions-list">
            {DAILY_MISSIONS.map(m => {
              const done = isMissionDone(missions, m.id)
              const prog = missions.progress[m.id] || 0
              const pct = Math.round((prog / m.target) * 100)
              return (
                <div key={m.id} className={`gami-mission-item ${done ? 'done' : ''}`}>
                  <div className="gami-mission-icon">{m.icon}</div>
                  <div className="gami-mission-info">
                    <div className="gami-mission-label">{m.label}</div>
                    <div className="progress-track" style={{ marginTop: 6 }}>
                      <div className="progress-fill" style={{ width: `${pct}%`, background: done ? '#4CAF50' : undefined }} />
                    </div>
                    <div className="gami-mission-prog">{prog}/{m.target}</div>
                  </div>
                  <div className={`gami-mission-xp ${done ? 'done' : ''}`}>
                    {done ? '✓' : `+${m.xp}`}
                    {!done && <span className="gami-xp-label">XP</span>}
                  </div>
                </div>
              )
            })}
          </div>
          {missionsDone === DAILY_MISSIONS.length && (
            <div className="gami-all-done">
              <div className="gami-all-done-emoji">🎉</div>
              <div className="gami-all-done-title">Xuất sắc!</div>
              <div className="gami-all-done-sub">Hoàn thành tất cả nhiệm vụ hôm nay!</div>
            </div>
          )}
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {tab === 'achievements' && (
        <div className="gami-achievements fade-up">
          <div className="gami-ach-summary">
            <span className="gami-ach-count">{earnedAchievements.length}</span>
            <span className="gami-ach-total">/{ACHIEVEMENTS.length} thành tích</span>
          </div>
          <div className="gami-ach-grid">
            {ACHIEVEMENTS.map(a => {
              const earned = a.condition(stats)
              return (
                <div key={a.id} className={`gami-ach-item ${earned ? 'earned' : 'locked'}`}>
                  <div className="gami-ach-icon">{earned ? a.icon : '🔒'}</div>
                  <div className="gami-ach-label">{a.label}</div>
                  <div className="gami-ach-desc">{a.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
