import { useState, useEffect, useRef, useCallback } from 'react'
import './ExamRoom.css'

function speak(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'zh-CN'; u.rate = 0.8
    speechSynthesis.speak(u)
  }
}

// Tokenize Chinese text for tap-to-lookup
function TokenizedText({ text, vocab }) {
  const [popup, setPopup] = useState(null)
  // Simple: split by char, group non-Chinese as words
  const chars = text.split('')
  return (
    <span className="er-tokenized">
      {chars.map((ch, i) => {
        const isChinese = /[\u4e00-\u9fff]/.test(ch)
        if (!isChinese) return <span key={i}>{ch}</span>
        const word = vocab?.find(w => w.h === ch || w.h.startsWith(ch))
        return (
          <span
            key={i}
            className={`er-char ${word ? 'has-lookup' : ''}`}
            onClick={() => word && setPopup(popup?.h === ch ? null : { h: ch, p: word.p, m: word.m })}
          >
            {ch}
            {popup?.h === ch && (
              <span className="er-popup">
                <span className="er-popup-py">{popup.p}</span>
                <span className="er-popup-mn">{popup.m}</span>
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}

export default function ExamRoom({ exam, savedAnswers, startTime, onFinish, onExit }) {
  const totalSeconds = exam.duration * 60
  const [answers, setAnswers] = useState(savedAnswers || {})
  const [sectionIdx, setSectionIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    return Math.max(0, totalSeconds - elapsed)
  })
  const [showSubmit, setShowSubmit] = useState(false)
  const [speaking, setSpeaking] = useState(null)
  const timerRef = useRef(null)
  const autoSubmitted = useRef(false)

  const section = exam.sections[sectionIdx]
  const allQuestions = exam.sections.flatMap(s => s.questions)
  const answeredCount = Object.keys(answers).length
  const totalQ = allQuestions.length

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const left = Math.max(0, totalSeconds - elapsed)
      setTimeLeft(left)
      if (left === 0 && !autoSubmitted.current) {
        autoSubmitted.current = true
        handleSubmit(true)
      }
    }, 500)
    return () => clearInterval(timerRef.current)
  }, [])

  const handleSubmit = useCallback((auto = false) => {
    clearInterval(timerRef.current)
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    onFinish(answers, Math.min(elapsed, totalSeconds))
  }, [answers, startTime, totalSeconds, onFinish])

  function handleAnswer(qId, opt) {
    setAnswers(a => ({ ...a, [qId]: opt.charAt(0) }))
  }

  function playAudio(text, qId) {
    setSpeaking(qId)
    speak(text)
    setTimeout(() => setSpeaking(null), 3000)
  }

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const ss = String(timeLeft % 60).padStart(2, '0')
  const isWarning = timeLeft <= 300 && timeLeft > 0

  return (
    <div className="er-screen">
      {/* Top bar */}
      <div className="er-topbar">
        <button className="er-exit-btn" onClick={onExit} title="Thoát (thời gian vẫn chạy)">✕</button>
        <div className={`er-timer ${isWarning ? 'warning' : ''}`}>
          ⏱ {mm}:{ss}
        </div>
        <button className="er-submit-btn" onClick={() => setShowSubmit(true)}>
          Nộp bài
        </button>
      </div>

      {/* Progress */}
      <div className="er-progress-bar">
        <div className="er-progress-fill" style={{ width: `${(answeredCount / totalQ) * 100}%` }} />
      </div>
      <div className="er-progress-text">{answeredCount}/{totalQ} câu đã trả lời</div>

      {/* Section tabs */}
      <div className="er-section-tabs">
        {exam.sections.map((s, i) => (
          <button
            key={s.id}
            className={`er-section-tab ${sectionIdx === i ? 'active' : ''}`}
            onClick={() => setSectionIdx(i)}
          >
            {s.icon} {s.name}
            <span className="er-section-count">
              {s.questions.filter(q => answers[q.id]).length}/{s.questions.length}
            </span>
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="er-questions">
        {section.questions.map((q, qi) => (
          <div key={q.id} className="er-question-card">
            <div className="er-q-header">
              <span className="er-q-num">Câu {allQuestions.indexOf(q) + 1}</span>
              {answers[q.id] && <span className="er-q-answered">✓</span>}
            </div>

            {/* Audio player for listen type */}
            {q.type === 'listen' && (
              <div className="er-audio-player">
                <button
                  className={`er-play-btn ${speaking === q.id ? 'playing' : ''}`}
                  onClick={() => playAudio(q.audio, q.id)}
                >
                  {speaking === q.id ? '⏸' : '▶'}
                </button>
                <div className="er-audio-wave">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`er-wave-bar ${speaking === q.id ? 'active' : ''}`}
                      style={{ animationDelay: `${i * 0.08}s` }} />
                  ))}
                </div>
                <span className="er-audio-label">Nhấn để nghe</span>
              </div>
            )}

            {/* Passage for read type */}
            {q.type === 'read' && q.passage && (
              <div className="er-passage">
                <div className="er-passage-label">📖 Đọc đoạn văn sau:</div>
                <div className="er-passage-text hanzi">
                  <TokenizedText text={q.passage} vocab={[]} />
                </div>
                <div className="er-passage-hint">💡 Nhấn vào chữ Hán để xem nghĩa</div>
              </div>
            )}

            {/* Question text */}
            <div className="er-q-text">{q.question}</div>

            {/* Options */}
            <div className="er-options">
              {q.options.map((opt, oi) => {
                const letter = opt.charAt(0)
                const selected = answers[q.id] === letter
                return (
                  <button
                    key={oi}
                    className={`er-option ${selected ? 'selected' : ''}`}
                    onClick={() => handleAnswer(q.id, opt)}
                  >
                    <span className="er-opt-label">{letter}</span>
                    <span className={q.type === 'read' ? 'hanzi' : ''}>{opt.slice(3)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="er-nav">
        {sectionIdx > 0 && (
          <button className="er-nav-btn prev" onClick={() => setSectionIdx(i => i - 1)}>
            ← Phần trước
          </button>
        )}
        {sectionIdx < exam.sections.length - 1 ? (
          <button className="er-nav-btn next" onClick={() => setSectionIdx(i => i + 1)}>
            Phần tiếp →
          </button>
        ) : (
          <button className="er-nav-btn submit" onClick={() => setShowSubmit(true)}>
            Nộp bài 🎯
          </button>
        )}
      </div>

      {/* Submit confirm */}
      {showSubmit && (
        <div className="er-modal-overlay">
          <div className="er-modal">
            <div className="er-modal-icon">📋</div>
            <div className="er-modal-title">Xác nhận nộp bài</div>
            <div className="er-modal-body">
              Bạn đã trả lời <strong>{answeredCount}/{totalQ}</strong> câu.
              {answeredCount < totalQ && <span className="er-modal-warn"> Còn {totalQ - answeredCount} câu chưa trả lời!</span>}
            </div>
            <div className="er-modal-btns">
              <button className="er-modal-cancel" onClick={() => setShowSubmit(false)}>Làm tiếp</button>
              <button className="er-modal-confirm" onClick={() => handleSubmit(false)}>Nộp bài</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
