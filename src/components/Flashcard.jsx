import { loadCustomVocab } from './CustomVocab.jsx'
import { useState, useCallback } from 'react'
import { HSK1 } from '../data/hsk1.js'
import { getDueWords } from '../data/srs.js'
import './Flashcard.css'

const getWordList = () => {
  const custom = loadCustomVocab()
  return [...HSK1, ...custom]
}
const TOTAL = HSK1.length

function speak(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'zh-CN'
    u.rate = 0.8
    speechSynthesis.speak(u)
  }
}

function getCatColor(cat) {
  const map = {
    'Giao tiếp': {bg:'#E8F5E9',fg:'#2E7D32'}, 'Đại từ':    {bg:'#E3F2FD',fg:'#1565C0'},
    'Số đếm':    {bg:'#FFF3E0',fg:'#E65100'}, 'Thời gian': {bg:'#F3E5F5',fg:'#6A1B9A'},
    'Gia đình':  {bg:'#FCE4EC',fg:'#880E4F'}, 'Động từ':   {bg:'#E8F8F6',fg:'#00695C'},
    'Tính từ':   {bg:'#FFF8E1',fg:'#F57F17'}, 'Đồ ăn':     {bg:'#FFEBEE',fg:'#B71C1C'},
    'Nơi chốn':  {bg:'#E0F2F1',fg:'#004D40'}, 'Giao thông':{bg:'#E8EAF6',fg:'#283593'},
    'Sức khỏe':  {bg:'#F9FBE7',fg:'#558B2F'}, 'Học tập':   {bg:'#E1F5FE',fg:'#01579B'},
    'Thiên nhiên':{bg:'#E0F7FA',fg:'#006064'},'Màu sắc':   {bg:'#F8BBD9',fg:'#880E4F'},
    'Quần áo':   {bg:'#EDE7F6',fg:'#4527A0'}, 'Nghề nghiệp':{bg:'#E8F5E9',fg:'#1B5E20'},
    'Phó từ':    {bg:'#F5F5F5',fg:'#424242'}, 'Lượng từ':  {bg:'#FFF8E1',fg:'#F57F17'},
    'Vị trí':    {bg:'#E8EAF6',fg:'#283593'}, 'Đồ vật':    {bg:'#E0F2F1',fg:'#004D40'},
    'Thể thao':  {bg:'#E8F5E9',fg:'#1B5E20'}, 'Tâm trạng': {bg:'#FCE4EC',fg:'#880E4F'},
    'Động vật':  {bg:'#FFF3E0',fg:'#BF360C'}, 'Văn hóa':   {bg:'#EDE7F6',fg:'#311B92'},
    'Ngữ pháp':  {bg:'#F5F5F5',fg:'#424242'},
  }
  return map[cat] || {bg:'#E8F8F6', fg:'#4DBFB0'}
}

function getCatEmoji(cat) {
  const map = {
    'Giao tiếp':'💬','Đại từ':'👤','Số đếm':'🔢','Thời gian':'⏰',
    'Gia đình':'👨‍👩‍👧‍👦','Động từ':'⚡','Tính từ':'✨','Đồ ăn':'🍜',
    'Nơi chốn':'📍','Giao thông':'🚇','Sức khỏe':'❤️','Học tập':'📚',
    'Thiên nhiên':'🌿','Màu sắc':'🎨','Quần áo':'👗','Nghề nghiệp':'💼',
    'Phó từ':'🔤','Lượng từ':'🔢','Vị trí':'🗺️','Đồ vật':'🧰',
    'Thể thao':'⚽','Tâm trạng':'😊','Động vật':'🐾','Văn hóa':'🏮','Ngữ pháp':'📝',
  }
  return map[cat] || '📖'
}

