/**
 * 小红书高视觉冲击力 · 杂志级大片排版海报生成器 (Canvas Retina 渲染)
 * 设计规范：大字号、突出视觉中心雷达图、精炼痛点标签、去除冗长文字、杂志封面感
 */

class ChakraPosterGenerator {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    // 小红书官方标准黄金竖版 3:4 比例 (750 x 1000 px)
    this.width = 750;
    this.height = 1000;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  /**
   * 生成极简吸睛大片海报
   */
  async generatePoster(data) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. 侘寂奶油质感背景 + 层次光影
    ctx.fillStyle = "#F6F2EA";
    ctx.fillRect(0, 0, w, h);

    // 氛围光晕 (柔和发光微渐变)
    const halo1 = ctx.createRadialGradient(w * 0.25, 200, 10, w * 0.25, 200, 360);
    halo1.addColorStop(0, "rgba(222, 175, 86, 0.16)");
    halo1.addColorStop(1, "rgba(246, 242, 234, 0)");
    ctx.fillStyle = halo1;
    ctx.fillRect(0, 0, w, h);

    const halo2 = ctx.createRadialGradient(w * 0.75, 600, 10, w * 0.75, 600, 380);
    halo2.addColorStop(0, "rgba(123, 174, 127, 0.15)");
    halo2.addColorStop(1, "rgba(246, 242, 234, 0)");
    ctx.fillStyle = halo2;
    ctx.fillRect(0, 0, w, h);

    // 雅致内框线条
    ctx.strokeStyle = "rgba(170, 155, 135, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    // 2. 顶部品牌徽标 (极简高级感)
    ctx.textAlign = "center";
    ctx.fillStyle = "#8E8375";
    ctx.font = "600 14px -apple-system, sans-serif";
    ctx.letterSpacing = "5px";
    ctx.fillText("— INNER ENERGY RADAR · 脉轮能量报告 —", w / 2, 75);

    // 3. 核心大字号人格/卡点标签 (视觉第一焦点，字号加大到 38px！)
    ctx.fillStyle = "#221D1A";
    ctx.font = "700 38px 'Noto Serif SC', -apple-system, sans-serif";
    ctx.letterSpacing = "1px";
    ctx.fillText(data.persona.title, w / 2, 132);

    // 扎心副标金句 (字号 18px，突出展示)
    ctx.fillStyle = "#70665A";
    ctx.font = "italic 500 18px -apple-system, sans-serif";
    ctx.fillText(data.persona.tagline, w / 2, 172);

    // 4. 中间：巨大雷达图 (尺寸放大到 490px，居中极具张力)
    if (data.radarImage) {
      const radarSize = 490;
      const rx = (w - radarSize) / 2;
      const ry = 195;
      ctx.drawImage(data.radarImage, rx, ry, radarSize, radarSize);
    }

    // 5. 雷达图下方：核心双指标对比药丸徽章 (醒目色块)
    const lowest = data.lowestChakra;
    const highest = data.highestChakra;
    const lowestScore = data.chakraScores[lowest.id] || 35;
    const highestScore = data.chakraScores[highest.id] || 85;

    // 左胶囊：严重受阻 (警示色)
    this.drawPillBadge(
      ctx,
      70, 695, 290, 50,
      "rgba(216, 122, 104, 0.15)",
      "#D87A68",
      `⚠️ 最需疏通: ${lowest.name} (${lowestScore}%)`
    );

    // 右胶囊：天赋优势 (生机色)
    this.drawPillBadge(
      ctx,
      390, 695, 290, 50,
      "rgba(123, 174, 127, 0.15)",
      "#5A8B5F",
      `✦ 天赋优势: ${highest.name} (${highestScore}%)`
    );

    // 6. 底部精炼痛点卡片 (白色毛玻璃底，字大清晰，绝不拥挤)
    this.drawRoundedRect(ctx, 60, 765, w - 120, 140, 16, "rgba(255, 255, 255, 0.88)", "rgba(200, 185, 170, 0.4)");

    ctx.textAlign = "left";
    // 卡点行
    ctx.fillStyle = "#B55442";
    ctx.font = "600 17px -apple-system, sans-serif";
    ctx.fillText("● 核心能量卡点：", 85, 805);

    ctx.fillStyle = "#2D2621";
    ctx.font = "500 16px -apple-system, sans-serif";
    this.wrapText(ctx, data.persona.coreBottleneck, 215, 805, 440, 24, 2);

    // 处方行
    ctx.fillStyle = "#4F8354";
    ctx.font = "600 17px -apple-system, sans-serif";
    ctx.fillText("● 专属调频建议：", 85, 868);

    ctx.fillStyle = "#2D2621";
    ctx.font = "500 16px -apple-system, sans-serif";
    const rxSummary = `${lowest.frequency.split(' ')[0]} 音频共振 · ${lowest.crystal.split(' ')[0]} · ${lowest.affirmation}`;
    this.wrapText(ctx, rxSummary, 215, 868, 440, 24, 2);

    // 7. 底部小红书专属打卡水印
    ctx.textAlign = "center";
    ctx.fillStyle = "#9C9182";
    ctx.font = "500 14px -apple-system, sans-serif";
    ctx.fillText("小红书 @内在脉轮探索 · 长按保存测测你的脉轮", w / 2, 946);

    return this.canvas.toDataURL("image/png");
  }

  // 绘制药丸胶囊徽章
  drawPillBadge(ctx, x, y, width, height, bgColor, textColor, text) {
    this.drawRoundedRect(ctx, x, y, width, height, height / 2, bgColor, null);
    ctx.textAlign = "center";
    ctx.fillStyle = textColor;
    ctx.font = "600 15px -apple-system, sans-serif";
    ctx.fillText(text, x + width / 2, y + height / 2 + 5);
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

  wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
    const chars = text.split("");
    let line = "";
    let currentY = y;
    let linesDrawn = 0;

    for (let n = 0; n < chars.length; n++) {
      const testLine = line + chars[n];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        linesDrawn++;
        if (linesDrawn >= maxLines) {
          ctx.fillText(line + "...", x, currentY);
          return;
        }
        ctx.fillText(line, x, currentY);
        line = chars[n];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }
}

window.ChakraPosterGenerator = ChakraPosterGenerator;
