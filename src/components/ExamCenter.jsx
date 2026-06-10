import { useState } from 'react'
import { EXAMS, LEVELS } from '../data/examData.js'
import ExamRoom from './ExamRoom.jsx'
import ExamResult from './ExamResult.jsx'
import './ExamCenter.css'

const STORAGE_KEY = 'hsk_exam_progress'

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  catch { return {} }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export default function ExamCenter() {
  const [level, setLevel] = useState(1)
  const [currentExam, setCurrentExam] = useState(null)
  const [examResult, setExamResult] = useState(null)
  const [progress, setProgress] = useState(loadProgress)
  const [showConfirm, setShowConfirm] = useState(null)
  const [showPremium, setShowPremium] = useState(false)
  const [isPremium] = useState(false) // có thể mở rộng sau

  const filteredExams = EXAMS.filter(e => e.level === level)

  function getExamStatus(examId) {
    const p = progress[examId]
    if (!p) return 'new'
    if (p.completed) return 'done'
    return 'inprogress'
  }

  function startExam(exam) {
    if (!exam.free && !isPremium) { setShowPremium(true); return }
    setShowConfirm(exam)
  }

  function confirmStart(exam) {
    setShowConfirm(null)
    const p = { ...progress }
    p[exam.id] = { startTime: Date.now(), answers: {}, completed: false }
    setProgress(p)
    saveProgress(p)
    setCurrentExam(exam)
  }

  function resumeExam(exam) {
    setCurrentExam(exam)
  }

  function handleFinish(exam, answers, timeUsed) {
    // Calculate score
    let total = 0, correct = 0
    let listenCorrect = 0, listenTotal = 0
    let readCorrect = 0, readTotal = 0
    let vocabCorrect = 0, vocabTotal = 0

    exam.sections.forEach(sec => {
      sec.questions.forEach(q => {
        total++
        const isCorrect = answers[q.id] === q.answer
        if (isCorrect) correct++
        if (sec.id === 'listen') { listenTotal++; if (isCorrect) listenCorrect++ }
        if (sec.id === 'read')   { readTotal++;   if (isCorrect) readCorrect++ }
        if (sec.id === 'vocab')  { vocabTotal++;  if (isCorrect) vocabCorrect++ }
      })
    })

    const score = Math.round((correct / total) * exam.totalScore)
    const passed = score >= exam.passScore

    const result = {
      examId: exam.id,
      score, total: exam.totalScore, passed,
      correct, totalQ: total,
      timeUsed,
      listenPct: listenTotal ? Math.round(listenCorrect / listenTotal * 100) : 0,
      readPct:   readTotal   ? Math.round(readCorrect   / readTotal   * 100) : 0,
      vocabPct:  vocabTotal  ? Math.round(vocabCorrect  / vocabTotal  * 100) : 0,
      answers,
      exam,
      date: new Date().toLocaleDateString('vi-VN'),
    }

    const p = { ...progress, [exam.id]: { completed: true, score, passed, answers, date: result.date } }
    setProgress(p)
    saveProgress(p)
    setCurrentExam(null)
    setExamResult(result)
  }

  // In exam room
  if (currentExam) {
    const saved = progress[currentExam.id]
    return (
      <ExamRoom
        exam={currentExam}
        savedAnswers={saved?.answers || {}}
        startTime={saved?.startTime || Date.now()}
        onFinish={(answers, timeUsed) => handleFinish(currentExam, answers, timeUsed)}
        onExit={() => setCurrentExam(null)}
      />
    )
  }

  // Result screen
  if (examResult) {
    return (
      <ExamResult
        result={examResult}
        onBack={() => setExamResult(null)}
        onRetry={() => {
          const exam = examResult.exam
          const p = { ...progress, [exam.id]: { startTime: Date.now(), answers: {}, completed: false } }
          setProgress(p); saveProgress(p)
          setExamResult(null); setCurrentExam(exam)
        }}
      />
    )
  }

  return (
    <div className="ec-screen">
      {/* Header */}
      <div className="ec-header">
        <div className="ec-header-title">🎓 Trung tâm đề thi</div>
        <div className="ec-header-sub">Thi thử theo chuẩn HSK quốc tế</div>
      </div>

      {/* Level tabs */}
      <div className="ec-level-tabs">
        {LEVELS.map(lv => (
          <button
            key={lv}
            className={`ec-level-tab ${level === lv ? 'active' : ''}`}
            onClick={() => setLevel(lv)}
          >
            HSK {lv}
            {lv >= 3 && !isPremium && <span className="ec-lock-small">🔒</span>}
          </button>
        ))}
      </div>

      {/* Exam list */}
      <div className="ec-list">
        {filteredExams.length === 0 ? (
          <div className="ec-empty">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Đang chuẩn bị</div>
            <div style={{ color: 'var(--text3)', fontSize: 13 }}>Đề thi HSK {level} sẽ sớm có mặt!</div>
          </div>
        ) : (
          filteredExams.map(exam => {
            const status = getExamStatus(exam.id)
            const p = progress[exam.id]
            const locked = !exam.free && !isPremium
            return (
              <div key={exam.id} className={`ec-card ${locked ? 'locked' : ''}`}>
                <div className="ec-card-top">
                  <div className="ec-card-info">
                    <div className="ec-card-title">{exam.title}</div>
                    <div className="ec-card-meta">
                      <span>⏱ {exam.duration} phút</span>
                      <span>•</span>
                      <span>👥 {exam.participants.toLocaleString()} người</span>
                      <span>•</span>
                      <span>📊 {exam.totalScore} điểm</span>
                    </div>
                  </div>
                  {locked && <div className="ec-lock-badge">🔒 Pro</div>}
                  {!locked && status === 'done' && (
                    <div className="ec-done-badge">
                      <div className="ec-done-score">{p.score}</div>
                      <div className="ec-done-label">điểm</div>
                    </div>
                  )}
                </div>

                {/* Section icons */}
                <div className="ec-sections">
                  {exam.sections.map(s => (
                    <span key={s.id} className="ec-section-chip">{s.icon} {s.name}</span>
                  ))}
                </div>

                {/* Status + button */}
                <div className="ec-card-bottom">
                  {status === 'new' && !locked && (
                    <span className="ec-status new">📋 Chưa làm</span>
                  )}
                  {status === 'inprogress' && (
                    <span className="ec-status progress">⏸ Đang làm dở</span>
                  )}
                  {status === 'done' && (
                    <span className={`ec-status ${p.passed ? 'pass' : 'fail'}`}>
                      {p.passed ? '✅ Đạt' : '❌ Chưa đạt'} — {p.date}
                    </span>
                  )}
                  {locked && <span className="ec-status locked">🔒 Tài khoản Pro</span>}

                  {!locked && status === 'new' && (
                    <button className="ec-btn start" onClick={() => startExam(exam)}>
                      Bắt đầu →
                    </button>
                  )}
                  {!locked && status === 'inprogress' && (
                    <button className="ec-btn resume" onClick={() => resumeExam(exam)}>
                      Làm tiếp →
                    </button>
                  )}
                  {!locked && status === 'done' && (
                    <button className="ec-btn retry" onClick={() => startExam(exam)}>
                      Thi lại
                    </button>
                  )}
                  {locked && (
                    <button className="ec-btn unlock" onClick={() => setShowPremium(true)}>
                      Mở khóa
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="ec-modal-overlay" onClick={() => setShowConfirm(null)}>
          <div className="ec-modal" onClick={e => e.stopPropagation()}>
            <div className="ec-modal-icon">⚠️</div>
            <div className="ec-modal-title">Bắt đầu thi?</div>
            <div className="ec-modal-body">
              Đồng hồ sẽ đếm ngược <strong>{showConfirm.duration} phút</strong> ngay lập tức và không thể tạm dừng. Kể cả khi thoát app, thời gian vẫn tiếp tục chạy.
            </div>
            <div className="ec-modal-btns">
              <button className="ec-modal-cancel" onClick={() => setShowConfirm(null)}>Huỷ</button>
              <button className="ec-modal-confirm" onClick={() => confirmStart(showConfirm)}>
                Tôi đã sẵn sàng! 🎯
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium modal */}
      {showPremium && (
        <div className="ec-modal-overlay" onClick={() => setShowPremium(false)}>
          <div className="ec-modal" onClick={e => e.stopPropagation()}>
            <div className="ec-modal-icon">👑</div>
            <div className="ec-modal-title">Nâng cấp Premium</div>
            <div className="ec-modal-body">
              Mở khóa tất cả đề thi HSK 2-6, xem giải thích chi tiết và theo dõi tiến độ không giới hạn.
            </div>
            <div className="ec-premium-features">
              {['✅ Tất cả đề thi HSK 1-6', '✅ Giải thích chi tiết', '✅ Lịch sử kết quả', '✅ Không quảng cáo'].map(f => (
                <div key={f} className="ec-premium-feat">{f}</div>
              ))}
            </div>
            <button className="ec-modal-confirm" onClick={() => setShowPremium(false)}>
              Sắp ra mắt 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
