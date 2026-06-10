import { useState } from 'react'
import Flashcard from './components/Flashcard.jsx'
import Vocab from './components/Vocab.jsx'
import Quiz from './components/Quiz.jsx'
import Stats from './components/Stats.jsx'
import Listen from './components/Listen.jsx'
import Gamification from './components/Gamification.jsx'
import LearningPath from './components/LearningPath.jsx'
import Scanner from './components/Scanner.jsx'
import XRay from './components/XRay.jsx'
import CustomVocab, { loadCustomVocab } from './components/CustomVocab.jsx'
import ExamCenter from './components/ExamCenter.jsx'
import { loadSRS, saveSRS, updateSRS, getDueWords, ratingToQuality } from './data/srs.js'
import { loadStreak, updateStreak } from './data/gamification.js'
import { HSK1 } from './data/hsk1.js'

const TABS = [
  { id:'flash',  label:'Thẻ',      icon:'🃏' },
  { id:'vocab',  label:'Từ vựng',  icon:'📖' },
  { id:'quiz',   label:'Quiz',     icon:'✏️' },
  { id:'panda',  label:'Gấu trúc', icon:'🐼' },
  { id:'more',   label:'Thêm',     icon:'⚡' },
  { id:'exam',   label:'Thi thử',  icon:'🎓' },
]

const TAB_TITLES = {
  flash:'Thẻ ghi nhớ', vocab:'Từ vựng', quiz:'Quiz',
  panda:'Gấu trúc', more:'Khám phá',
  path:'Lộ trình HSK', scan:'Object Scanner',
  stats:'Thống kê', listen:'Luyện nghe/nói',
}

export default function App() {
  const [tab, setTab]                 = useState('flash')
  const [learnedCount, setLearnedCount] = useState(0)
  const [xp, setXP]                  = useState(() => Number(localStorage.getItem('hsk_xp') || 0))
  const [quizCorrect, setQuizCorrect] = useState(0)
  const [quizTotal, setQuizTotal]     = useState(0)
  const [streak]                      = useState(() => updateStreak(loadStreak()).count)
  const [srsData, setSrsData]         = useState(loadSRS)
  const [xrayWord, setXrayWord]       = useState(null)
  const [showCustomVocab, setShowCustomVocab] = useState(false)

  function addXP(n) {
    const next = xp + n
    setXP(next)
    localStorage.setItem('hsk_xp', next)
  }

  function handleFlashcardRate(wordId, rating) {
    const updated = updateSRS(srsData, wordId, ratingToQuality(rating))
    setSrsData(updated)
    saveSRS(updated)
  }

  const dueCount = getDueWords(srsData, HSK1).length

  return (
    <div className="app-shell">
      {/* Header */}
      <div className="app-header">
        <span style={{ fontSize:22 }}>🏮</span>
        <div style={{ flex:1 }}>
          <h1 style={{ fontSize:17 }}>{TAB_TITLES[tab]}</h1>
          <div style={{ fontSize:12, color:'var(--mint-dark)', fontWeight:600 }}>
            Jiang Chinese
          </div>
        </div>
        <div className="header-right">
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
            <span style={{ fontSize:16, fontWeight:800, color:'#FF6B35' }}>🔥 {streak}</span>
            <span style={{ fontSize:10, color:'var(--text3)', fontWeight:600 }}>Streak</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', marginLeft:8 }}>
            <span style={{ fontSize:16, fontWeight:800, color:'var(--mint)' }}>⭐ {xp}</span>
            <span style={{ fontSize:10, color:'var(--text3)', fontWeight:600 }}>XP</span>
          </div>
        </div>
      </div>

      {/* Screen */}
      <div className="screen">
        {tab==='flash'  && <Flashcard onProgress={setLearnedCount} onXP={addXP} onRate={handleFlashcardRate} onXRay={setXrayWord} srsData={srsData} dueCount={dueCount} />}
        {tab==='vocab'  && <Vocab onXRay={setXrayWord} />}
        {tab==='quiz'   && <Quiz onXP={addXP} onResult={(c,t) => { setQuizCorrect(c); setQuizTotal(t) }} />}
        {tab==='panda'  && <Gamification xp={xp} learnedCount={learnedCount} streak={streak} />}
        {tab==='stats'  && <Stats learnedCount={learnedCount} quizCorrect={quizCorrect} quizTotal={quizTotal} xp={xp} />}
        {tab==='listen' && <Listen />}
        {tab==='path'   && <LearningPath currentXP={xp} />}
        {tab==='scan'   && <Scanner onSaveWord={w => console.log('Saved', w)} />}
        {tab==='exam'   && <ExamCenter />}
        {tab==='more'   && <MoreScreen onNavigate={(id) => {
          if (id === 'custom') setShowCustomVocab(true)
          else setTab(id)
        }} />}
      </div>

      {xrayWord && <XRay word={xrayWord} onClose={() => setXrayWord(null)} />}
      {showCustomVocab && <CustomVocab onClose={() => setShowCustomVocab(false)} />}

      {/* Bottom nav */}
      <nav className="bottom-nav">
        {TABS.map(t => (
          <button key={t.id} className={`nav-item ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)}>
            <span className="nav-icon" style={{ position:'relative' }}>
              {t.icon}
              {t.id==='flash' && dueCount>0 && (
                <span style={{
                  position:'absolute', top:-4, right:-6,
                  background:'var(--orange)', color:'#fff',
                  width:16, height:16, borderRadius:'50%',
                  fontSize:10, fontWeight:800,
                  display:'flex', alignItems:'center', justifyContent:'center'
                }}>{Math.min(dueCount,99)}</span>
              )}
            </span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

function MoreScreen({ onNavigate }) {
  const items = [
    { id:'custom', icon:'📝', label:'Từ vựng của tôi',  sub:'Tự thêm từ vựng cá nhân',       color:'#4CAF50' },
    { id:'path',   icon:'🗺️', label:'Lộ trình HSK',    sub:'HSK 1 → 6, từng bước rõ ràng', color:'#4DBFB0' },
    { id:'scan',   icon:'📷', label:'Object Scanner',   sub:'Quét vật thể học từ vựng',      color:'#FF9800' },
    { id:'stats',  icon:'📊', label:'Thống kê',         sub:'Tiến độ & biểu đồ học tập',    color:'#9C27B0' },
    { id:'listen', icon:'🎧', label:'Luyện nghe / Nói', sub:'Shadowing & luyện phát âm',     color:'#E91E63' },
  ]
  return (
    <div style={{ padding:'20px' }}>
      <div style={{ fontSize:20, fontWeight:800, color:'var(--text)', marginBottom:4 }}>Khám phá</div>
      <div style={{ fontSize:13, color:'var(--text3)', marginBottom:20 }}>Tất cả tính năng</div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {items.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            display:'flex', alignItems:'center', gap:14,
            padding:'16px 18px', background:'var(--white)',
            border:`2px solid ${item.color}22`, borderRadius:'var(--r-sm)',
            cursor:'pointer', textAlign:'left', width:'100%', fontFamily:'var(--font)',
          }}>
            <div style={{
              width:48, height:48, borderRadius:12, background:item.color+'18',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:24, flexShrink:0
            }}>{item.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:800, color:'var(--text)' }}>{item.label}</div>
              <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>{item.sub}</div>
            </div>
            <span style={{ color:item.color, fontSize:20 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
