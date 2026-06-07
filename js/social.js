/* Social, Forums, and Multiplayer Battle Controller */

window.initSocialView = initSocialView;
window.selectSocialTab = selectSocialTab;

// Multiplayer battle bindings
window.startMatchmaking = startMatchmaking;
window.cancelMatchmaking = cancelMatchmaking;
window.submitBattleAnswer = submitBattleAnswer;
window.quitBattle = quitBattle;

// Forum bindings
window.viewForumPost = viewForumPost;
window.upvotePost = upvotePost;
window.submitForumReply = submitForumReply;
window.submitNewThread = submitNewThread;

// Study groups bindings
window.openStudyGroupChat = openStudyGroupChat;
window.sendGroupChatMessage = sendGroupChatMessage;

let activeSocialTab = "battle";

// Battle variables
let battleState = {
  active: false,
  questions: [],
  currentIndex: 0,
  playerScore: 0,
  opponentScore: 0,
  opponentName: "Hendra_ITB",
  opponentUni: "Institut Teknologi Bandung",
  matchmakingTimer: null,
  opponentActionTimer: null,
  userAnswers: {}
};

// Group chat variables
let activeGroupChat = null;

function initSocialView() {
  selectSocialTab(activeSocialTab);
}

function selectSocialTab(tabName) {
  activeSocialTab = tabName;
  const container = document.getElementById('social-view');
  
  // Render Tab Nav
  let viewHtml = `
    <div class="page-title-area">
      <h1 class="page-title">Komunitas Kampus</h1>
      <p class="page-subtitle">Uji kemampuan Anda melawan mahasiswa lain atau diskusikan topik kebahasaan di forum.</p>
    </div>
    
    <div class="social-tabs-nav">
      <button class="social-tab-btn ${tabName === 'battle' ? 'active' : ''}" onclick="selectSocialTab('battle')"><i data-lucide="swords" style="width:14px;display:inline-block;vertical-align:middle;margin-right:6px;"></i> Quiz Battle (1v1)</button>
      <button class="social-tab-btn ${tabName === 'forum' ? 'active' : ''}" onclick="selectSocialTab('forum')"><i data-lucide="message-square" style="width:14px;display:inline-block;vertical-align:middle;margin-right:6px;"></i> Forum Diskusi</button>
      <button class="social-tab-btn ${tabName === 'groups' ? 'active' : ''}" onclick="selectSocialTab('groups')"><i data-lucide="users" style="width:14px;display:inline-block;vertical-align:middle;margin-right:6px;"></i> Kelompok Belajar</button>
    </div>
    
    <div id="social-tab-viewport"></div>
  `;
  
  container.innerHTML = viewHtml;
  
  // Render Tab Content
  const viewport = document.getElementById('social-tab-viewport');
  if (tabName === 'battle') {
    renderBattleTab(viewport);
  } else if (tabName === 'forum') {
    renderForumTab(viewport);
  } else if (tabName === 'groups') {
    renderGroupsTab(viewport);
  }
  
  lucide.createIcons();
}

/* ================= 1. MULTIPLAYER BATTLE ================= */
function renderBattleTab(viewport) {
  if (battleState.active) {
    renderActiveBattle(viewport);
    return;
  }
  
  viewport.innerHTML = `
    <div class="glass-card battle-lobby-card">
      <div class="lobby-matching-icon" id="matching-icon-panel">
        <i data-lucide="swords" style="width:40px;height:40px;"></i>
        <div class="lobby-matching-spinner" id="matching-spinner" style="display:none;"></div>
      </div>
      
      <div id="lobby-prompt-panel">
        <h2 style="font-family:var(--font-heading); font-size:1.6rem; font-weight:800; margin-bottom:8px;">1v1 Arena Akademik</h2>
        <p style="color:var(--color-text-secondary); font-size:0.9rem; line-height:1.5; max-width:450px; margin-bottom:20px;">
          Tantang mahasiswa acak dari universitas lain secara langsung. Siapa yang menjawab soal tata bahasa dengan akurasi dan kecepatan tertinggi akan menang!
        </p>
        <button class="btn btn-primary" onclick="startMatchmaking()"><i data-lucide="search"></i> Cari Lawan Main</button>
      </div>

      <div id="lobby-searching-panel" style="display:none;">
        <h2 style="font-family:var(--font-heading); font-size:1.4rem; font-weight:800; margin-bottom:5px; color:var(--color-accent);">Mencari Kompetitor...</h2>
        <p style="font-size:0.85rem; color:var(--color-text-muted); font-style:italic;" id="matchmaking-status-txt">Menghubungkan ke antrean server nasional...</p>
        <button class="btn btn-secondary" style="margin-top:20px;" onclick="cancelMatchmaking()">Batal Mencari</button>
      </div>
    </div>
  `;
}

