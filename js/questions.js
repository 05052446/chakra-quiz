// 脉轮题库与深度解析数据库
// 7大脉轮 x 3道现实生活场景题 = 21题
// 采用 1-5 分制：1(完全不符合) -> 5(完全符合)

const CHAKRAS_CONFIG = {
  root: {
    id: "root",
    name: "海底轮",
    sanskrit: "Muladhara",
    location: "会阴·脊柱基底",
    color: "#D87A68", // 暖赤陶红
    lightColor: "rgba(216, 122, 104, 0.15)",
    theme: "生存 · 安全感 · 物质根基",
    keywords: ["扎根", "底气", "安全感", "身体连接"],
    frequency: "396 Hz (清除恐惧与内疚)",
    crystal: "红碧玺 / 黑曜石 / 石榴石",
    aroma: "雪松 / 广藿香 / 岩兰草",
    affirmation: "“我安全地存在于大地之上，我被丰盛与爱全然支持。”",
    lowDesc: "容易感到漂浮心慌、未来匮乏感强烈、经常失眠、害怕不测、攒不下钱或对物质极度焦虑。",
    balancedDesc: "内心踏实沉稳，对生活充满深层安全感，有强大的现实落地与行动执行力。",
    highDesc: "容易死板抗拒改变、对物质财富过度执着或控制欲过强。"
  },
  sacral: {
    id: "sacral",
    name: "本我轮",
    sanskrit: "Svadhisthana",
    location: "下腹部·肚脐下方三指",
    color: "#E08A56", // 琥珀暖杏橙
    lightColor: "rgba(224, 138, 86, 0.15)",
    theme: "情绪 · 感官愉悦 · 创造力",
    keywords: ["流动", "愉悦", "亲密感", "情感接纳"],
    frequency: "417 Hz (化解卡点与促进改变)",
    crystal: "红玛瑙 / 太阳石 / 月光石",
    aroma: "甜橙 / 依兰依兰 / 檀香",
    affirmation: "“我允许情绪如流水般自然流动，我值得享受生命纯粹的欢愉。”",
    lowDesc: "情绪麻木压抑、感受不到生活乐趣、对亲密关系抗拒或冷淡、创造力枯竭匮乏。",
    balancedDesc: "情感饱满热情，善于表达内心感受，拥有源源不断的创造灵感与舒适的亲密感。",
    highDesc: "情绪剧烈波动起伏、容易恋爱脑、过度沉溺感官刺激或情感依赖。"
  },
  solar: {
    id: "solar",
    name: "太阳神经丛",
    sanskrit: "Manipura",
    location: "上腹部·胃与肋骨交汇",
    color: "#DEAF56", // 麦芒暖阳金
    lightColor: "rgba(222, 175, 86, 0.15)",
    theme: "意志力 · 自信 · 边界感与行动",
    keywords: ["魄力", "自尊", "行动力", "内在力量"],
    frequency: "528 Hz (转化与生命奇迹)",
    crystal: "黄水晶 / 虎眼石 / 琥珀",
    aroma: "柠檬 / 迷迭香 / 葡萄柚",
    affirmation: "“我深知自己的价值，我有力量掌控自己的人生与选择。”",
    lowDesc: "容易拖延内耗、自卑怀疑自己、不敢确立个人边界、在强势者面前容易怯懦妥协。",
    balancedDesc: "充满健康的自信与果断决断力，行动力强，边界清晰且尊重他人。",
    highDesc: "争强好胜、控制欲过盛、急躁易怒、工作狂倾向且难以接纳批评。"
  },
  heart: {
    id: "heart",
    name: "心轮",
    sanskrit: "Anahata",
    location: "胸腔正中·心包区",
    color: "#7BAE7F", // 鼠尾草玉绿
    lightColor: "rgba(123, 174, 127, 0.15)",
    theme: "爱 · 慈悲 · 原谅与高配得感",
    keywords: ["接纳", "自爱", "同理心", "宽恕"],
    frequency: "639 Hz (人际和谐与心意相通)",
    crystal: "粉水晶 / 绿幽灵 / 孔雀石",
    aroma: "玫瑰 / 佛手柑 / 茉莉",
    affirmation: "“我无条件地爱与接纳真实的自己，我的心向世界全然敞开。”",
    lowDesc: "习惯封闭心门（防卫机制）、总觉得自己不配被爱、害怕受伤害、习惯自我苛责。",
    balancedDesc: "拥有强大的自爱力与同理心，能真诚付出也能坦然接受爱，懂得宽恕释怀。",
    highDesc: "容易圣母心泛滥、为了讨好他人而过度牺牲自己、失去健康的分寸界限。"
  },
  throat: {
    id: "throat",
    name: "喉轮",
    sanskrit: "Vishuddha",
    location: "咽喉·颈部凹陷处",
    color: "#6B9AC4", // 雾霾天青蓝
    lightColor: "rgba(107, 154, 196, 0.15)",
    theme: "真实表达 · 沟通 · 自我发声",
    keywords: ["真理", "发声", "拒绝", "清晰沟通"],
    frequency: "741 Hz (直觉唤醒与真实表达)",
    crystal: "海蓝宝 / 天河石 / 蓝纹玛瑙",
    aroma: "尤加利 / 欧薄荷 / 洋甘菊",
    affirmation: "“我允许自己清晰、温和而坚定地说出内心的真实感受。”",
    lowDesc: "习惯咽下委屈、讨好型不敢说‘不’、公开场合表达焦虑卡壳、容易有颈部结节感。",
    balancedDesc: "能流畅从容地表达真实观点，既善于倾听也能温和坚定地表达立场。",
    highDesc: "言语强势凌厉、喜欢打断他人、言辞刻薄或过度倾吐停不下来。"
  },
  thirdEye: {
    id: "thirdEye",
    name: "眉心轮",
    sanskrit: "Ajna",
    location: "两眉之间略上方·印堂",
    color: "#6E72B7", // 鸢尾清靛紫
    lightColor: "rgba(110, 114, 183, 0.15)",
    theme: "直觉 · 洞察力 · 心灵清晰度",
    keywords: ["直觉", "洞察", "清醒", "灵感"],
    frequency: "852 Hz (回归内在秩序与灵性直觉)",
    crystal: "青金石 / 蓝晶石 / 萤石",
    aroma: "乳香 / 快乐鼠尾草 / 杜松",
    affirmation: "“我信任内在深刻的直觉，我看清万物表象之下的真相。”",
    lowDesc: "思维混乱迷茫、过度依赖外在评价、缺乏灵感直觉、做决定时纠结徘徊。",
    balancedDesc: "拥有敏锐的直觉与洞察力，看问题清晰透彻，富有远见与想象力。",
    highDesc: "容易过度空想脱离现实、失眠多梦、沉迷精神世界而不愿落地执行。"
  },
  crown: {
    id: "crown",
    name: "顶轮",
    sanskrit: "Sahasrara",
    location: "头顶正中·百会穴",
    color: "#9E7CB8", // 薰衣草淡雅紫
    lightColor: "rgba(158, 124, 184, 0.15)",
    theme: "超越意识 · 臣服 · 万物合一",
    keywords: ["觉悟", "敬畏", "平静", "内在智慧"],
    frequency: "963 Hz (连接宇宙源头纯粹意识)",
    crystal: "白水晶 / 紫水晶 / 透石膏",
    aroma: "薰衣草 / 没药 / 莲花",
    affirmation: "“我臣服于生命的流动，我与万物的美好与神圣自然相连。”",
    lowDesc: "常感生活空虚虚无、缺乏深层精神寄托、总觉得孤独无援、对生命失去敬畏。",
    balancedDesc: "内心从容宁静，体验到与世界的深刻联结，常怀感恩与宽广的生命格局。",
    highDesc: "过度孤傲疏离、鄙视世俗生活、容易陷入精神优越感中无法脚踏实地。"
  }
};

