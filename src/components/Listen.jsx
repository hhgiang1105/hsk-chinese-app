import { useState, useRef } from 'react'
import './Listen.css'

const LESSONS = [
  {
    id: 1,
    title: 'Chào hỏi cơ bản',
    level: 'HSK 1',
    emoji: '👋',
    text: '你好，我叫小明。很高兴认识你！我是学生，我在北京学习中文。',
    translation: 'Xin chào, tôi tên là Tiểu Minh. Rất vui được gặp bạn! Tôi là học sinh, tôi học tiếng Trung ở Bắc Kinh.',
    words: ['你好','我','叫','很高兴','认识','学生','北京','学习','中文'],
  },
  {
    id: 2,
    title: 'Hỏi thăm sức khoẻ',
    level: 'HSK 1',
    emoji: '😊',
    text: '你好吗？我很好，谢谢！你呢？最近忙不忙？我最近有点累，工作很多。',
    translation: 'Bạn có khoẻ không? Tôi rất khoẻ, cảm ơn! Còn bạn thì sao? Dạo này bạn có bận không? Dạo này tôi hơi mệt, công việc nhiều lắm.',
    words: ['你好吗','很好','谢谢','最近','忙','累','工作'],
  },
  {
    id: 3,
    title: 'Tự giới thiệu',
    level: 'HSK 1',
    emoji: '🙋',
    text: '大家好！我叫李华，我是越南人。我今年二十岁，我在大学学习汉语。我喜欢学中文，因为中文很有意思。',
    translation: 'Xin chào mọi người! Tôi tên là Lý Hoa, tôi là người Việt Nam. Năm nay tôi hai mươi tuổi, tôi đang học tiếng Trung ở đại học. Tôi thích học tiếng Trung vì tiếng Trung rất thú vị.',
    words: ['大家好','越南人','今年','二十岁','大学','汉语','喜欢','因为','有意思'],
  },
  {
    id: 4,
    title: 'Mua đồ ở siêu thị',
    level: 'HSK 1',
    emoji: '🛒',
    text: '请问，这个苹果多少钱？一斤三块钱。我要两斤。一共六块钱。给你十块。找你四块，谢谢！',
    translation: 'Cho hỏi, táo này bao nhiêu tiền một cân? Ba tệ một cân. Tôi muốn hai cân. Tổng cộng sáu tệ. Đây mười tệ. Thối lại bốn tệ, cảm ơn!',
    words: ['请问','苹果','多少钱','一斤','两斤','一共','给你','找你'],
  },
  {
    id: 5,
    title: 'Hỏi đường',
    level: 'HSK 1',
    emoji: '🗺️',
    text: '请问，地铁站在哪里？往前走，然后右转，大概走五分钟就到了。谢谢你！不客气，祝你顺利！',
    translation: 'Xin hỏi, ga tàu điện ngầm ở đâu? Đi thẳng, rồi rẽ phải, đi khoảng năm phút là đến. Cảm ơn bạn! Không có gì, chúc bạn thuận lợi!',
    words: ['地铁站','在哪里','往前走','然后','右转','大概','五分钟','就到了','不客气','顺利'],
  },
  {
    id: 6,
    title: 'Gọi món ở nhà hàng',
    level: 'HSK 1',
    emoji: '🍜',
    text: '服务员，请给我看一下菜单。好的，请稍等。我要一碗米饭，一盘青菜，还有一杯茶。好的，请问还需要别的吗？不用了，谢谢。',
    translation: 'Nhân viên ơi, cho tôi xem thực đơn với. Được, xin chờ một chút. Tôi muốn một bát cơm, một đĩa rau, và một cốc trà. Được rồi, xin hỏi cần gì thêm không? Không cần nữa, cảm ơn.',
    words: ['服务员','菜单','稍等','一碗','米饭','一盘','青菜','一杯','茶','别的'],
  },
  {
    id: 7,
    title: 'Đặt phòng khách sạn',
    level: 'HSK 2',
    emoji: '🏨',
    text: '你好，我想订一间房间。请问您要住几天？我住三天，从今天开始。好的，单人间还是双人间？单人间就可以了，一晚上多少钱？一晚上两百块。',
    translation: 'Xin chào, tôi muốn đặt một phòng. Xin hỏi quý khách muốn ở mấy ngày? Tôi ở ba ngày, bắt đầu từ hôm nay. Được, phòng đơn hay phòng đôi? Phòng đơn được rồi, một đêm bao nhiêu tiền? Một đêm hai trăm tệ.',
    words: ['订','房间','住几天','开始','单人间','双人间','一晚上','两百块'],
  },
  {
    id: 8,
    title: 'Khám bệnh',
    level: 'HSK 2',
    emoji: '🏥',
    text: '医生，我头疼，还有点发烧。你哪里不舒服？从什么时候开始的？从昨天晚上开始的。我给你开个药，多喝水，好好休息。',
    translation: 'Bác sĩ ơi, tôi bị đau đầu và hơi sốt. Bạn thấy khó chịu ở đâu? Bắt đầu từ khi nào? Bắt đầu từ tối qua. Tôi kê thuốc cho bạn, uống nhiều nước, nghỉ ngơi đầy đủ.',
    words: ['头疼','发烧','不舒服','从什么时候','昨天晚上','开药','多喝水','休息'],
  },
  {
    id: 9,
    title: 'Nói về gia đình',
    level: 'HSK 1',
    emoji: '👨‍👩‍👧‍👦',
    text: '我家有四口人，爸爸、妈妈、姐姐和我。我爸爸是医生，我妈妈是老师。我姐姐已经大学毕业了，她在一家公司工作。我很爱我的家人。',
    translation: 'Gia đình tôi có bốn người: bố, mẹ, chị gái và tôi. Bố tôi là bác sĩ, mẹ tôi là giáo viên. Chị gái tôi đã tốt nghiệp đại học rồi, chị ấy làm việc ở một công ty. Tôi rất yêu gia đình mình.',
    words: ['四口人','爸爸','妈妈','姐姐','医生','老师','大学','毕业','公司','家人'],
  },
  {
    id: 10,
    title: 'Nói về thời tiết',
    level: 'HSK 1',
    emoji: '🌤️',
    text: '今天天气怎么样？今天天气很好，晴天，不冷也不热。明天呢？明天会下雨，出门要带伞。秋天的天气真好，我很喜欢秋天。',
    translation: 'Hôm nay thời tiết thế nào? Hôm nay thời tiết rất đẹp, trời nắng, không lạnh cũng không nóng. Còn ngày mai thì sao? Ngày mai sẽ có mưa, ra ngoài nhớ mang ô. Thời tiết mùa thu thật đẹp, tôi rất thích mùa thu.',
    words: ['天气','晴天','不冷','不热','下雨','出门','带伞','秋天'],
  },
  {
    id: 11,
    title: 'Lên kế hoạch cuối tuần',
    level: 'HSK 1',
    emoji: '📅',
    text: '这个周末你有什么计划？我打算和朋友去公园玩。听起来很不错！我们可以一起去吗？当然可以！我们周六早上九点在公园门口见面吧。好的，不见不散！',
    translation: 'Cuối tuần này bạn có kế hoạch gì không? Tôi định đi chơi công viên với bạn bè. Nghe hay đấy! Chúng tôi có thể đi cùng không? Tất nhiên được! Chúng ta gặp nhau ở cổng công viên lúc chín giờ sáng thứ Bảy nhé. Được, hẹn gặp nhau nhé!',
    words: ['周末','计划','打算','公园','一起','周六','早上','九点','门口','不见不散'],
  },
  {
    id: 12,
    title: 'Mua vé tàu',
    level: 'HSK 2',
    emoji: '🚆',
    text: '我想买两张去上海的火车票。请问您要哪天的？明天下午的。好的，明天下午有三点和五点的，您要哪一趟？我要三点的，多少钱？一张一百五十块，两张三百块。',
    translation: 'Tôi muốn mua hai vé tàu đi Thượng Hải. Xin hỏi quý khách muốn ngày nào? Chiều mai. Được, chiều mai có chuyến ba giờ và năm giờ, quý khách muốn chuyến nào? Tôi muốn chuyến ba giờ, bao nhiêu tiền? Một vé một trăm năm mươi tệ, hai vé ba trăm tệ.',
    words: ['两张','火车票','上海','哪天','下午','一趟','一百五十块','三百块'],
  },
  {
    id: 13,
    title: 'Nói về sở thích',
    level: 'HSK 1',
    emoji: '🎨',
    text: '你平时喜欢做什么？我喜欢听音乐、看电影，还喜欢做运动。你喜欢什么运动？我最喜欢游泳，每周游两三次。你呢？我喜欢跑步，每天早上跑步三十分钟。',
    translation: 'Bình thường bạn thích làm gì? Tôi thích nghe nhạc, xem phim, và tập thể thao. Bạn thích môn thể thao gì? Tôi thích bơi lội nhất, mỗi tuần bơi hai ba lần. Còn bạn? Tôi thích chạy bộ, mỗi sáng chạy bộ ba mươi phút.',
    words: ['平时','听音乐','看电影','运动','游泳','每周','跑步','每天早上','三十分钟'],
  },
  {
    id: 14,
    title: 'Gọi điện thoại',
    level: 'HSK 1',
    emoji: '📱',
    text: '喂，你好！请问是王明吗？对，我就是，请问你是哪位？我是李小红，你现在方便说话吗？不太方便，我现在在开会。那我等一下再打给你吧。好的，谢谢你，再见！',
    translation: 'A lô, xin chào! Xin hỏi có phải Vương Minh không? Đúng rồi, tôi đây, xin hỏi bạn là ai? Tôi là Lý Tiểu Hồng, bây giờ bạn có tiện nói chuyện không? Không tiện lắm, tôi đang họp. Vậy tôi gọi lại cho bạn sau nhé. Được, cảm ơn bạn, tạm biệt!',
    words: ['喂','请问','就是','哪位','方便','说话','开会','等一下','再打','再见'],
  },
  {
    id: 15,
    title: 'Ở bưu điện',
    level: 'HSK 2',
    emoji: '📮',
    text: '你好，我想寄一个包裹去越南。好的，请把包裹放在这里。这个包裹多重？大概两公斤。寄普通快递还是特快？普通快递就行，要多少天到？大概七到十天，一共八十块钱。',
    translation: 'Xin chào, tôi muốn gửi một gói hàng đến Việt Nam. Được, xin đặt gói hàng vào đây. Gói hàng này nặng bao nhiêu? Khoảng hai cân. Gửi chuyển phát thường hay chuyển phát nhanh? Thường thôi, mất mấy ngày đến? Khoảng bảy đến mười ngày, tổng cộng tám mươi tệ.',
    words: ['寄','包裹','越南','多重','公斤','普通快递','特快','七到十天','八十块'],
  },
  {
    id: 16,
    title: 'Thuê nhà',
    level: 'HSK 2',
    emoji: '🏠',
    text: '我想租一间公寓，有两室一厅的吗？有的，我们这里有一套，月租两千块。包水电吗？不包，水电费另算。可以看一下房间吗？当然可以，我现在带你去看。',
    translation: 'Tôi muốn thuê một căn hộ, có loại hai phòng ngủ một phòng khách không? Có, chúng tôi có một căn, tiền thuê hai nghìn tệ một tháng. Có bao gồm tiền điện nước không? Không bao gồm, tính riêng. Tôi có thể xem phòng không? Tất nhiên được, tôi dẫn bạn đi xem ngay.',
    words: ['租','公寓','两室一厅','月租','两千块','水电','另算','看房间'],
  },
]