function startMatchmaking() {
  document.getElementById('lobby-prompt-panel').style.display = 'none';
  document.getElementById('lobby-searching-panel').style.display = 'block';
  document.getElementById('matching-spinner').style.display = 'block';
  
  const statusTxt = document.getElementById('matchmaking-status-txt');
  const statuses = [
    "Membuka jalur server perguruan tinggi...",
    "Mencari mahasiswa dari Universitas Gadjah Mada...",
    "Mencari kompetitor dari Institut Teknologi Bandung...",
    "Lawan ditemukan! Mengunduh materi modul kuis..."
  ];
  
  let i = 0;
  statusTxt.innerText = statuses[0];
  
  battleState.matchmakingTimer = setInterval(() => {
    i++;
    if (i < statuses.length) {
      statusTxt.innerText = statuses[i];
    } else {
      clearInterval(battleState.matchmakingTimer);
      // Resolve match
      triggerBattleStart();
    }
  }, 1000);
}

function cancelMatchmaking() {
  if (battleState.matchmakingTimer) clearInterval(battleState.matchmakingTimer);
  document.getElementById('lobby-prompt-panel').style.display = 'block';
  document.getElementById('lobby-searching-panel').style.display = 'none';
  document.getElementById('matching-spinner').style.display = 'none';
}

function triggerBattleStart() {
  const user = AppState.getUser();
  const opponents = [
    { name: "Hendra_ITB", uni: "Institut Teknologi Bandung" },
    { name: "Rani_UGM", uni: "Universitas Gadjah Mada" },
    { name: "Siti_UNJ", uni: "Universitas Negeri Jakarta" }
  ];
  const choice = opponents[Math.floor(Math.random() * opponents.length)];
  
  battleState.active = true;
  battleState.opponentName = choice.name;
  battleState.opponentUni = choice.uni;
  battleState.playerScore = 0;
  battleState.opponentScore = 0;
  battleState.currentIndex = 0;
  battleState.userAnswers = {};
  
  // Load questions (take Mahir & Menengah grammar questions)
  const allQs = AppState.getQuestions();
  battleState.questions = allQs.filter(q => q.type === 'multiple-choice' || q.type === 'fill-blank' || q.type === 'grammar-correction');
  
  selectSocialTab('battle');
  
  // Opponent answers simulator (opponent scores every 4-7 seconds with 70% probability)
  simulateOpponentActions();
}

function simulateOpponentActions() {
  if (battleState.opponentActionTimer) clearInterval(battleState.opponentActionTimer);
  
  battleState.opponentActionTimer = setInterval(() => {
    if (!battleState.active) {
      clearInterval(battleState.opponentActionTimer);
      return;
    }
    
    // Opponent finishes one question
    const progress = Math.round((battleState.opponentScore / battleState.questions.length) * 100);
    
    if (battleState.opponentScore < battleState.questions.length) {
      const isCorrect = Math.random() < 0.75; // 75% accuracy
      if (isCorrect) {
        battleState.opponentScore += 1;
        triggerBattleFeed(`${battleState.opponentName} menjawab BENAR!`);
      } else {
        triggerBattleFeed(`${battleState.opponentName} salah menjawab.`);
      }
      
      // Update Opponent progress HUD bar
      const bar = document.getElementById('battle-hud-opp-bar');
      if (bar) {
        const percent = Math.round((battleState.opponentScore / battleState.questions.length) * 100);
        bar.style.width = percent + "%";
      }
      
      // Check if game finishes (opponent finished all, and player finished all)
      checkBattleResolution();
    }
  }, 4500);
}

function triggerBattleFeed(text) {
  const feed = document.getElementById('battle-live-feed');
  if (feed) feed.innerText = text;
}

