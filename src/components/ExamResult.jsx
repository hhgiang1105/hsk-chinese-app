import { useState } from 'react'
import './ExamResult.css'

function RadarChart({ listen, read, vocab }) {
  const size = 220
  const cx = size / 2, cy = size / 2
  const r = 72

  const labels = [
    { label: 'Nghe', pct: listen, angle: -90 },
    { label: 'Đọc', pct: read, angle: 30 },
    { label: 'Từ vựng', pct: vocab, angle: 150 },
  ]

  function polar(angle, radius) {
    const rad = (angle * Math.PI) / 180
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)]
  }

  const gridLevels = [0.25, 0.5, 0.75, 1.0]
  const points = labels.map(l => polar(l.angle, r * (l.pct / 100)))
  const pointStr = points.map(p => p.join(',')).join(' ')
  const axes = labels.map(l => polar(l.angle, r))

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map((g, i) => {
        const gPts = labels.map(l => polar(l.angle, r * g))
        return <polygon key={i} points={gPts.map(p => p.join(',')).join(' ')}
          fill="none" stroke="#B2E8E3" strokeWidth="1" opacity="0.7" />
      })}
      {axes.map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#B2E8E3" strokeWidth="1" />
      ))}
      <polygon points={pointStr}
        fill="rgba(77,191,176,0.2)" stroke="#4DBFB0" strokeWidth="2.5" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill="#4DBFB0" />
      ))}
      {labels.map((l, i) => {
        const [lx, ly] = polar(l.angle, r + 24)
        return (
          <g key={i}>
            <text x={lx} y={ly - 6} textAnchor="middle" fontSize="11" fontWeight="700"
              fill="#5A7470" fontFamily="Nunito">{l.label}</text>
            <text x={lx} y={ly + 8} textAnchor="middle" fontSize="13" fontWeight="800"
              fill="#2E9F91" fontFamily="Nunito">{l.pct}%</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function ExamResult({ result, onBack, onRetry }) {
  const [review, setReview] = useState(false)
  const { exam, score, total, passed, correct, totalQ, timeUsed,
          listenPct, readPct, vocabPct, answers, date } = result

  const mm = String(Math.floor(timeUsed / 60)).padStart(2, '0')
  const ss = String(timeUsed % 60).padStart(2, '0')

  const skills = [
    { icon:'🎧', name:'Nghe',      pct: listenPct },
    { icon:'📖', name:'Đọc',       pct: readPct   },
    { icon:'📝', name:'Từ vựng',   pct: vocabPct  },
  ]
  const weakest = skills.reduce((a, b) => a.pct < b.pct ? a : b)

  return (
    <div className="res-screen">
      {/* Header */}
      <div className={`res-header ${passed ? 'pass' : 'fail'}`}>
        <button className="res-back" onClick={onBack}>‹ Danh sách đề</button>
        <div className="res-header-title">{passed ? '🎉 Xuất sắc!' : '💪 Cố gắng hơn!'}</div>
      </div>

      <div className="res-body">
        {/* Score card */}
        <div className="res-score-card card">
          <div className="res-score-circle" style={{ borderColor: passed ? '#4DBFB0' : '#FF6B6B' }}>
            <div className="res-score-num" style={{ color: passed ? '#4DBFB0' : '#FF6B6B' }}>{score}</div>
            <div className="res-score-max">/{total} điểm</div>
          </div>
          <div className="res-score-info">
            <div className={`res-pass-badge ${passed ? 'pass' : 'fail'}`}>
              {passed ? '✅ ĐẠT' : '❌ CHƯA ĐẠT'}
            </div>
            <div className="res-score-detail">✓ {correct}/{totalQ} câu đúng</div>
            <div className="res-score-time">⏱ {mm}:{ss}</div>
            <div className="res-score-date">📅 {date}</div>
          </div>
        </div>

        {/* Radar */}
        <div className="res-radar-card card">
          <div className="res-section-title">📊 Biểu đồ năng lực</div>
          <div className="res-radar-wrap">
            <RadarChart listen={listenPct} read={readPct} vocab={vocabPct} />
          </div>
          <div className="res-weak-tip">
            💡 Kỹ năng cần cải thiện nhất: <strong>{weakest.name}</strong> ({weakest.pct}%)
          </div>
        </div>

        {/* Skills */}
        <div className="res-skills card">
          <div className="res-section-title">Chi tiết từng kỹ năng</div>
          {skills.map(s => (
            <div key={s.name} className="res-skill-row">
              <span className="res-skill-icon">{s.icon}</span>
              <span className="res-skill-name">{s.name}</span>
              <div className="res-skill-bar">
                <div className="res-skill-fill"
                  style={{ width:`${s.pct}%`, background: s.pct >= 60 ? '#4DBFB0' : '#FF6B6B' }} />
              </div>
              <span className="res-skill-pct" style={{ color: s.pct >= 60 ? '#4DBFB0' : '#FF6B6B' }}>
                {s.pct}%
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="res-actions">
          <button className="res-review-btn" onClick={() => setReview(r => !r)}>
            {review ? '🙈 Ẩn bài làm' : '🔍 Xem lại bài làm'}
          </button>
          <button className="btn-primary" style={{ flex:1 }} onClick={onRetry}>
            🔄 Thi lại
          </button>
        </div>

        {/* Review */}
        {review && (
          <div className="res-review">
            {exam.sections.map(sec => {
              const allQ = exam.sections.flatMap(s => s.questions)
              return (
                <div key={sec.id} className="res-review-section">
                  <div className="res-review-sec-title">{sec.icon} {sec.name}</div>
                  {sec.questions.map(q => {
                    const userAns = answers[q.id]
                    const isCorrect = userAns === q.answer
                    const qNum = allQ.indexOf(q) + 1
                    return (
                      <div key={q.id} className={`res-review-q ${isCorrect ? 'correct' : userAns ? 'wrong' : 'skipped'}`}>
                        <div className="res-review-q-header">
                          <span className="res-review-q-num">Câu {qNum}</span>
                          <span className={`res-review-q-status ${isCorrect ? 'correct' : userAns ? 'wrong' : 'skipped'}`}>
                            {isCorrect ? '✓ Đúng' : userAns ? '✗ Sai' : '— Bỏ qua'}
                          </span>
                        </div>
                        <div className="res-review-q-text">{q.question}</div>
                        {q.passage && (
                          <div className="res-review-passage hanzi">
                            {q.passage.length > 80 ? q.passage.slice(0, 80) + '...' : q.passage}
                          </div>
                        )}
                        <div className="res-review-options">
                          {q.options.map((opt, i) => {
                            const letter = opt.charAt(0)
                            const isRight = letter === q.answer
                            const isUser  = letter === userAns
                            return (
                              <div key={i} className={`res-review-opt
                                ${isRight ? 'right' : ''}
                                ${isUser && !isRight ? 'user-wrong' : ''}
                              `}>
                                <span className="res-review-opt-icon">
                                  {isRight ? '✓' : isUser && !isRight ? '✗' : ''}
                                </span>
                                {opt}
                              </div>
                            )
                          })}
                        </div>
                        {(!isCorrect || !userAns) && (
                          <div className="res-review-explain">
                            💡 <strong>Giải thích:</strong> {q.explain}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