// 21 道现实生活情境题目（打分 1-5）
// 选项：1=极不符合, 2=不太符合, 3=中立/有时, 4=比较符合, 5=完全符合
// 注意：题目表述分为正向/反向（健康度测量）
const QUIZ_QUESTIONS = [
  // 1. 海底轮 (Root)
  {
    id: 1,
    chakra: "root",
    question: "面对不确定的未来，即使目前存款尚可，我也常常感到莫名的生存心慌与匮乏感。",
    reverse: true // 符合程度越高，代表能量越受阻
  },
  {
    id: 2,
    chakra: "root",
    question: "我感到双脚踏实地扎根在现实生活中，身体有饱满的底气去应对日常生活中的变动。",
    reverse: false
  },
  {
    id: 3,
    chakra: "root",
    question: "我经常感到身体疲累沉重，容易失眠、精神紧绷，很难在所处的环境中全然放松下来。",
    reverse: true
  },

  // 2. 本我轮 (Sacral)
  {
    id: 4,
    chakra: "sacral",
    question: "我常常压抑或忽视自己的真实欲望与情绪，感到生活单调乏味，很难全心享受当下的快乐。",
    reverse: true
  },
  {
    id: 5,
    chakra: "sacral",
    question: "我能自然接纳自己的情感波动，在亲密关系中感到舒适自在，享受与他人亲近的情感交流。",
    reverse: false
  },
  {
    id: 6,
    chakra: "sacral",
    question: "在面对新的兴趣、创作或改变时，我常常感到灵感枯竭或内在有一堵阻滞的墙。",
    reverse: true
  },

  // 3. 太阳神经丛 (Solar Plexus)
  {
    id: 7,
    chakra: "solar",
    question: "我脑海中有许多想法和目标，但一到执行阶段就陷入拖延、自我怀疑与严重的内耗。",
    reverse: true
  },
  {
    id: 8,
    chakra: "solar",
    question: "在重要场合或面对强势的人时，我能够自信从容地表达立场，不轻易委曲求全。",
    reverse: false
  },
  {
    id: 9,
    chakra: "solar",
    question: "面对批评或挫折时，我常常产生强烈的自卑与自我否定，胃部容易感到发紧不适。",
    reverse: true
  },

  // 4. 心轮 (Heart)
  {
    id: 10,
    chakra: "heart",
    question: "我习惯去关照和治愈别人的感受，但当别人向我表达关心或赠予善意时，我却感到局促不安。",
    reverse: true
  },
  {
    id: 11,
    chakra: "heart",
    question: "即使受过委屈或伤害，我也拥有自我疗愈的力量，相信自己是一个值得被爱的人。",
    reverse: false
  },
  {
    id: 12,
    chakra: "heart",
    question: "我下意识地在人际交往中建立坚硬的情感防卫墙，很难完全敞开心扉去信任一段深层关系。",
    reverse: true
  },

  // 5. 喉轮 (Throat)
  {
    id: 13,
    chakra: "throat",
    question: "当遇到不舒服或不公平的事情时，我习惯把委屈咽进肚子里，极难开口当面拒绝别人。",
    reverse: true
  },
  {
    id: 14,
    chakra: "throat",
    question: "我能清晰、温和而坚定地表达自己的真实主张，不因害怕他人不快而刻意迎合奉承。",
    reverse: false
  },
  {
    id: 15,
    chakra: "throat",
    question: "需要在公开场合发言、汇报或与人沟通真实感受时，我容易嗓子发紧、心跳加剧或喉咙堵胀。",
    reverse: true
  },

  // 6. 眉心轮 (Third Eye)
  {
    id: 16,
    chakra: "thirdEye",
    question: "在做人生或工作重要抉择时，我常常陷入思维泥潭，极度依赖别人的建议而怀疑自己的直觉判断。",
    reverse: true
  },
  {
    id: 17,
    chakra: "thirdEye",
    question: "我常常能凭借敏锐的内在直觉看穿事物的本质，内心清晰地知道自己想要的生活方向。",
    reverse: false
  },
  {
    id: 18,
    chakra: "thirdEye",
    question: "我容易想得太多而睡不好觉，脑海中充斥着挥之不去的杂念与精神内耗。",
    reverse: true
  },

  // 7. 顶轮 (Crown)
  {
    id: 19,
    chakra: "crown",
    question: "我常常陷入虚无与孤独感中，总觉得奔波忙碌缺乏深层的意义，精神上找不到寄托。",
    reverse: true
  },
  {
    id: 20,
    chakra: "crown",
    question: "在静处或大自然中，我常能感受到内心的深沉宁静与敬畏，体验到自己与更广阔世界的联结。",
    reverse: false
  },
  {
    id: 21,
    chakra: "crown",
    question: "我很难对生活中的不可抗力‘臣服’，总是试图用紧绷的控制感去抵御生活的不确定性。",
    reverse: true
  }
];

