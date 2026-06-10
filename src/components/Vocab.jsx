import { loadCustomVocab } from './CustomVocab.jsx'
import { useState, useMemo } from 'react'
import { HSK1, CATEGORIES } from '../data/hsk1.js'
import './Vocab.css'

function speak(text, lang = 'zh-CN') {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = 0.85
    speechSynthesis.speak(u)
  }
}

function getCatColor(cat) {
  const map = {
    'Giao tiếp': '#4CAF50','Đại từ': '#2196F3','Số đếm': '#FF9800',
    'Thời gian': '#9C27B0','Gia đình': '#E91E63','Động từ': '#4DBFB0',
    'Tính từ': '#FF5722','Đồ ăn': '#F44336','Nơi chốn': '#009688',
    'Giao thông': '#3F51B5','Sức khỏe': '#8BC34A','Học tập': '#03A9F4',
    'Thiên nhiên': '#00BCD4','Màu sắc': '#E91E63','Quần áo': '#673AB7',
    'Nghề nghiệp': '#4CAF50','Phó từ': '#607D8B','Lượng từ': '#FF9800',
    'Vị trí': '#3F51B5','Đồ vật': '#009688','Thể thao': '#4CAF50',
    'Tâm trạng': '#E91E63','Động vật': '#FF5722','Văn hóa': '#512DA8',
  }
  return map[cat] || '#4DBFB0'
}

export default function Vocab({ onXRay }) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('Tất cả')
  const [speaking, setSpeaking] = useState(null)
  const [expanded, setExpanded] = useState(null)

  const customCats = loadCustomVocab().map(w => w.cat).filter(Boolean)
  const cats = ['Tất cả', ...CATEGORIES, ...customCats.filter(c => !CATEGORIES.includes(c))]

  const allWords = useMemo(() => {
    const custom = loadCustomVocab()
    return [...HSK1, ...custom]
  }, [])

  const filtered = useMemo(() => {
    let list = allWords
    if (cat !== 'Tất cả') list = list.filter(w => w.cat === cat)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(w =>
        w.h.includes(q) ||
        w.p.toLowerCase().includes(q) ||
        w.m.toLowerCase().includes(q)
      )
    }
    return list
  }, [search, cat])

  const handleSpeak = (e, word) => {
    e.stopPropagation()
    setSpeaking(word.id)
    speak(word.h)
    setTimeout(() => setSpeaking(null), 1500)
  }

  return (
    <div className="vocab-screen">
      {/* Search */}
      <div className="vocab-search-wrap">
        <span className="vocab-search-icon">🔍</span>
        <input
          className="vocab-search"
          type="text"
          placeholder="Tìm từ vựng..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="vocab-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* Category filter */}
      <div className="vocab-cats-wrap">
        <div className="pill-tabs">
          {cats.map(c => (
            <button
              key={c}
              className={`pill-tab ${cat === c ? 'active' : ''}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="vocab-count">
        <span>{filtered.length} từ</span>
        <span className="vocab-filter-label">
          {cat !== 'Tất cả' ? `• ${cat}` : '• Tất cả'}
        </span>
      </div>

      {/* List */}
      <div className="vocab-list">
        {filtered.length === 0 && (
          <div className="vocab-empty">
            <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
            <div>Không tìm thấy từ nào</div>
          </div>
        )}
        {filtered.map((word, i) => {
          const color = getCatColor(word.cat)
          const isExpanded = expanded === word.id
          return (
            <div
              key={word.id}
              className={`vocab-item fade-up ${isExpanded ? 'expanded' : ''}`}
              style={{ animationDelay: `${Math.min(i, 20) * 20}ms` }}
              onClick={() => setExpanded(isExpanded ? null : word.id)}
            >
              <div className="vocab-item-main">
                <div className="vocab-item-left">
                  <span className="vocab-num">{word.id}.</span>
                  <div className="vocab-item-info">
                    <div className="vocab-item-hanzi hanzi">{word.h}</div>
                    <div className="vocab-item-meaning">{word.m}</div>
                  </div>
                </div>
                <div className="vocab-item-right">
                  <span
                    className="vocab-cat-dot"
                    style={{ background: color + '22', color }}
                  >
                    {word.cat}
                  </span>
                  <button
                    className="vocab-xray-btn"
                    onClick={e => { e.stopPropagation(); onXRay && onXRay(word) }}
                    title="X-Ray Kanji"
                  >🔬</button>
                  <button
                    className={`vocab-speak ${speaking === word.id ? 'active' : ''}`}
                    onClick={e => handleSpeak(e, word)}
                    aria-label="Nghe phát âm"
                  >
                    ▶
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="vocab-item-detail fade-up">
                  <div className="vocab-detail-pinyin">{word.p}</div>
                  <div className="vocab-detail-example hanzi">{word.ex}</div>
                  {word.exp && <div className="vocab-detail-exp">{word.exp}</div>}
                  {word.exv && <div className="vocab-detail-exv">🇻🇳 {word.exv}</div>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
