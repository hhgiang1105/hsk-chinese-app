import { useState, useRef, useEffect, useCallback } from 'react'
import './Scanner.css'

const OBJECT_TRANSLATIONS = {
  'chair': { h:'椅子', p:'yǐ zi', m:'Ghế' },
  'table': { h:'桌子', p:'zhuō zi', m:'Bàn' },
  'desk': { h:'桌子', p:'zhuō zi', m:'Bàn' },
  'laptop': { h:'电脑', p:'diàn nǎo', m:'Máy tính' },
  'computer': { h:'电脑', p:'diàn nǎo', m:'Máy tính' },
  'notebook': { h:'电脑', p:'diàn nǎo', m:'Máy tính' },
  'cell phone': { h:'手机', p:'shǒu jī', m:'Điện thoại' },
  'mobile phone': { h:'手机', p:'shǒu jī', m:'Điện thoại' },
  'telephone': { h:'电话', p:'diàn huà', m:'Điện thoại' },
  'book': { h:'书', p:'shū', m:'Sách' },
  'bottle': { h:'瓶子', p:'píng zi', m:'Chai' },
  'cup': { h:'杯子', p:'bēi zi', m:'Cốc' },
  'mug': { h:'杯子', p:'bēi zi', m:'Cốc' },
  'cat': { h:'猫', p:'māo', m:'Mèo' },
  'kitten': { h:'猫', p:'māo', m:'Mèo' },
  'dog': { h:'狗', p:'gǒu', m:'Chó' },
  'puppy': { h:'狗', p:'gǒu', m:'Chó' },
  'person': { h:'人', p:'rén', m:'Người' },
  'man': { h:'男人', p:'nán rén', m:'Đàn ông' },
  'woman': { h:'女人', p:'nǚ rén', m:'Phụ nữ' },
  'car': { h:'汽车', p:'qì chē', m:'Ô tô' },
  'bicycle': { h:'自行车', p:'zì xíng chē', m:'Xe đạp' },
  'bike': { h:'自行车', p:'zì xíng chē', m:'Xe đạp' },
  'flower': { h:'花', p:'huā', m:'Hoa' },
  'tree': { h:'树', p:'shù', m:'Cây' },
  'plant': { h:'植物', p:'zhí wù', m:'Cây cối' },
  'apple': { h:'苹果', p:'píng guǒ', m:'Táo' },
  'banana': { h:'香蕉', p:'xiāng jiāo', m:'Chuối' },
  'orange': { h:'橙子', p:'chéng zi', m:'Cam' },
  'pizza': { h:'披萨', p:'pī sà', m:'Pizza' },
  'pen': { h:'笔', p:'bǐ', m:'Bút' },
  'pencil': { h:'铅笔', p:'qiān bǐ', m:'Bút chì' },
  'bag': { h:'包', p:'bāo', m:'Túi' },
  'backpack': { h:'书包', p:'shū bāo', m:'Balo' },
  'watch': { h:'手表', p:'shǒu biǎo', m:'Đồng hồ' },
  'glasses': { h:'眼镜', p:'yǎn jìng', m:'Kính mắt' },
  'door': { h:'门', p:'mén', m:'Cửa' },
  'window': { h:'窗户', p:'chuāng hu', m:'Cửa sổ' },
  'sofa': { h:'沙发', p:'shā fā', m:'Ghế sofa' },
  'couch': { h:'沙发', p:'shā fā', m:'Ghế sofa' },
  'bed': { h:'床', p:'chuáng', m:'Giường' },
  'television': { h:'电视', p:'diàn shì', m:'Tivi' },
  'tv': { h:'电视', p:'diàn shì', m:'Tivi' },
  'keyboard': { h:'键盘', p:'jiàn pán', m:'Bàn phím' },
  'mouse': { h:'鼠标', p:'shǔ biāo', m:'Chuột máy tính' },
  'clock': { h:'钟', p:'zhōng', m:'Đồng hồ treo' },
  'lamp': { h:'灯', p:'dēng', m:'Đèn' },
  'light': { h:'灯', p:'dēng', m:'Đèn' },
  'umbrella': { h:'伞', p:'sǎn', m:'Ô / Dù' },
  'key': { h:'钥匙', p:'yào shi', m:'Chìa khóa' },
  'wallet': { h:'钱包', p:'qián bāo', m:'Ví tiền' },
  'shoe': { h:'鞋', p:'xié', m:'Giày' },
  'hat': { h:'帽子', p:'mào zi', m:'Mũ' },
  'shirt': { h:'上衣', p:'shàng yī', m:'Áo' },
  'water': { h:'水', p:'shuǐ', m:'Nước' },
  'food': { h:'食物', p:'shí wù', m:'Thức ăn' },
  'rice': { h:'米饭', p:'mǐ fàn', m:'Cơm' },
  'bowl': { h:'碗', p:'wǎn', m:'Bát' },
}