function speak(text, rate = 0.8) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'zh-CN'
    u.rate = rate
    speechSynthesis.speak(u)
  }
}

const LEVEL_COLORS = {
  'HSK 1': { bg: '#E8F8F6', fg: '#2E9F91', border: '#4DBFB0' },
  'HSK 2': { bg: '#E3F2FD', fg: '#1565C0', border: '#5B9CF6' },
}

export default function Listen() {
  const [lessonIdx, setLessonIdx] = useState(0)
  const [playing, setPlaying]     = useState(false)
  const [showTrans, setShowTrans] = useState(false)
  const [highlightWord, setHighlightWord] = useState(null)
  const [listening, setListening] = useState(false)
  const [listenResult, setListenResult] = useState('')
  const [listenFeedback, setListenFeedback] = useState(null)
  const [speed, setSpeed]         = useState(0.8)
  const [filterLevel, setFilterLevel] = useState('전체')
  const recognitionRef = useRef(null)
  const playTimerRef   = useRef(null)

  const levels = ['전체', 'HSK 1', 'HSK 2']
  const filteredLessons = filterLevel === '전체' ? LESSONS : LESSONS.filter(l => l.level === filterLevel)
  const lesson = filteredLessons[lessonIdx] || filteredLessons[0]
  const lc = LEVEL_COLORS[lesson.level] || LEVEL_COLORS['HSK 1']

  function playAudio() {
    setPlaying(true)
    speak(lesson.text, speed)
    clearTimeout(playTimerRef.current)
    const dur = (lesson.text.length / 3) * (1 / speed) * 1000
    playTimerRef.current = setTimeout(() => setPlaying(false), dur + 500)
  }

  function stopAudio() {
    speechSynthesis.cancel()
    clearTimeout(playTimerRef.current)
    setPlaying(false)
  }

  function speakWord(word) {
    setHighlightWord(word)
    speak(word, 0.7)
    setTimeout(() => setHighlightWord(null), 1200)
  }

  function changeLesson(idx) {
    stopAudio()
    setLessonIdx(idx)
    setShowTrans(false)
    setListenFeedback(null)
    setListenResult('')
  }

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setListenFeedback({ type: 'error', msg: 'Trình duyệt không hỗ trợ. Dùng Chrome nhé!' })
      return
    }
    const recog = new SR()
    recog.lang = 'zh-CN'
    recog.interimResults = false
    recog.maxAlternatives = 1
    recog.onresult = e => {
      const said = e.results[0][0].transcript
      setListenResult(said)
      const target = lesson.text.replace(/[，。！？、]/g, '')
      const said2  = said.replace(/[，。！？、]/g, '')
      let match = 0
      for (const ch of said2) { if (target.includes(ch)) match++ }
      const score = Math.min(100, Math.round((match / Math.max(target.length, 1)) * 150))
      setListenFeedback({
        type: score >= 70 ? 'good' : 'try',
        msg: score >= 90 ? '🎉 Tuyệt vời!' : score >= 70 ? '😊 Khá tốt!' : '💪 Luyện thêm nhé!',
        score
      })
      setListening(false)
    }
    recog.onerror = () => { setListening(false); setListenFeedback({ type: 'error', msg: 'Không nghe được, thử lại!' }) }
    recog.onend = () => setListening(false)
    recognitionRef.current = recog
    recog.start()
    setListening(true)
    setListenFeedback(null)
    setListenResult('')
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  return (
    <div className="listen-screen">
      {/* Level filter */}
      <div className="listen-filter-row">
        {['전체', 'HSK 1', 'HSK 2'].map(lv => (
          <button
            key={lv}
            className={`listen-filter-btn ${filterLevel === lv ? 'active' : ''}`}
            onClick={() => { setFilterLevel(lv); setLessonIdx(0); stopAudio() }}
          >
            {lv === '전체' ? 'Tất cả' : lv}
          </button>
        ))}
        <span className="listen-count">{filteredLessons.length} bài</span>
      </div>

      {/* Lesson list */}
      <div className="listen-lessons-wrap">
        <div className="pill-tabs">
          {filteredLessons.map((l, i) => (
            <button
              key={l.id}
              className={`pill-tab ${lessonIdx === i ? 'active' : ''}`}
              onClick={() => changeLesson(i)}
            >
              {l.emoji} {l.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main card */}
      <div className="listen-card card" style={{ margin:'0 20px', borderTop:`3px solid ${lc.border}` }}>
        {/* Title */}
        <div className="listen-card-header">
          <div>
            <div className="listen-card-title">{lesson.emoji} {lesson.title}</div>
            <span className="badge" style={{ background:lc.bg, color:lc.fg, fontSize:11, marginTop:4 }}>
              {lesson.level}
            </span>
          </div>
        </div>

        {/* Player */}
        <div className="listen-play-row">
          <button
            className={`listen-play-btn ${playing ? 'playing' : ''}`}
            onClick={playing ? stopAudio : playAudio}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <div className="listen-progress-wrap">
            <div className="listen-fake-progress">
              <div className={`listen-fake-fill ${playing ? 'animating' : ''}`} />
            </div>
            <div className="listen-time-row">
              <span>00:00</span>
              <span>00:{String(Math.round(lesson.text.length / 3 / speed)).padStart(2,'0')}</span>
            </div>
          </div>
        </div>

        {/* Speed */}
        <div className="listen-speed-row">
          {[0.6, 0.8, 1.0].map(s => (
            <button
              key={s}
              className={`listen-speed-btn ${speed === s ? 'active' : ''}`}
              onClick={() => setSpeed(s)}
            >
              {s === 0.6 ? '🐢 Chậm' : s === 0.8 ? '🚶 Bình thường' : '🚀 Nhanh'}
            </button>
          ))}
        </div>

        {/* Text */}
        <div className="listen-text hanzi">{lesson.text}</div>

        {/* Keywords */}
        <div className="listen-words-title">Từ khoá — nhấn để nghe:</div>
        <div className="listen-words">
          {lesson.words.map(w => (
            <button
              key={w}
              className={`listen-word-chip ${highlightWord === w ? 'highlighted' : ''}`}
              onClick={() => speakWord(w)}
            >
              <span className="hanzi">{w}</span>
            </button>
          ))}
        </div>

        {/* Translation toggle */}
        <button className="listen-trans-toggle" onClick={() => setShowTrans(t => !t)}>
          {showTrans ? '🙈 Ẩn bản dịch' : '👁 Xem bản dịch'}
        </button>
        {showTrans && (
          <div className="listen-translation fade-up">{lesson.translation}</div>
        )}
      </div>

      {/* Speak section */}
      <div className="listen-speak-section card" style={{ margin:'12px 20px 0' }}>
        <div className="listen-speak-title">🎤 Luyện nói</div>
        <div className="listen-speak-desc">Nhấn mic và đọc to đoạn văn bên trên bằng tiếng Trung</div>

        {listenResult && (
          <div className="listen-result-text hanzi">{listenResult}</div>
        )}

        {listenFeedback && (
          <div className={`listen-feedback ${listenFeedback.type}`}>
            <span className="listen-feedback-msg">{listenFeedback.msg}</span>
            {listenFeedback.score !== undefined && (
              <span className="listen-feedback-score">{listenFeedback.score}/100</span>
            )}
          </div>
        )}

        <button
          className={`listen-mic-btn btn-primary full ${listening ? 'active' : ''}`}
          onClick={listening ? stopListening : startListening}
        >
          {listening ? '⏹ Dừng lại' : '🎤 BẮT ĐẦU NÓI'}
        </button>

        {listening && (
          <div className="listen-listening-indicator">
            <div className="listen-wave" />
            <div className="listen-wave" style={{ animationDelay:'0.15s' }} />
            <div className="listen-wave" style={{ animationDelay:'0.3s' }} />
            <span>Đang nghe...</span>
          </div>
        )}
      </div>
    </div>
  )
}
