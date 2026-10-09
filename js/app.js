/**
 * 脉轮测评核心控制逻辑 (Chakra Quiz App Engine)
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM 视图容器
  const viewWelcome = document.getElementById("view-welcome");
  const viewQuiz = document.getElementById("view-quiz");
  const viewAnalyzing = document.getElementById("view-analyzing");
  const viewResult = document.getElementById("view-result");

  // 控制按钮
  const btnStart = document.getElementById("btn-start");
  const btnPrev = document.getElementById("btn-prev");
  const btnGeneratePoster = document.getElementById("btn-generate-poster");
  const btnRetake = document.getElementById("btn-retake");
  const btnMonetizeAction = document.getElementById("btn-monetize-action");

  // 答题元素
  const progressBarFill = document.getElementById("progress-bar-fill");
  const questionNumCurrent = document.getElementById("q-num-current");
  const questionChakraBadge = document.getElementById("q-chakra-badge");
  const questionTitle = document.getElementById("q-title");
  const optionsStack = document.getElementById("options-stack");

  // 结果元素
  const personaTag = document.getElementById("res-persona-tag");
  const personaTitle = document.getElementById("res-persona-title");
  const personaSubtitle = document.getElementById("res-persona-subtitle");
  const personaQuote = document.getElementById("res-persona-quote");
  const bottleneckDesc = document.getElementById("res-bottleneck-desc");
  const chakraAccordion = document.getElementById("chakra-accordion");

  // 弹窗
  const posterModal = document.getElementById("poster-modal");
  const posterModalImg = document.getElementById("poster-modal-img");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const shopModal = document.getElementById("shop-modal");
  const btnCloseShop = document.getElementById("btn-close-shop");

  // 全局答题状态
  let currentQuestionIndex = 0;
  const userAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);
  let chartInstance = null;
  let lastResultData = null;

  // 选项定义 (1-5分)
  const OPTION_LABELS = [
    { score: 1, text: "完全不像我 (极不符合)" },
    { score: 2, text: "偶尔有一点 (不太符合)" },
    { score: 3, text: "中立 / 视情况而定" },
    { score: 4, text: "比较符合我 (常有此感)" },
    { score: 5, text: "完全就是我 (极度符合)" }
  ];

  // 1. 初始化事件
  btnStart.addEventListener("click", () => {
    switchView(viewQuiz);
    loadQuestion(0);
  });

  btnPrev.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      loadQuestion(currentQuestionIndex - 1);
    }
  });

  btnRetake.addEventListener("click", () => {
    userAnswers.fill(null);
    currentQuestionIndex = 0;
    switchView(viewWelcome);
  });

  if (btnGeneratePoster) {
    btnGeneratePoster.addEventListener("click", handleGeneratePoster);
  }

  if (btnMonetizeAction) {
    btnMonetizeAction.addEventListener("click", () => {
      shopModal.classList.add("active");
    });
  }

  btnCloseModal.addEventListener("click", () => {
    posterModal.classList.remove("active");
  });

  btnCloseShop.addEventListener("click", () => {
    shopModal.classList.remove("active");
  });

  posterModal.addEventListener("click", (e) => {
    if (e.target === posterModal) posterModal.classList.remove("active");
  });

  shopModal.addEventListener("click", (e) => {
    if (e.target === shopModal) shopModal.classList.remove("active");
  });

  // 切换页面
  function switchView(targetView) {
    [viewWelcome, viewQuiz, viewAnalyzing, viewResult].forEach(v => {
      if (v) v.classList.remove("active");
    });
    if (targetView) {
      targetView.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // 2. 加载渲染单题
  function loadQuestion(index) {
    currentQuestionIndex = index;
    const q = QUIZ_QUESTIONS[index];
    const total = QUIZ_QUESTIONS.length;
    const chakraConf = CHAKRAS_CONFIG[q.chakra];

    // 更新进度
    const progressPercent = Math.round(((index + 1) / total) * 100);
    progressBarFill.style.width = `${progressPercent}%`;
    questionNumCurrent.textContent = `${index + 1}`;

    // 更新脉轮标签与色彩
    questionChakraBadge.style.backgroundColor = chakraConf.lightColor;
    questionChakraBadge.style.color = chakraConf.color;
    questionChakraBadge.innerHTML = `<span style="width:7px; height:7px; border-radius:50%; background:${chakraConf.color};"></span> ${chakraConf.name} · ${chakraConf.sanskrit}`;

    // 题目文本
    questionTitle.textContent = q.question;

    // 上一题按钮状态
    btnPrev.style.visibility = index === 0 ? "hidden" : "visible";

    // 渲染 5 个选项
    optionsStack.innerHTML = "";
    OPTION_LABELS.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = `option-btn ${userAnswers[index] === opt.score ? "selected" : ""}`;
      btn.innerHTML = `
        <span>${opt.text}</span>
        <div class="option-scale-dot"></div>
      `;
      btn.addEventListener("click", () => handleSelectOption(opt.score));
      optionsStack.appendChild(btn);
    });
  }

  // 处理选项点击
  function handleSelectOption(score) {
    userAnswers[currentQuestionIndex] = score;

    // 视觉反馈高亮
    const buttons = optionsStack.querySelectorAll(".option-btn");
    buttons.forEach((b, idx) => {
      b.classList.toggle("selected", idx === score - 1);
    });

    // 短暂延迟平滑切入下一题，提供良好触感
    setTimeout(() => {
      if (currentQuestionIndex + 1 < QUIZ_QUESTIONS.length) {
        loadQuestion(currentQuestionIndex + 1);
      } else {
        // 完成全部 21 题，进入分析过渡
        finishQuizAndAnalyze();
      }
    }, 220);
  }

  // 3. 计算得分与过渡分析
  function finishQuizAndAnalyze() {
    switchView(viewAnalyzing);

    // 2.2 秒仪式感能量分析过渡动画
    setTimeout(() => {
      calculateAndRenderResults();
      switchView(viewResult);
    }, 2200);
  }

  // 4. 算分与画像判定算法
  function calculateAndRenderResults() {
    // 汇总每个脉轮得分（初始 0 分）
    const scores = {
      root: 0,
      sacral: 0,
      solar: 0,
      heart: 0,
      throat: 0,
      thirdEye: 0,
      crown: 0
    };

    QUIZ_QUESTIONS.forEach((q, idx) => {
      const rawChoice = userAnswers[idx] || 3;
      // 反向题目（分数越高说明越卡点堵塞），需要反转为健康正向能量分
      // 1分 -> 5分; 5分 -> 1分
      const healthScore = q.reverse ? (6 - rawChoice) : rawChoice;
      scores[q.chakra] += healthScore;
    });

    // 转换成 0 - 100 分制（每脉轮满分 15 分，最低 3 分）
    // (score - 3) / 12 * 100
    const normalizedScores = {};
    const chakraKeys = Object.keys(CHAKRAS_CONFIG);

    chakraKeys.forEach(k => {
      const pct = Math.round(((scores[k] - 3) / 12) * 100);
      // 保证区间在 20 - 95 之间更加自然饱满
      normalizedScores[k] = Math.max(18, Math.min(95, pct));
    });

    // 排序找出能量最高与最低的脉轮
    const sortedChakras = chakraKeys.map(k => ({
      ...CHAKRAS_CONFIG[k],
      score: normalizedScores[k]
    })).sort((a, b) => a.score - b.score);

    const lowestChakra = sortedChakras[0]; // 能量最堵塞的脉轮
    const highestChakra = sortedChakras[sortedChakras.length - 1]; // 最活跃的脉轮

    // 匹配人格画像
    let matchedPersona = PERSONA_PROFILES.find(p => p.condition(lowestChakra, highestChakra));
    if (!matchedPersona) matchedPersona = PERSONA_PROFILES[PERSONA_PROFILES.length - 1];

    // 保存全局结果供生成海报使用
    lastResultData = {
      persona: matchedPersona,
      lowestChakra,
      highestChakra,
      normalizedScores
    };

    // 填充结果文字
    personaTag.textContent = `核心能量主型 · ${highestChakra.name}充盈 / ${lowestChakra.name}需疏通`;
    personaTitle.textContent = matchedPersona.title;
    personaSubtitle.textContent = matchedPersona.subtitle;
    personaQuote.textContent = matchedPersona.tagline;
    bottleneckDesc.textContent = matchedPersona.coreBottleneck;

    // 渲染雷达图
    renderRadarChart(normalizedScores);

    // 渲染 7 大脉轮折叠明细卡片
    renderChakraAccordion(sortedChakras);
  }

  // 5. 渲染 Chart.js 莫兰迪 7 维雷达图
  function renderRadarChart(scores) {
    const ctx = document.getElementById("chakraRadarChart").getContext("2d");
    if (chartInstance) {
      chartInstance.destroy();
    }

    const labels = ["海底轮", "本我轮", "太阳轮", "心轮", "喉轮", "眉心轮", "顶轮"];
    const dataValues = [
      scores.root,
      scores.sacral,
      scores.solar,
      scores.heart,
      scores.throat,
      scores.thirdEye,
      scores.crown
    ];

    chartInstance = new Chart(ctx, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [{
          label: "脉轮流动度",
          data: dataValues,
          backgroundColor: "rgba(123, 174, 127, 0.28)", // 鼠尾草玉绿半透明
          borderColor: "#5A8B5F",
          borderWidth: 2.5,
          pointBackgroundColor: [
            "#D87A68", "#E08A56", "#DEAF56", "#7BAE7F", "#6B9AC4", "#6E72B7", "#9E7CB8"
          ],
          pointBorderColor: "#FAF5EE",
          pointBorderWidth: 2,
          pointRadius: 5.5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              color: "rgba(180, 165, 145, 0.45)",
              lineWidth: 1.2
            },
            grid: {
              color: "rgba(180, 165, 145, 0.35)",
              lineWidth: 1.2
            },
            pointLabels: {
              font: {
                size: 14,
                family: "-apple-system, sans-serif",
                weight: "600"
              },
              color: "#3A3228"
            },
            ticks: {
              display: false,
              min: 0,
              max: 100,
              stepSize: 20
            },
            suggestedMin: 10,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => ` 能量通畅度: ${context.raw}%`
            }
          }
        }
      }
    });
  }

  // 6. 渲染 7 大脉轮列表明细
  function renderChakraAccordion(chakraList) {
    chakraAccordion.innerHTML = "";

    // 恢复按正常由下到上的顺序展示
    const orderedKeys = ["root", "sacral", "solar", "heart", "throat", "thirdEye", "crown"];
    orderedKeys.forEach(key => {
      const chakra = CHAKRAS_CONFIG[key];
      const score = lastResultData.normalizedScores[key];

      let statusTag = "";
      if (score < 45) {
        statusTag = `<span class="chakra-status-tag status-blocked">严重阻滞 (${score}%)</span>`;
      } else if (score <= 75) {
        statusTag = `<span class="chakra-status-tag status-balanced">流动平衡 (${score}%)</span>`;
      } else {
        statusTag = `<span class="chakra-status-tag status-active">活跃充沛 (${score}%)</span>`;
      }

      const card = document.createElement("div");
      card.className = "chakra-item-card";
      card.innerHTML = `
        <div class="chakra-item-header">
          <div class="chakra-name-badge">
            <span class="chakra-dot" style="background:${chakra.color};"></span>
            <span>${chakra.name} · <span style="font-weight:400; font-size:12px; color:var(--text-muted);">${chakra.theme}</span></span>
          </div>
          ${statusTag}
        </div>
        
        <div class="chakra-bar-track">
          <div class="chakra-bar-val" style="width:${score}%; background:${chakra.color};"></div>
        </div>

        <div style="font-size:12px; color:var(--text-main); line-height:1.5; margin-bottom:6px;">
          ${score < 50 ? chakra.lowDesc : chakra.balancedDesc}
        </div>

        <div class="chakra-rx-box">
          <div class="rx-row"><span class="rx-label">对应频段:</span> <span>${chakra.frequency}</span></div>
          <div class="rx-row"><span class="rx-label">能量晶石:</span> <span>${chakra.crystal}</span></div>
          <div class="rx-row"><span class="rx-label">疗愈肯定语:</span> <span style="font-style:italic;">${chakra.affirmation}</span></div>
        </div>
      `;
      chakraAccordion.appendChild(card);
    });
  }

  // 7. 处理一键生成小红书海报
  async function handleGeneratePoster() {
    if (!lastResultData || !chartInstance) return;

    btnGeneratePoster.textContent = "正在绘制高清海报...";
    btnGeneratePoster.style.opacity = "0.7";

    try {
      // 导出雷达图为 Base64 图片
      const chartBase64 = chartInstance.toBase64Image();
      const img = new Image();
      img.src = chartBase64;
      await new Promise(resolve => { img.onload = resolve; });

      const posterGen = new window.ChakraPosterGenerator();
      const posterDataUrl = await posterGen.generatePoster({
        persona: lastResultData.persona,
        lowestChakra: lastResultData.lowestChakra,
        highestChakra: lastResultData.highestChakra,
        chakraScores: lastResultData.normalizedScores,
        radarImage: img
      });

      // 显示在弹窗中
      posterModalImg.src = posterDataUrl;
      posterModal.classList.add("active");
    } catch (err) {
      console.error("生成海报失败", err);
      alert("海报生成失败，请重试");
    } finally {
      btnGeneratePoster.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        保存并生成小红书打卡长图
      `;
      btnGeneratePoster.style.opacity = "1";
    }
  }
});
