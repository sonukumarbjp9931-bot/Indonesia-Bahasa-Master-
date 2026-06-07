/* Quiz Engine Controller for BahasaMaster Indonesia */

let activeQuiz = {
  questions: [],
  currentIndex: 0,
  score: 0,
  xpEarned: 0,
  timeLeft: 30,
  timerId: null,
  categoryLabel: "",
  userAnswers: {},
  matchingSelectedLeft: null,
  matchingSelectedRight: null,
  matchingDonePairs: 0
};

// Bind to window for routing hooks
window.initQuizView = initQuizView;
window.selectQuizCategory = selectQuizCategory;
window.startPlacementQuiz = startPlacementQuiz;

function initQuizView() {
  const container = document.getElementById('quiz-view');
  
  // Show standard level selector if no active quiz
  if (!activeQuiz.questions.length) {
    renderQuizMenu();
  }
}

function renderQuizMenu() {
  const container = document.getElementById('quiz-view');
  container.innerHTML = `
    <div class="page-title-area">
      <h1 class="page-title">Pusat Kuis & Modul</h1>
      <p class="page-subtitle">Pilih tingkat keahlian belajar Anda untuk mulai berlatih.</p>
    </div>
    
    <div class="level-selector-wrap">
      <div class="level-card-grid">
        <!-- Pemula -->
        <div class="glass-card lvl-select-card interactive" onclick="selectQuizCategory('pemula')">
          <div class="lvl-select-info">
            <span class="lvl-badge-tag lvl-badge-pemula">Tingkat 1</span>
            <h3 class="lvl-select-title">Pemula (Pemula)</h3>
            <p class="lvl-select-desc">Materi kosakata dasar, sapaan formal sehari-hari, dan tata bahasa sederhana.</p>
            <div class="lvl-select-stats">
              <span><i data-lucide="help-circle" style="width:14px;"></i> 3 Soal</span>
              <span><i data-lucide="clock" style="width:14px;"></i> ~2 Mnit</span>
            </div>
          </div>
          <button class="icon-btn" style="background: var(--color-primary); color:#fff;"><i data-lucide="play"></i></button>
        </div>

        <!-- Menengah -->
        <div class="glass-card lvl-select-card interactive" onclick="selectQuizCategory('menengah')">
          <div class="lvl-select-info">
            <span class="lvl-badge-tag lvl-badge-menengah">Tingkat 2-4</span>
            <h3 class="lvl-select-title">Menengah (Menengah)</h3>
            <p class="lvl-select-desc">Memahami artikel/berita, mendengarkan audio pengumuman, dan istilah teknologi.</p>
            <div class="lvl-select-stats">
              <span><i data-lucide="help-circle" style="width:14px;"></i> 3 Soal</span>
              <span><i data-lucide="clock" style="width:14px;"></i> ~3 Mnit</span>
            </div>
          </div>
          <button class="icon-btn" style="background: var(--color-accent); color:#fff;"><i data-lucide="play"></i></button>
        </div>

        <!-- Mahir -->
        <div class="glass-card lvl-select-card interactive" onclick="selectQuizCategory('mahir')">
          <div class="lvl-select-info">
            <span class="lvl-badge-tag lvl-badge-mahir">Tingkat 5-7</span>
            <h3 class="lvl-select-title">Mahir (Mahir)</h3>
            <p class="lvl-select-desc">Pleonasme tata bahasa baku, pemahaman sosiokultural daerah, dan struktur skripsi.</p>
            <div class="lvl-select-stats">
              <span><i data-lucide="help-circle" style="width:14px;"></i> 2 Soal</span>
              <span><i data-lucide="clock" style="width:14px;"></i> ~2 Mnit</span>
            </div>
          </div>
          <button class="icon-btn" style="background: var(--color-secondary); color:#fff;"><i data-lucide="play"></i></button>
        </div>

        <!-- Profesional -->
        <div class="glass-card lvl-select-card interactive" onclick="selectQuizCategory('profesional')">
          <div class="lvl-select-info">
            <span class="lvl-badge-tag lvl-badge-profesional">Tingkat 8+</span>
            <h3 class="lvl-select-title">Profesional (Mahasiswa Akhir)</h3>
            <p class="lvl-select-desc">Esai ilmiah akademik formal, penyuntingan naskah, dan pidato kepemimpinan.</p>
            <div class="lvl-select-stats">
              <span><i data-lucide="help-circle" style="width:14px;"></i> 1 Soal</span>
              <span><i data-lucide="clock" style="width:14px;"></i> ~4 Mnit</span>
            </div>
          </div>
          <button class="icon-btn" style="background: #8b5cf6; color:#fff;"><i data-lucide="play"></i></button>
        </div>
      </div>
      
      <!-- Placement Test Widget -->
      <div class="glass-card" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:20px; padding:30px; border-left: 5px solid var(--color-accent);">
        <div style="max-width:550px;">
          <h3 style="font-family:var(--font-heading); font-size:1.3rem; font-weight:800; margin-bottom:8px;">Ragu dengan kemampuan Bahasa Indonesia Anda?</h3>
          <p style="color:var(--color-text-secondary); font-size:0.9rem; line-height:1.5;">Ikuti Tes Penempatan (Placement Test) berdurasi 5 menit untuk secara otomatis menganalisis level kompetensi Anda saat ini.</p>
        </div>
        <button onclick="startPlacementQuiz()" class="btn btn-accent"><i data-lucide="compass"></i> Ikuti Tes Penempatan</button>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function selectQuizCategory(level) {
  const allQuestions = AppState.getQuestions();
  // Filter questions for the selected level
  const filtered = allQuestions.filter(q => q.level === level);
  
  if (filtered.length) {
    startQuiz(filtered, `Tingkat ${level.charAt(0).toUpperCase() + level.slice(1)}`);
  } else {
    triggerUINotification("Informasi", "Kategori soal ini sedang dikembangkan.");
  }
}

function startPlacementQuiz() {
  const allQuestions = AppState.getQuestions();
  // Choose representative questions from each level
  const placementQuestions = [
    allQuestions.find(q => q.id === "pemula-mc-1"),
    allQuestions.find(q => q.id === "pemula-fitb-1"),
    allQuestions.find(q => q.id === "menengah-rc-1"),
    allQuestions.find(q => q.id === "menengah-listen-1"),
    allQuestions.find(q => q.id === "mahir-gc-1"),
    allQuestions.find(q => q.id === "profesional-essay-1")
  ].filter(q => q !== undefined); // safety check

  startQuiz(placementQuestions, "Tes Penempatan");
}

function startQuiz(questionsArray, categoryLabel) {
  // Deep clone questions to avoid modifying main state
  activeQuiz.questions = JSON.parse(JSON.stringify(questionsArray));
  activeQuiz.currentIndex = 0;
  activeQuiz.score = 0;
  activeQuiz.xpEarned = 0;
  activeQuiz.categoryLabel = categoryLabel;
  activeQuiz.userAnswers = {};

  renderActiveQuiz();
  startTimer();
}

function renderActiveQuiz() {
  const container = document.getElementById('quiz-view');
  const q = activeQuiz.questions[activeQuiz.currentIndex];
  const progressPercent = Math.round((activeQuiz.currentIndex / activeQuiz.questions.length) * 100);

  // Close previous drawer if open
  closeFeedbackDrawer();

  container.innerHTML = `
    <div class="quiz-container">
      <!-- Quiz Status Header -->
      <div class="quiz-header">
        <div class="quiz-progress-container">
          <span class="quiz-progress-text">Soal ${activeQuiz.currentIndex + 1} dari ${activeQuiz.questions.length}</span>
          <div class="quiz-progress-bar-bg">
            <div class="quiz-progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>
        
        <div class="quiz-timer" id="quiz-timer-display">
          <i data-lucide="clock"></i>
          <span id="timer-sec">30</span> Detik
        </div>
      </div>
      
      <!-- Active Question Card -->
      <div class="glass-card question-card">
        <div class="question-meta">
          <span class="q-badge" style="color:var(--color-primary);">${activeQuiz.categoryLabel}</span>
          <span class="q-badge" style="text-transform: uppercase;">${q.category.replace('-', ' ')}</span>
        </div>
        
        <div class="q-text">${q.question}</div>
        
        <!-- Render specific question UI -->
        <div id="question-type-viewport">
          ${renderQuestionBody(q)}
        </div>
      </div>
      
      <!-- Quiz Navigation Footer -->
      <div class="quiz-footer">
        <button class="btn btn-secondary" onclick="quitQuiz()"><i data-lucide="x"></i> Keluar</button>
        <button class="btn btn-primary" id="check-answer-btn" onclick="checkAnswer()">Periksa Jawaban <i data-lucide="chevron-right"></i></button>
      </div>
    </div>
    
    <!-- Answer Explanation Slide Up Drawer -->
    <div class="feedback-drawer" id="feedback-drawer">
      <!-- Content populated dynamically -->
    </div>
  `;

  // Additional post-render bindings
  if (q.type === 'sentence-arrangement') {
    initSentenceArrangement(q);
  } else if (q.type === 'matching') {
    initMatchingBoard(q);
  }
  
  lucide.createIcons();
  updateTimerDisplay();
}

function renderQuestionBody(q) {
  switch (q.type) {
    case 'multiple-choice':
      return `
        <div class="mc-options-list">
          ${q.options.map((opt, i) => `
            <button class="mc-option-btn" onclick="selectMcOption(this, '${opt}')">
              <span class="mc-option-letter">${String.fromCharCode(65 + i)}</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
      `;
      
    case 'fill-blank':
      // Split question text at ___ if available
      const parts = q.question.split("___");
      return `
        <div class="fitb-input-container">
          <p class="fitb-text-display">
            ${parts[0] || ""}
            <span class="fitb-blank-spot" id="blank-spot">_________</span>
            ${parts[1] || ""}
          </p>
          <input type="text" class="fitb-input" id="fitb-user-input" placeholder="Ketik jawaban Anda di sini..." oninput="updateBlankSpot(this)">
          <div style="font-size:0.85rem; color:var(--color-text-muted);">Petunjuk: ${q.hint}</div>
        </div>
      `;
      
    case 'sentence-arrangement':
      return `
        <div class="sa-blocks-container">
          <div class="sa-workspace-area" id="sa-workspace" placeholder="Sentuh kata di bawah untuk menyusun kalimat">
            <!-- Selected word tags go here -->
          </div>
          <div style="font-size:0.8rem; color:var(--color-text-muted); font-weight:600;">Pilihan Kata:</div>
          <div class="sa-pool-area" id="sa-pool">
            <!-- Available word pool -->
          </div>
        </div>
      `;
      
    case 'reading-comprehension':
      return `
        <div class="rc-split-layout">
          <div class="rc-passage-panel">
            <strong>Teks Bacaan:</strong><br><br>
            ${q.passage}
          </div>
          <div class="mc-options-list">
            ${q.options.map((opt, i) => `
              <button class="mc-option-btn" onclick="selectMcOption(this, '${opt}')">
                <span class="mc-option-letter">${String.fromCharCode(65 + i)}</span>
                <span>${opt}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
      
    case 'listening':
      return `
        <div class="listen-control-card">
          <button class="listen-play-btn" onclick="playSpeechText('${q.textToSpeak}')" title="Putar Suara">
            <i data-lucide="volume-2"></i>
          </button>
          <div class="listen-wave-anim" id="listen-wave">
            <div class="listen-wave-bar"></div>
            <div class="listen-wave-bar"></div>
            <div class="listen-wave-bar"></div>
            <div class="listen-wave-bar"></div>
            <div class="listen-wave-bar"></div>
          </div>
          <p style="font-size:0.85rem; color:var(--color-text-muted);">Klik tombol di atas untuk mendengarkan dikte audio penutur asli.</p>
        </div>
        <div class="mc-options-list" style="margin-top:20px;">
          ${q.options.map((opt, i) => `
            <button class="mc-option-btn" onclick="selectMcOption(this, '${opt}')">
              <span class="mc-option-letter">${String.fromCharCode(65 + i)}</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
      `;
      
    case 'matching':
      return `
        <div class="matching-board">
          <div class="matching-column" id="match-left-col"></div>
          <div class="matching-column" id="match-right-col"></div>
        </div>
      `;
      
    case 'grammar-correction':
      const words = q.sentence.split(/\s+/);
      return `
        <div class="grammar-check-sentence">
          ${words.map((w, i) => `<span class="grammar-word-tag" onclick="selectGrammarWord(this, '${w}')">${w}</span>`).join(' ')}
        </div>
        <p style="font-size:0.85rem; color:var(--color-text-muted); margin-top:10px;">Ketuk kata atau frasa yang dinilai tidak baku/salah dalam susunan kalimat di atas.</p>
      `;
      
    case 'true-false':
      return `
        <div class="tf-container">
          <div class="tf-btn-card tf-true" onclick="selectTrueFalse(this, 'True')">
            <div class="tf-icon-circle"><i data-lucide="check" style="width:30px;height:30px;"></i></div>
            <span>BENAR</span>
          </div>
          <div class="tf-btn-card tf-false" onclick="selectTrueFalse(this, 'False')">
            <div class="tf-icon-circle"><i data-lucide="x" style="width:30px;height:30px;"></i></div>
            <span>SALAH</span>
          </div>
        </div>
      `;
      
    case 'essay':
      return `
        <div class="essay-container">
          <textarea class="essay-textarea" id="essay-user-input" placeholder="Tuliskan esai akademik Anda di sini (minimal 3 kalimat)..." oninput="updateEssayCount(this)"></textarea>
          <div class="essay-counter" id="essay-char-count">0 karakter</div>
        </div>
      `;
      
    default:
      return `<p>Tipe soal tidak dikenali.</p>`;
  }
}

/* --- Interactive Input Helpers --- */

// MC Selection
function selectMcOption(btn, val) {
  document.querySelectorAll('.mc-option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  activeQuiz.userAnswers[activeQuiz.currentIndex] = val;
}

// FITB Display Sync
function updateBlankSpot(inp) {
  const blank = document.getElementById('blank-spot');
  if (blank) {
    blank.innerText = inp.value.trim() || "_________";
  }
  activeQuiz.userAnswers[activeQuiz.currentIndex] = inp.value.trim();
}

// Sentence Arrangement setup
function initSentenceArrangement(q) {
  const pool = document.getElementById('sa-pool');
  const workspace = document.getElementById('sa-workspace');
  
  // Scramble words
  const words = [...q.words];
  // Sort randomly
  words.sort(() => Math.random() - 0.5);
  
  pool.innerHTML = "";
  workspace.innerHTML = "";
  
  words.forEach(w => {
    const chip = document.createElement('span');
    chip.className = 'sa-word-chip';
    chip.innerText = w;
    
    chip.onclick = () => {
      if (chip.parentNode === pool) {
        // Move to workspace
        workspace.appendChild(chip);
      } else {
        // Move back to pool
        pool.appendChild(chip);
      }
      // Record answer
      const selectedWords = Array.from(workspace.querySelectorAll('.sa-word-chip')).map(el => el.innerText);
      activeQuiz.userAnswers[activeQuiz.currentIndex] = selectedWords;
    };
    
    pool.appendChild(chip);
  });
}

// Speech Synthesis player
function playSpeechText(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // stop current sound
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Indonesian
    utterance.rate = 0.85; // slightly slower for readability
    
    const wave = document.getElementById('listen-wave');
    wave.classList.add('active');
    
    utterance.onend = () => {
      wave.classList.remove('active');
    };
    
    window.speechSynthesis.speak(utterance);
  } else {
    triggerUINotification("Browser Error", "Fitur text-to-speech tidak didukung di browser Anda.");
  }
}

// Vocabulary Matching builder
function initMatchingBoard(q) {
  const leftCol = document.getElementById('match-left-col');
  const rightCol = document.getElementById('match-right-col');
  
  activeQuiz.matchingDonePairs = 0;
  activeQuiz.matchingSelectedLeft = null;
  activeQuiz.matchingSelectedRight = null;
  
  leftCol.innerHTML = "";
  rightCol.innerHTML = "";
  
  // Left: Indonesian words (shuffled)
  const lefts = q.pairs.map(p => p.left).sort(() => Math.random() - 0.5);
  // Right: Meanings (shuffled)
  const rights = q.pairs.map(p => p.right).sort(() => Math.random() - 0.5);
  
  lefts.forEach(w => {
    const card = document.createElement('div');
    card.className = 'match-item-card';
    card.innerText = w;
    card.setAttribute('data-side', 'left');
    card.onclick = () => selectMatchItem(card, q);
    leftCol.appendChild(card);
  });
  
  rights.forEach(w => {
    const card = document.createElement('div');
    card.className = 'match-item-card';
    card.innerText = w;
    card.setAttribute('data-side', 'right');
    card.onclick = () => selectMatchItem(card, q);
    rightCol.appendChild(card);
  });
}

function selectMatchItem(card, q) {
  const side = card.getAttribute('data-side');
  
  if (side === 'left') {
    // Clear previous left selection
    document.querySelectorAll('#match-left-col .match-item-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    activeQuiz.matchingSelectedLeft = card;
  } else {
    // Clear previous right selection
    document.querySelectorAll('#match-right-col .match-item-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    activeQuiz.matchingSelectedRight = card;
  }
  
  // If both are selected, check match
  if (activeQuiz.matchingSelectedLeft && activeQuiz.matchingSelectedRight) {
    const leftVal = activeQuiz.matchingSelectedLeft.innerText;
    const rightVal = activeQuiz.matchingSelectedRight.innerText;
    
    // Find matching pair
    const pair = q.pairs.find(p => p.left === leftVal && p.right === rightVal);
    
    if (pair) {
      // It's a match!
      activeQuiz.matchingSelectedLeft.classList.add('correct');
      activeQuiz.matchingSelectedRight.classList.add('correct');
      activeQuiz.matchingSelectedLeft.classList.remove('selected');
      activeQuiz.matchingSelectedRight.classList.remove('selected');
      activeQuiz.matchingDonePairs += 1;
      
      activeQuiz.matchingSelectedLeft = null;
      activeQuiz.matchingSelectedRight = null;
      
      if (activeQuiz.matchingDonePairs === q.pairs.length) {
        activeQuiz.userAnswers[activeQuiz.currentIndex] = "matched-all";
      }
    } else {
      // Shake incorrect
      const l = activeQuiz.matchingSelectedLeft;
      const r = activeQuiz.matchingSelectedRight;
      l.style.borderColor = 'var(--color-error)';
      r.style.borderColor = 'var(--color-error)';
      
      setTimeout(() => {
        l.classList.remove('selected');
        r.classList.remove('selected');
        l.style.borderColor = '';
        r.style.borderColor = '';
      }, 500);
      
      activeQuiz.matchingSelectedLeft = null;
      activeQuiz.matchingSelectedRight = null;
    }
  }
}

// Grammar word select
function selectGrammarWord(span, word) {
  document.querySelectorAll('.grammar-word-tag').forEach(s => s.classList.remove('selected'));
  span.classList.add('selected');
  // Clean punctuation from word for comparison
  const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
  activeQuiz.userAnswers[activeQuiz.currentIndex] = cleanWord;
}

// True False selection
function selectTrueFalse(card, val) {
  document.querySelectorAll('.tf-btn-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  activeQuiz.userAnswers[activeQuiz.currentIndex] = val;
}

// Essay counter
function updateEssayCount(textarea) {
  const len = textarea.value.length;
  document.getElementById('essay-char-count').innerText = `${len} karakter`;
  activeQuiz.userAnswers[activeQuiz.currentIndex] = textarea.value.trim();
}

/* --- Active Quiz Timer --- */
function startTimer() {
  activeQuiz.timeLeft = 30; // 30s per question
  updateTimerDisplay();
  
  if (activeQuiz.timerId) clearInterval(activeQuiz.timerId);
  
  activeQuiz.timerId = setInterval(() => {
    activeQuiz.timeLeft -= 1;
    updateTimerDisplay();
    
    if (activeQuiz.timeLeft <= 0) {
      clearInterval(activeQuiz.timerId);
      // Auto check on timeout (unanswered)
      checkAnswer();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById('quiz-timer-display');
  const timerSec = document.getElementById('timer-sec');
  
  if (timerSec) {
    timerSec.innerText = activeQuiz.timeLeft;
    if (activeQuiz.timeLeft <= 10) {
      timerDisplay.classList.add('low-time');
    } else {
      timerDisplay.classList.remove('low-time');
    }
  }
}

/* --- Answer Validation Logic --- */
function checkAnswer() {
  // Stop timer
  if (activeQuiz.timerId) clearInterval(activeQuiz.timerId);
  
  const q = activeQuiz.questions[activeQuiz.currentIndex];
  let isCorrect = false;
  const ans = activeQuiz.userAnswers[activeQuiz.currentIndex];
  
  // Grade different question types
  switch (q.type) {
    case 'multiple-choice':
    case 'reading-comprehension':
    case 'listening':
      isCorrect = (ans === q.answer);
      break;
      
    case 'fill-blank':
      isCorrect = (ans && ans.toLowerCase().trim() === q.blankAnswer.toLowerCase().trim());
      break;
      
    case 'sentence-arrangement':
      if (Array.isArray(ans)) {
        isCorrect = (ans.join(' ') === q.correctOrder.join(' '));
      }
      break;
      
    case 'matching':
      isCorrect = (ans === "matched-all");
      break;
      
    case 'grammar-correction':
      // Compare clean words
      const cleanIncorrect = q.incorrectWord.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      isCorrect = (ans && ans.toLowerCase() === cleanIncorrect);
      break;
      
    case 'true-false':
      isCorrect = (ans === q.answer);
      break;
      
    case 'essay':
      // Simulated AI Tutor grading for essay
      isCorrect = gradeEssaySimulated(ans);
      break;
  }
  
  // Update score
  if (isCorrect) {
    activeQuiz.score += 1;
    activeQuiz.xpEarned += 25; // 25 XP per correct answer
    if (window.playCorrectSound) window.playCorrectSound();
  } else {
    if (window.playIncorrectSound) window.playIncorrectSound();
  }

  // Freeze user inputs in the viewport
  disableQuestionInputs();

  // Show sliding drawer feedback
  showAnswerDrawer(isCorrect, q);
}

function gradeEssaySimulated(text) {
  if (!text) return false;
  // Rule 1: Minimum characters
  if (text.length < 80) return false;
  
  // Rule 2: Count sentences (minimum 3 periods/questions)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  if (sentences.length < 3) return false;
  
  // Check academic buzzwords
  const buzzwords = ["pelestarian", "globalisasi", "urgensi", "bahasa", "indonesia", "budaya", "identitas", "penting", "modern"];
  const matches = buzzwords.filter(word => text.toLowerCase().includes(word));
  
  return matches.length >= 2; // Pass if contains at least 2 key terms
}

function disableQuestionInputs() {
  document.querySelectorAll('.mc-option-btn').forEach(b => b.style.pointerEvents = 'none');
  const fitb = document.getElementById('fitb-user-input');
  if (fitb) fitb.disabled = true;
  document.querySelectorAll('.sa-word-chip').forEach(c => c.style.pointerEvents = 'none');
  document.querySelectorAll('.match-item-card').forEach(c => c.style.pointerEvents = 'none');
  document.querySelectorAll('.grammar-word-tag').forEach(s => s.style.pointerEvents = 'none');
  document.querySelectorAll('.tf-btn-card').forEach(c => c.style.pointerEvents = 'none');
  const essayVal = document.getElementById('essay-user-input');
  if (essayVal) essayVal.disabled = true;
}

function showAnswerDrawer(isCorrect, q) {
  const drawer = document.getElementById('feedback-drawer');
  if (!drawer) return;

  // Custom feedback fields
  let correctExplanationStr = q.explanation;
  let vocabListHtml = "";
  
  if (q.vocabBreakdown && Object.keys(q.vocabBreakdown).length) {
    vocabListHtml = `
      <div class="feedback-vocab-list">
        <span class="fb-title">Kamus Diksi:</span>
        ${Object.entries(q.vocabBreakdown).map(([word, mean]) => `
          <div class="feedback-vocab-item">
            <span class="feedback-vocab-word">${word}</span>
            <span class="feedback-vocab-mean">${mean}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // If essay, show a custom simulated AI report
  if (q.type === 'essay') {
    const text = activeQuiz.userAnswers[activeQuiz.currentIndex] || "";
    if (isCorrect) {
      correctExplanationStr = `<strong>Ulasan AI Tutor:</strong> Esai Anda terstruktur dengan baik. Penggunaan kosakata formal seperti '${text.includes("urgensi") ? "urgensi" : "pelestarian"}' tepat sasaran. Argumentasi koheren (memenuhi batas minimal 3 kalimat).`;
    } else {
      correctExplanationStr = `<strong>Ulasan AI Tutor:</strong> Esai Anda belum memenuhi kriteria kelulusan. Harap gunakan bahasa baku akademik, tulis minimal 3 kalimat, dan masukkan argumen yang mendalam mengenai pelestarian nilai budaya.`;
    }
  }

  drawer.className = `feedback-drawer ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'} active`;
  drawer.innerHTML = `
    <div class="feedback-header">
      <div class="feedback-icon-wrap">
        <i data-lucide="${isCorrect ? 'check' : 'x'}"></i>
      </div>
      <div>
        <h4 class="feedback-result-title">${isCorrect ? 'Jawaban Benar!' : 'Jawaban Salah!'}</h4>
        <p style="font-size:0.85rem; color:var(--color-text-muted);">Mendapatkan ${isCorrect ? '25' : '0'} XP</p>
      </div>
    </div>
    
    <div class="feedback-body">
      <div class="feedback-explanation">
        <span class="fb-title">Pembahasan Soal:</span>
        <p class="fb-text">${correctExplanationStr}</p>
      </div>
      
      <div class="feedback-details">
        ${vocabListHtml}
        <div>
          <span class="fb-title">Tata Bahasa:</span>
          <p class="fb-text" style="font-size:0.85rem;">${q.grammarExplanation}</p>
        </div>
        <div>
          <span class="fb-title">Tips Belajar:</span>
          <p class="fb-text" style="font-size:0.85rem; font-style:italic;">${q.tip}</p>
        </div>
      </div>
    </div>
    
    <div class="feedback-actions">
      <button class="btn btn-primary" onclick="proceedToNextQuestion()">
        ${activeQuiz.currentIndex + 1 === activeQuiz.questions.length ? 'Selesaikan Kuis' : 'Soal Berikutnya'} <i data-lucide="arrow-right"></i>
      </button>
    </div>
  `;
  
  lucide.createIcons();
}

function closeFeedbackDrawer() {
  const drawer = document.getElementById('feedback-drawer');
  if (drawer) drawer.classList.remove('active');
}

function proceedToNextQuestion() {
  closeFeedbackDrawer();
  
  if (activeQuiz.currentIndex + 1 < activeQuiz.questions.length) {
    activeQuiz.currentIndex += 1;
    renderActiveQuiz();
    startTimer();
  } else {
    finishQuiz();
  }
}

/* --- Quiz Finish & Grading --- */
function finishQuiz() {
  if (activeQuiz.timerId) clearInterval(activeQuiz.timerId);
  closeFeedbackDrawer();

  const container = document.getElementById('quiz-view');
  
  // Award XP and logs
  const levelUpTriggered = AppState.addXp(activeQuiz.xpEarned);
  AppState.logQuizCompletion(activeQuiz.categoryLabel, activeQuiz.score, activeQuiz.questions.length, activeQuiz.xpEarned);
  
  // Double-check if we need to issue milestone certificates!
  // If score is high (e.g. >= 80% on a category), issue certificate
  const passRate = activeQuiz.score / activeQuiz.questions.length;
  let certIssued = null;
  if (passRate >= 0.8 && activeQuiz.categoryLabel !== "Tes Penempatan") {
    const title = `Sertifikat Kompetensi ${activeQuiz.categoryLabel}`;
    certIssued = AppState.issueCertificate(title, activeQuiz.categoryLabel, activeQuiz.questions[0].level);
  }

  // Display results
  container.innerHTML = `
    <div class="quiz-container">
      <div class="glass-card quiz-finished-card">
        <div class="q-finished-trophy">
          <i data-lucide="trophy"></i>
        </div>
        
        <h2 class="q-finished-title">Kuis Selesai!</h2>
        <p style="color:var(--color-text-secondary); max-width:500px;">Kerja bagus! Anda telah menuntaskan modul <strong>${activeQuiz.categoryLabel}</strong>. Berikut adalah rincian performa belajar Anda:</p>
        
        <div class="q-finished-stats">
          <div class="q-finished-stat-item">
            <span class="q-finished-stat-val">${activeQuiz.score}/${activeQuiz.questions.length}</span>
            <span class="q-finished-stat-lbl">Jawaban Benar</span>
          </div>
          <div class="q-finished-stat-item">
            <span class="q-finished-stat-val q-finished-stat-val-xp">+${activeQuiz.xpEarned}</span>
            <span class="q-finished-stat-lbl">XP Diperoleh</span>
          </div>
          <div class="q-finished-stat-item">
            <span class="q-finished-stat-val" style="color:var(--color-secondary);">${Math.round(passRate * 100)}%</span>
            <span class="q-finished-stat-lbl">Akurasi</span>
          </div>
        </div>

        ${certIssued ? `
          <div class="glass-card" style="padding:15px 25px; border-left:4px solid var(--color-secondary); background:rgba(245,158,11,0.06); display:flex; align-items:center; gap:15px; margin: 10px 0; text-align:left;">
            <i data-lucide="file-badge" style="color:var(--color-secondary); width:32px; height:32px; flex-shrink:0;"></i>
            <div>
              <h4 style="font-family:var(--font-heading); font-size:1rem; font-weight:800; color:var(--color-secondary);">Sertifikat Kompetensi Diperoleh!</h4>
              <p style="font-size:0.85rem; color:var(--color-text-secondary);">Selamat, Anda melampaui skor kelulusan 80% untuk tingkat ini. Sertifikat Anda telah disimpan dalam Dasbor.</p>
            </div>
          </div>
        ` : ''}

        ${activeQuiz.categoryLabel === "Tes Penempatan" ? `
          <div class="glass-card" style="padding:20px; border-left:4px solid var(--color-accent); background:rgba(6,182,212,0.06); margin: 10px 0; text-align:left; max-width:600px;">
            <h4 style="font-family:var(--font-heading); font-size:1.1rem; font-weight:800; color:var(--color-accent); display:flex; align-items:center; gap:8px;"><i data-lucide="compass"></i> Rekomendasi Penempatan Belajar</h4>
            <p style="font-size:0.9rem; color:var(--color-text-secondary); margin-top:8px; line-height:1.4;">
              Berdasarkan hasil jawaban diagnostik Anda, tingkat kecakapan Anda setara dengan <strong>${getDiagnosticPlacement(activeQuiz.score)}</strong>. 
              Kami merekomendasikan Anda belajar mulai dari modul tingkat tersebut.
            </p>
          </div>
        ` : ''}

        <div style="display:flex; gap:15px; margin-top:15px;">
          <button class="btn btn-secondary" onclick="renderQuizMenu()"><i data-lucide="book-open"></i> Menu Kuis</button>
          <a href="#dashboard" class="btn btn-primary"><i data-lucide="layout-dashboard"></i> Buka Dasbor</a>
        </div>
      </div>
    </div>
  `;

  // Trigger celebration confetti
  triggerConfettiCelebration();
  
  // Reset active state
  activeQuiz.questions = [];
  activeQuiz.currentIndex = 0;
  
  lucide.createIcons();
}

function getDiagnosticPlacement(score) {
  if (score <= 2) return "Pemula (Level 1)";
  if (score <= 4) return "Menengah (Level 2-4)";
  if (score === 5) return "Mahir (Level 5-7)";
  return "Profesional (Level 8+)";
}

function quitQuiz() {
  if (activeQuiz.timerId) clearInterval(activeQuiz.timerId);
  closeFeedbackDrawer();
  
  // Reset
  activeQuiz.questions = [];
  renderQuizMenu();
}