export default function Flashcard({ onProgress, onXP, onRate, onXRay, srsData = {}, dueCount = 0 }) {
  const [mode, setMode] = useState('all') // 'all' | 'srs' | 'new'
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [rated, setRated] = useState({})
  const [anim, setAnim] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const allWords = getWordList()
  // 'new' mode: filter out words rated 'easy' or 'ok' this session + already in SRS as mature
  const newWords = allWords.filter(w => {
    const r = rated[w.id]
    return !r || r === 'hard' // chưa học hoặc đánh dấu Khó
  })
  const wordList = mode === 'srs'
    ? getDueWords(srsData, allWords).slice(0, 50)
    : mode === 'new'
      ? (newWords.length > 0 ? newWords : allWords) // fallback nếu đã học hết
      : allWords

  const total = wordList.length
  const card = wordList[idx] || HSK1[0]
  const learnedCount = Object.keys(rated).length
  const pct = Math.round((learnedCount / TOTAL) * 100)
  const catColor = getCatColor(card.cat)

  const go = useCallback((dir) => {
    setAnim(true)
    setFlipped(false)
    setTimeout(() => {
      setIdx(i => (i + dir + total) % total)
      setAnim(false)
    }, 160)
  }, [total])

  function rate(r) {
    if (!rated[card.id]) {
      const next = { ...rated, [card.id]: r }
      setRated(next)
      onProgress(Object.keys(next).length)
      if (r === 'easy') onXP(10)
      else if (r === 'ok') onXP(5)
      onRate && onRate(card.id, r)
    }
    go(1)
  }

  function handleSpeak(e) {
    e.stopPropagation()
    setSpeaking(true)
    speak(card.h)
    setTimeout(() => setSpeaking(false), 1500)
  }

  return (
    <div className="fc-screen">
      {/* Header */}
      <div className="fc-header">
        <div className="fc-header-top">
          <span className="fc-title">Thẻ ghi nhớ</span>
          <span className="fc-count">{idx + 1}/{total}</span>
        </div>
        {/* Mode toggle */}
        <div className="fc-mode-row">
          <button
            className={`fc-mode-btn ${mode==='all' ? 'active' : ''}`}
            onClick={() => { setMode('all'); setIdx(0); setFlipped(false) }}
          >📚 Tất cả</button>
          <button
            className={`fc-mode-btn ${mode==='new' ? 'active' : ''}`}
            onClick={() => { setMode('new'); setIdx(0); setFlipped(false) }}
          >✨ Chưa biết
            {mode !== 'new' && <span className="fc-mode-count">{newWords.length}</span>}
          </button>
          <button
            className={`fc-mode-btn ${mode==='srs' ? 'active' : ''}`}
            onClick={() => { setMode('srs'); setIdx(0); setFlipped(false) }}
          >🧠 SRS
            {mode !== 'srs' && dueCount > 0 && <span className="fc-mode-count">{dueCount}</span>}
          </button>
        </div>
        <div className="fc-progress-row">
          <span className="fc-progress-label">Progress tracking</span>
          <span className="fc-progress-val">{learnedCount}/{TOTAL}</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width:`${pct}%` }} />
        </div>
      </div>

      {/* SRS empty state */}
      {mode === 'srs' && total === 0 && (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', textAlign:'center' }}>
          <div style={{ fontSize:56, marginBottom:12 }}>🎉</div>
          <div style={{ fontSize:18, fontWeight:800, color:'var(--text)', marginBottom:6 }}>Hoàn thành rồi!</div>
          <div style={{ fontSize:14, color:'var(--text3)' }}>Không có từ nào cần ôn hôm nay.<br/>Quay lại sau nhé!</div>
          <button className="btn-mint" style={{ marginTop:20 }} onClick={() => setMode('all')}>Học từ mới</button>
        </div>
      )}

      {/* NEW mode — all done state */}
      {mode === 'new' && newWords.length === 0 && (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', textAlign:'center' }}>
          <div style={{ fontSize:56, marginBottom:12 }}>🏆</div>
          <div style={{ fontSize:18, fontWeight:800, color:'var(--text)', marginBottom:6 }}>Xuất sắc!</div>
          <div style={{ fontSize:14, color:'var(--text3)', lineHeight:1.6 }}>
            Bạn đã học qua tất cả từ trong phiên này!<br/>
            Tiếp tục ôn lại hoặc chuyển sang SRS.
          </div>
          <div style={{ display:'flex', gap:10, marginTop:20 }}>
            <button className="btn-outline" onClick={() => { setRated({}); setIdx(0) }}>🔄 Học lại từ đầu</button>
            <button className="btn-mint" onClick={() => setMode('srs')}>🧠 Ôn SRS</button>
          </div>
        </div>
      )}

      {/* Card */}
      {total > 0 && (
        <>
          <div className="fc-card-wrap">
            <div
              className={`fc-card-flipper ${flipped ? 'flipped' : ''} ${anim ? 'slide-out' : ''}`}
              onClick={() => setFlipped(f => !f)}
            >
              {/* Front */}
              <div className="fc-card fc-front card">
                <div className="fc-card-top-row">
                  <span className="fc-cat-badge badge" style={{ background:catColor.bg, color:catColor.fg }}>
                    {card.cat}
                  </span>
                  <button
                    className="fc-xray-btn"
                    onClick={e => { e.stopPropagation(); onXRay && onXRay(card) }}
                    title="X-Ray Kanji"
                  >🔬 X-Ray</button>
                </div>
                <div className="fc-hanzi hanzi">{card.h}</div>
                <div className="fc-pinyin">{card.p}</div>
                <button className={`fc-speaker-btn ${speaking ? 'active' : ''}`} onClick={handleSpeak}>
                  <span>🔊</span>
                  <span>Nghe phát âm</span>
                </button>
                <div className="fc-illustration">{getCatEmoji(card.cat)}</div>
                <button className="btn-primary full fc-flip-btn">LẬT THẺ</button>
              </div>

              {/* Back */}
              <div className="fc-card fc-back card">
                <div className="fc-card-top-row">
                  <span className="fc-cat-badge badge" style={{ background:catColor.bg, color:catColor.fg }}>
                    {card.cat}
                  </span>
                  <button
                    className="fc-xray-btn"
                    onClick={e => { e.stopPropagation(); onXRay && onXRay(card) }}
                  >🔬 X-Ray</button>
                </div>
                <div className="fc-hanzi hanzi">{card.h}</div>
                <div className="fc-pinyin">{card.p}</div>
                <button className={`fc-speaker-btn ${speaking ? 'active' : ''}`} onClick={handleSpeak}>
                  <span>🔊</span><span>Nghe phát âm</span>
                </button>
                <div className="fc-meaning">{card.m}</div>
                <div className="fc-example">
                  <span className="hanzi">{card.ex}</span>
                  {card.exp && <span className="fc-example-py">{card.exp}</span>}
                  {card.exv && <span className="fc-example-vn">🇻🇳 {card.exv}</span>}
                </div>
                <button className="btn-primary full fc-flip-btn"
                  onClick={e => { e.stopPropagation(); setFlipped(false) }}>LẬT LẠI</button>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="fc-bottom">
            <div className="fc-nav-row">
              <button className="fc-nav-btn" onClick={() => go(-1)}>‹</button>
              <div className="fc-dots">
                {[...Array(Math.min(5, total))].map((_, i) => {
                  const di = Math.floor(idx / 5) * 5 + i
                  return <div key={i} className={`fc-dot ${di===idx?'active':''} ${rated[wordList[di]?.id]?'rated':''}`} />
                })}
              </div>
              <button className="fc-nav-btn" onClick={() => go(1)}>›</button>
            </div>
            <div className="fc-rate-row">
              <button className={`fc-rate-btn hard ${rated[card.id]==='hard'?'selected':''}`} onClick={() => rate('hard')}>
                <span className="rate-icon">😓</span><span>Khó</span>
              </button>
              <button className={`fc-rate-btn ok ${rated[card.id]==='ok'?'selected':''}`} onClick={() => rate('ok')}>
                <span className="rate-icon">😊</span><span>Ổn</span>
              </button>
              <button className={`fc-rate-btn easy ${rated[card.id]==='easy'?'selected':''}`} onClick={() => rate('easy')}>
                <span className="rate-icon">⭐</span><span>Dễ</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
