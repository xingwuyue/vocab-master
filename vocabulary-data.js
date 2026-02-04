// 词汇数据库 - 基于高频词汇表
// 阶段1: 1-1000 (最核心高频词)
// 阶段2: 1001-3000 (常用词)
// 阶段3: 3001-5000 (进阶词)
// 阶段4: 5001-10000 (中高级词)
// 阶段5: 10001-30000 (精通级词)

const vocabularyData = {
    // 阶段1: 高频1000词
    1: [
        { word: "the", phonetic: "/ðə/", meaning: "这；那", example: "The sun is shining.", exampleCN: "阳光明媚。" },
        { word: "be", phonetic: "/biː/", meaning: "是；存在", example: "To be or not to be.", exampleCN: "生存还是毁灭。" },
        { word: "and", phonetic: "/ænd/", meaning: "和；与", example: "You and I are friends.", exampleCN: "你我是朋友。" },
        { word: "of", phonetic: "/əv/", meaning: "的；属于", example: "The capital of France.", exampleCN: "法国的首都。" },
        { word: "a", phonetic: "/eɪ/", meaning: "一个", example: "I have a dream.", exampleCN: "我有一个梦想。" },
        { word: "in", phonetic: "/ɪn/", meaning: "在...里", example: "She is in the room.", exampleCN: "她在房间里。" },
        { word: "to", phonetic: "/tuː/", meaning: "到；向", example: "I go to school.", exampleCN: "我去上学。" },
        { word: "have", phonetic: "/hæv/", meaning: "有；拥有", example: "I have a car.", exampleCN: "我有一辆车。" },
        { word: "it", phonetic: "/ɪt/", meaning: "它", example: "It is raining.", exampleCN: "下雨了。" },
        { word: "I", phonetic: "/aɪ/", meaning: "我", example: "I love you.", exampleCN: "我爱你。" },
        { word: "that", phonetic: "/ðæt/", meaning: "那个；那", example: "That is a good idea.", exampleCN: "那是个好主意。" },
        { word: "for", phonetic: "/fɔːr/", meaning: "为了；给", example: "This gift is for you.", exampleCN: "这个礼物是给你的。" },
        { word: "you", phonetic: "/juː/", meaning: "你；你们", example: "You are amazing.", exampleCN: "你很棒。" },
        { word: "he", phonetic: "/hiː/", meaning: "他", example: "He is my brother.", exampleCN: "他是我的兄弟。" },
        { word: "with", phonetic: "/wɪð/", meaning: "和...一起；带有", example: "I live with my family.", exampleCN: "我和家人住在一起。" },
        { word: "on", phonetic: "/ɒn/", meaning: "在...上", example: "The book is on the table.", exampleCN: "书在桌子上。" },
        { word: "do", phonetic: "/duː/", meaning: "做；助动词", example: "What do you do?", exampleCN: "你是做什么的？" },
        { word: "say", phonetic: "/seɪ/", meaning: "说", example: "What did you say?", exampleCN: "你说什么？" },
        { word: "this", phonetic: "/ðɪs/", meaning: "这个", example: "This is my home.", exampleCN: "这是我的家。" },
        { word: "they", phonetic: "/ðeɪ/", meaning: "他们；她们；它们", example: "They are students.", exampleCN: "他们是学生。" },
        { word: "at", phonetic: "/æt/", meaning: "在(某地、某时)", example: "I will see you at 5.", exampleCN: "我5点见你。" },
        { word: "but", phonetic: "/bʌt/", meaning: "但是", example: "I like him, but I don't trust him.", exampleCN: "我喜欢他，但我不信任他。" },
        { word: "we", phonetic: "/wiː/", meaning: "我们", example: "We are a team.", exampleCN: "我们是一个团队。" },
        { word: "his", phonetic: "/hɪz/", meaning: "他的", example: "This is his book.", exampleCN: "这是他的书。" },
        { word: "from", phonetic: "/frɒm/", meaning: "从；来自", example: "I am from China.", exampleCN: "我来自中国。" },
        { word: "that", phonetic: "/ðæt/", meaning: "那个", example: "That was a great movie.", exampleCN: "那是一部很棒的电影。" },
        { word: "not", phonetic: "/nɒt/", meaning: "不；没有", example: "I do not understand.", exampleCN: "我不明白。" },
        { word: "by", phonetic: "/baɪ/", meaning: "通过；被；由", example: "Written by Shakespeare.", exampleCN: "莎士比亚所著。" },
        { word: "she", phonetic: "/ʃiː/", meaning: "她", example: "She is a doctor.", exampleCN: "她是一名医生。" },
        { word: "or", phonetic: "/ɔːr/", meaning: "或者；还是", example: "Tea or coffee?", exampleCN: "茶还是咖啡？" },
        { word: "as", phonetic: "/æz/", meaning: "作为；如同", example: "Work as a teacher.", exampleCN: "当老师工作。" },
        { word: "what", phonetic: "/wɒt/", meaning: "什么", example: "What do you want?", exampleCN: "你想要什么？" },
        { word: "go", phonetic: "/ɡəʊ/", meaning: "去；走", example: "Let's go home.", exampleCN: "我们回家吧。" },
        { word: "their", phonetic: "/ðeər/", meaning: "他们的", example: "This is their house.", exampleCN: "这是他们的房子。" },
        { word: "can", phonetic: "/kæn/", meaning: "能；可以", example: "I can speak English.", exampleCN: "我会说英语。" },
        { word: "who", phonetic: "/huː/", meaning: "谁", example: "Who are you?", exampleCN: "你是谁？" },
        { word: "get", phonetic: "/ɡet/", meaning: "得到；获得", example: "I got a new job.", exampleCN: "我得到了一份新工作。" },
        { word: "if", phonetic: "/ɪf/", meaning: "如果；是否", example: "If it rains, stay home.", exampleCN: "如果下雨，就待在家里。" },
        { word: "would", phonetic: "/wʊd/", meaning: "将；愿意", example: "I would like some tea.", exampleCN: "我想要一些茶。" },
        { word: "her", phonetic: "/hɜːr/", meaning: "她的；她", example: "That's her car.", exampleCN: "那是她的车。" },
        { word: "all", phonetic: "/ɔːl/", meaning: "所有的；全部", example: "All of us are happy.", exampleCN: "我们所有人都很高兴。" },
        { word: "my", phonetic: "/maɪ/", meaning: "我的", example: "This is my phone.", exampleCN: "这是我的手机。" },
        { word: "make", phonetic: "/meɪk/", meaning: "制作；使", example: "Make a cake.", exampleCN: "做一个蛋糕。" },
        { word: "about", phonetic: "/əˈbaʊt/", meaning: "关于；大约", example: "Tell me about yourself.", exampleCN: "告诉我关于你自己的事。" },
        { word: "know", phonetic: "/nəʊ/", meaning: "知道；了解", example: "I know the answer.", exampleCN: "我知道答案。" },
        { word: "will", phonetic: "/wɪl/", meaning: "将要；愿意", example: "I will help you.", exampleCN: "我会帮助你。" },
        { word: "up", phonetic: "/ʌp/", meaning: "向上；起来", example: "Wake up early.", exampleCN: "早起。" },
        { word: "one", phonetic: "/wʌn/", meaning: "一；一个", example: "One day at a time.", exampleCN: "一次过一天。" },
        { word: "time", phonetic: "/taɪm/", meaning: "时间；次数", example: "Time flies.", exampleCN: "时光飞逝。" },
        { word: "year", phonetic: "/jɪər/", meaning: "年", example: "Happy New Year!", exampleCN: "新年快乐！" },
        { word: "so", phonetic: "/səʊ/", meaning: "所以；如此", example: "So, what happened?", exampleCN: "那么，发生了什么？" },
        { word: "think", phonetic: "/θɪŋk/", meaning: "想；认为", example: "I think so.", exampleCN: "我想是的。" },
        { word: "when", phonetic: "/wen/", meaning: "什么时候", example: "When did you arrive?", exampleCN: "你什么时候到的？" },
        { word: "which", phonetic: "/wɪtʃ/", meaning: "哪一个", example: "Which one do you want?", exampleCN: "你想要哪一个？" },
        { word: "them", phonetic: "/ðem/", meaning: "他们；它们", example: "Give it to them.", exampleCN: "把这个给他们。" },
        { word: "some", phonetic: "/sʌm/", meaning: "一些", example: "I need some water.", exampleCN: "我需要一些水。" },
        { word: "me", phonetic: "/miː/", meaning: "我(宾格)", example: "Help me, please.", exampleCN: "请帮助我。" },
        { word: "people", phonetic: "/ˈpiːpl/", meaning: "人们", example: "Many people came.", exampleCN: "很多人来了。" },
        { word: "take", phonetic: "/teɪk/", meaning: "拿；取；花费", example: "Take your time.", exampleCN: "慢慢来。" },
        { word: "out", phonetic: "/aʊt/", meaning: "出去；外面", example: "Let's eat out tonight.", exampleCN: "我们今晚出去吃吧。" },
        { word: "into", phonetic: "/ˈɪntuː/", meaning: "进入", example: "Go into the room.", exampleCN: "进入房间。" },
        { word: "just", phonetic: "/dʒʌst/", meaning: "刚刚；只是", example: "I just arrived.", exampleCN: "我刚到。" },
        { word: "see", phonetic: "/siː/", meaning: "看见", example: "I see what you mean.", exampleCN: "我明白你的意思。" },
        { word: "him", phonetic: "/hɪm/", meaning: "他(宾格)", example: "I saw him yesterday.", exampleCN: "我昨天看见他了。" },
        { word: "your", phonetic: "/jɔːr/", meaning: "你的；你们的", example: "What's your name?", exampleCN: "你叫什么名字？" },
        { word: "come", phonetic: "/kʌm/", meaning: "来", example: "Come here, please.", exampleCN: "请过来。" },
        { word: "could", phonetic: "/kʊd/", meaning: "能；可以(过去式)", example: "Could you help me?", exampleCN: "你能帮我吗？" },
        { word: "now", phonetic: "/naʊ/", meaning: "现在", example: "Do it now.", exampleCN: "现在就做。" },
        { word: "than", phonetic: "/ðæn/", meaning: "比", example: "Better than ever.", exampleCN: "比以往任何时候都好。" },
        { word: "like", phonetic: "/laɪk/", meaning: "喜欢；像", example: "I like music.", exampleCN: "我喜欢音乐。" },
        { word: "other", phonetic: "/ˈʌðər/", meaning: "其他的", example: "The other day.", exampleCN: "前几天。" },
        { word: "how", phonetic: "/haʊ/", meaning: "如何；怎样", example: "How are you?", exampleCN: "你好吗？" },
        { word: "then", phonetic: "/ðen/", meaning: "然后；那时", example: "First this, then that.", exampleCN: "先做这个，然后做那个。" },
        { word: "its", phonetic: "/ɪts/", meaning: "它的", example: "The dog wagged its tail.", exampleCN: "狗摇着尾巴。" },
        { word: "our", phonetic: "/ˈaʊər/", meaning: "我们的", example: "This is our home.", exampleCN: "这是我们的家。" },
        { word: "two", phonetic: "/tuː/", meaning: "二", example: "Two heads are better than one.", exampleCN: "三个臭皮匠顶个诸葛亮。" },
        { word: "more", phonetic: "/mɔːr/", meaning: "更多", example: "I want more.", exampleCN: "我想要更多。" },
        { word: "these", phonetic: "/ðiːz/", meaning: "这些", example: "These are mine.", exampleCN: "这些是我的。" },
        { word: "want", phonetic: "/wɒnt/", meaning: "想要", example: "I want to learn.", exampleCN: "我想学习。" },
        { word: "way", phonetic: "/weɪ/", meaning: "方式；道路", example: "Show me the way.", exampleCN: "给我指路。" },
        { word: "look", phonetic: "/lʊk/", meaning: "看；看起来", example: "Look at me.", exampleCN: "看着我。" },
        { word: "first", phonetic: "/fɜːrst/", meaning: "第一；首先", example: "First things first.", exampleCN: "要紧的事先做。" },
        { word: "also", phonetic: "/ˈɔːlsəʊ/", meaning: "也；而且", example: "I also like it.", exampleCN: "我也喜欢它。" },
        { word: "new", phonetic: "/nuː/", meaning: "新的", example: "A new beginning.", exampleCN: "新的开始。" },
        { word: "because", phonetic: "/bɪˈkɒz/", meaning: "因为", example: "Because I said so.", exampleCN: "因为我是这么说的。" },
        { word: "day", phonetic: "/deɪ/", meaning: "天；日", example: "Have a nice day!", exampleCN: "祝你今天愉快！" },
        { word: "more", phonetic: "/mɔːr/", meaning: "更多", example: "More or less.", exampleCN: "或多或少。" },
        { word: "use", phonetic: "/juːz/", meaning: "使用", example: "How do I use this?", exampleCN: "我怎么用这个？" },
        { word: "no", phonetic: "/nəʊ/", meaning: "不；没有", example: "No problem.", exampleCN: "没问题。" },
        { word: "man", phonetic: "/mæn/", meaning: "男人；人类", example: "A wise man.", exampleCN: "一个智者。" },
        { word: "find", phonetic: "/faɪnd/", meaning: "找到；发现", example: "Find your passion.", exampleCN: "找到你的热情。" },
        { word: "here", phonetic: "/hɪər/", meaning: "这里", example: "I'm here.", exampleCN: "我在这里。" },
        { word: "thing", phonetic: "/θɪŋ/", meaning: "东西；事情", example: "One thing at a time.", exampleCN: "一次做一件事。" },
        { word: "give", phonetic: "/ɡɪv/", meaning: "给", example: "Give me a hand.", exampleCN: "帮我一下。" },
        { word: "many", phonetic: "/ˈmeni/", meaning: "许多", example: "Many thanks.", exampleCN: "非常感谢。" },
        { word: "well", phonetic: "/wel/", meaning: "好；井", example: "All is well.", exampleCN: "一切都好。" },
        { word: "only", phonetic: "/ˈəʊnli/", meaning: "只有；仅仅", example: "Only time will tell.", exampleCN: "只有时间会证明。" },
        { word: "those", phonetic: "/ðəʊz/", meaning: "那些", example: "Those were the days.", exampleCN: "那些日子真好。" },
        { word: "tell", phonetic: "/tel/", meaning: "告诉", example: "Tell me the truth.", exampleCN: "告诉我真相。" },
        { word: "one", phonetic: "/wʌn/", meaning: "一个", example: "One more time.", exampleCN: "再来一次。" },
        { word: "very", phonetic: "/ˈveri/", meaning: "非常", example: "Very good.", exampleCN: "非常好。" },
        { word: "when", phonetic: "/wen/", meaning: "当...时候", example: "When in Rome.", exampleCN: "入乡随俗。" },
        { word: "any", phonetic: "/ˈeni/", meaning: "任何", example: "Any time.", exampleCN: "任何时间。" },
        { word: "there", phonetic: "/ðeər/", meaning: "那里", example: "There you go.", exampleCN: "给你/就是这样。" },
        { word: "down", phonetic: "/daʊn/", meaning: "向下", example: "Calm down.", exampleCN: "冷静下来。" }
    ],
    
    // 阶段2: 1001-3000词（展示前100个）
    2: [
        { word: "good", phonetic: "/ɡʊd/", meaning: "好的", example: "Have a good day!", exampleCN: "祝你今天愉快！" },
        { word: "water", phonetic: "/ˈwɔːtər/", meaning: "水", example: "I need some water.", exampleCN: "我需要一些水。" },
        { word: "long", phonetic: "/lɒŋ/", meaning: "长的；长久", example: "Long time no see.", exampleCN: "好久不见。" },
        { word: "little", phonetic: "/ˈlɪtl/", meaning: "小的；少量", example: "A little bit.", exampleCN: "一点点。" },
        { word: "world", phonetic: "/wɜːrld/", meaning: "世界", example: "The world is beautiful.", exampleCN: "世界很美好。" },
        { word: "work", phonetic: "/wɜːrk/", meaning: "工作", example: "I have work to do.", exampleCN: "我有工作要做。" },
        { word: "life", phonetic: "/laɪf/", meaning: "生活；生命", example: "Life is good.", exampleCN: "生活很美好。" },
        { word: "place", phonetic: "/pleɪs/", meaning: "地方", example: "This is my happy place.", exampleCN: "这是我的快乐之地。" },
        { word: "right", phonetic: "/raɪt/", meaning: "正确的；右边", example: "You're right.", exampleCN: "你是对的。" },
        { word: "back", phonetic: "/bæk/", meaning: "后面；回来", example: "I'll be back.", exampleCN: "我会回来的。" },
        { word: "little", phonetic: "/ˈlɪtl/", meaning: "小的；少", example: "Little by little.", exampleCN: "一点一点地。" },
        { word: "case", phonetic: "/keɪs/", meaning: "情况；案例", example: "In that case.", exampleCN: "既然那样。" },
        { word: "system", phonetic: "/ˈsɪstəm/", meaning: "系统", example: "The system works well.", exampleCN: "系统运行良好。" },
        { word: "week", phonetic: "/wiːk/", meaning: "星期；周", example: "See you next week.", exampleCN: "下周见。" },
        { word: "company", phonetic: "/ˈkʌmpəni/", meaning: "公司", example: "I work for a tech company.", exampleCN: "我在一家科技公司工作。" },
        { word: "number", phonetic: "/ˈnʌmbər/", meaning: "数字；号码", example: "What's your phone number?", exampleCN: "你的电话号码是多少？" },
        { word: "group", phonetic: "/ɡruːp/", meaning: "组；团体", example: "We're in the same group.", exampleCN: "我们在同一个组。" },
        { word: "problem", phonetic: "/ˈprɒbləm/", meaning: "问题", example: "No problem at all.", exampleCN: "完全没问题。" },
        { word: "fact", phonetic: "/fækt/", meaning: "事实", example: "In fact, it's true.", exampleCN: "事实上，这是真的。" },
        { word: "idea", phonetic: "/aɪˈdɪə/", meaning: "想法；主意", example: "That's a great idea!", exampleCN: "那是个好主意！" }
    ],
    
    // 阶段3: 3001-5000词
    3: [
        { word: "analysis", phonetic: "/əˈnæləsɪs/", meaning: "分析", example: "The analysis shows positive results.", exampleCN: "分析显示了积极的结果。" },
        { word: "approach", phonetic: "/əˈprəʊtʃ/", meaning: "方法；接近", example: "We need a new approach.", exampleCN: "我们需要一个新方法。" },
        { word: "available", phonetic: "/əˈveɪləbl/", meaning: "可用的；有空的", example: "Are you available tomorrow?", exampleCN: "你明天有空吗？" },
        { word: "benefit", phonetic: "/ˈbenɪfɪt/", meaning: "好处；受益", example: "Exercise has many benefits.", exampleCN: "运动有很多好处。" },
        { word: "concept", phonetic: "/ˈkɒnsept/", meaning: "概念", example: "The concept is simple.", exampleCN: "这个概念很简单。" },
        { word: "conclusion", phonetic: "/kənˈkluːʒn/", meaning: "结论", example: "In conclusion, we should proceed.", exampleCN: "总之，我们应该继续进行。" },
        { word: "conduct", phonetic: "/ˈkɒndʌkt/", meaning: "进行；行为", example: "We will conduct a survey.", exampleCN: "我们将进行一项调查。" },
        { word: "conference", phonetic: "/ˈkɒnfərəns/", meaning: "会议", example: "The conference starts tomorrow.", exampleCN: "会议明天开始。" },
        { word: "consider", phonetic: "/kənˈsɪdər/", meaning: "考虑", example: "Please consider my proposal.", exampleCN: "请考虑我的提议。" },
        { word: "consistent", phonetic: "/kənˈsɪstənt/", meaning: "一致的", example: "Be consistent in your efforts.", exampleCN: "在你的努力中保持一致。" }
    ],
    
    // 阶段4: 5001-10000词
    4: [
        { word: "accommodate", phonetic: "/əˈkɒmədeɪt/", meaning: "容纳；适应", example: "The hotel can accommodate 500 guests.", exampleCN: "这家酒店可以容纳500位客人。" },
        { word: "acknowledge", phonetic: "/əkˈnɒlɪdʒ/", meaning: "承认；致谢", example: "I acknowledge your contribution.", exampleCN: "我感谢你的贡献。" },
        { word: "acquire", phonetic: "/əˈkwaɪər/", meaning: "获得；习得", example: "We need to acquire new skills.", exampleCN: "我们需要获得新技能。" },
        { word: "advocate", phonetic: "/ˈædvəkeɪt/", meaning: "提倡；拥护者", example: "She is an advocate for human rights.", exampleCN: "她是人权的拥护者。" },
        { word: "allocate", phonetic: "/ˈæləkeɪt/", meaning: "分配；配置", example: "We need to allocate more resources.", exampleCN: "我们需要分配更多资源。" },
        { word: "anticipate", phonetic: "/ænˈtɪsɪpeɪt/", meaning: "预期；预料", example: "We anticipate a large crowd.", exampleCN: "我们预计会有大批人群。" },
        { word: "assess", phonetic: "/əˈses/", meaning: "评估；评价", example: "We need to assess the damage.", exampleCN: "我们需要评估损失。" },
        { word: "assign", phonetic: "/əˈsaɪn/", meaning: "分配；指派", example: "I'll assign you a task.", exampleCN: "我会给你分配一个任务。" },
        { word: "assume", phonetic: "/əˈsjuːm/", meaning: "假设；承担", example: "Don't assume anything.", exampleCN: "不要做任何假设。" },
        { word: "attain", phonetic: "/əˈteɪn/", meaning: "达到；实现", example: "He attained his goal.", exampleCN: "他实现了他的目标。" }
    ],
    
    // 阶段5: 10001-30000词（学术/专业词汇）
    5: [
        { word: "aberration", phonetic: "/ˌæbəˈreɪʃn/", meaning: "异常；脱离常规", example: "The test result was an aberration.", exampleCN: "测试结果是个异常值。" },
        { word: "abrogate", phonetic: "/ˈæbrəɡeɪt/", meaning: "废除；取消", example: "The treaty was abrogated.", exampleCN: "条约被废除了。" },
        { word: "acrimony", phonetic: "/ˈækrɪməni/", meaning: "尖刻；刻薄", example: "The divorce was settled without acrimony.", exampleCN: "离婚没有尖刻的争吵就解决了。" },
        { word: "adumbrate", phonetic: "/ˈædʌmbreɪt/", meaning: "预示；概述", example: "The speech adumbrated future plans.", exampleCN: "演讲概述了未来的计划。" },
        { word: "alacrity", phonetic: "/əˈlækrəti/", meaning: "敏捷；乐意", example: "She accepted with alacrity.", exampleCN: "她欣然接受了。" },
        { word: "anathema", phonetic: "/əˈnæθəmə/", meaning: "诅咒；令人厌恶的事", example: "Violence is anathema to him.", exampleCN: "暴力对他来说是令人厌恶的。" },
        { word: "approbation", phonetic: "/ˌæprəˈbeɪʃn/", meaning: "认可；批准", example: "The plan met with approbation.", exampleCN: "计划得到了认可。" },
        { word: "asperity", phonetic: "/əˈsperəti/", meaning: "严厉；严酷", example: "He spoke with asperity.", exampleCN: "他说话很严厉。" },
        { word: "assiduous", phonetic: "/əˈsɪdʒuəs/", meaning: "勤勉的", example: "He is an assiduous student.", exampleCN: "他是个勤勉的学生。" },
        { word: "augury", phonetic: "/ˈɔːɡjuri/", meaning: "预兆；占卜", example: "It was a favorable augury.", exampleCN: "这是个好兆头。" }
    ]
};

// 词汇范围定义
const stageRanges = {
    1: { start: 1, end: 1000, count: 1000, name: "高频基础" },
    2: { start: 1001, end: 3000, count: 2000, name: "日常交流" },
    3: { start: 3001, end: 5000, count: 2000, name: "进阶提升" },
    4: { start: 5001, end: 10000, count: 5000, name: "中高级" },
    5: { start: 10001, end: 30000, count: 20000, name: "精通级" }
};

// 获取阶段词汇
function getStageVocabulary(stage) {
    // 返回该阶段的词汇（实际使用时可以从完整词汇库中加载）
    return vocabularyData[stage] || [];
}
