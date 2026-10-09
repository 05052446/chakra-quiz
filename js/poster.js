/**
 * 小红书高颜值竖版打卡海报生成器 (Canvas Retina 渲染)
 * 适配小红书竖版长图比例 (750 x 1280 px)
 */

class ChakraPosterGenerator {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    // 高清 Retina 2x 分辨率
    this.width = 750;
    this.height = 1280;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  /**
   * 生成海报数据 URL
   * @param {Object} data 包含 persona, chakraScores, radarChartBase64
   */
  async generatePoster(data) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. 绘制侘寂奶油温润背景
    ctx.fillStyle = "#F8F5EE";
    ctx.fillRect(0, 0, w, h);

    // 绘制柔和渐变微光斑
    const radialBg = ctx.createRadialGradient(w * 0.2, h * 0.15, 20, w * 0.2, h * 0.15, 380);
    radialBg.addColorStop(0, "rgba(222, 175, 86, 0.12)");
    radialBg.addColorStop(1, "rgba(248, 245, 238, 0)");
    ctx.fillStyle = radialBg;
    ctx.fillRect(0, 0, w, h);

    const radialBg2 = ctx.createRadialGradient(w * 0.8, h * 0.45, 30, w * 0.8, h * 0.45, 420);
    radialBg2.addColorStop(0, "rgba(123, 174, 127, 0.14)");
    radialBg2.addColorStop(1, "rgba(248, 245, 238, 0)");
    ctx.fillStyle = radialBg2;
    ctx.fillRect(0, 0, w, h);

    const radialBg3 = ctx.createRadialGradient(w * 0.3, h * 0.85, 20, w * 0.3, h * 0.85, 400);
    radialBg3.addColorStop(0, "rgba(110, 114, 183, 0.1)");
    radialBg3.addColorStop(1, "rgba(248, 245, 238, 0)");
    ctx.fillStyle = radialBg3;
    ctx.fillRect(0, 0, w, h);

    // 绘制精致的外边框修饰
    ctx.strokeStyle = "rgba(180, 165, 145, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, w - 72, h - 72);

    // 2. 顶部品牌与标题区
    ctx.textAlign = "center";
    ctx.fillStyle = "#8C8275";
    ctx.font = "500 18px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("— CHAKRA ENERGY INNER RADAR —", w / 2, 86);

    ctx.fillStyle = "#2D2824";
    ctx.font = "600 32px 'Noto Serif SC', serif, -apple-system, sans-serif";
    ctx.fillText("内在能量觉察 · 脉轮自测报告", w / 2, 134);

    // 3. 用户人格标签卡片 (圆角矩形)
    this.drawRoundedRect(ctx, 60, 168, w - 120, 150, 20, "rgba(255, 255, 255, 0.85)", "rgba(200, 184, 166, 0.4)");

    ctx.fillStyle = "#9A7426";
    ctx.font = "600 18px -apple-system, sans-serif";
    ctx.fillText(data.persona.title, w / 2, 212);

    ctx.fillStyle = "#7A7268";
    ctx.font = "400 16px -apple-system, sans-serif";
    ctx.fillText(data.persona.subtitle, w / 2, 242);

    ctx.fillStyle = "#4A423A";
    ctx.font = "italic 16px -apple-system, sans-serif";
    ctx.fillText(data.persona.tagline, w / 2, 284);

    // 4. 中间绘制雷达图
    if (data.radarImage) {
      const radarSize = 420;
      const rx = (w - radarSize) / 2;
      const ry = 345;
      ctx.drawImage(data.radarImage, rx, ry, radarSize, radarSize);
    }

    // 5. 核心卡点与处方卡片
    this.drawRoundedRect(ctx, 60, 785, w - 120, 310, 20, "rgba(255, 255, 255, 0.9)", "rgba(216, 122, 104, 0.3)");

    ctx.textAlign = "left";
    // 警示标
    ctx.fillStyle = "#B55442";
    ctx.font = "600 18px -apple-system, sans-serif";
    ctx.fillText("⚠️ 关键能量卡点提示", 90, 826);

    ctx.fillStyle = "#3D3630";
    ctx.font = "400 15px -apple-system, sans-serif";
    this.wrapText(ctx, data.persona.coreBottleneck, 90, 860, w - 180, 24);

    // 处方
    ctx.fillStyle = "#4F8354";
    ctx.font = "600 18px -apple-system, sans-serif";
    ctx.fillText("🌿 专属能量调频建议", 90, 955);

    ctx.fillStyle = "#3D3630";
    ctx.font = "400 15px -apple-system, sans-serif";
    this.wrapText(ctx, data.persona.energyPrescription, 90, 990, w - 180, 24);

    // 每日肯定语
    if (data.lowestChakra) {
      ctx.fillStyle = "#7A7268";
      ctx.font = "italic 14px -apple-system, sans-serif";
      ctx.fillText(`“ ${data.lowestChakra.affirmation} ”`, 90, 1065);
    }

    // 6. 底部小红书专属打卡水印与提示
    ctx.textAlign = "center";
    ctx.fillStyle = "#9E9486";
    ctx.font = "400 14px -apple-system, sans-serif";
    ctx.fillText("小红书 @内在脉轮探索 · 一起看见身体真实的需要", w / 2, 1140);

    ctx.fillStyle = "#B8ADA0";
    ctx.font = "400 12px -apple-system, sans-serif";
    ctx.fillText("长按保存图片 · 分享到小红书参与脉轮疗愈打卡", w / 2, 1170);

    // 7. 返回 base64 图片格式
    return this.canvas.toDataURL("image/png");
  }

  drawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split("");
    let line = "";
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }
}

window.ChakraPosterGenerator = ChakraPosterGenerator;