function renderActiveBattle(viewport) {
  const user = AppState.getUser();
  const q = battleState.questions[battleState.currentIndex];
  
  viewport.innerHTML = `
    <div class="quiz-container">
      <!-- Battle HUD -->
      <div class="battle-hud">
        <div class="battle-hud-player">
          <div class="msg-avatar">Saya</div>
          <div class="hud-profile" style="flex-grow:1;">
            <span class="hud-name">${user.username}</span>
            <span class="hud-uni">${user.university}</span>
            <div class="hud-progress-bg">
              <div class="hud-progress-fill" id="battle-hud-play-bar" style="width: ${Math.round((battleState.currentIndex / battleState.questions.length)*100)}%;"></div>
            </div>
          </div>
        </div>
        
        <div class="hud-versus">VS</div>
        
        <div class="battle-hud-player" style="flex-direction:row-reverse; text-align:right;">
          <div class="msg-avatar" style="background:linear-gradient(135deg, var(--color-secondary), #ea580c);">${battleState.opponentName.charAt(0)}</div>
          <div class="hud-profile" style="flex-grow:1;">
            <span class="hud-name">${battleState.opponentName}</span>
            <span class="hud-uni">${battleState.opponentUni}</span>
            <div class="hud-progress-bg">
              <div class="hud-progress-fill opponent" id="battle-hud-opp-bar" style="width: ${Math.round((battleState.opponentScore / battleState.questions.length)*100)}%;"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="battle-feed" id="battle-live-feed">Dua petarung siap... Pertandingan dimulai!</div>
      
      <!-- Question Card -->
      <div class="glass-card question-card">
        <div class="q-text">${q.question}</div>
        
        <div id="battle-question-type-viewport">
          ${renderQuestionBodyForBattle(q)}
        </div>
      </div>
      
      <!-- Footer controls -->
      <div class="quiz-footer">
        <button class="btn btn-secondary" onclick="quitBattle()"><i data-lucide="flag"></i> Menyerah</button>
        <button class="btn btn-primary" onclick="submitBattleAnswer()">Kirim Jawaban <i data-lucide="send"></i></button>
      </div>
    </div>
  `;
}

function renderQuestionBodyForBattle(q) {
  // Simple MC option / input display helper
  if (q.type === 'multiple-choice' || q.type === 'grammar-correction') {
    const options = q.options || q.sentence.split(/\s+/);
    return `
      <div class="mc-options-list">
        ${options.map((opt, i) => `
          <button class="mc-option-btn" onclick="selectBattleOption(this, '${opt}')">
            <span class="mc-option-letter">${String.fromCharCode(65 + i)}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;
  } else if (q.type === 'fill-blank') {
    return `
      <div class="fitb-input-container">
        <input type="text" class="fitb-input" id="battle-fitb-input" placeholder="Jawaban..." oninput="battleState.userAnswers[battleState.currentIndex] = this.value.trim()">
      </div>
    `;
  }
  return `<p>Soal tidak dikenali</p>`;
}

