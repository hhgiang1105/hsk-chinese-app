import { useState, useEffect, useRef, useCallback } from 'react'
import { HSK1 } from '../data/hsk1.js'
import './Quiz.css'

const QUIZ_TYPES = [
  { id: 'meaning', label: 'Chọn nghĩa tiếng Việt',  icon: '🔤', desc: 'Nhìn chữ Hán, chọn nghĩa đúng' },
  { id: 'hanzi',   label: 'Chọn chữ Hán',           icon: '汉', desc: 'Nhìn nghĩa, chọn chữ Hán đúng' },
  { id: 'pinyin',  label: 'Chọn pinyin',             icon: 'pīn', desc: 'Nhìn chữ Hán, chọn pinyin đúng' },
  { id: 'sentence',label: 'Dịch câu ví dụ',          icon: '📝', desc: 'Dịch cả câu tiếng Trung sang tiếng Việt' },
]

// Câu dịch mẫu đi kèm với bản dịch tiếng Việt đầy đủ
const SENTENCE_TRANSLATIONS = {
  '你好！很高兴认识你。':   'Xin chào! Rất vui được gặp bạn.',
  '谢谢你的帮助！':         'Cảm ơn bạn đã giúp đỡ!',
  '对不起，我迟到了。':     'Xin lỗi, tôi đến muộn.',
  '再见，明天见！':         'Tạm biệt, hẹn gặp ngày mai!',
  '你好吗？我很好，谢谢。': 'Bạn có khỏe không? Tôi rất khỏe, cảm ơn.',
  '我是学生。':             'Tôi là học sinh.',
  '你叫什么名字？':         'Bạn tên là gì?',
  '他是我的朋友。':         'Anh ấy là bạn tôi.',
  '我想吃饺子。':           'Tôi muốn ăn sủi cảo.',
  '你喝茶还是咖啡？':       'Bạn uống trà hay cà phê?',
  '我想买一件新衣服。':     'Tôi muốn mua một bộ quần áo mới.',
  '今天天气怎么样？':       'Hôm nay thời tiết thế nào?',
  '我每天学习汉语。':       'Tôi học tiếng Trung mỗi ngày.',
  '请坐。':                 'Mời ngồi.',
  '我在学中文。':           'Tôi đang học tiếng Trung.',
  '他很高兴认识你！':       'Anh ấy rất vui được gặp bạn!',
  '我喜欢听音乐。':         'Tôi thích nghe nhạc.',
  '这个城市很大。':         'Thành phố này rất lớn.',
  '今天很热！':             'Hôm nay rất nóng!',
  '这本书很有意思。':       'Cuốn sách này rất thú vị.',
  '我家有四口人。':         'Gia đình tôi có bốn người.',
  '你在哪里？':             'Bạn đang ở đâu?',
  '我去学校。':             'Tôi đi đến trường.',
  '请说慢一点。':           'Xin hãy nói chậm hơn.',
  '我喜欢学中文。':         'Tôi thích học tiếng Trung.',
  '你有时间吗？':           'Bạn có thời gian không?',
  '他每天早上跑步。':       'Anh ấy chạy bộ mỗi sáng.',
  '洗手间在哪里？':         'Nhà vệ sinh ở đâu?',
  '我要一杯水。':           'Tôi muốn một cốc nước.',
  '妈妈做饭很好吃。':       'Mẹ nấu ăn rất ngon.',
  '我喜欢吃水果。':         'Tôi thích ăn hoa quả.',
  '中国人喜欢喝茶。':       'Người Trung Quốc thích uống trà.',
  '我每天喝咖啡。':         'Tôi uống cà phê mỗi ngày.',
  '你吃饭了吗？':           'Bạn ăn cơm chưa?',
  '我喜欢学习汉语。':       'Tôi thích học tiếng Trung.',
  '北京是中国的首都。':     'Bắc Kinh là thủ đô của Trung Quốc.',
  '我在图书馆看书。':       'Tôi đang đọc sách ở thư viện.',
  '我喜欢旅游。':           'Tôi thích du lịch.',
  '她的眼睛很大。':         'Mắt cô ấy rất to.',
  '我头疼。':               'Tôi bị đau đầu.',
  '这朵花很漂亮。':         'Bông hoa này rất đẹp.',
  '我喜欢游泳。':           'Tôi thích bơi lội.',
  '他很帅。':               'Anh ấy rất đẹp trai.',
  '我有一个哥哥。':         'Tôi có một anh trai.',
  '今天是我的生日！':       'Hôm nay là sinh nhật của tôi!',
  '我喜欢唱歌。':           'Tôi thích hát.',
  '你会说中文吗？':         'Bạn có biết nói tiếng Trung không?',
  '外面很冷。':             'Ngoài trời rất lạnh.',
  '我想去中国。':           'Tôi muốn đi Trung Quốc.',
  '我喜欢香蕉。':           'Tôi thích chuối.',
  '我喜欢吃香蕉。':         'Tôi thích ăn chuối.',
  '我自己做到了！':         'Tôi tự mình làm được rồi!',
  '请再说一遍。':           'Xin hãy nói lại một lần nữa.',
  '我们去饭馆吃饭吧。':     'Chúng ta đi nhà hàng ăn cơm thôi.',
  '这个答案错了。':         'Câu trả lời này sai rồi.',
  '我去医院看病。':         'Tôi đi bệnh viện khám bệnh.',
  '这件衣服太贵了！':       'Bộ quần áo này quá đắt!',
  '我发烧了。':             'Tôi bị sốt rồi.',
  '我的手机在哪里？':       'Điện thoại của tôi ở đâu?',
  '我坐地铁上班。':         'Tôi đi tàu điện ngầm đi làm.',
  '请给我一杯水。':         'Xin hãy cho tôi một cốc nước.',
  '我们是朋友。':           'Chúng ta là bạn bè.',
  '我回家了。':             'Tôi về nhà rồi.',
  '这里很安静。':           'Nơi đây rất yên tĩnh.',
  '我很高兴！':             'Tôi rất vui!',
  '春天来了，花都开了。':   'Mùa xuân đến rồi, hoa nở khắp nơi.',
  '熊猫是中国的国宝。':     'Gấu trúc là quốc bảo của Trung Quốc.',
  '你今天穿什么？':         'Hôm nay bạn mặc gì?',
  '他会说中文。':           'Anh ấy biết nói tiếng Trung.',
  '我每天十一点睡觉。':     'Tôi ngủ lúc 11 giờ mỗi ngày.',
  '我七点起床。':           'Tôi thức dậy lúc 7 giờ.',
  '你能帮我吗？':           'Bạn có thể giúp tôi không?',
  '请等一下。':             'Xin hãy chờ một chút.',
  '最近我很忙。':           'Dạo này tôi rất bận.',
  '这件事很重要。':         'Việc này rất quan trọng.',
  '我从越南来。':           'Tôi đến từ Việt Nam.',
  '因为下雨，我没去。':     'Vì trời mưa nên tôi không đi.',
  '虽然难，但是有意思。':   'Mặc dù khó nhưng rất thú vị.',
  '如果你来，我很高兴。':   'Nếu bạn đến tôi sẽ rất vui.',
  '他比我高。':             'Anh ấy cao hơn tôi.',
  '我终于来了！':           'Tôi cuối cùng đã đến rồi!',
  '我的中文越来越好了。':   'Tiếng Trung của tôi ngày càng tốt hơn.',
  '别担心，慢慢来。':       'Đừng lo, từ từ thôi.',
  '她唱歌唱得很好。':       'Cô ấy hát rất hay.',
  '我不会跳舞。':           'Tôi không biết nhảy múa.',
  '今天是晴天。':           'Hôm nay trời nắng.',
  '北京冬天会下雪。':       'Mùa đông Bắc Kinh có tuyết rơi.',
  '我坐飞机去北京。':       'Tôi đi máy bay đến Bắc Kinh.',
  '这里价格很便宜。':       'Giá ở đây rất rẻ.',
  '这个词是什么意思？':     'Từ này có nghĩa là gì?',
  '你的发音很准确。':       'Phát âm của bạn rất chính xác.',
  '汉语语法不太难。':       'Ngữ pháp tiếng Trung không quá khó.',
  '多吃蔬菜对身体好。':     'Ăn nhiều rau củ tốt cho sức khỏe.',
  '我去超市买水果。':       'Tôi đi siêu thị mua hoa quả.',
  '请关门。':               'Xin hãy đóng cửa lại.',
  '请开灯。':               'Xin hãy bật đèn lên.',
  '我在家。':               'Tôi đang ở nhà.',
  '我们一起去吧！':         'Chúng ta cùng đi thôi!',
  '你好！是王先生吗？':     'Xin chào! Có phải ông Vương không?',
}

