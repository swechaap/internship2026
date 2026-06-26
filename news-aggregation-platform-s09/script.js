tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          fontFamily: {
            sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
          },
          colors: {
            ink: "#111827",
            aurora: "#38bdf8",
            mint: "#2dd4bf",
            coral: "#fb7185",
            amber: "#f59e0b",
          },
          boxShadow: {
            glow: "0 24px 80px rgba(45, 212, 191, .18)",
            panel: "0 20px 60px rgba(15, 23, 42, .14)",
          },
        },
      },
    };

const categories = ["All", "Technology", "Business", "Politics", "Sports", "Health", "Entertainment"];
    const articles = [
      { id: 1, title: "Chipmakers race to shrink energy costs for generative AI data centers", category: "Technology", source: "TechLedger", author: "Mira Chen", minutes: 5, sentiment: 82, reliability: 94, time: "8 min ago", image: "linear-gradient(135deg,#0ea5e9,#2dd4bf)", keywords: ["AI chips", "data centers", "energy"], summary: "New accelerator designs and liquid cooling systems are reducing the power intensity of AI workloads while keeping model latency low.", body: "Major chipmakers are redesigning accelerators around power-aware scheduling, advanced packaging, and liquid-cooled racks. Analysts say the shift could make enterprise AI deployments easier to justify as energy budgets become a board-level concern.", risk: "Low risk. Multiple industry reports align and the claims are specific without sensational language." },
      { id: 2, title: "Global markets climb as inflation expectations soften", category: "Business", source: "Market Atlas", author: "Jon Bell", minutes: 4, sentiment: 68, reliability: 91, time: "16 min ago", image: "linear-gradient(135deg,#14b8a6,#f59e0b)", keywords: ["markets", "inflation", "rates"], summary: "Equities rose after new survey data suggested consumers expect lower inflation, easing pressure on central banks.", body: "Stock indexes advanced across several regions after inflation expectation surveys moved lower. Investors are watching whether the shift gives policymakers more flexibility, although analysts remain cautious about wage growth and commodity volatility.", risk: "Low risk. The article cites measurable indicators and avoids unsupported predictions." },
      { id: 3, title: "Election commission pilots transparent audit dashboard", category: "Politics", source: "Civic Wire", author: "Asha Rao", minutes: 6, sentiment: 54, reliability: 88, time: "24 min ago", image: "linear-gradient(135deg,#6366f1,#38bdf8)", keywords: ["elections", "audit", "public data"], summary: "A new public dashboard will track ballot chain-of-custody milestones and publish audit updates in near real time.", body: "Election officials are testing a dashboard that displays audit milestones, machine checks, and incident reports. The pilot is intended to improve transparency while preserving voter privacy and local reporting workflows.", risk: "Moderate-low risk. It is plausible and source-backed, though implementation details should be verified locally." },
      { id: 4, title: "Underdog club uses predictive fitness model to prevent injuries", category: "Sports", source: "SportScope", author: "Leo Marin", minutes: 3, sentiment: 77, reliability: 86, time: "31 min ago", image: "linear-gradient(135deg,#22c55e,#0ea5e9)", keywords: ["sports analytics", "fitness", "injury prevention"], summary: "A club credits wearable data and recovery forecasts for cutting soft-tissue injuries during a packed fixture stretch.", body: "Coaches are using player load, sleep indicators, and historical recovery curves to adjust training intensity. The system recommends rest windows and flags athletes at elevated injury risk before matchday.", risk: "Low-medium risk. Outcome claims are promising but may be based on team-reported data." },
      { id: 5, title: "Hospitals deploy AI triage assistant for routine intake questions", category: "Health", source: "HealthSignal", author: "Nadia Smith", minutes: 7, sentiment: 61, reliability: 90, time: "45 min ago", image: "linear-gradient(135deg,#06b6d4,#a3e635)", keywords: ["health AI", "triage", "patient intake"], summary: "Clinical teams are using AI assistants to gather symptoms, medication lists, and urgency indicators before nurse review.", body: "Hospital networks are rolling out intake assistants that collect structured patient details before a clinician enters the loop. Administrators say the tools reduce repetitive documentation while keeping final decisions with licensed staff.", risk: "Low risk. The article clearly separates administrative AI support from medical decision-making." },
      { id: 6, title: "Streaming studios test interactive trailers personalized by genre taste", category: "Entertainment", source: "Culture Cloud", author: "Imani Cole", minutes: 4, sentiment: 73, reliability: 84, time: "1 hr ago", image: "linear-gradient(135deg,#fb7185,#8b5cf6)", keywords: ["streaming", "trailers", "personalization"], summary: "Studios are experimenting with trailers that reorder scenes based on a viewer's favorite genres and viewing history.", body: "Entertainment platforms are testing modular trailers that foreground comedy, suspense, or cast moments depending on user preferences. The goal is to improve discovery without misrepresenting the film's actual tone.", risk: "Medium risk. The technology is realistic, but platform-level rollout claims should be confirmed." },
      { id: 7, title: "Open-source robot kits enter classrooms with safer autonomy modules", category: "Technology", source: "Future Desk", author: "Sam Ortega", minutes: 5, sentiment: 79, reliability: 89, time: "1 hr ago", image: "linear-gradient(135deg,#0891b2,#84cc16)", keywords: ["robotics", "education", "open source"], summary: "New robotics kits include bounded autonomy settings that let students explore AI controls without unsafe physical behavior.", body: "Educators are adopting kits that combine visual programming, sensor fusion, and guardrails for speed and collision behavior. Teachers say the design helps students understand autonomy while keeping classroom setups manageable.", risk: "Low risk. Source claims are concrete and consistent with current education technology trends." },
      { id: 8, title: "Local councils use heat maps to target cooling centers", category: "Health", source: "Urban Monitor", author: "Priya Desai", minutes: 6, sentiment: 49, reliability: 92, time: "2 hrs ago", image: "linear-gradient(135deg,#f97316,#0ea5e9)", keywords: ["heat maps", "public health", "cities"], summary: "Officials are combining weather, transit, and demographic data to decide where to expand cooling-center access.", body: "City teams are overlaying heat vulnerability data with transit maps and medical emergency records. The approach helps locate cooling centers in neighborhoods where residents face the highest exposure and least mobility.", risk: "Low risk. Public planning data and health indicators support the article's claims." }
    ];

    let selectedCategory = "All";
    let selectedArticle = articles[0];
    let saved = 0, summaries = 0, risks = 0;
    let charts = {};

    const $ = (id) => document.getElementById(id);
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    const sentimentLabel = (score) => score >= 72 ? "Positive" : score >= 55 ? "Balanced" : "Cautious";
    const sentimentClass = (score) => score >= 72 ? "bg-teal-400/15 text-teal-700 dark:text-teal-200" : score >= 55 ? "bg-amber-400/15 text-amber-700 dark:text-amber-200" : "bg-rose-400/15 text-rose-700 dark:text-rose-200";

    function initTheme() {
      const savedTheme = localStorage.getItem("newsSphereTheme") || "dark";
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
      $("sunIcon").classList.toggle("hidden", savedTheme === "dark");
      $("moonIcon").classList.toggle("hidden", savedTheme !== "dark");
    }

    function renderTicker() {
      const stream = [...articles.slice(0, 6), ...articles.slice(0, 6)];
      $("trendingTicker").innerHTML = stream.map(article => `
        <button data-article="${article.id}" class="min-w-[260px] rounded-xl border border-slate-200/60 bg-white/70 p-4 text-left transition hover:border-sky-300 dark:border-white/10 dark:bg-slate-900/70">
          <span class="text-xs font-black text-sky-600 dark:text-sky-300">${article.category}</span>
          <p class="mt-2 line-clamp-2 text-sm font-black">${article.title}</p>
          <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">${article.source} • ${article.time}</p>
        </button>
      `).join("");
      $("signalBrief").textContent = "AI detected strong momentum around data-center efficiency, inflation expectations, and public-sector transparency.";
    }

    function renderTabs() {
      $("categoryTabs").innerHTML = categories.map(cat => `
        <button data-category="${cat}" class="${cat === selectedCategory ? "tab-active" : ""} shrink-0 rounded-xl border border-slate-200/70 px-4 py-2 text-sm font-black text-slate-500 transition hover:border-sky-300 dark:border-white/10 dark:text-slate-300">${cat}</button>
      `).join("");
      $("sourceCategory").innerHTML = categories.filter(c => c !== "All").map(c => `<option>${c}</option>`).join("");
    }

    function filteredArticles() {
      const query = $("searchInput").value.trim().toLowerCase();
      const sort = $("sortSelect").value;
      let list = articles.filter(article => selectedCategory === "All" || article.category === selectedCategory);
      if (query) {
        list = list.filter(article => [article.title, article.source, article.category, article.keywords.join(" ")].join(" ").toLowerCase().includes(query));
      }
      return list.sort((a,b) => sort === "credibility" ? b.reliability - a.reliability : sort === "reading" ? a.minutes - b.minutes : a.id - b.id);
    }

    function renderNews() {
      const list = filteredArticles();
      $("newsGrid").innerHTML = list.map(article => `
        <article class="feed-card glass rounded-2xl p-4">
          <button data-article="${article.id}" class="block w-full text-left">
            <div class="mb-4 h-36 rounded-xl" style="background:${article.image}"></div>
            <div class="mb-3 flex flex-wrap gap-2">
              <span class="rounded-full bg-sky-400/15 px-3 py-1 text-xs font-black text-sky-700 dark:text-sky-200">${article.category}</span>
              <span class="rounded-full ${sentimentClass(article.sentiment)} px-3 py-1 text-xs font-black">${sentimentLabel(article.sentiment)}</span>
            </div>
            <h3 class="text-lg font-black leading-snug">${article.title}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">${article.summary}</p>
            <div class="mt-4 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>${article.source}</span>
              <span>${article.minutes} min read</span>
            </div>
          </button>
        </article>
      `).join("") || `<div class="glass rounded-2xl p-8 text-center md:col-span-2"><p class="font-black">No stories match that filter.</p><p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Try a broader keyword or another category.</p></div>`;
    }

    function selectArticle(id) {
      selectedArticle = articles.find(a => a.id === Number(id)) || selectedArticle;
      $("readerCategory").textContent = selectedArticle.category;
      $("readerSentiment").textContent = sentimentLabel(selectedArticle.sentiment);
      $("readerSentiment").className = `rounded-full px-3 py-1 text-xs font-black ${sentimentClass(selectedArticle.sentiment)}`;
      $("readerTime").textContent = `${selectedArticle.minutes} min read`;
      $("readerTitle").textContent = selectedArticle.title;
      $("readerMeta").textContent = `${selectedArticle.source} • ${selectedArticle.author} • ${selectedArticle.time}`;
      $("readerBody").textContent = selectedArticle.body;
      $("readerSource").textContent = selectedArticle.source;
      $("readerReliability").textContent = `${selectedArticle.reliability}% reliability score`;
      $("sourceInitial").textContent = selectedArticle.source.slice(0,1);
      $("sentimentBar").style.width = `${selectedArticle.sentiment}%`;
      $("sentimentScore").textContent = `${selectedArticle.sentiment}/100 • ${sentimentLabel(selectedArticle.sentiment)} tone`;
      $("keywordList").innerHTML = selectedArticle.keywords.map(k => `<span class="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-black dark:bg-white/10">${k}</span>`).join("");
      $("aiOutput").classList.add("hidden");
      updateToolOutput("Selected article loaded. Choose an AI feature to analyze it.");
      location.hash = "reader";
    }

    function renderCounters() {
      document.querySelectorAll(".counter").forEach(el => {
        const target = Number(el.dataset.target);
        let current = 0;
        const step = Math.max(1, Math.round(target / 48));
        const timer = setInterval(() => {
          current = Math.min(target, current + step);
          el.textContent = current.toLocaleString();
          if (current >= target) clearInterval(timer);
        }, 25);
      });
      setInterval(() => {
        $("liveReads").textContent = `${(1240 + Math.floor(Math.random() * 240)).toLocaleString()} active`;
        $("confidenceBar").style.width = `${82 + Math.floor(Math.random() * 12)}%`;
        $("confidenceText").textContent = `${82 + Math.floor(Math.random() * 12)}% source agreement`;
      }, 2600);
    }

    function updateStats() {
      $("savedCount").textContent = saved;
      $("summaryCount").textContent = summaries;
      $("riskCount").textContent = risks;
    }

    function toolText(type) {
      if (type === "summary") return `<b>AI summary:</b> ${selectedArticle.summary} Key impact: readers should watch how this story changes policy, budgets, or public behavior over the next news cycle.`;
      if (type === "fake") return `<b>Fake news detector:</b> ${selectedArticle.risk} Evidence quality: ${selectedArticle.reliability >= 90 ? "strong" : "moderate"}. Sensational wording: ${selectedArticle.reliability > 85 ? "limited" : "present"}.`;
      if (type === "sentiment") return `<b>Sentiment analysis:</b> This article scores ${selectedArticle.sentiment}/100, which NewsSphere labels as ${sentimentLabel(selectedArticle.sentiment)}. The tone is driven by words around ${selectedArticle.keywords.slice(0,2).join(" and ")}.`;
      if (type === "keywords") return `<b>Keyword extraction:</b> ${selectedArticle.keywords.map(k => `<span class="rounded bg-white/10 px-2 py-1">${k}</span>`).join(" ")}. These terms connect the article to related clusters in the live stream.`;
      if (type === "eli15") return `<b>Explain like I'm 15:</b> ${selectedArticle.title} means people are using new tools or data to make a complicated system easier to understand, faster to manage, or safer to trust. The main thing to remember is: ${selectedArticle.summary.toLowerCase()}`;
      return "Select an AI tool or article action to generate insights.";
    }

    function updateToolOutput(html) {
      $("toolOutput").innerHTML = html;
    }

    function showReaderOutput(type) {
      if (type === "summary") summaries++;
      if (type === "fake") risks++;
      updateStats();
      const html = toolText(type);
      $("aiOutput").innerHTML = html;
      $("aiOutput").classList.remove("hidden");
      updateToolOutput(html);
    }

    function chartPalette() {
      return ["#38bdf8", "#2dd4bf", "#fb7185", "#f59e0b", "#8b5cf6", "#22c55e"];
    }

    function createCharts() {
      const textColor = getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
      const gridColor = getComputedStyle(document.documentElement).getPropertyValue("--line").trim();
      const common = { responsive: true, plugins: { legend: { labels: { color: textColor, font: { weight: "700" } } } }, scales: { x: { ticks: { color: textColor }, grid: { color: gridColor } }, y: { ticks: { color: textColor }, grid: { color: gridColor } } } };
      Object.values(charts).forEach(chart => chart.destroy());
      charts.topics = new Chart($("topicsChart"), { type: "line", data: { labels: ["AI", "Markets", "Elections", "Health", "Sports", "Streaming"], datasets: [{ label: "Mentions", data: randomSeries(6, 35, 95), borderColor: "#38bdf8", backgroundColor: "rgba(56,189,248,.18)", tension: .4, fill: true }] }, options: common });
      charts.category = new Chart($("categoryChart"), { type: "bar", data: { labels: categories.slice(1), datasets: [{ label: "Popularity", data: randomSeries(6, 28, 88), backgroundColor: chartPalette() }] }, options: common });
      charts.reading = new Chart($("readingChart"), { type: "radar", data: { labels: ["Morning", "Midday", "Afternoon", "Evening", "Night"], datasets: [{ label: "Reading minutes", data: randomSeries(5, 12, 70), borderColor: "#2dd4bf", backgroundColor: "rgba(45,212,191,.18)" }] }, options: { responsive: true, plugins: common.plugins, scales: { r: { ticks: { color: textColor, backdropColor: "transparent" }, grid: { color: gridColor }, pointLabels: { color: textColor } } } } });
      charts.source = new Chart($("sourceChart"), { type: "doughnut", data: { labels: ["Verified media", "Local sources", "Research feeds", "Social tips"], datasets: [{ data: randomSeries(4, 12, 42), backgroundColor: chartPalette() }] }, options: { responsive: true, plugins: common.plugins } });
    }

    function randomSeries(count, min, max) {
      return Array.from({ length: count }, () => Math.floor(min + Math.random() * (max - min)));
    }

    function renderAdmin() {
      const reports = [
        ["Source onboarding", "37 active sources, 5 awaiting review", "Operational"],
        ["Report queue", `${3 + risks} articles flagged for credibility review`, "Review"],
        ["User analytics", "Top cohort reads Technology and Business", "Insight"],
        ["Category manager", "7 categories synced across feed filters", "Synced"]
      ];
      $("adminRows").innerHTML = reports.map(([title, detail, status]) => `
        <div class="admin-row rounded-xl border border-slate-200/70 bg-white/45 p-4 dark:border-white/10 dark:bg-slate-950/35">
          <div class="flex items-center justify-between gap-3">
            <div><p class="font-black">${title}</p><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${detail}</p></div>
            <span class="rounded-full bg-teal-400/15 px-3 py-1 text-xs font-black text-teal-700 dark:text-teal-200">${status}</span>
          </div>
        </div>
      `).join("");
    }

    function chatBubble(text, who = "ai") {
      const align = who === "user" ? "ml-auto bg-sky-500 text-white" : "mr-auto bg-slate-900/5 text-slate-800 dark:bg-white/10 dark:text-slate-100";
      const node = document.createElement("div");
      node.className = `max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${align} fade-in`;
      node.innerHTML = text;
      $("chatMessages").appendChild(node);
      $("chatMessages").scrollTop = $("chatMessages").scrollHeight;
    }

    function aiChatResponse(prompt) {
      const lower = prompt.toLowerCase();
      if (lower.includes("related")) return `Related reads: ${articles.filter(a => a.category === selectedArticle.category && a.id !== selectedArticle.id).slice(0,2).map(a => a.title).join(" • ") || "try the Technology and Business clusters for adjacent context."}`;
      if (lower.includes("summar")) return selectedArticle.summary;
      if (lower.includes("fake") || lower.includes("risk")) return selectedArticle.risk;
      if (lower.includes("compare")) return "Technology stories are focused on AI infrastructure and robotics, while business coverage is currently shaped by inflation expectations and market confidence.";
      if (lower.includes("explain")) return toolText("eli15").replace("<b>Explain like I'm 15:</b> ", "");
      return `Here is the short answer: ${selectedArticle.title} is connected to ${selectedArticle.keywords.join(", ")}. NewsSphere rates the source at ${selectedArticle.reliability}% and sentiment at ${selectedArticle.sentiment}/100.`;
    }

    function bindEvents() {
      $("themeToggle").addEventListener("click", () => {
        const dark = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", dark);
        localStorage.setItem("newsSphereTheme", dark ? "dark" : "light");
        $("sunIcon").classList.toggle("hidden", dark);
        $("moonIcon").classList.toggle("hidden", !dark);
        createCharts();
      });
      $("mobileMenuBtn").addEventListener("click", () => $("mobileNav").classList.toggle("hidden"));
      document.addEventListener("click", event => {
        const articleButton = event.target.closest("[data-article]");
        if (articleButton) selectArticle(articleButton.dataset.article);
        const tab = event.target.closest("[data-category]");
        if (tab) {
          selectedCategory = tab.dataset.category;
          renderTabs();
          renderNews();
        }
        const authButton = event.target.closest("[data-open-auth]");
        if (authButton) $("authModal").classList.add("show");
        const promptButton = event.target.closest("[data-chat-prompt]");
        if (promptButton) {
          openChat();
          submitChat(promptButton.dataset.chatPrompt);
        }
      });
      $("searchInput").addEventListener("input", renderNews);
      $("sortSelect").addEventListener("change", renderNews);
      $("summaryBtn").addEventListener("click", () => showReaderOutput("summary"));
      $("explainBtn").addEventListener("click", () => showReaderOutput("eli15"));
      $("fakeBtn").addEventListener("click", () => showReaderOutput("fake"));
      $("saveBtn").addEventListener("click", () => { saved++; updateStats(); $("saveBtn").textContent = "Saved"; });
      document.querySelectorAll("[data-tool]").forEach(btn => btn.addEventListener("click", () => {
        const type = btn.dataset.tool;
        if (type === "summary") summaries++;
        if (type === "fake") risks++;
        updateStats();
        updateToolOutput(toolText(type));
      }));
      $("eli15Btn").addEventListener("click", () => updateToolOutput(toolText("eli15")));
      $("refreshCharts").addEventListener("click", createCharts);
      $("sourceForm").addEventListener("submit", event => {
        event.preventDefault();
        const name = $("sourceName").value.trim();
        if (!name) return;
        articles.unshift({ id: Date.now(), title: `${name} added a new monitored feed to NewsSphere`, category: $("sourceCategory").value, source: name, author: "Admin Bot", minutes: 2, sentiment: 65, reliability: Number($("sourceScore").value), time: "Just now", image: "linear-gradient(135deg,#2dd4bf,#38bdf8)", keywords: ["new source", "admin", $("sourceCategory").value.toLowerCase()], summary: "A new source has been added to the aggregation pipeline and will be monitored for reliability.", body: "The admin panel has simulated a source onboarding event. In a production platform, this would trigger feed validation, metadata extraction, and quality monitoring.", risk: "Pending review until enough articles are sampled." });
        $("sourceName").value = "";
        renderNews(); renderTicker(); renderAdmin(); createCharts();
      });
      $("clearReports").addEventListener("click", () => { risks = 0; updateStats(); renderAdmin(); });
      $("authClose").addEventListener("click", () => $("authModal").classList.remove("show"));
      $("authModal").addEventListener("click", event => { if (event.target.id === "authModal") $("authModal").classList.remove("show"); });
      $("authForm").addEventListener("submit", event => { event.preventDefault(); $("authStatus").classList.remove("hidden"); });
      $("loginTab").addEventListener("click", () => switchAuth("login"));
      $("signupTab").addEventListener("click", () => switchAuth("signup"));
      $("chatToggle").addEventListener("click", openChat);
      $("chatClose").addEventListener("click", () => $("chatbot").classList.add("hidden"));
      $("chatForm").addEventListener("submit", event => {
        event.preventDefault();
        const prompt = $("chatInput").value.trim();
        if (prompt) submitChat(prompt);
        $("chatInput").value = "";
      });
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            document.querySelectorAll(".nav-link").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
          }
        });
      }, { rootMargin: "-35% 0px -55% 0px" });
      document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
    }

    function switchAuth(mode) {
      $("loginTab").classList.toggle("bg-white", mode === "login");
      $("loginTab").classList.toggle("dark:bg-slate-900", mode === "login");
      $("signupTab").classList.toggle("bg-white", mode === "signup");
      $("signupTab").classList.toggle("dark:bg-slate-900", mode === "signup");
      $("authStatus").classList.add("hidden");
    }

    function openChat() {
      $("chatbot").classList.remove("hidden");
      if (!$("chatMessages").children.length) chatBubble("Hi, I can summarize articles, explain complex topics, recommend related stories, and answer current-affairs questions using this demo news stream.");
    }

    function submitChat(prompt) {
      chatBubble(prompt, "user");
      setTimeout(() => chatBubble(aiChatResponse(prompt)), 350);
    }

    window.addEventListener("DOMContentLoaded", () => {
      initTheme();
      renderTicker();
      renderTabs();
      renderNews();
      selectArticle(1);
      renderCounters();
      updateStats();
      renderAdmin();
      createCharts();
      bindEvents();
    });