function selectBattleOption(btn, val) {
  document.querySelectorAll('.mc-option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  battleState.userAnswers[battleState.currentIndex] = val;
}

function submitBattleAnswer() {
  const q = battleState.questions[battleState.currentIndex];
  const ans = battleState.userAnswers[battleState.currentIndex];
  let isCorrect = false;
  
  if (q.type === 'multiple-choice') {
    isCorrect = (ans === q.answer);
  } else if (q.type === 'fill-blank') {
    isCorrect = (ans && ans.toLowerCase().trim() === q.blankAnswer.toLowerCase().trim());
  } else if (q.type === 'grammar-correction') {
    isCorrect = (ans && ans.toLowerCase() === q.incorrectWord.toLowerCase());
  }
  
  if (isCorrect) {
    battleState.playerScore += 1;
    triggerBattleFeed("Anda menjawab BENAR!");
  } else {
    triggerBattleFeed("Jawaban Anda salah.");
  }
  
  // Update user progress HUD bar
  const bar = document.getElementById('battle-hud-play-bar');
  if (bar) {
    const percent = Math.round(((battleState.currentIndex + 1) / battleState.questions.length) * 100);
    bar.style.width = percent + "%";
  }
  
  // Proceed or finish
  if (battleState.currentIndex + 1 < battleState.questions.length) {
    battleState.currentIndex += 1;
    const viewport = document.getElementById('social-tab-viewport');
    renderActiveBattle(viewport);
    lucide.createIcons();
  } else {
    // Wait for opponent to finish
    triggerBattleFeed("Anda selesai! Menunggu lawan merampungkan kuis...");
    checkBattleResolution();
  }
}

function checkBattleResolution() {
  const allPlayerFinished = (battleState.currentIndex + 1 >= battleState.questions.length && battleState.userAnswers[battleState.currentIndex] !== undefined);
  const allOpponentFinished = (battleState.opponentScore >= battleState.questions.length || Math.random() > 0.95);
  
  if (allPlayerFinished && allOpponentFinished) {
    // Stop timers
    if (battleState.opponentActionTimer) clearInterval(battleState.opponentActionTimer);
    
    // Grade match
    const victory = battleState.playerScore > battleState.opponentScore;
    const tie = battleState.playerScore === battleState.opponentScore;
    
    const viewport = document.getElementById('social-tab-viewport');
    
    let xpAward = 20; // draw or loss
    if (victory) {
      xpAward = 50;
      AppState.addXp(50);
    } else {
      AppState.addXp(20);
    }
    
    viewport.innerHTML = `
      <div class="glass-card battle-lobby-card">
        <div class="q-finished-trophy" style="background:${victory ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' : 'linear-gradient(135deg, #475569, #1e293b)'};">
          <i data-lucide="${victory ? 'crown' : 'frown'}"></i>
        </div>
        
        <h2 style="font-family:var(--font-heading); font-size:2rem; font-weight:900; color:${victory ? 'var(--color-secondary)' : 'var(--color-text-primary)'};">
          ${victory ? 'KEMENANGAN!' : tie ? 'PERANDINGAN SERI' : 'KEKALAHAN'}
        </h2>
        
        <p style="color:var(--color-text-secondary); max-width:400px; margin-bottom:15px;">
          Pertandingan melawan <strong>${battleState.opponentName}</strong> selesai dengan skor akhir:
        </p>
        
        <div style="display:flex; justify-content:center; gap:40px; font-size:1.6rem; font-weight:800; margin-bottom:20px;">
          <div>
            <div style="color:var(--color-primary);">${battleState.playerScore}</div>
            <div style="font-size:0.75rem; color:var(--color-text-muted);">SKOR SAYA</div>
          </div>
          <div style="color:var(--color-text-muted); font-style:italic;">vs</div>
          <div>
            <div style="color:var(--color-secondary);">${battleState.opponentScore}</div>
            <div style="font-size:0.75rem; color:var(--color-text-muted);">SKOR LAWAN</div>
          </div>
        </div>
        
        <div style="font-size:0.95rem; color:var(--color-accent); font-weight:700; margin-bottom:20px;">
          +${xpAward} XP Belajar Diperoleh
        </div>
        
        <button class="btn btn-primary" onclick="quitBattle()"><i data-lucide="check"></i> Lanjutkan</button>
      </div>
    `;
    
    triggerConfettiCelebration();
    lucide.createIcons();
  }
}

function quitBattle() {
  if (battleState.opponentActionTimer) clearInterval(battleState.opponentActionTimer);
  battleState.active = false;
  selectSocialTab('battle');
}


/* ================= 2. DISCUSSION FORUMS ================= */
function renderForumTab(viewport) {
  const posts = AppState.getForumPosts();
  
  viewport.innerHTML = `
    <div class="forum-split-layout">
      <!-- Main Feed -->
      <div class="forum-feed">
        ${posts.map(post => `
          <div class="glass-card forum-card">
            <div class="forum-card-header">
              <span class="forum-card-author">${post.author} (${post.university})</span>
              <span><i data-lucide="message-circle" style="width:12px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> ${post.replies.length} Balasan</span>
            </div>
            
            <h3 class="forum-card-title" onclick="viewForumPost('${post.id}')">${post.title}</h3>
            <p class="forum-card-body">${post.content.length > 180 ? post.content.substring(0, 180) + "..." : post.content}</p>
            
            <div class="forum-card-actions">
              <button class="forum-action-btn" onclick="upvotePost('${post.id}')">
                <i data-lucide="thumbs-up"></i> Upvote (${post.upvotes})
              </button>
              <button class="forum-action-btn" onclick="viewForumPost('${post.id}')">
                <i data-lucide="reply"></i> Buka Diskusi
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- Thread Creator Panel (Sidebar) -->
      <aside>
        <div class="glass-card">
          <h4 style="font-family:var(--font-heading); font-size:1.1rem; font-weight:800; color:var(--color-primary); margin-bottom:15px;"><i data-lucide="plus-circle"></i> Mulai Diskusi Baru</h4>
          <form id="new-thread-form" onsubmit="submitNewThread(event)">
            <div class="form-group">
              <label for="thread-title">Judul Topik</label>
              <input type="text" id="thread-title" placeholder="Contoh: Arti akhiran -an pada kata makanan" required>
            </div>
            <div class="form-group">
              <label for="thread-content">Deskripsi</label>
              <textarea id="thread-content" style="min-height:100px; resize:vertical; font-size:0.85rem;" placeholder="Jelaskan pertanyaan atau pendapat Anda dengan lengkap..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;"><i data-lucide="send"></i> Publikasikan</button>
          </form>
        </div>
      </aside>
    </div>
  `;
}

function viewForumPost(postId) {
  const posts = AppState.getForumPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  
  const viewport = document.getElementById('social-tab-viewport');
  
  viewport.innerHTML = `
    <div class="glass-card" style="padding:30px;">
      <button class="btn btn-secondary" style="padding:6px 12px; font-size:0.8rem; margin-bottom:20px;" onclick="selectSocialTab('forum')"><i data-lucide="arrow-left"></i> Kembali ke Forum</button>
      
      <div class="forum-detail-post">
        <div class="forum-card-header" style="margin-bottom:15px;">
          <strong style="color:var(--color-accent);">${post.author}</strong> dari ${post.university}
        </div>
        <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:800; margin-bottom:12px;">${post.title}</h2>
        <p style="font-size:0.95rem; line-height:1.6; color:var(--color-text-secondary); white-space:pre-line;">${post.content}</p>
      </div>
      
      <h4 style="font-family:var(--font-heading); font-size:1.1rem; font-weight:800; margin-bottom:15px;">Tanggapan Perguruan Tinggi (${post.replies.length})</h4>
      
      <div class="forum-replies-list">
        ${post.replies.map(rep => `
          <div class="reply-item-card">
            <div class="reply-item-header">
              <strong>${rep.author} (${rep.university})</strong>
            </div>
            <p style="color:var(--color-text-secondary); line-height:1.4;">${rep.content}</p>
          </div>
        `).join('')}
        ${post.replies.length === 0 ? `<p style="color:var(--color-text-muted); font-style:italic; padding:10px;">Belum ada balasan. Jadilah yang pertama menjawab!</p>` : ''}
      </div>
      
      <div style="border-top: 1px solid var(--color-card-border); padding-top:20px;">
        <h4 style="font-family:var(--font-heading); font-size:1rem; font-weight:800; margin-bottom:12px;">Tulis Tanggapan Anda</h4>
        <form id="reply-form" onsubmit="submitForumReply(event, '${post.id}')">
          <div class="form-group">
            <textarea id="reply-text" style="min-height:80px; font-size:0.85rem;" placeholder="Ketik jawaban akademis Anda di sini..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary"><i data-lucide="send"></i> Balas</button>
        </form>
      </div>
    </div>
  `;
  
  lucide.createIcons();
}

function upvotePost(id) {
  AppState.upvotePost(id);
  selectSocialTab('forum');
}

function submitForumReply(e, postId) {
  e.preventDefault();
  const textEl = document.getElementById('reply-text');
  if (!textEl) return;
  
  AppState.addForumReply(postId, textEl.value.trim());
  viewForumPost(postId);
  triggerUINotification("Tanggapan Dikirim", "Kontribusi diskusi Anda telah dicatat.");
}

function submitNewThread(e) {
  e.preventDefault();
  const title = document.getElementById('thread-title').value.trim();
  const content = document.getElementById('thread-content').value.trim();
  
  AppState.addForumPost(title, content);
  selectSocialTab('forum');
  triggerUINotification("Topik Baru Dibuat", "Diskusi Anda sekarang terlihat secara nasional.");
}


/* ================= 3. KELOMPOK BELAJAR ================= */
const STUDY_GROUPS_DATABASE = [
  { id: "grp-ui", name: "Sastra Indonesia UI", members: 48, desc: "Kelompok diskusi telaah sastra klasik Melayu, ejaan baku, dan kajian prosa kontemporer." },
  { id: "grp-itb", name: "Teknik Menulis Ilmiah ITB", members: 36, desc: "Fokus pada penyusunan abstrak berbahasa Indonesia, penulisan sitasi, dan logika kalimat efektif." },
  { id: "grp-ugm", name: "Klub Debat Bahasa UGM", members: 42, desc: "Latihan pidato kepemimpinan formal, sanggahan argumentasi baku, dan retorika kebahasaan." }
];

const MOCK_CHAT_MESSAGES = {
  "grp-ui": [
    { author: "Hendra_ITB", text: "Kira-kira di ujian skripsi nanti, bab pembahasan dituntut pakai ragam bahasa apa ya?" },
    { author: "Rani_UGM", text: "Wajib ragam formal. Hindari kata-kata populer seperti 'bikin', 'gimana', atau 'banget'. Ganti dengan 'membuat', 'bagaimana', 'sangat'." }
  ],
  "grp-itb": [
    { author: "Siti_UNJ", text: "Teman-teman, penulisan kata 'analisa' itu yang baku 'analisis' atau 'analisa'?" },
    { author: "Budi_UGM", text: "Yang baku adalah 'analisis'. Penyerapan akhiran -ysis bahasa Inggris diubah jadi -isis." }
  ],
  "grp-ugm": [
    { author: "Dewi_Airlangga", text: "Selamat pagi! Adakah yang punya referensi materi teknik berpidato di sidang adat?" },
    { author: "Hendra_ITB", text: "Coba cek buku panduan retorika karya Gorys Keraf, itu sangat lengkap dan tata bahasanya terstruktur." }
  ]
};

function renderGroupsTab(viewport) {
  if (activeGroupChat) {
    renderGroupChatBox(viewport);
    return;
  }
  
  viewport.innerHTML = `
    <div class="group-grid">
      ${STUDY_GROUPS_DATABASE.map(group => `
        <div class="glass-card group-card">
          <div class="group-card-header">
            <span class="group-member-count">${group.members} Anggota</span>
            <i data-lucide="users" style="color:var(--color-primary);"></i>
          </div>
          
          <h3 class="group-card-name">${group.name}</h3>
          <p class="group-card-desc">${group.desc}</p>
          
          <button class="btn btn-secondary" onclick="openStudyGroupChat('${group.id}')" style="margin-top:10px;"><i data-lucide="message-square"></i> Masuk Ruang Obrolan</button>
        </div>
      `).join('')}
    </div>
  `;
}

function openStudyGroupChat(groupId) {
  activeGroupChat = STUDY_GROUPS_DATABASE.find(g => g.id === groupId);
  selectSocialTab('groups');
}

function renderGroupChatBox(viewport) {
  const g = activeGroupChat;
  const msgs = MOCK_CHAT_MESSAGES[g.id] || [];
  
  viewport.innerHTML = `
    <div class="glass-card" style="padding:24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-card-border); padding-bottom:15px; margin-bottom:20px;">
        <div>
          <h3 style="font-family:var(--font-heading); font-weight:800; font-size:1.2rem; color:var(--color-primary);">${g.name}</h3>
          <span style="font-size:0.75rem; color:var(--color-text-muted);">${g.members} anggota terhubung secara real-time</span>
        </div>
        <button class="btn btn-secondary" style="padding:6px 12px; font-size:0.8rem;" onclick="activeGroupChat = null; selectSocialTab('groups')"><i data-lucide="arrow-left"></i> Kembali</button>
      </div>
      
      <!-- Chat Dialogue Container -->
      <div class="group-chat-box">
        <div class="group-chat-msg-list" id="group-msg-list">
          ${msgs.map(m => `
            <div class="group-chat-bubble">
              <div class="group-chat-bubble-author">${m.author}</div>
              <div>${m.text}</div>
            </div>
          `).join('')}
        </div>
        
        <!-- Text Input -->
        <div class="chat-input-bar">
          <input type="text" class="chat-input" id="group-chat-text-input" placeholder="Tulis pesan ke kelompok..." onkeydown="if(event.key === 'Enter') sendGroupChatMessage()">
          <button class="btn btn-primary" onclick="sendGroupChatMessage()" style="width:40px; height:40px; border-radius:50%; padding:0;"><i data-lucide="send"></i></button>
        </div>
      </div>
    </div>
  `;
  
  // Scroll message list to bottom
  const msgList = document.getElementById('group-msg-list');
  if (msgList) msgList.scrollTop = msgList.scrollHeight;
  
  lucide.createIcons();
}

function sendGroupChatMessage() {
  const inp = document.getElementById('group-chat-text-input');
  if (!inp) return;
  
  const text = inp.value.trim();
  if (!text) return;
  
  const user = AppState.getUser();
  
  // Add to mock dataset
  if (!MOCK_CHAT_MESSAGES[activeGroupChat.id]) MOCK_CHAT_MESSAGES[activeGroupChat.id] = [];
  MOCK_CHAT_MESSAGES[activeGroupChat.id].push({
    author: user.username,
    text: text
  });
  
  inp.value = "";
  
  // Re-render chat dialogue
  const viewport = document.getElementById('social-tab-viewport');
  renderGroupChatBox(viewport);
}