// Distractor sentences for sentence mode (wrong answers)
const SENTENCE_DISTRACTORS = [
  'Hôm nay thời tiết rất đẹp.',
  'Tôi không biết làm thế nào.',
  'Anh ấy đang làm việc ở công ty.',
  'Chúng tôi đi học cùng nhau.',
  'Cô ấy rất thích mua sắm.',
  'Bạn có thể giúp tôi không?',
  'Tôi cần nghỉ ngơi một chút.',
  'Họ đang ăn tối ở nhà hàng.',
  'Con mèo đang ngủ trên ghế.',
  'Trời đang mưa rất to.',
  'Anh trai tôi là bác sĩ.',
  'Chúng ta cùng xem phim nhé.',
  'Tôi chưa làm bài tập xong.',
  'Cửa hàng đóng cửa lúc 9 giờ.',
  'Bài kiểm tra rất khó.',
  'Tôi thích uống trà hơn cà phê.',
  'Cô giáo giải thích rất rõ ràng.',
  'Xe buýt đến muộn 10 phút.',
  'Tôi đang học bài cho kỳ thi.',
  'Gia đình tôi có năm người.',
]

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function getOptions(correctWord, field, allWords, count = 4) {
  const correctVal = correctWord[field]
  const opts = [correctVal]
  // Pick distractors from same category first for harder questions
  const sameCat = allWords.filter(w => w.id !== correctWord.id && w.cat === correctWord.cat)
  const others  = allWords.filter(w => w.id !== correctWord.id && w.cat !== correctWord.cat)
  const pool = shuffle([...sameCat, ...others])
  for (const w of pool) {
    if (opts.length >= count) break
    if (!opts.includes(w[field])) opts.push(w[field])
  }
  return shuffle(opts)
}

