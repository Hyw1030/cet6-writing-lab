const topics = [
  {
    title: "社会实践与学术学习同等重要",
    keyword: "social practice and academic learning",
    prompt: "Some people believe that social practice is as important as academic learning. Write an essay to express your view and support it with examples.",
    fit: "能套",
    note: "结尾把 it 改成 both of them 会更自然。"
  },
  {
    title: "自主学习能力",
    keyword: "independent learning",
    prompt: "Nowadays, cultivating independent learning ability is increasingly important for personal development.",
    fit: "能套",
    note: "直接套主模板，例子写制定目标、主动学习。"
  },
  {
    title: "数字素养和数字技能",
    keyword: "digital literacy and digital skills",
    prompt: "People are increasingly aware of the importance of digital literacy and digital skills in today's world.",
    fit: "能套",
    note: "例子用搜索信息、整理材料、完成作业。"
  },
  {
    title: "基础知识",
    keyword: "basic knowledge",
    prompt: "A sound knowledge of the basics is of vital importance for students to master an academic subject.",
    fit: "能套",
    note: "把 learning efficiency 改成 building a solid foundation 更贴题。"
  },
  {
    title: "职业准备",
    keyword: "career preparation",
    prompt: "College students should make good preparation for their future career.",
    fit: "能套",
    note: "例子用 job market, internships, required skills。"
  },
  {
    title: "人工智能的合理使用",
    keyword: "the proper use of AI",
    prompt: "Discuss whether AI can be properly used as a helpful tool and how people should use it.",
    fit: "需微调",
    note: "加入风险句，强调不能替代独立思考。"
  },
  {
    title: "社交媒体责任使用",
    keyword: "the proper use of social media",
    prompt: "People should use social media properly and responsibly.",
    fit: "需微调",
    note: "用技术/风险题微调句，写 misinformation 和 mindful scrolling。"
  },
  {
    title: "设定切实目标",
    keyword: "setting realistic goals",
    prompt: "In order to improve the possibility of success, people should set realistic goals and work persistently.",
    fit: "能套",
    note: "例子写计划、时间管理、可执行目标。"
  },
  {
    title: "自律",
    keyword: "self-discipline",
    prompt: "Self-discipline is important to students' personal growth.",
    fit: "能套",
    note: "例子写抵抗干扰、按时完成任务。"
  },
  {
    title: "大学探索机会",
    keyword: "college experience",
    prompt: "College provides students with opportunities to explore themselves and find the right path.",
    fit: "能套",
    note: "把 future competition 改成 a fulfilling career 更贴。"
  }
];

const keywords = [
  "social practice",
  "academic learning",
  "independent learning",
  "digital literacy",
  "digital skills",
  "basic knowledge",
  "self-discipline",
  "career preparation",
  "setting realistic goals",
  "the proper use of social media",
  "the proper use of AI",
  "self-exploration",
  "a sense of responsibility"
];

const imageNames = [
  "微信图片_20260609094041_63_51.jpg",
  "微信图片_20260609094042_64_51.jpg",
  "微信图片_20260609094044_65_51.jpg",
  "微信图片_20260609094046_66_51.jpg",
  "微信图片_20260609094047_67_51.jpg",
  "微信图片_20260609094049_68_51.jpg",
  "微信图片_20260609094050_69_51.jpg",
  "微信图片_20260609094051_70_51.jpg",
  "微信图片_20260609094052_71_51.jpg",
  "微信图片_20260609094053_72_51.jpg",
  "微信图片_20260609094054_73_51.jpg",
  "微信图片_20260609094055_74_51.jpg",
  "微信图片_20260609094056_75_51.jpg",
  "微信图片_20260609094057_76_51.jpg",
  "微信图片_20260609094058_77_51.jpg",
  "微信图片_20260609094059_78_51.jpg"
];

