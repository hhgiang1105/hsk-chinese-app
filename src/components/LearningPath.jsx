import { useState } from 'react'
import { HSK_LEVELS } from '../data/hskLevels.js'
import './LearningPath.css'

export default function LearningPath({ currentXP = 0 }) {
  const [selected, setSelected] = useState(null)

  const unlockedLevel = currentXP >= 700 ? 3 : currentXP >= 300 ? 2 : currentXP >= 100 ? 1 : 0

  return (
    <div className="lp-screen">
      <div className="lp-header">
        <div className="lp-title">Lộ trình HSK</div>
        <div className="lp-sub">Chuẩn quốc tế Hán ngữ</div>
      </div>

      {/* Path */}
      <div className="lp-path">
        {HSK_LEVELS.map((level, i) => {
          const unlocked = i <= unlockedLevel
          const isSelected = selected === i
          const progress = i === 0 ? Math.min(100, Math.round((currentXP / 100) * 100)) : 0

          return (
            <div key={level.level} className="lp-level-wrap">
              {/* Connector line */}
              {i > 0 && (
                <div className={`lp-connector ${unlocked ? 'done' : ''}`} />
              )}

              {/* Level node */}
              <div
                className={`lp-node ${unlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected' : ''}`}
                style={{ borderColor: unlocked ? level.color : '#E0EFED', background: unlocked ? level.bgColor : '#F5F5F5' }}
                onClick={() => setSelected(isSelected ? null : i)}
              >
                <div className="lp-node-left">
                  <div className="lp-node-icon" style={{ background: unlocked ? level.color : '#ccc', color: '#fff' }}>
                    {unlocked ? `${level.level}` : '🔒'}
                  </div>
                  <div>
                    <div className="lp-node-name" style={{ color: unlocked ? level.color : '#ccc' }}>{level.name}</div>
                    <div className="lp-node-desc">{level.description}</div>
                    <div className="lp-node-words">{level.words.toLocaleString()} từ vựng</div>
                  </div>
                </div>
                {unlocked && (
                  <div className="lp-node-pct" style={{ color: level.color }}>
                    {i === 0 ? `${progress}%` : '0%'}
                  </div>
                )}
              </div>

              {/* Expanded detail */}
              {isSelected && (
                <div className="lp-detail fade-up" style={{ borderColor: level.color + '44' }}>
                  {/* Topics */}
                  <div className="lp-detail-topics">
                    {level.topics.map(t => (
                      <span key={t} className="lp-topic-chip" style={{ background: level.bgColor, color: level.color }}>{t}</span>
                    ))}
                  </div>

                  {/* Modules */}
                  <div className="lp-modules">
                    {level.modules.map((mod, mi) => {
                      const modUnlocked = unlocked && (mi === 0 || level.modules[mi - 1].done)
                      return (
                        <div key={mod.id} className={`lp-module ${modUnlocked ? 'active' : 'locked'}`}>
                          <div className="lp-module-icon">{modUnlocked ? mod.icon : '🔒'}</div>
                          <div className="lp-module-label">{mod.label}</div>
                          {mod.done && <div className="lp-module-done">✓</div>}
                          {modUnlocked && !mod.done && (
                            <button
                              className="lp-module-btn"
                              style={{ background: level.color }}
                              onClick={() => alert(`Tính năng ${mod.label} sẽ được mở trong bản cập nhật tiếp theo!`)}
                            >
                              Bắt đầu
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="lp-footer">
        <div className="lp-footer-text">
          🏆 Hoàn thành HSK 6 để đạt chứng chỉ thành thạo tiếng Trung
        </div>
      </div>
    </div>
  )
}