// 人格画像与标签映射表（根据主导能量和最低堵塞能量组合生成）
const PERSONA_PROFILES = [
  {
    condition: (lowest, highest) => lowest.id === 'throat' || lowest.id === 'heart',
    title: "高敏感的温和守护者",
    subtitle: "外在包容体恤 · 内在渴望发声与被接纳",
    tagline: "“你的心装得下世界，却唯独忘了好好拥抱自己。”",
    coreBottleneck: "喉轮与心轮受阻。习惯压抑自己的真实想法去成全别人，筑起防卫心墙，不敢轻易示弱或大声说出内心的需要。",
    energyPrescription: "练习温和坚定的拒绝；每日晨间朗读喉轮肯定语；用 741Hz 音频放松喉部紧绷肌肉。"
  },
  {
    condition: (lowest, highest) => lowest.id === 'root' || lowest.id === 'solar',
    title: "疲惫的内耗赶路人",
    subtitle: "内心渴望突破 · 底层缺乏安全与行动底气",
    tagline: "“想得太多走得太急，你的身体正在呼唤一次深度的‘接地’扎根。”",
    coreBottleneck: "海底轮与太阳轮能量偏低。常常伴随长期的生存匮乏焦虑与行动力拖延，对自己缺乏笃定的信任感，容易紧绷失眠。",
    energyPrescription: "每日进行 10 分钟赤足接地冥想；点燃雪松或岩兰草香氛；通过 396Hz 音频逐步驱散底层潜意识恐惧。"
  },
  {
    condition: (lowest, highest) => lowest.id === 'sacral',
    title: "理智紧绷的秩序守护者",
    subtitle: "掌控力强 · 情绪与感知通道暂时休眠",
    tagline: "“你习惯用理智解决所有问题，却让感受快乐的能力慢慢褪色。”",
    coreBottleneck: "本我轮能量流动受限。过于强调逻辑、规则与正确，压抑了本能的情绪流动与感官欢愉，创造力与亲密关系处于干燥状态。",
    energyPrescription: "放下‘必须有用’的执念，给自己安排无目的的散步与艺术创作；使用甜橙精油唤醒愉悦感。"
  },
  {
    condition: (lowest, highest) => lowest.id === 'thirdEye' || lowest.id === 'crown',
    title: "迷失航向的求索者",
    subtitle: "现实奔忙 · 精神世界渴望清晰与安顿",
    tagline: "“穿梭在世俗喧嚣中，你的内在眼睛需要一抹静谧的微光。”",
    coreBottleneck: "顶三轮能量未被充分激活。对日复一日的生活产生精神疲惫与虚无感，直觉被繁杂的信息噪音淹没，看不清未来的主心骨。",
    energyPrescription: "进行数字排毒（减少睡前刷手机）；在百会穴涂抹薰衣草精油进行 5 分钟闭目观想；倾听 852Hz 灵性音疗。"
  },
  {
    // 默认兜底画像
    condition: () => true,
    title: "正在觉醒的灵性探索者",
    subtitle: "能量正在重构 · 渴望身心合一的平衡之旅",
    tagline: "“每一次对内在的诚实觉察，都是生命能量重获自由的开始。”",
    coreBottleneck: "多处脉轮能量流动存在起伏，正在经历人生观念或生活节奏的转型期，需要更有序的能量清理与滋养。",
    energyPrescription: "遵循七天渐进脉轮梳理，从海底轮扎根做起，逐步打通自下而上的能量中脉通道。"
  }
];
