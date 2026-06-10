import { useState, useEffect } from 'react'
import './CustomVocab.css'

const STORAGE_KEY = 'hsk_custom_vocab'

export function loadCustomVocab() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

export function saveCustomVocab(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export default function CustomVocab({ onClose }) {
  const [words, setWords]       = useState(loadCustomVocab)
  const [tab, setTab]           = useState('list') // 'list' | 'add'
  const [editWord, setEditWord] = useState(null)

  // Form state
  const [hanzi,   setHanzi]   = useState('')
  const [pinyin,  setPinyin]  = useState('')
  const [meaning, setMeaning] = useState('')
  const [example, setExample] = useState('')
  const [cat,     setCat]     = useState('Tuỳ chỉnh')
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)

  const CATS = ['Tuỳ chỉnh','Giao tiếp','Đồ ăn','Du lịch','Công việc','Học tập','Gia đình','Khác']

  function resetForm() {
    setHanzi(''); setPinyin(''); setMeaning(''); setExample(''); setCat('Tuỳ chỉnh')
    setError(''); setEditWord(null)
  }

  function openAdd() { resetForm(); setTab('add') }

  function openEdit(word) {
    setEditWord(word)
    setHanzi(word.h); setPinyin(word.p); setMeaning(word.m)
    setExample(word.ex || ''); setCat(word.cat || 'Tuỳ chỉnh')
    setTab('add')
  }

  function handleSave() {
    if (!hanzi.trim())   { setError('Vui lòng nhập chữ Hán'); return }
    if (!pinyin.trim())  { setError('Vui lòng nhập pinyin'); return }
    if (!meaning.trim()) { setError('Vui lòng nhập nghĩa'); return }

    const newWord = {
      id: editWord ? editWord.id : `custom_${Date.now()}`,
      h: hanzi.trim(),
      p: pinyin.trim(),
      m: meaning.trim(),
      ex: example.trim() || `${hanzi.trim()}。`,
      cat: cat,
      custom: true,
    }

    let updated
    if (editWord) {
      updated = words.map(w => w.id === editWord.id ? newWord : w)
    } else {
      // Check duplicate
      if (words.find(w => w.h === hanzi.trim())) {
        setError('Từ này đã tồn tại trong danh sách của bạn!')
        return
      }
      updated = [...words, newWord]
    }

    setWords(updated)
    saveCustomVocab(updated)
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      resetForm()
      setTab('list')
    }, 800)
  }

  function handleDelete(id) {
    const updated = words.filter(w => w.id !== id)
    setWords(updated)
    saveCustomVocab(updated)
  }

  function speak(text) {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'zh-CN'; u.rate = 0.8
      speechSynthesis.speak(u)
    }
  }

  return (
    <div className="cv-overlay" onClick={onClose}>
      <div className="cv-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="cv-header">
          <div className="cv-header-row">
            <div>
              <div className="cv-title">📝 Từ vựng của tôi</div>
              <div className="cv-sub">{words.length} từ đã thêm</div>
            </div>
            <button className="cv-close" onClick={onClose}>✕</button>
          </div>
          <div className="cv-tabs">
            <button className={`cv-tab ${tab==='list'?'active':''}`} onClick={() => { setTab('list'); resetForm() }}>
              📋 Danh sách
            </button>
            <button className={`cv-tab ${tab==='add'?'active':''}`} onClick={openAdd}>
              ➕ Thêm từ mới
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="cv-body">

          {/* LIST TAB */}
          {tab === 'list' && (
            <div className="cv-list">
              {words.length === 0 ? (
                <div className="cv-empty">
                  <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
                  <div style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:6 }}>Chưa có từ nào</div>
                  <div style={{ fontSize:13, color:'var(--text3)', marginBottom:20 }}>Thêm từ vựng mới để học!</div>
                  <button className="btn-primary" onClick={openAdd}>➕ Thêm từ đầu tiên</button>
                </div>
              ) : (
                <>
                  <button className="cv-add-btn" onClick={openAdd}>➕ Thêm từ mới</button>
                  {words.map(w => (
                    <div key={w.id} className="cv-word-item">
                      <div className="cv-word-main">
                        <div className="cv-word-hanzi hanzi" onClick={() => speak(w.h)}>{w.h}</div>
                        <div className="cv-word-info">
                          <div className="cv-word-pinyin">{w.p}</div>
                          <div className="cv-word-meaning">{w.m}</div>
                          {w.ex && <div className="cv-word-example hanzi">{w.ex}</div>}
                        </div>
                        <span className="cv-word-cat">{w.cat}</span>
                      </div>
                      <div className="cv-word-actions">
                        <button className="cv-action-btn speak" onClick={() => speak(w.h)}>🔊</button>
                        <button className="cv-action-btn edit" onClick={() => openEdit(w)}>✏️</button>
                        <button className="cv-action-btn delete" onClick={() => handleDelete(w.id)}>🗑</button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* ADD/EDIT TAB */}
          {tab === 'add' && (
            <div className="cv-form">
              <div className="cv-form-title">
                {editWord ? '✏️ Chỉnh sửa từ' : '➕ Thêm từ mới'}
              </div>

              <div className="cv-field">
                <label>Chữ Hán <span className="cv-required">*</span></label>
                <input
                  className="cv-input hanzi"
                  type="text"
                  placeholder="VD: 你好"
                  value={hanzi}
                  onChange={e => { setHanzi(e.target.value); setError('') }}
                />
              </div>

              <div className="cv-field">
                <label>Pinyin <span className="cv-required">*</span></label>
                <input
                  className="cv-input"
                  type="text"
                  placeholder="VD: nǐ hǎo"
                  value={pinyin}
                  onChange={e => { setPinyin(e.target.value); setError('') }}
                />
              </div>

              <div className="cv-field">
                <label>Nghĩa tiếng Việt <span className="cv-required">*</span></label>
                <input
                  className="cv-input"
                  type="text"
                  placeholder="VD: Xin chào"
                  value={meaning}
                  onChange={e => { setMeaning(e.target.value); setError('') }}
                />
              </div>

              <div className="cv-field">
                <label>Câu ví dụ <span className="cv-optional">(tuỳ chọn)</span></label>
                <input
                  className="cv-input hanzi"
                  type="text"
                  placeholder="VD: 你好！很高兴认识你。"
                  value={example}
                  onChange={e => setExample(e.target.value)}
                />
              </div>

              <div className="cv-field">
                <label>Chủ đề</label>
                <div className="cv-cat-grid">
                  {CATS.map(c => (
                    <button
                      key={c}
                      className={`cv-cat-btn ${cat===c?'active':''}`}
                      onClick={() => setCat(c)}
                    >{c}</button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {hanzi && (
                <div className="cv-preview">
                  <div className="cv-preview-label">Xem trước:</div>
                  <div className="cv-preview-card">
                    <div className="cv-preview-hanzi hanzi">{hanzi}</div>
                    <div className="cv-preview-pinyin">{pinyin}</div>
                    <div className="cv-preview-meaning">{meaning}</div>
                  </div>
                </div>
              )}

              {error && <div className="cv-error">⚠ {error}</div>}

              {success ? (
                <div className="cv-success">✓ {editWord ? 'Đã cập nhật!' : 'Đã thêm thành công!'}</div>
              ) : (
                <div className="cv-form-btns">
                  <button className="cv-cancel-btn" onClick={() => { resetForm(); setTab('list') }}>Huỷ</button>
                  <button className="btn-primary" style={{ flex:1 }} onClick={handleSave}>
                    {editWord ? '💾 Lưu thay đổi' : '➕ Thêm từ'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