const templateText = `Recently, more and more people have begun to realize the importance of XX. In a world full of changes and challenges, XX is no longer a minor choice, but an essential ability/quality for personal growth and future development.

First, XX helps people deal with problems more effectively. For college students, it can improve learning efficiency, broaden their horizons and enable them to make wiser decisions. For example, students who attach importance to XX are more likely to stay focused and make steady progress. Second, XX also plays a key role in long-term development. It builds confidence and independence, and prepares people for future competition in society.

In conclusion, XX is closely related to individual development and social progress. It is high time that we paid more attention to it and took practical action to develop this valuable ability/quality. Only in this way can we better face future challenges and create a more promising future.`;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const state = {
  timerSeconds: 30 * 60,
  timerId: null
};

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1800);
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    // Fall back below for local file usage.
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(helper);
  return ok;
}

function wordCount(text) {
  return (text.match(/[A-Za-z]+(?:[-'][A-Za-z]+)?/g) || []).length;
}

function paragraphCount(text) {
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).length;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function highlightKeyword(text, keyword) {
  const safeText = escapeHtml(text);
  if (!keyword || keyword === "XX") {
    return safeText.replaceAll("XX", '<span class="part-topic">XX</span>');
  }
  const safeKeyword = escapeHtml(keyword);
  return safeText.replaceAll(safeKeyword, `<span class="part-topic">${safeKeyword}</span>`);
}

function renderTemplateBreakdown() {
  const keyword = $("#topicKeyword").value.trim() || "XX";
  const parts = [
    {
      label: "开头固定模板：引出现象和重要性",
      type: "core",
      text: "Recently, more and more people have begun to realize the importance of XX. In a world full of changes and challenges, XX is no longer a minor choice, but an essential ability/quality for personal growth and future development."
    },
    {
      label: "正文固定模板：两个好处，适合大多数重要性题",
      type: "core",
      text: "First, XX helps people deal with problems more effectively. For college students, it can improve learning efficiency, broaden their horizons and enable them to make wiser decisions."
    },
    {
      label: "例子句：这里最适合按题目换一换",
      type: "tune",
      text: "For example, students who attach importance to XX are more likely to stay focused and make steady progress."
    },
    {
      label: "正文固定模板：补第二个长期作用",
      type: "core",
      text: "Second, XX also plays a key role in long-term development. It builds confidence and independence, and prepares people for future competition in society."
    },
    {
      label: "结尾固定模板：总结并呼吁行动",
      type: "core",
      text: "In conclusion, XX is closely related to individual development and social progress. It is high time that we paid more attention to it and took practical action to develop this valuable ability/quality. Only in this way can we better face future challenges and create a more promising future."
    }
  ];

  $("#breakdownBody").innerHTML = parts
    .map((part) => {
      const text = highlightKeyword(part.text.replaceAll("XX", keyword), keyword);
      return `<div class="breakdown-part"><span class="breakdown-label">${part.label}</span><span class="part-${part.type}">${text}</span></div>`;
    })
    .join("");
}

function updateStats() {
  const text = $("#essayInput").value;
  $("#wordCount").textContent = wordCount(text);
  $("#paragraphCount").textContent = paragraphCount(text);
  $("#saveState").textContent = "已自动保存";
  localStorage.setItem("cet6EssayDraft", text);
  renderTemplateBreakdown();
  updateCodexRequest();
}

function renderTopics() {
  const select = $("#topicSelect");
  topics.forEach((topic, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = topic.title;
    select.appendChild(option);
  });
  select.addEventListener("change", () => {
    const topic = topics[Number(select.value)];
    $("#topicKeyword").value = topic.keyword;
    $("#topicPrompt").textContent = topic.prompt;
    updateCodexRequest();
  });
  select.dispatchEvent(new Event("change"));
}

function renderKeywords() {
  const root = $("#keywordChips");
  keywords.forEach((item) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = item;
    chip.addEventListener("click", () => {
      $("#topicKeyword").value = item;
      updateCodexRequest();
      toast("已填入核心词");
    });
    root.appendChild(chip);
  });
}

function renderVerify() {
  const root = $("#verifyList");
  topics.forEach((topic) => {
    const item = document.createElement("div");
    item.className = "verify-item";
    item.innerHTML = `
      <strong>${topic.title}</strong>
      <span>${topic.note}</span>
      <span class="badge ${topic.fit.includes("需") ? "warn" : ""}">${topic.fit}</span>
    `;
    root.appendChild(item);
  });
}

function renderGallery() {
  const root = $("#sourceGallery");
  imageNames.forEach((name, index) => {
    const link = document.createElement("a");
    link.href = `./assets/${encodeURIComponent(name)}`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.title = `真题图 ${index + 1}`;
    link.innerHTML = `<img src="./assets/${name}" alt="真题图 ${index + 1}" loading="lazy" />`;
    root.appendChild(link);
  });
}

function setTimerText() {
  const minutes = String(Math.floor(state.timerSeconds / 60)).padStart(2, "0");
  const seconds = String(state.timerSeconds % 60).padStart(2, "0");
  $("#timerText").textContent = `${minutes}:${seconds}`;
}

function runChecks() {
  const text = $("#essayInput").value;
  const wc = wordCount(text);
  const pc = paragraphCount(text);
  const checks = [
    {
      title: "字数",
      ok: wc >= 150 && wc <= 220,
      warn: wc >= 130 && wc < 150,
      detail: wc < 150 ? `当前 ${wc} 词，建议写到 150-200 词。` : `当前 ${wc} 词，长度基本可用。`
    },
    {
      title: "结构",
      ok: pc >= 3,
      warn: pc === 2,
      detail: pc >= 3 ? "三段式清楚。" : "建议分成开头、正文、结尾三段。"
    },
    {
      title: "连接词",
      ok: /First|Second|Moreover|Furthermore|In conclusion|Therefore/i.test(text),
      warn: false,
      detail: "至少保留 First, Second, In conclusion 这类路标词。"
    },
    {
      title: "模板残留",
      ok: !/\bXX\b/.test(text),
      warn: false,
      detail: /\bXX\b/.test(text) ? "还有 XX 没替换，考场绝对要改掉。" : "没有发现 XX 残留。"
    },
    {
      title: "高危拼写",
      ok: !/banlance|significience|dacc?ording|enviroment|independant/i.test(text),
      warn: false,
      detail: "重点检查 balance, significance, according, environment, independent。"
    },
    {
      title: "切题",
      ok: $("#topicKeyword").value.trim() && text.toLowerCase().includes($("#topicKeyword").value.trim().split(" ")[0].toLowerCase()),
      warn: true,
      detail: "作文中要反复出现题目核心词或它的同义表达。"
    }
  ];

  const root = $("#scoreGrid");
  root.innerHTML = "";
  checks.forEach((check) => {
    const status = check.ok ? "good" : check.warn ? "warn" : "bad";
    const card = document.createElement("div");
    card.className = `check-card ${status}`;
    card.innerHTML = `<strong>${check.ok ? "通过" : check.warn ? "注意" : "要改"}：${check.title}</strong><span>${check.detail}</span>`;
    root.appendChild(card);
  });
}

function savePractice() {
  const text = $("#essayInput").value.trim();
  if (!text) {
    toast("还没有作文可保存");
    return;
  }
  const records = JSON.parse(localStorage.getItem("cet6EssayRecords") || "[]");
  const topic = topics[Number($("#topicSelect").value)];
  records.unshift({
    time: new Date().toLocaleString(),
    topic: topic.title,
    keyword: $("#topicKeyword").value,
    words: wordCount(text),
    text
  });
  localStorage.setItem("cet6EssayRecords", JSON.stringify(records.slice(0, 20)));
  renderHistory();
  toast("已保存练习记录");
}

function renderHistory() {
  const root = $("#practiceHistory");
  const records = JSON.parse(localStorage.getItem("cet6EssayRecords") || "[]");
  if (!records.length) {
    root.innerHTML = `<p class="muted">还没有保存记录。写完一篇后点“保存这篇”。</p>`;
    return;
  }
  root.innerHTML = "";
  records.forEach((record) => {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `<strong>${record.topic}</strong><p class="muted">${record.time} · ${record.words} words · ${record.keyword}</p>`;
    item.addEventListener("click", () => {
      $("#essayInput").value = record.text;
      $("#topicKeyword").value = record.keyword;
      updateStats();
      toast("已载入这篇作文");
    });
    root.appendChild(item);
  });
}

function updateCodexRequest() {
  const topic = topics[Number($("#topicSelect").value)] || topics[0];
  const need = $("#codexNeed").value.trim() || "请帮我批改这篇六级作文，指出最影响得分的问题，并给出适合最后两天背诵的修改版。";
  const essay = $("#essayInput").value.trim() || "（我还没有写作文）";
  $("#codexRequest").value = `我正在使用你做的 cet6-writing-lab 网站练六级作文/翻译。

题目类型：${topic.title}
题目要求：${topic.prompt}
核心词：${$("#topicKeyword").value || topic.keyword}

我的需求：${need}

我的作文：
${essay}

如果需要改网站，请直接修改 D:\\5.13\\cet6-writing-lab 里的文件。`;
}

function bindEvents() {
  $$(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".nav-item").forEach((item) => item.classList.remove("active"));
      $$(".panel").forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      $(`#${button.dataset.panel}`).classList.add("active");
    });
  });

  $("#essayInput").addEventListener("input", updateStats);
  $("#topicKeyword").addEventListener("input", updateCodexRequest);
  $("#codexNeed").addEventListener("input", updateCodexRequest);

  $("#insertTemplate").addEventListener("click", () => {
    const keyword = $("#topicKeyword").value.trim() || "XX";
    $("#essayInput").value = templateText.replaceAll("XX", keyword);
    updateStats();
    $("#templateBreakdown").classList.add("show");
    toast("模板已插入");
  });

  $("#toggleBreakdown").addEventListener("click", () => {
    $("#templateBreakdown").classList.toggle("show");
    renderTemplateBreakdown();
  });

  $("#clearEssay").addEventListener("click", () => {
    $("#essayInput").value = "";
    updateStats();
    toast("已清空当前作文");
  });

  $("#savePractice").addEventListener("click", savePractice);
  $("#runCheck").addEventListener("click", runChecks);

  $("#timerStart").addEventListener("click", () => {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
      $("#timerStart").textContent = "继续";
      return;
    }
    $("#timerStart").textContent = "暂停";
    state.timerId = setInterval(() => {
      state.timerSeconds = Math.max(0, state.timerSeconds - 1);
      setTimerText();
      if (state.timerSeconds === 0) {
        clearInterval(state.timerId);
        state.timerId = null;
        $("#timerStart").textContent = "开始";
        toast("30 分钟到");
      }
    }, 1000);
  });

  $("#timerReset").addEventListener("click", () => {
    clearInterval(state.timerId);
    state.timerId = null;
    state.timerSeconds = 30 * 60;
    $("#timerStart").textContent = "开始";
    setTimerText();
  });

  $$("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = $(button.dataset.copy).innerText;
      await copyText(text);
      toast("已复制");
    });
  });

  $("#copyCodexRequest").addEventListener("click", async () => {
    updateCodexRequest();
    await copyText($("#codexRequest").value);
    toast("请求已复制，发给我就行");
  });

  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("cet6Theme", next);
  });
}

function init() {
  document.documentElement.dataset.theme = localStorage.getItem("cet6Theme") || "light";
  renderTopics();
  renderKeywords();
  renderVerify();
  renderGallery();
  renderHistory();
  $("#essayInput").value = localStorage.getItem("cet6EssayDraft") || "";
  updateStats();
  setTimerText();
  bindEvents();
  runChecks();
}

init();
