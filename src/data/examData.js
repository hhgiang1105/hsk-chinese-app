// Zang Exam Center — Đề thi thử HSK

export const EXAMS = [
  // ── HSK 1 ──────────────────────────────────────────
  {
    id: 'hsk1_01',
    level: 1,
    title: 'Đề thi thử HSK 1 - Đề số 01',
    duration: 40, // phút
    totalScore: 100,
    passScore: 60,
    participants: 1284,
    free: true,
    sections: [
      {
        id: 'listen',
        name: 'Phần Nghe',
        icon: '🎧',
        questions: [
          {
            id: 'l1', type: 'listen',
            audio: '你好，我叫李明。',
            question: 'Người nói tên là gì?',
            options: ['A. 王明', 'B. 李明', 'C. 张明', 'D. 刘明'],
            answer: 'B',
            explain: '李明 (Lǐ Míng) — câu "我叫李明" nghĩa là "Tôi tên là Lý Minh".'
          },
          {
            id: 'l2', type: 'listen',
            audio: '现在几点？三点半。',
            question: 'Bây giờ là mấy giờ?',
            options: ['A. 两点', 'B. 三点', 'C. 三点半', 'D. 四点'],
            answer: 'C',
            explain: '三点半 (sān diǎn bàn) = 3 giờ 30 phút (3 rưỡi).'
          },
          {
            id: 'l3', type: 'listen',
            audio: '我喜欢吃苹果，不喜欢吃香蕉。',
            question: 'Người nói thích ăn gì?',
            options: ['A. 香蕉', 'B. 苹果', 'C. 西瓜', 'D. 橙子'],
            answer: 'B',
            explain: '苹果 (píngguǒ) = táo. Câu nói "我喜欢吃苹果" = Tôi thích ăn táo.'
          },
          {
            id: 'l4', type: 'listen',
            audio: '今天天气很热，有三十五度。',
            question: 'Nhiệt độ hôm nay là bao nhiêu?',
            options: ['A. 二十五度', 'B. 三十度', 'C. 三十五度', 'D. 四十度'],
            answer: 'C',
            explain: '三十五度 (sānshíwǔ dù) = 35 độ.'
          },
          {
            id: 'l5', type: 'listen',
            audio: '我家有四口人，爸爸、妈妈、弟弟和我。',
            question: 'Gia đình người nói có mấy người?',
            options: ['A. 三口人', 'B. 四口人', 'C. 五口人', 'D. 六口人'],
            answer: 'B',
            explain: '四口人 (sì kǒu rén) = bốn người trong gia đình.'
          },
        ]
      },
      {
        id: 'read',
        name: 'Phần Đọc',
        icon: '📖',
        questions: [
          {
            id: 'r1', type: 'read',
            passage: '小明今年八岁，他在北京上小学。他喜欢踢足球和看书。他的爸爸是老师，妈妈是医生。',
            question: '小明的妈妈是做什么的？',
            options: ['A. 老师', 'B. 医生', 'C. 学生', 'D. 工人'],
            answer: 'B',
            explain: '文章说"妈妈是医生" — Bài văn nói "妈妈是医生" (mẹ là bác sĩ).'
          },
          {
            id: 'r2', type: 'read',
            passage: '今天是星期六，天气很好。我和朋友去公园玩。我们在公园踢球，还吃了冰淇淋。',
            question: '他们在公园做什么了？（选两个）',
            options: ['A. 踢球', 'B. 游泳', 'C. 吃冰淇淋', 'D. 看电影'],
            answer: 'A',
            explain: '"踢球"和"吃冰淇淋"都提到了。Đáp án A (踢球) là đáp án chính được hỏi.'
          },
          {
            id: 'r3', type: 'read',
            passage: '我叫王丽，是越南人。我在中国学习汉语，已经学了两年了。我觉得汉语很有意思，但是也很难。',
            question: '王丽学汉语多少年了？',
            options: ['A. 一年', 'B. 两年', 'C. 三年', 'D. 四年'],
            answer: 'B',
            explain: '"已经学了两年了" = đã học được hai năm rồi.'
          },
          {
            id: 'r4', type: 'read',
            passage: '超市里有很多东西：水果、蔬菜、肉、鱼和饮料。今天苹果一斤三块钱，香蕉一斤两块钱。',
            question: '苹果一斤多少钱？',
            options: ['A. 一块钱', 'B. 两块钱', 'C. 三块钱', 'D. 四块钱'],
            answer: 'C',
            explain: '"苹果一斤三块钱" = táo ba tệ một cân.'
          },
          {
            id: 'r5', type: 'read',
            passage: '张老师的课很有意思。他上课的时候，常常给学生讲故事，大家都很喜欢听。他说，学习汉语要多听、多说、多读、多写。',
            question: '张老师认为学习汉语要怎么做？',
            options: ['A. 只要多读书', 'B. 多听、多说、多读、多写', 'C. 只要上课认真', 'D. 多看电视'],
            answer: 'B',
            explain: '"多听、多说、多读、多写" = nghe nhiều, nói nhiều, đọc nhiều, viết nhiều.'
          },
        ]
      },
      {
        id: 'vocab',
        name: 'Từ vựng & Ngữ pháp',
        icon: '📝',
        questions: [
          {
            id: 'v1', type: 'vocab',
            question: '请选择正确的词语填空：我___去图书馆看书。',
            options: ['A. 想', 'B. 是', 'C. 有', 'D. 在'],
            answer: 'A',
            explain: '"想" (xiǎng) = muốn. "我想去..." = Tôi muốn đi... Đây là trợ động từ chỉ ý muốn.'
          },
          {
            id: 'v2', type: 'vocab',
            question: '"漂亮"的意思是什么？',
            options: ['A. 很高', 'B. 很美', 'C. 很大', 'D. 很快'],
            answer: 'B',
            explain: '漂亮 (piàoliang) = đẹp, xinh. "她很漂亮" = Cô ấy rất đẹp.'
          },
          {
            id: 'v3', type: 'vocab',
            question: '选择正确的句子：',
            options: [
              'A. 我是很高兴',
              'B. 我很是高兴',
              'C. 我很高兴',
              'D. 很我高兴'
            ],
            answer: 'C',
            explain: '"很" (hěn) đứng trước tính từ để bổ nghĩa. Cấu trúc đúng: 主语 + 很 + 形容词.'
          },
          {
            id: 'v4', type: 'vocab',
            question: '"再见"的英语是什么意思？',
            options: ['A. Hello', 'B. Thank you', 'C. Goodbye', 'D. Sorry'],
            answer: 'C',
            explain: '再见 (zàijiàn) = Goodbye / Tạm biệt. 再 = lại, 见 = gặp → gặp lại.'
          },
          {
            id: 'v5', type: 'vocab',
            question: '下面哪个词是"蔬菜"的意思？',
            options: ['A. Meat', 'B. Fruit', 'C. Vegetables', 'D. Fish'],
            answer: 'C',
            explain: '蔬菜 (shūcài) = rau củ / vegetables.'
          },
          {
            id: 'v6', type: 'vocab',
            question: '用"因为...所以..."造句，选择正确的：',
            options: [
              'A. 因为下雨，我没去。所以',
              'B. 因为我没去，所以下雨。',
              'C. 因为下雨，所以我没去。',
              'D. 所以下雨，因为我没去。'
            ],
            answer: 'C',
            explain: 'Cấu trúc: 因为 + nguyên nhân + 所以 + kết quả. "因为下雨，所以我没去" = Vì trời mưa nên tôi không đi.'
          },
          {
            id: 'v7', type: 'vocab',
            question: '"我比他高"这句话的意思是：',
            options: [
              'A. Tôi cao bằng anh ấy',
              'B. Tôi cao hơn anh ấy',
              'C. Anh ấy cao hơn tôi',
              'D. Chúng tôi đều cao'
            ],
            answer: 'B',
            explain: '"比" (bǐ) là giới từ so sánh. A比B + tính từ = A [tính từ] hơn B.'
          },
          {
            id: 'v8', type: 'vocab',
            question: '选出与"高兴"意思相近的词：',
            options: ['A. 难过', 'B. 生气', 'C. 开心', 'D. 害怕'],
            answer: 'C',
            explain: '高兴 (gāoxìng) ≈ 开心 (kāixīn), đều có nghĩa là vui vẻ, hạnh phúc.'
          },
          {
            id: 'v9', type: 'vocab',
            question: '"你吃饭了吗？"应该怎么回答？',
            options: [
              'A. 我是吃饭。',
              'B. 吃了，谢谢！',
              'C. 我不是吃饭。',
              'D. 我吃饭很好。'
            ],
            answer: 'B',
            explain: 'Câu hỏi dùng "了吗" hỏi hành động đã xảy ra chưa. Trả lời: 吃了 (đã ăn rồi) + 谢谢。'
          },
          {
            id: 'v10', type: 'vocab',
            question: '"这本书多少钱？"中"多少"的意思是：',
            options: ['A. Đắt hay rẻ', 'B. Bao nhiêu', 'C. Cái nào', 'D. Thế nào'],
            answer: 'B',
            explain: '多少 (duōshao) = bao nhiêu, dùng để hỏi số lượng hoặc giá tiền.'
          },
        ]
      }
    ]
  },

  // ── HSK 1 Đề 02 ────────────────────────────────────
  {
    id: 'hsk1_02',
    level: 1,
    title: 'Đề thi thử HSK 1 - Đề số 02',
    duration: 40,
    totalScore: 100,
    passScore: 60,
    participants: 876,
    free: true,
    sections: [
      {
        id: 'listen',
        name: 'Phần Nghe',
        icon: '🎧',
        questions: [
          {
            id: 'l1', type: 'listen',
            audio: '我妈妈是老师，她在小学工作。',
            question: 'Mẹ của người nói làm nghề gì?',
            options: ['A. 医生', 'B. 护士', 'C. 老师', 'D. 工人'],
            answer: 'C',
            explain: '"我妈妈是老师" = Mẹ tôi là giáo viên.'
          },
          {
            id: 'l2', type: 'listen',
            audio: '明天是星期三，后天是星期四。',
            question: 'Hôm nay là thứ mấy?',
            options: ['A. 星期一', 'B. 星期二', 'C. 星期三', 'D. 星期四'],
            answer: 'B',
            explain: '"明天是星期三" = ngày mai là thứ tư → hôm nay là thứ ba (星期二).'
          },
          {
            id: 'l3', type: 'listen',
            audio: '这件衣服一百五十块钱，我觉得有点贵。',
            question: 'Chiếc áo này giá bao nhiêu?',
            options: ['A. 一百块', 'B. 一百五十块', 'C. 两百块', 'D. 五十块'],
            answer: 'B',
            explain: '一百五十块 = 150 tệ.'
          },
          {
            id: 'l4', type: 'listen',
            audio: '我每天七点起床，然后吃早饭，八点去上学。',
            question: 'Người nói mấy giờ đi học?',
            options: ['A. 六点', 'B. 七点', 'C. 七点半', 'D. 八点'],
            answer: 'D',
            explain: '"八点去上学" = tám giờ đi học.'
          },
          {
            id: 'l5', type: 'listen',
            audio: '我不喜欢冬天，因为太冷了。我最喜欢春天。',
            question: 'Người nói thích mùa nào nhất?',
            options: ['A. 春天', 'B. 夏天', 'C. 秋天', 'D. 冬天'],
            answer: 'A',
            explain: '"我最喜欢春天" = Tôi thích mùa xuân nhất.'
          },
        ]
      },
      {
        id: 'read',
        name: 'Phần Đọc',
        icon: '📖',
        questions: [
          {
            id: 'r1', type: 'read',
            passage: '李华是一个大学生。他每天六点半起床，跑步半个小时，然后去教室上课。他的学习成绩很好，老师和同学都很喜欢他。',
            question: '李华每天几点起床？',
            options: ['A. 六点', 'B. 六点半', 'C. 七点', 'D. 七点半'],
            answer: 'B',
            explain: '"每天六点半起床" = mỗi ngày thức dậy lúc sáu giờ rưỡi.'
          },
          {
            id: 'r2', type: 'read',
            passage: '我家附近有一个公园。公园里有很多花和树，还有一个湖。每天早上，很多老人在公园里打太极拳，小朋友在草地上玩耍。',
            question: '公园里有什么？',
            options: ['A. 只有花', 'B. 花、树和湖', 'C. 只有树和湖', 'D. 只有湖'],
            answer: 'B',
            explain: '文章提到"花和树，还有一个湖" = hoa, cây và hồ.'
          },
          {
            id: 'r3', type: 'read',
            passage: '今天下午我去了超市买东西。我买了苹果、牛奶和面包。苹果五块钱，牛奶三块钱，面包两块钱，一共十块钱。',
            question: '他一共花了多少钱？',
            options: ['A. 八块钱', 'B. 九块钱', 'C. 十块钱', 'D. 十一块钱'],
            answer: 'C',
            explain: '5 + 3 + 2 = 10块钱. "一共十块钱" = tổng cộng mười tệ.'
          },
          {
            id: 'r4', type: 'read',
            passage: '我有一只猫，它叫小白。小白是白色的，非常可爱。它喜欢玩球，也喜欢睡觉。每天我回家，它都会来门口迎接我。',
            question: '小白是什么颜色的？',
            options: ['A. 黑色', 'B. 黄色', 'C. 白色', 'D. 灰色'],
            answer: 'C',
            explain: '"小白是白色的" = Tiểu Bạch màu trắng.'
          },
          {
            id: 'r5', type: 'read',
            passage: '我的爷爷今年七十二岁，身体很好。他每天早上打太极拳，下午看报纸，晚上看电视。他说，坚持运动是他身体好的秘诀。',
            question: '爷爷的身体为什么好？',
            options: ['A. 吃了很多药', 'B. 经常去医院', 'C. 坚持运动', 'D. 睡觉很多'],
            answer: 'C',
            explain: '"坚持运动是他身体好的秘诀" = kiên trì tập thể dục là bí quyết sức khỏe của ông.'
          },
        ]
      },
      {
        id: 'vocab',
        name: 'Từ vựng & Ngữ pháp',
        icon: '📝',
        questions: [
          {
            id: 'v1', type: 'vocab',
            question: '"对不起"的意思是：',
            options: ['A. Cảm ơn', 'B. Xin chào', 'C. Xin lỗi', 'D. Tạm biệt'],
            answer: 'C',
            explain: '对不起 (duìbuqǐ) = Xin lỗi. Câu trả lời thường là "没关系" (không sao).'
          },
          {
            id: 'v2', type: 'vocab',
            question: '选出正确的时间表达：',
            options: ['A. 我昨天将去北京', 'B. 我昨天去了北京', 'C. 我昨天去北京了的', 'D. 我去昨天北京'],
            answer: 'B',
            explain: '"了" (le) dùng sau động từ để diễn tả hành động đã hoàn thành. "去了" = đã đi.'
          },
          {
            id: 'v3', type: 'vocab',
            question: '下面哪个词的意思是"便宜"的反义词？',
            options: ['A. 好', 'B. 贵', 'C. 大', 'D. 多'],
            answer: 'B',
            explain: '便宜 (piányí) = rẻ, trái nghĩa là 贵 (guì) = đắt.'
          },
          {
            id: 'v4', type: 'vocab',
            question: '"我___了，需要休息一下。"应该填：',
            options: ['A. 高兴', 'B. 漂亮', 'C. 累', 'D. 快'],
            answer: 'C',
            explain: '累 (lèi) = mệt. "我累了，需要休息" = Tôi mệt rồi, cần nghỉ ngơi.'
          },
          {
            id: 'v5', type: 'vocab',
            question: '"不但...而且..."表示：',
            options: ['A. Nguyên nhân và kết quả', 'B. Điều kiện', 'C. Thêm vào, không chỉ... mà còn...', 'D. Đối lập'],
            answer: 'C',
            explain: '"不但A，而且B" = không chỉ A mà còn B. Ví dụ: 他不但会说中文，而且会说英文。'
          },
          {
            id: 'v6', type: 'vocab',
            question: '"请问，图书馆___哪里？"应该填：',
            options: ['A. 是', 'B. 在', 'C. 有', 'D. 去'],
            answer: 'B',
            explain: '"在" (zài) dùng để hỏi/nói vị trí. "图书馆在哪里" = Thư viện ở đâu?'
          },
          {
            id: 'v7', type: 'vocab',
            question: '选择正确的量词：一___书',
            options: ['A. 个', 'B. 条', 'C. 本', 'D. 张'],
            answer: 'C',
            explain: '本 (běn) là lượng từ cho sách, vở. "一本书" = một cuốn sách.'
          },
          {
            id: 'v8', type: 'vocab',
            question: '"他学习___努力，成绩___很好。"应该填：',
            options: ['A. 很...很', 'B. 非常...所以', 'C. 虽然...但是', 'D. 因为...所以'],
            answer: 'B',
            explain: '"非常努力...所以成绩很好" = rất cố gắng... nên kết quả tốt. Hoặc đáp án B đúng nhất về ngữ nghĩa.'
          },
          {
            id: 'v9', type: 'vocab',
            question: '"早上好"的意思是：',
            options: ['A. Chúc ngủ ngon', 'B. Tạm biệt', 'C. Chào buổi sáng', 'D. Xin lỗi'],
            answer: 'C',
            explain: '早上好 (zǎoshang hǎo) = Chào buổi sáng / Good morning.'
          },
          {
            id: 'v10', type: 'vocab',
            question: '"他___我高两厘米。"应该填：',
            options: ['A. 比', 'B. 和', 'C. 跟', 'D. 对'],
            answer: 'A',
            explain: '"比" dùng để so sánh. "他比我高两厘米" = Anh ấy cao hơn tôi hai xentimet.'
          },
        ]
      }
    ]
  },

  // ── HSK 2 Đề 01 ────────────────────────────────────
  {
    id: 'hsk2_01',
    level: 2,
    title: 'Đề thi thử HSK 2 - Đề số 01',
    duration: 55,
    totalScore: 100,
    passScore: 60,
    participants: 643,
    free: true,
    sections: [
      {
        id: 'listen',
        name: 'Phần Nghe',
        icon: '🎧',
        questions: [
          {
            id: 'l1', type: 'listen',
            audio: '我最近在学做中国菜，已经学会了做饺子和炒饭。',
            question: 'Người nói đã học được làm gì?',
            options: ['A. 只学了饺子', 'B. 饺子和炒饭', 'C. 只学了炒饭', 'D. 面条和饺子'],
            answer: 'B',
            explain: '"学会了做饺子和炒饭" = đã học được làm sủi cảo và cơm chiên.'
          },
          {
            id: 'l2', type: 'listen',
            audio: '这次旅行我去了北京、上海和西安，玩了两个星期。',
            question: 'Chuyến đi kéo dài bao lâu?',
            options: ['A. 一个星期', 'B. 两个星期', 'C. 三个星期', 'D. 一个月'],
            answer: 'B',
            explain: '"玩了两个星期" = đã chơi hai tuần.'
          },
          {
            id: 'l3', type: 'listen',
            audio: '我姐姐比我大三岁，今年二十五岁，在一家医院做护士。',
            question: 'Người nói năm nay bao nhiêu tuổi?',
            options: ['A. 二十岁', 'B. 二十一岁', 'C. 二十二岁', 'D. 二十五岁'],
            answer: 'C',
            explain: '姐姐25岁，比我大3岁，所以我25-3=22岁.'
          },
          {
            id: 'l4', type: 'listen',
            audio: '这家餐厅的菜味道不错，但是价格有点贵，服务也一般。',
            question: ' 对这家餐厅，说话人有什么看法？',
            options: [
              'A. 菜好吃，价格便宜，服务好',
              'B. 菜好吃，但价格贵，服务一般',
              'C. 菜不好吃，但价格便宜',
              'D. 什么都不好'
            ],
            answer: 'B',
            explain: '"味道不错" = ngon, "价格有点贵" = giá hơi đắt, "服务也一般" = dịch vụ cũng bình thường.'
          },
          {
            id: 'l5', type: 'listen',
            audio: '我弟弟从小就喜欢画画，现在在一所大学学习美术，将来想成为一名画家。',
            question: '我弟弟的理想是什么？',
            options: ['A. 当老师', 'B. 当医生', 'C. 当画家', 'D. 当音乐家'],
            answer: 'C',
            explain: '"将来想成为一名画家" = tương lai muốn trở thành họa sĩ.'
          },
        ]
      },
      {
        id: 'read',
        name: 'Phần Đọc',
        icon: '📖',
        questions: [
          {
            id: 'r1', type: 'read',
            passage: '现代人的生活节奏越来越快，很多人因为工作太忙而忽视了健康。医生建议，每天应该保证七到八小时的睡眠，坚持适量运动，少吃油腻食物，多吃蔬菜水果。',
            question: '医生建议每天睡多少小时？',
            options: ['A. 五到六小时', 'B. 六到七小时', 'C. 七到八小时', 'D. 八到九小时'],
            answer: 'C',
            explain: '"每天应该保证七到八小时的睡眠" = mỗi ngày cần đảm bảo ngủ 7-8 tiếng.'
          },
          {
            id: 'r2', type: 'read',
            passage: '王芳是一个非常勤奋的学生。她每天早上六点起床，先复习昨天的内容，然后预习新课。她认为，学习最重要的是坚持，不能三天打鱼两天晒网。',
            question: '"三天打鱼两天晒网"的意思是：',
            options: [
              'A. Rất chăm chỉ',
              'B. Không kiên trì, làm việc không đều đặn',
              'C. Thích câu cá',
              'D. Làm nhiều việc cùng lúc'
            ],
            answer: 'B',
            explain: '"三天打鱼两天晒网" là thành ngữ nghĩa là không kiên trì, làm lúc có lúc không, thiếu đều đặn.'
          },
          {
            id: 'r3', type: 'read',
            passage: '春节是中国最重要的传统节日，通常在一月底或二月初。春节前，家家户户都要大扫除，贴春联，买年货。春节当天，全家人要一起吃年夜饭，孩子们可以收到红包。',
            question: '春节通常在什么时候？',
            options: ['A. 十二月', 'B. 一月底或二月初', 'C. 三月', 'D. 六月'],
            answer: 'B',
            explain: '"通常在一月底或二月初" = thường vào cuối tháng 1 hoặc đầu tháng 2.'
          },
          {
            id: 'r4', type: 'read',
            passage: '互联网改变了我们的生活方式。现在，我们可以在网上购物、学习、工作、交友，甚至可以看病。但是，网络也带来了一些问题，比如网络安全和个人隐私保护的问题。',
            question: '这段话主要讲的是什么？',
            options: [
              'A. 如何使用互联网',
              'B. 互联网对生活的影响',
              'C. 网络安全问题',
              'D. 在网上购物的方法'
            ],
            answer: 'B',
            explain: '全文讲互联网改变了生活，带来便利也带来问题 — chủ đề chính là ảnh hưởng của internet.'
          },
          {
            id: 'r5', type: 'read',
            passage: '我的朋友小李最近换了工作。他以前在一家外贸公司上班，薪水不错，但是工作压力很大，经常加班到很晚。现在他在一所学校做体育老师，薪水少了一些，但是他说他现在更快乐了。',
            question: '小李为什么觉得现在更快乐？',
            options: [
              'A. 因为薪水更多了',
              'B. 因为工作压力小了',
              'C. 因为不用上班了',
              'D. 因为有更多钱了'
            ],
            answer: 'B',
            explain: '小李现在薪水少了但更快乐，意味着现在压力更小，生活更轻松。'
          },
        ]
      },
      {
        id: 'vocab',
        name: 'Từ vựng & Ngữ pháp',
        icon: '📝',
        questions: [
          {
            id: 'v1', type: 'vocab',
            question: '"虽然天气很冷，___他还是去跑步了。"应该填：',
            options: ['A. 因为', 'B. 所以', 'C. 但是', 'D. 如果'],
            answer: 'C',
            explain: '"虽然...但是..." = mặc dù... nhưng... Diễn đạt sự tương phản.'
          },
          {
            id: 'v2', type: 'vocab',
            question: '"这个问题___简单，我一下子就明白了。"应该填：',
            options: ['A. 很', 'B. 非常', 'C. 相当', 'D. 挺...的'],
            answer: 'D',
            explain: '"挺...的" là cấu trúc phổ biến trong khẩu ngữ, có nghĩa là "khá...". "挺简单的" = khá đơn giản.'
          },
          {
            id: 'v3', type: 'vocab',
            question: '"他把书___桌子上了。"应该填：',
            options: ['A. 放', 'B. 去', 'C. 在', 'D. 到'],
            answer: 'A',
            explain: '"把" + tân ngữ + động từ + bổ ngữ. "把书放在桌子上" = đặt sách lên bàn.'
          },
          {
            id: 'v4', type: 'vocab',
            question: '"越来越"表示什么意思？',
            options: [
              'A. Rất... rất...',
              'B. Ngày càng...',
              'C. Vừa... vừa...',
              'D. Lúc thì... lúc thì...'
            ],
            answer: 'B',
            explain: '"越来越" (yuèláiyuè) = ngày càng, càng ngày càng. "越来越好" = ngày càng tốt hơn.'
          },
          {
            id: 'v5', type: 'vocab',
            question: '"我是___坐飞机___坐火车去北京的。"（表示两种方式都可以）应该填：',
            options: ['A. 不但...而且', 'B. 既...又', 'C. 虽然...但是', 'D. 因为...所以'],
            answer: 'B',
            explain: '"既...又..." = vừa... vừa... Diễn đạt hai đặc điểm/hành động cùng tồn tại.'
          },
          {
            id: 'v6', type: 'vocab',
            question: '"他说的话我没___。"应该填：',
            options: ['A. 听懂', 'B. 听到', 'C. 听见了', 'D. 听'],
            answer: 'A',
            explain: '"听懂" (tīng dǒng) = nghe hiểu. "没听懂" = nghe không hiểu. Khác với "听到" (nghe thấy).'
          },
          {
            id: 'v7', type: 'vocab',
            question: '"这家餐厅___好吃，___价格合理。"应该填：',
            options: ['A. 虽然...但是', 'B. 因为...所以', 'C. 不但...而且', 'D. 如果...就'],
            answer: 'C',
            explain: '"不但...而且..." = không chỉ... mà còn... Thêm ý tích cực.'
          },
          {
            id: 'v8', type: 'vocab',
            question: '"请___一下，我去拿东西。"应该填：',
            options: ['A. 坐', 'B. 等', 'C. 站', 'D. 看'],
            answer: 'B',
            explain: '"等一下" = đợi một chút. "请等一下" = Xin hãy đợi một chút.'
          },
          {
            id: 'v9', type: 'vocab',
            question: '"她的普通话说得___。"选出最合适的词：',
            options: ['A. 很流利', 'B. 非常流利地', 'C. 流利很', 'D. 很地流利'],
            answer: 'A',
            explain: '结构：说得 + 程度补语。"说得很流利" = nói rất trôi chảy. Phó từ đứng trước tính từ.'
          },
          {
            id: 'v10', type: 'vocab',
            question: '"他___一边学习，一边听音乐。"应该填：',
            options: ['A. 经常', 'B. 将来', 'C. 已经', 'D. 刚才'],
            answer: 'A',
            explain: '"经常" (jīngcháng) = thường xuyên. Phù hợp với "一边...一边..." (vừa... vừa...).'
          },
        ]
      }
    ]
  },

  // ── HSK 2 Đề 02 (locked for free) ─────────────────
  {
    id: 'hsk2_02',
    level: 2,
    title: 'Đề thi thử HSK 2 - Đề số 02',
    duration: 55,
    totalScore: 100,
    passScore: 60,
    participants: 412,
    free: false,
    sections: [
      {
        id: 'listen', name: 'Phần Nghe', icon: '🎧',
        questions: [
          { id:'l1', type:'listen', audio:'他每天骑自行车上班，从家到公司大约需要二十分钟。', question:'他从家到公司需要多长时间？', options:['A. 十分钟','B. 二十分钟','C. 三十分钟','D. 四十分钟'], answer:'B', explain:'"大约需要二十分钟" = mất khoảng hai mươi phút.' },
          { id:'l2', type:'listen', audio:'这家书店每天早上九点开门，晚上九点关门，星期天不营业。', question:'这家书店星期天开门吗？', options:['A. 开门，九点到九点','B. 开门，但只营业半天','C. 不开门','D. 不确定'], answer:'C', explain:'"星期天不营业" = chủ nhật không mở cửa.' },
          { id:'l3', type:'listen', audio:'我学汉语已经三年了，可以用汉语和中国朋友交流，但还不能看中文报纸。', question:'他的汉语水平怎么样？', options:['A. 可以看中文报纸','B. 可以和中国人交流','C. 刚开始学习','D. 完全不会'], answer:'B', explain:'"可以用汉语和中国朋友交流" = có thể giao tiếp bằng tiếng Trung.' },
          { id:'l4', type:'listen', audio:'我想去图书馆，但是今天下雨，我不想走路，打车又太贵，所以我决定坐地铁。', question:'他最后选择怎么去图书馆？', options:['A. 走路','B. 打车','C. 坐地铁','D. 骑车'], answer:'C', explain:'"决定坐地铁" = quyết định đi tàu điện ngầm.' },
          { id:'l5', type:'listen', audio:'这次考试，我们班有三十个同学参加，二十五个通过了，五个没有通过。', question:'多少同学没有通过考试？', options:['A. 三个','B. 四个','C. 五个','D. 六个'], answer:'C', explain:'"五个没有通过" = năm người không đậu.' },
        ]
      },
      {
        id: 'read', name: 'Phần Đọc', icon: '📖',
        questions: [
          { id:'r1', type:'read', passage:'为了减少空气污染，越来越多的城市开始鼓励市民乘坐公共交通，减少私家车的使用。许多城市还建设了更多的自行车道，方便市民骑车出行。', question:'这段话主要讲什么？', options:['A. 如何购买私家车','B. 减少污染的措施','C. 如何骑自行车','D. 城市发展计划'], answer:'B', explain:'全文围绕"减少空气污染"的措施展开。' },
          { id:'r2', type:'read', passage:'李明的爱好是摄影，他喜欢在旅行中记录美丽的风景和有趣的人物。他的照片曾经在一次摄影比赛中获得了二等奖，让他非常开心。', question:'李明的摄影在比赛中获得了什么奖？', options:['A. 一等奖','B. 二等奖','C. 三等奖','D. 没有获奖'], answer:'B', explain:'"获得了二等奖" = đạt giải nhì.' },
          { id:'r3', type:'read', passage:'随着互联网的发展，网上购物越来越流行。人们可以不出门就买到世界各地的商品，而且价格通常比实体店便宜。不过，网上购物也有缺点，比如不能亲眼看到商品，收到货物后可能会有失望的情况。', question:'网上购物的缺点是什么？', options:['A. 价格太贵','B. 不方便','C. 不能亲眼看商品','D. 速度太慢'], answer:'C', explain:'"不能亲眼看到商品" = không thể tận mắt xem hàng hóa.' },
          { id:'r4', type:'read', passage:'研究表明，经常阅读对大脑健康非常有益。阅读不仅可以增加知识，还能提高专注力和想象力，甚至可以延缓大脑老化。专家建议每天至少阅读三十分钟。', question:'专家建议每天阅读多长时间？', options:['A. 十分钟','B. 二十分钟','C. 三十分钟','D. 一小时'], answer:'C', explain:'"每天至少阅读三十分钟" = mỗi ngày đọc ít nhất 30 phút.' },
          { id:'r5', type:'read', passage:'马云是中国著名的企业家，阿里巴巴的创始人。他出生于1964年，年轻时曾多次考大学失败，后来成为一名英语教师。1999年，他创办了阿里巴巴，经过多年发展，成为了世界著名的电商平台。', question:'马云在创办阿里巴巴之前做什么工作？', options:['A. 程序员','B. 医生','C. 英语老师','D. 商人'], answer:'C', explain:'"成为一名英语教师" = trở thành giáo viên tiếng Anh.' },
        ]
      },
      {
        id: 'vocab', name: 'Từ vựng & Ngữ pháp', icon: '📝',
        questions: [
          { id:'v1', type:'vocab', question:'"他___学习___工作，每天都很忙。"应该填：', options:['A. 既...又','B. 虽然...但是','C. 因为...所以','D. 不但...而且'], answer:'A', explain:'"既A又B" = vừa A vừa B, diễn đạt hai điều cùng tồn tại.' },
          { id:'v2', type:'vocab', question:'"请把窗户___。"应该填：', options:['A. 打开','B. 开打','C. 打了开','D. 开了'], answer:'A', explain:'"把" structure: 把+宾语+动词+结果。"把窗户打开" = mở cửa sổ ra.' },
          { id:'v3', type:'vocab', question:'"这个词我___在哪里见过，但想不起来了。"应该填：', options:['A. 将要','B. 好像','C. 肯定','D. 一定'], answer:'B', explain:'"好像" (hǎoxiàng) = hình như, có vẻ như. Diễn đạt sự không chắc chắn.' },
          { id:'v4', type:'vocab', question:'"他___能来，___不一定。"应该填：', options:['A. 可能...也','B. 如果...就','C. 虽然...但是','D. 既然...就'], answer:'A', explain:'"可能...也..." = có thể... nhưng cũng... Diễn đạt sự không chắc chắn.' },
          { id:'v5', type:'vocab', question:'"这家餐厅的服务___不好，我下次不来了。"应该填：', options:['A. 太','B. 很','C. 非常','D. 十分'], answer:'A', explain:'"太...了" = quá... Thường kèm theo ý phàn nàn hoặc thái quá.' },
          { id:'v6', type:'vocab', question:'"___你不喜欢吃辣的，可以告诉服务员不放辣椒。"应该填：', options:['A. 因为','B. 如果','C. 虽然','D. 既然'], answer:'B', explain:'"如果" (rúguǒ) = nếu. Diễn đạt điều kiện giả định.' },
          { id:'v7', type:'vocab', question:'"这个问题对我来说___简单。"选出最合适的词：', options:['A. 太','B. 挺...的','C. 好像','D. 差不多'], answer:'B', explain:'"挺...的" = khá... Ví dụ: "挺简单的" = khá đơn giản.' },
          { id:'v8', type:'vocab', question:'"我昨天___买了新手机。"应该填：', options:['A. 刚','B. 将','C. 正','D. 再'], answer:'A', explain:'"刚" (gāng) = vừa mới. "刚买了" = vừa mới mua.' },
          { id:'v9', type:'vocab', question:'"他跑得___快___我想象的。"应该填：', options:['A. 比...更','B. 比...的','C. 和...一样','D. 没有...那么'], answer:'A', explain:'"比想象的更快" = nhanh hơn tưởng tượng. Cấu trúc so sánh với "比+更".' },
          { id:'v10', type:'vocab', question:'"___天气好，我们就去公园。"应该填：', options:['A. 如果','B. 虽然','C. 因为','D. 既然'], answer:'A', explain:'"如果A，就B" = nếu A thì B. Cấu trúc câu điều kiện.' },
        ]
      }
    ]
  },

  // ── HSK 3 (locked) ─────────────────────────────────
  {
    id: 'hsk3_01',
    level: 3,
    title: 'Đề thi thử HSK 3 - Đề số 01',
    duration: 85,
    totalScore: 300,
    passScore: 180,
    participants: 289,
    free: false,
    sections: [
      { id:'listen', name:'Phần Nghe', icon:'🎧', questions:[
        { id:'l1', type:'listen', audio:'这道菜的特点是色香味俱全，既好看又好吃。', question:'这道菜有什么特点？', options:['A. 只是好看','B. 只是好吃','C. 色香味俱全','D. 价格实惠'], answer:'C', explain:'"色香味俱全" = đẹp mắt, thơm ngon, đầy đủ hương vị.' }
      ]},
      { id:'read', name:'Phần Đọc', icon:'📖', questions:[
        { id:'r1', type:'read', passage:'人工智能正在改变我们的世界...', question:'人工智能的主要影响是什么？', options:['A. 只影响工业','B. 改变各个领域','C. 没有影响','D. 只影响教育'], answer:'B', explain:'人工智能正在改变各个领域。' }
      ]},
      { id:'vocab', name:'词汇语法', icon:'📝', questions:[
        { id:'v1', type:'vocab', question:'"尽管困难重重，他___坚持下来了。"应该填：', options:['A. 还是','B. 而且','C. 因为','D. 虽然'], answer:'A', explain:'"尽管...还是..." = mặc dù... vẫn...' }
      ]}
    ]
  },
]

export const LEVELS = [1, 2, 3, 4, 5, 6]
