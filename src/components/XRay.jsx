import { useState, useEffect, useRef } from 'react'
import { getDecomposition, getRadical, RADICALS } from '../data/radicals.js'
import './XRay.css'

export default function XRay({ word, onClose }) {
  const [tab, setTab] = useState('decompose') // 'decompose' | 'stroke' | 'radical'
  const writerRef = useRef(null)
  const writerInstance = useRef(null)
  const decomp = getDecomposition(word.h)
  const char = word.h[0] // Use first character

  useEffect(() => {
    if (tab === 'stroke') loadHanziWriter()
    return () => { if (writerInstance.current) writerInstance.current = null }
  }, [tab, char])

  async function loadHanziWriter() {
    if (!writerRef.current) return
    writerRef.current.innerHTML = ''
    try {
      const HanziWriter = (await import('hanzi-writer')).default
      writerInstance.current = HanziWriter.create(writerRef.current, char, {
        width: 240, height: 240,
        padding: 16,
        strokeColor: '#2E9F91',
        radicalColor: '#FF6B35',
        strokeAnimationSpeed: 0.8,
        delayBetweenStrokes: 400,
        showCharacter: false,
        showOutline: true,
      })
    } catch (e) {
      if (writerRef.current) {
        writerRef.current.innerHTML = `<div class="xray-stroke-fallback">
          <div style="font-size:100px;font-family:'Noto Serif SC',serif">${char}</div>
          <div style="font-size:13px;color:#9a9daa;margin-top:8px">Cần kết nối internet để tải stroke order</div>
        </div>`
      }
    }
  }

  function animateStrokes() {
    if (writerInstance.current) {
      writerInstance.current.animateCharacter()
    }
  }

  function showOutline() {
    if (writerInstance.current) {
      writerInstance.current.showCharacter()
    }
  }

  return (
    <div className="xray-overlay" onClick={onClose}>
      <div className="xray-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="xray-header">
          <div className="xray-title-row">
            <span className="xray-char hanzi">{word.h}</span>
            <div>
              <div className="xray-pinyin">{word.p}</div>
              <div className="xray-meaning">{word.m}</div>
            </div>
            <button className="xray-close" onClick={onClose}>✕</button>
          </div>
          <div className="pill-tabs" style={{ marginTop: 12 }}>
            <button className={`pill-tab ${tab === 'decompose' ? 'active' : ''}`} onClick={() => setTab('decompose')}>🔬 Phân rã</button>
            <button className={`pill-tab ${tab === 'stroke' ? 'active' : ''}`} onClick={() => setTab('stroke')}>✍️ Thứ tự nét</button>
            <button className={`pill-tab ${tab === 'radical' ? 'active' : ''}`} onClick={() => setTab('radical')}>📖 Bộ thủ</button>
          </div>
        </div>

        {/* Body */}
        <div className="xray-body">

          {/* DECOMPOSE TAB */}
          {tab === 'decompose' && (
            <div className="xray-decompose fade-up">
              {decomp ? (
                <>
                  <div className="xray-story-box">
                    <div className="xray-story-label">💡 Câu chuyện ghi nhớ</div>
                    <div className="xray-story">{decomp.story}</div>
                  </div>
                  <div className="xray-components">
                    {decomp.components.map((comp, i) => {
                      const rad = getRadical(comp.char)
                      return (
                        <div key={i} className="xray-comp-card" style={{ borderColor: comp.color + '44' }}>
                          <div className="xray-comp-char hanzi" style={{ color: comp.color }}>{comp.char}</div>
                          <div className="xray-comp-info">
                            <div className="xray-comp-meaning" style={{ color: comp.color }}>{comp.meaning}</div>
                            {rad && <div className="xray-comp-desc">{rad.mnemonic}</div>}
                          </div>
                          {rad && <div className="xray-comp-emoji">{rad.emoji}</div>}
                        </div>
                      )
                    })}
                  </div>
                  <div className="xray-formula">
                    {decomp.components.map((c, i) => (
                      <span key={i}>
                        <span className="xray-formula-char hanzi" style={{ color: c.color }}>{c.char}</span>
                        {i < decomp.components.length - 1 && <span className="xray-formula-plus"> + </span>}
                      </span>
                    ))}
                    <span className="xray-formula-eq"> = </span>
                    <span className="xray-formula-result hanzi">{word.h}</span>
                  </div>
                </>
              ) : (
                <div className="xray-no-data">
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                  <div>Chưa có dữ liệu phân rã cho chữ này</div>
                  <div className="xray-char-big hanzi">{char}</div>
                </div>
              )}
            </div>
          )}

          {/* STROKE ORDER TAB */}
          {tab === 'stroke' && (
            <div className="xray-stroke fade-up">
              <div className="xray-stroke-canvas">
                <div ref={writerRef} className="xray-writer" />
              </div>
              <div className="xray-stroke-btns">
                <button className="btn-mint" onClick={animateStrokes}>▶ Xem animation</button>
                <button className="btn-outline" onClick={showOutline}>👁 Hiện chữ mẫu</button>
              </div>
              <div className="xray-stroke-rules">
                <div className="xray-rule-title">📏 Quy tắc viết chữ Hán</div>
                {[
                  { icon: '⬅️➡️', rule: 'Trái trước, phải sau' },
                  { icon: '⬆️⬇️', rule: 'Trên trước, dưới sau' },
                  { icon: '🔲', rule: 'Ngoài trước, trong sau' },
                  { icon: '➡️', rule: 'Nét ngang trước, nét dọc sau' },
                ].map((r, i) => (
                  <div key={i} className="xray-rule-item">
                    <span>{r.icon}</span>
                    <span>{r.rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RADICAL TAB */}
          {tab === 'radical' && (
            <div className="xray-radical fade-up">
              <div className="xray-radical-title">Các bộ thủ cơ bản</div>
              <div className="xray-radical-grid">
                {Object.entries(RADICALS).slice(0, 16).map(([char, rad]) => (
                  <div key={char} className="xray-rad-item">
                    <div className="xray-rad-char hanzi">{char}</div>
                    <div className="xray-rad-emoji">{rad.emoji}</div>
                    <div className="xray-rad-name">{rad.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