function findTranslation(predictions) {
  for (const pred of predictions) {
    const labels = pred.className.toLowerCase().split(',').map(s => s.trim())
    for (const label of labels) {
      for (const [key, val] of Object.entries(OBJECT_TRANSLATIONS)) {
        if (label.includes(key) || key.includes(label)) {
          return { ...val, detected: pred.className.split(',')[0].trim(), confidence: Math.round(pred.probability * 100) }
        }
      }
    }
  }
  return null
}

export default function Scanner({ onSaveWord }) {
  const videoRef   = useRef(null)
  const streamRef  = useRef(null)
  const modelRef   = useRef(null)
  const intervalRef= useRef(null)

  const [phase, setPhase]       = useState('idle') // idle | loading-model | loading-cam | scanning | error
  const [result, setResult]     = useState(null)
  const [savedWords, setSavedWords] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [loadStep, setLoadStep] = useState('')

  useEffect(() => () => { cleanup() }, [])

  function cleanup() {
    clearInterval(intervalRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  async function start() {
    setPhase('loading-model')
    setResult(null)
    setErrorMsg('')

    try {
      // Step 1: Load TensorFlow
      setLoadStep('Đang tải TensorFlow.js...')
      const tf = await import('@tensorflow/tfjs')
      await tf.ready()

      // Step 2: Load MobileNet
      setLoadStep('Đang tải model nhận diện AI...')
      const mobilenet = await import('@tensorflow-models/mobilenet')
      const model = await mobilenet.load({ version: 2, alpha: 0.5 })
      modelRef.current = model

      // Step 3: Camera
      setLoadStep('Đang bật camera...')
      setPhase('loading-cam')

      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      }

      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints)
      } catch {
        // fallback: any camera
        stream = await navigator.mediaDevices.getUserMedia({ video: true })
      }

      streamRef.current = stream
      videoRef.current.srcObject = stream
      await videoRef.current.play()

      setPhase('scanning')
      startDetection()

    } catch (e) {
      console.error(e)
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setErrorMsg('Bị từ chối quyền camera. Vào Settings trình duyệt → cho phép Camera.')
      } else if (e.name === 'NotFoundError') {
        setErrorMsg('Không tìm thấy camera trên thiết bị này.')
      } else if (e.message?.includes('model')) {
        setErrorMsg('Không tải được AI model. Kiểm tra kết nối internet và thử lại.')
      } else {
        setErrorMsg(`Lỗi: ${e.message || 'Không xác định'}`)
      }
      setPhase('error')
      cleanup()
    }
  }

  function startDetection() {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(async () => {
      if (!modelRef.current || !videoRef.current || videoRef.current.readyState < 2) return
      try {
        const preds = await modelRef.current.classify(videoRef.current, 5)
        const found = findTranslation(preds)
        setResult(found || { notFound: true, detected: preds[0]?.className?.split(',')[0] || '...' })
      } catch (e) {
        console.warn('Detection error:', e)
      }
    }, 1200)
  }

  function stop() {
    cleanup()
    clearInterval(intervalRef.current)
    setPhase('idle')
    setResult(null)
  }

  function saveWord() {
    if (!result || result.notFound) return
    if (savedWords.find(w => w.h === result.h)) return
    setSavedWords(w => [...w, result])
    onSaveWord && onSaveWord(result)
  }

  const alreadySaved = result && !result.notFound && savedWords.find(w => w.h === result.h)

  return (
    <div className="scanner-screen">
      <div className="scanner-header">
        <div className="scanner-title">📷 Object Scanner</div>
        <div className="scanner-sub">Quét vật thể để học từ tiếng Trung</div>
      </div>

      {/* Camera view — always mounted so ref works */}
      <div className="scanner-cam-wrap" style={{ display: phase === 'scanning' ? 'block' : 'none' }}>
        <div className="scanner-live">
          <video ref={videoRef} className="scanner-video" playsInline muted autoPlay />
          <div className="scanner-crosshair">
            <div className="scanner-corner tl" /><div className="scanner-corner tr" />
            <div className="scanner-corner bl" /><div className="scanner-corner br" />
          </div>
          <div className="scanner-scanning-bar" />
          {result && !result.notFound && (
            <div className="scanner-live-label">
              ✅ {result.detected} ({result.confidence}%)
            </div>
          )}
        </div>
      </div>

      {/* Hidden video for non-scanning states */}
      {phase !== 'scanning' && (
        <video ref={videoRef} style={{ display:'none' }} playsInline muted autoPlay />
      )}

      {/* IDLE */}
      {phase === 'idle' && (
        <div className="scanner-placeholder">
          <div className="scanner-placeholder-icon">📷</div>
          <div className="scanner-placeholder-text">Nhấn bắt đầu để quét vật thể</div>
          <div className="scanner-placeholder-sub">AI sẽ nhận diện và dạy bạn từ tiếng Trung</div>
          <button className="btn-primary" style={{ marginTop:20 }} onClick={start}>
            🔍 Bắt đầu quét
          </button>
        </div>
      )}

      {/* LOADING */}
      {(phase === 'loading-model' || phase === 'loading-cam') && (
        <div className="scanner-placeholder">
          <div className="scanner-loader-wrap">
            <div className="scanner-loader-ring" />
            <div className="scanner-loader-icon">🤖</div>
          </div>
          <div className="scanner-placeholder-text" style={{ marginTop:16 }}>{loadStep}</div>
          <div className="scanner-placeholder-sub">Lần đầu có thể mất 10-20 giây</div>
          <div className="scanner-load-steps">
            <div className={`scanner-step ${phase === 'loading-model' ? 'active' : 'done'}`}>① Tải AI model</div>
            <div className={`scanner-step ${phase === 'loading-cam' ? 'active' : phase === 'scanning' ? 'done' : ''}`}>② Bật camera</div>
            <div className="scanner-step">③ Nhận diện</div>
          </div>
        </div>
      )}

      {/* ERROR */}
      {phase === 'error' && (
        <div className="scanner-placeholder">
          <div style={{ fontSize:48, marginBottom:12 }}>❌</div>
          <div className="scanner-error-msg">{errorMsg}</div>
          <button className="btn-primary" style={{ marginTop:16 }} onClick={start}>
            🔄 Thử lại
          </button>
        </div>
      )}

      {/* RESULT (shown when scanning) */}
      {phase === 'scanning' && (
        <div className="scanner-result-area">
          {!result ? (
            <div className="scanner-waiting">
              <div className="scanner-pulse" />
              <span>Đang nhận diện vật thể...</span>
            </div>
          ) : result.notFound ? (
            <div className="scanner-result-unknown">
              <span>🔍 Phát hiện: <strong>{result.detected}</strong></span>
              <span className="scanner-result-hint">Chưa có trong từ điển</span>
            </div>
          ) : (
            <div className="scanner-result-card fade-up">
              <div className="scanner-word-display">
                <div className="scanner-hanzi hanzi">{result.h}</div>
                <div className="scanner-info">
                  <div className="scanner-pinyin">{result.p}</div>
                  <div className="scanner-meaning">{result.m}</div>
                  <div className="scanner-conf">Độ chính xác: {result.confidence}%</div>
                </div>
              </div>
              <button
                className={`scanner-save-btn ${alreadySaved ? 'saved' : ''}`}
                onClick={saveWord}
                disabled={!!alreadySaved}
              >
                {alreadySaved ? '✓ Đã lưu vào flashcard' : '💾 Lưu vào flashcard'}
              </button>
            </div>
          )}

          <button className="scanner-stop-btn" onClick={stop}>⏹ Dừng camera</button>
        </div>
      )}

      {/* Saved words */}
      {savedWords.length > 0 && (
        <div className="scanner-saved-list">
          <div className="scanner-saved-title">📚 Từ đã lưu ({savedWords.length})</div>
          <div className="scanner-saved-chips">
            {savedWords.map((w, i) => (
              <div key={i} className="scanner-saved-chip">
                <span className="hanzi">{w.h}</span>
                <span>{w.m}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {phase === 'idle' && (
        <div className="scanner-tips">
          <div className="scanner-tips-title">💡 Gợi ý để nhận diện tốt</div>
          {[
            'Hướng camera vào 1 vật thể rõ ràng, nền đơn giản',
            'Cần ánh sáng đầy đủ, tránh ngược sáng',
            'Giữ camera cách vật 30-60cm',
            'Hỗ trợ 50+ vật thể: bàn, ghế, điện thoại, mèo, chó...',
          ].map((t, i) => (
            <div key={i} className="scanner-tip-item">
              <span className="scanner-tip-dot" /><span>{t}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