function getSentenceOptions(correctTrans) {
  const distractors = shuffle(SENTENCE_DISTRACTORS.filter(d => d !== correctTrans)).slice(0, 3)
  return shuffle([correctTrans, ...distractors])
}

function Timer({ running }) {
  const [secs, setSecs] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    if (running) ref.current = setInterval(() => setSecs(s => s + 1), 1000)
    else clearInterval(ref.current)
    return () => clearInterval(ref.current)
  }, [running])
  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  return <span className="quiz-timer">00:{mm}:{ss}</span>
}

export default function Quiz({ onXP }) {
  const [quizType, setQuizType] = useState('meaning')
  const [started, setStarted]   = useState(false)
  const [order, setOrder]       = useState([])
  const [qi, setQi]             = useState(0)
  const [options, setOptions]   = useState([])
  const [chosen, setChosen]     = useState(null)
  const [correct, setCorrect]   = useState(0)
  const [done, setDone]         = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [sentenceData, setSentenceData] = useState(null)
  const [apiKey, setApiKey]     = useState(() => localStorage.getItem('anthropic_key') || '')
  const [showKeyInput, setShowKeyInput] = useState(false)

  const TOTAL = 20
  const word = order[qi] !== undefined ? HSK1.find(w => w.id === order[qi]) : null

  const initQuiz = useCallback(() => {
    const ids = shuffle(HSK1.map(w => w.id)).slice(0, TOTAL)
    setOrder(ids)
    setQi(0)
    setChosen(null)
    setCorrect(0)
    setDone(false)
    setSentenceData(null)
    setStarted(true)
  }, [])

  useEffect(() => {
    if (!word) return
    setChosen(null)
    setSentenceData(null)
    if (quizType === 'sentence') {
      buildSentenceQuestion(word)
    } else {
      const field = quizType === 'meaning' ? 'm' : quizType === 'hanzi' ? 'h' : 'p'
      setOptions(getOptions(word, field, HSK1))
    }
  }, [qi, word?.id, quizType])

  async function buildSentenceQuestion(word) {
    setAiLoading(true)

    // Try to use the example sentence with its known translation
    const exSentence = word.ex
    const knownTrans = SENTENCE_TRANSLATIONS[exSentence]

    if (!apiKey) {
      // No API key — use example sentence + known translation or fallback
      if (knownTrans) {
        const opts = getSentenceOptions(knownTrans)
        setSentenceData({ sentence: exSentence, correctTrans: knownTrans, opts })
      } else {
        // Fallback: show the word meaning as correct answer with distractor sentences
        const correctTrans = `Tôi thích ${word.m.toLowerCase()}.`
        const opts = getSentenceOptions(correctTrans)
        setSentenceData({ sentence: exSentence, correctTrans, opts })
      }
      setAiLoading(false)
      return
    }

    // With API key — generate fresh sentence + 3 plausible wrong translations
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 400,
          system: 'Bạn là trợ lý học tiếng Trung. Chỉ trả về JSON thuần túy, không markdown, không giải thích.',
          messages: [{
            role: 'user',
            content: `Tạo câu tiếng Trung HSK1 đơn giản dùng từ "${word.h}" (nghĩa: ${word.m}).
Trả về JSON với format sau (KHÔNG có markdown):
{"sentence":"câu tiếng Trung","correct":"bản dịch tiếng Việt đầy đủ của câu","wrong1":"bản dịch sai nhưng nghe hợp lý","wrong2":"bản dịch sai khác","wrong3":"bản dịch sai khác nữa"}
Lưu ý: wrong1/2/3 phải là câu tiếng Việt hoàn chỉnh, sai ở từ khóa chính hoặc ngữ nghĩa.`
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const json = JSON.parse(text.replace(/```json|```/g, '').trim())
      const opts = shuffle([json.correct, json.wrong1, json.wrong2, json.wrong3])
      setSentenceData({ sentence: json.sentence, correctTrans: json.correct, opts })
    } catch {
      // API failed — use known translation fallback
      if (knownTrans) {
        setSentenceData({ sentence: exSentence, correctTrans: knownTrans, opts: getSentenceOptions(knownTrans) })
      } else {
        const fallbackTrans = knownTrans || `Tôi thích ${word.m.toLowerCase()}.`
        setSentenceData({ sentence: exSentence, correctTrans: fallbackTrans, opts: getSentenceOptions(fallbackTrans) })
      }
    }
    setAiLoading(false)
  }

  function getCorrectAnswer() {
    if (quizType === 'sentence') return sentenceData?.correctTrans
    if (quizType === 'meaning')  return word?.m
    if (quizType === 'hanzi')    return word?.h
    return word?.p
  }

  function choose(opt) {
    if (chosen) return
    setChosen(opt)
    if (opt === getCorrectAnswer()) {
      onXP(15)
      setCorrect(c => c + 1)
    }
  }

  function next() {
    if (qi + 1 >= TOTAL) { setDone(true); return }
    setQi(q => q + 1)
  }

  function getOptState(opt) {
    if (!chosen) return ''
    if (opt === getCorrectAnswer()) return 'correct'
    if (opt === chosen) return 'wrong'
    return 'dim'
  }

  const isCorrectChosen = chosen && chosen === getCorrectAnswer()

  // ── RESULT ──
  if (done) {
    const pct = Math.round((correct / TOTAL) * 100)
    return (
      <div className="quiz-result-screen">
        <div className="quiz-result-emoji">{pct >= 80 ? '🎉' : pct >= 50 ? '📚' : '💪'}</div>
        <div className="quiz-result-score">{pct}%</div>
        <div className="quiz-result-sub">Bạn đúng {correct} / {TOTAL} câu</div>
        <div className="quiz-result-stars">
          {[...Array(3)].map((_, i) => (
            <span key={i} style={{ fontSize:32, opacity: pct >= (i+1)*33 ? 1 : 0.25 }}>⭐</span>
          ))}
        </div>
        <button className="btn-primary" style={{ marginTop:24, minWidth:200 }}
          onClick={() => { setDone(false); setStarted(false) }}>
          Làm lại
        </button>
      </div>
    )
  }

  // ── START ──
  if (!started) {
    return (
      <div className="quiz-start-screen">
        <div className="quiz-start-title">Chọn loại câu hỏi</div>
        <div className="quiz-type-list">
          {QUIZ_TYPES.map(t => (
            <button key={t.id}
              className={`quiz-type-btn ${quizType === t.id ? 'active' : ''}`}
              onClick={() => setQuizType(t.id)}
            >
              <span className="quiz-type-icon">{t.icon}</span>
              <div style={{ flex:1, textAlign:'left' }}>
                <div>{t.label}</div>
                <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>{t.desc}</div>
              </div>
              {t.id === 'sentence' && (
                <span className="badge" style={{ background:'#E8F8F6', color:'#4DBFB0', marginLeft:'auto', flexShrink:0 }}>AI</span>
              )}
            </button>
          ))}
        </div>

        {quizType === 'sentence' && (
          <div className="quiz-ai-key-section">
            <div className="quiz-ai-key-title">🔑 API Key Anthropic (tuỳ chọn)</div>
            <div className="quiz-ai-key-desc">
              Không có key vẫn chơi được với câu ví dụ có sẵn.<br/>
              Có key → AI tạo câu mới đa dạng hơn.
            </div>
            {showKeyInput ? (
              <div style={{ display:'flex', gap:8, marginTop:8 }}>
                <input type="password" className="quiz-key-input"
                  placeholder="sk-ant-..."
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                />
                <button className="btn-mint" style={{ padding:'10px 16px', borderRadius:12 }}
                  onClick={() => { localStorage.setItem('anthropic_key', apiKey); setShowKeyInput(false) }}>
                  Lưu
                </button>
              </div>
            ) : (
              <button className="quiz-key-toggle" onClick={() => setShowKeyInput(true)}>
                {apiKey ? '✓ Đã có key — nhấn để đổi' : '+ Nhập API key'}
              </button>
            )}
          </div>
        )}

        <button className="btn-primary full" style={{ marginTop:24 }} onClick={initQuiz}>
          Bắt đầu Quiz →
        </button>
      </div>
    )
  }

  // ── QUIZ ──
  const displayOpts = quizType === 'sentence' ? (sentenceData?.opts || []) : options
  // questionText: mode hanzi -> show meaning+pinyin; mode pinyin -> show hanzi; others -> hanzi
  const questionText = quizType === 'sentence' ? sentenceData?.sentence
    : quizType === 'hanzi'  ? word?.m
    : word?.h

  return (
    <div className="quiz-screen">
      <div className="quiz-topbar">
        <button className="quiz-back-btn" onClick={() => setStarted(false)}>‹</button>
        <Timer running={!chosen} />
        <span className="quiz-progress-text">{qi + 1}/{TOTAL}</span>
      </div>

      <div className="progress-track" style={{ margin:'0 20px' }}>
        <div className="progress-fill" style={{ width:`${(qi / TOTAL) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="quiz-question-block">
        <div className="quiz-question-label">
          {quizType === 'sentence' ? 'Dịch câu sau sang tiếng Việt:' :
           quizType === 'meaning'  ? 'Nghĩa của từ này là gì?' :
           quizType === 'hanzi'    ? 'Chữ Hán nào đúng?' : 'Pinyin nào đúng?'}
        </div>

        {aiLoading ? (
          <div className="quiz-ai-loading">
            <div className="quiz-spinner" />
            <span>Đang chuẩn bị câu hỏi...</span>
          </div>
        ) : (
          <div className={`quiz-question-word ${quizType !== 'hanzi' ? 'hanzi' : ''} ${quizType === 'sentence' ? 'sentence-mode' : ''}`}>
            {questionText}
          </div>
        )}

        {word && quizType !== 'sentence' && !aiLoading && (
          <div className="quiz-question-sub">
            {quizType === 'meaning' && <span className="quiz-pinyin">{word.p}</span>}
            {quizType === 'hanzi'   && <span className="quiz-pinyin">{word.p}</span>}
            {quizType === 'pinyin'  && <span className="quiz-hanzi-hint hanzi">{word.h} — {word.m}</span>}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="quiz-options">
        {displayOpts.map((opt, i) => (
          <button key={i}
            className={`quiz-opt ${getOptState(opt)}`}
            onClick={() => choose(opt)}
            disabled={!!chosen || aiLoading}
          >
            <span className="quiz-opt-label">{String.fromCharCode(65 + i)}</span>
            <span className={quizType === 'hanzi' ? 'hanzi' : ''}>{opt}</span>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {chosen && (
        <div className={`quiz-feedback ${isCorrectChosen ? 'correct' : 'wrong'}`}>
          <span className="quiz-feedback-icon">{isCorrectChosen ? '✓' : '✗'}</span>
          <span className="quiz-feedback-text">
            {isCorrectChosen
              ? 'Chính xác! +15 XP'
              : `Đáp án đúng: ${getCorrectAnswer()}`}
          </span>
          <button className="quiz-next-btn" onClick={next}>
            {qi + 1 >= TOTAL ? 'Kết quả' : 'Tiếp →'}
          </button>
        </div>
      )}
    </div>
  )
}
