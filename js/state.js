/* Global State Manager for BahasaMaster Indonesia */

const DEFAULT_QUESTIONS = [
  // BEGINNER (PEMULA)
  {
    id: "pemula-mc-1",
    level: "pemula",
    category: "kosa-kata",
    type: "multiple-choice",
    question: "Apa terjemahan yang tepat dari kata 'Selamat Pagi' dalam bahasa Inggris?",
    options: ["Good afternoon", "Good morning", "Good night", "Goodbye"],
    answer: "Good morning",
    explanation: "Kata 'Selamat Pagi' diucapkan dari terbit matahari sampai jam 11:00, yang dalam bahasa Inggris diterjemahkan menjadi 'Good morning'.",
    vocabBreakdown: { "Selamat": "Safe/congratulations", "Pagi": "Morning" },
    grammarExplanation: "Ucapan sapaan waktu dalam bahasa Indonesia biasanya tersusun atas kata 'Selamat' + [nama waktu].",
    tip: "Gunakan sapaan ini saat pertama kali bertemu seseorang di pagi hari."
  },
  {
    id: "pemula-fitb-1",
    level: "pemula",
    category: "tata-bahasa",
    type: "fill-blank",
    question: "Saya ___ mahasiswa baru di Universitas Indonesia.",
    blankAnswer: "adalah",
    hint: "Kata penghubung penjelas subjek (to be dalam bahasa Inggris)",
    explanation: "Kata 'adalah' digunakan sebagai kopula untuk mendefinisikan identitas subjek 'Saya' sebagai 'mahasiswa baru'.",
    vocabBreakdown: { "Saya": "I / me", "Mahasiswa": "College student", "Baru": "New" },
    grammarExplanation: "Pola kalimat nominal dalam bahasa Indonesia: Subjek + Kopula (adalah) + Predikat nominal.",
    tip: "Dalam percakapan informal, 'adalah' sering dihilangkan (misal: 'Saya mahasiswa baru')."
  },
  {
    id: "pemula-sa-1",
    level: "pemula",
    category: "tata-bahasa",
    type: "sentence-arrangement",
    question: "Susunlah kata-kata berikut menjadi kalimat yang benar!",
    words: ["Buku", "perpustakaan", "membaca", "di", "Saya"],
    correctOrder: ["Saya", "membaca", "Buku", "di", "perpustakaan"],
    explanation: "Struktur standar kalimat dalam bahasa Indonesia adalah Subjek (Saya) + Predikat (membaca) + Objek (Buku) + Keterangan Tempat (di perpustakaan).",
    vocabBreakdown: { "Membaca": "To read", "Perpustakaan": "Library" },
    grammarExplanation: "Struktur SPOK (Subjek, Predikat, Objek, Keterangan) adalah aturan tata bahasa paling dasar.",
    tip: "Keterangan tempat selalu diawali dengan kata depan seperti 'di', 'ke', atau 'dari'."
  },
  
  // INTERMEDIATE (MENENGAH)
  {
    id: "menengah-rc-1",
    level: "menengah",
    category: "membaca",
    type: "reading-comprehension",
    passage: "Candi Borobudur merupakan candi Buddha terbesar di dunia yang terletak di Magelang, Jawa Tengah. Candi ini dibangun pada abad ke-8 oleh Dinasti Syailendra. Struktur Borobudur berbentuk punden berundak yang terdiri dari sembilan teras. Setiap tahun, jutaan wisatawan dan umat Buddha berkumpul di sini untuk merayakan Hari Waisak.",
    question: "Kapan Candi Borobudur dibangun dan oleh siapa?",
    options: [
      "Abad ke-8 oleh Dinasti Sanjaya",
      "Abad ke-8 oleh Dinasti Syailendra",
      "Abad ke-9 oleh Dinasti Syailendra",
      "Abad ke-7 oleh Kerajaan Mataram"
    ],
    answer: "Abad ke-8 oleh Dinasti Syailendra",
    explanation: "Berdasarkan teks, Candi Borobudur dibangun pada abad ke-8 oleh Dinasti Syailendra.",
    vocabBreakdown: { "Candi": "Temple", "Terbesar": "Largest (ter- prefix = most)", "Punden berundak": "Stepped pyramid" },
    grammarExplanation: "Imbuhan 'ter-' pada kata 'terbesar' berfungsi membentuk kata sifat tingkat paling (superlatif).",
    tip: "Perhatikan kata kunci kronologi (abad) dan subjek dinasti pada paragraf pertama."
  },
  {
    id: "menengah-listen-1",
    level: "menengah",
    category: "mendengar",
    type: "listening",
    textToSpeak: "Presiden Joko Widodo meresmikan MRT Jakarta fase pertama pada tahun 2019.",
    question: "Tahun berapa MRT Jakarta fase pertama diresmikan berdasarkan audio?",
    options: ["2017", "2018", "2019", "2020"],
    answer: "2019",
    explanation: "Audio menyebutkan bahwa Presiden meresmikan MRT Jakarta fase pertama pada tahun 2019.",
    vocabBreakdown: { "Meresmikan": "To officially inaugurate", "Fase": "Phase" },
    grammarExplanation: "Kata 'meresmikan' dibentuk dari kata dasar 'resmi' (official) dengan imbuhan 'me-kan' yang menyatakan tindakan aktif transitif.",
    tip: "Gunakan tombol dengarkan berulang kali jika Anda melewatkan angkanya."
  },
  {
    id: "menengah-match-1",
    level: "menengah",
    category: "kosa-kata",
    type: "matching",
    question: "Pasangkan kata-kata bahasa Indonesia berikut dengan padanan artinya!",
    pairs: [
      { left: "Gawai", right: "Gadget" },
      { left: "Tetikus", right: "Mouse (computer)" },
      { left: "Pramusiwi", right: "Babysitter" },
      { left: "Luring", right: "Offline" }
    ],
    explanation: "Bahasa Indonesia memiliki istilah resmi untuk teknologi modern: Gawai (Gadget), Tetikus (Mouse), Luring (Luar Jaringan / Offline), Pramusiwi (Babysitter).",
    vocabBreakdown: {},
    grammarExplanation: "Istilah teknologi ini umumnya diserap atau diterjemahkan melalui proses pembentukan istilah oleh Pusat Bahasa.",
    tip: "Padanan istilah teknologi baru biasanya berupa singkatan atau perpaduan kata (contoh: luring = luar jaringan)."
  },

  // ADVANCED (MAHIR)
  {
    id: "mahir-gc-1",
    level: "mahir",
    category: "tata-bahasa",
    type: "grammar-correction",
    question: "Tentukan bagian kata yang salah dalam kalimat berikut: 'Mereka saling pukul-memukul di depan kelas.'",
    sentence: "Mereka saling pukul-memukul di depan kelas.",
    incorrectWord: "saling pukul-memukul",
    correctSuggestion: "saling pukul ATAU pukul-memukul",
    explanation: "Kalimat ini mengalami pleonasme (pemborosan kata). Kata 'saling' sudah bermakna timbal balik, begitu pula dengan bentuk reduplikasi 'pukul-memukul'. Seharusnya pilih salah satu.",
    vocabBreakdown: { "Saling": "Each other", "Pukul-memukul": "Hitting each other" },
    grammarExplanation: "Konstruksi 'saling + kata kerja reduplikasi bermakna resiprokal' dinilai tidak baku. Cukup gunakan 'saling pukul' atau 'pukul-memukul'.",
    tip: "Hindari penggunaan dua penanda resiprokal secara bersamaan."
  },
  {
    id: "mahir-tf-1",
    level: "mahir",
    category: "budaya",
    type: "true-false",
    question: "Apakah sistem kekerabatan adat Minangkabau di Sumatra Barat menganut sistem patrilineal (garis keturunan ayah)?",
    answer: "False",
    explanation: "Suku Minangkabau menganut sistem matrilineal (garis keturunan ibu), menjadikannya salah satu masyarakat matrilineal terbesar di dunia.",
    vocabBreakdown: { "Kekerabatan": "Kinship", "Menganut": "To adhere to / adopt" },
    grammarExplanation: "Kata 'kekerabatan' berasal dari kata dasar 'kerabat' (relative) mendapat konfiks 'ke-an' yang membentuk kata benda abstrak.",
    tip: "Budaya Indonesia sangat beragam; matrilineal Minangkabau adalah salah satu materi sosiokultural yang sering muncul dalam ujian bahasa."
  },

  // EXPERT (PROFESIONAL)
  {
    id: "profesional-essay-1",
    level: "profesional",
    category: "tata-bahasa",
    type: "essay",
    question: "Tuliskan pendapat singkat Anda (minimal 3 kalimat) mengenai urgensi pelestarian bahasa daerah di era globalisasi menggunakan ragam bahasa formal (baku)!",
    hint: "Gunakan kata hubung logis (namun, oleh karena itu, selain itu) dan ejaan yang disempurnakan (EYD).",
    explanation: "Tulisan dinilai berdasarkan ketepatan EYD, kekayaan kosakata akademik (urgensi, melestarikan, jati diri), dan koherensi paragraf.",
    vocabBreakdown: { "Urgensi": "Urgency", "Pelestarian": "Preservation", "Ragam bahasa": "Language register" },
    grammarExplanation: "Ragam bahasa baku menuntut penggunaan kalimat efektif, tidak rancu, kata berimbuhan lengkap, dan struktur kalimat subjek-predikat yang jelas.",
    tip: "Gunakan kata-kata transisi formal untuk menghubungkan kalimat."
  }
];

const INITIAL_STATE = {
  user: {
    username: "Mahasiswa Indonesia",
    university: "Universitas Indonesia",
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    streak: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    points: 150,
    badges: ["pioneer"], // Starts with a pioneer badge
    quizHistory: [],
    certificates: []
  },
  questions: DEFAULT_QUESTIONS,
  leaderboard: [
    { name: "Andi Wijaya", university: "Universitas Indonesia", xp: 1250, level: 8 },
    { name: "Siti Rahma", university: "Institut Teknologi Bandung", xp: 1100, level: 7 },
    { name: "Budi Santoso", university: "Universitas Gadjah Mada", xp: 950, level: 6 },
    { name: "Dewi Lestari", university: "Universitas Airlangga", xp: 820, level: 5 },
    { name: "Rian Hidayat", university: "Universitas Padjadjaran", xp: 710, level: 5 },
    { name: "Mahasiswa Indonesia", university: "Universitas Indonesia", xp: 0, level: 1 } // Will sync with user
  ],
  forumPosts: [
    {
      id: "post-1",
      title: "Perbedaan imbuhan me-kan dan me-i",
      author: "Hendra_ITB",
      university: "Institut Teknologi Bandung",
      content: "Halo teman-teman, ada yang bisa menjelaskan dengan detail kapan kita memakai -kan dan -i? Kadang masih bingung membedakan antara 'memasukkan' dan 'memasuki'. Terima kasih!",
      upvotes: 18,
      replies: [
        {
          author: "Bu_Dewi",
          university: "Universitas Negeri Jakarta (Dosen)",
          content: "Secara umum, akhiran '-i' biasanya menunjukkan objeknya diam (lokatif) atau perbuatan dilakukan berulang kali. Sedangkan '-kan' menunjukkan objeknya bergerak (kausatif). Contoh: 'memasuki kamar' (kamarnya diam, kita masuk ke dalamnya) vs 'memasukkan buku' (bukunya digerakkan masuk ke dalam tas). Semoga membantu!",
          upvotes: 24
        }
      ]
    },
    {
      id: "post-2",
      title: "Rekomendasi buku tata bahasa Indonesia formal",
      author: "Rani_UGM",
      university: "Universitas Gadjah Mada",
      content: "Apakah ada rekomendasi buku referensi EYD V terbaru yang mudah dipahami mahasiswa? Mau persiapan ujian sidang.",
      upvotes: 12,
      replies: []
    }
  ]
};

class StateManager {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem('bahasamaster_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Make sure user statistics exist
        if (parsed.user && parsed.questions) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved state, resetting to default", e);
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  saveState() {
    // Sync current user info with their leaderboard entry
    const userIndex = this.state.leaderboard.findIndex(p => p.name === this.state.user.username);
    if (userIndex !== -1) {
      this.state.leaderboard[userIndex].xp = this.state.user.xp;
      this.state.leaderboard[userIndex].level = this.state.user.level;
      this.state.leaderboard[userIndex].university = this.state.user.university;
    } else {
      this.state.leaderboard.push({
        name: this.state.user.username,
        university: this.state.user.university,
        xp: this.state.user.xp,
        level: this.state.user.level
      });
    }

    // Sort leaderboard by XP desc
    this.state.leaderboard.sort((a, b) => b.xp - a.xp);

    localStorage.setItem('bahasamaster_state', JSON.stringify(this.state));
    
    // Dispatch global event for parts of the app to re-render dynamically
    window.dispatchEvent(new CustomEvent('stateupdated', { detail: this.state }));
  }

  getUser() {
    return this.state.user;
  }

  getQuestions() {
    return this.state.questions;
  }

  getLeaderboard() {
    return this.state.leaderboard;
  }

  getForumPosts() {
    return this.state.forumPosts;
  }

  // Set Profile details
  updateProfile(username, university) {
    // Update matching name in leaderboard
    const oldName = this.state.user.username;
    const userIndex = this.state.leaderboard.findIndex(p => p.name === oldName);
    if (userIndex !== -1) {
      this.state.leaderboard[userIndex].name = username;
    }
    
    this.state.user.username = username;
    this.state.user.university = university;
    this.saveState();
  }

  // Add XP and points, handle leveling up
  addXp(amount) {
    this.state.user.xp += amount;
    this.state.user.points += Math.round(amount / 2);
    
    // Check level up (each level takes level * 100 XP)
    let leveledUp = false;
    while (this.state.user.xp >= this.state.user.xpToNextLevel) {
      this.state.user.xp -= this.state.user.xpToNextLevel;
      this.state.user.level += 1;
      this.state.user.xpToNextLevel = this.state.user.level * 100;
      leveledUp = true;
    }
    
    if (leveledUp) {
      this.checkAchievements();
      // Dispatch Level Up event
      window.dispatchEvent(new CustomEvent('levelup', { detail: { level: this.state.user.level } }));
    }
    
    this.saveState();
    return leveledUp;
  }

  // Increment daily streak
  incrementStreak() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (this.state.user.lastActiveDate === yesterday) {
      this.state.user.streak += 1;
      this.state.user.lastActiveDate = today;
      this.checkAchievements();
      this.saveState();
      return true;
    } else if (this.state.user.lastActiveDate !== today) {
      this.state.user.streak = 1;
      this.state.user.lastActiveDate = today;
      this.saveState();
      return true;
    }
    return false;
  }

  // Add item to quiz history
  logQuizCompletion(quizCategory, score, totalQuestions, xpEarned) {
    const historyItem = {
      id: "history-" + Date.now(),
      category: quizCategory,
      score: score,
      total: totalQuestions,
      xp: xpEarned,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    
    this.state.user.quizHistory.unshift(historyItem); // Add to start
    
    // Cap history at 20 items
    if (this.state.user.quizHistory.length > 20) {
      this.state.user.quizHistory.pop();
    }
    
    this.checkAchievements();
    this.saveState();
  }

  // Add a Certificate
  issueCertificate(title, category, level) {
    // Check if certificate already exists
    const exists = this.state.user.certificates.some(c => c.category === category && c.level === level);
    if (!exists) {
      const cert = {
        id: "cert-" + Date.now(),
        title: title,
        category: category,
        level: level,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        serialNumber: "BM-" + Math.floor(100000 + Math.random() * 900000)
      };
      this.state.user.certificates.push(cert);
      this.checkAchievements();
      this.saveState();
      return cert;
    }
    return null;
  }

  // Check achievements requirements
  checkAchievements() {
    const badges = this.state.user.badges;
    
    // 1. Streak badge: 5 Days (expert_streak)
    if (this.state.user.streak >= 5 && !badges.includes("streak_5")) {
      badges.push("streak_5");
      this.triggerBadgeNotification("Sobat Konsisten", "Berhasil menjaga streak belajar selama 5 hari berturut-turut!");
    }
    
    // 2. Quiz count badge: 5 Quizzes (quizmaster)
    if (this.state.user.quizHistory.length >= 5 && !badges.includes("quiz_5")) {
      badges.push("quiz_5");
      this.triggerBadgeNotification("Ksatria Kuis", "Telah menyelesaikan 5 kuis interaktif.");
    }
    
    // 3. Level milestone badge: Level 5 (level_5)
    if (this.state.user.level >= 5 && !badges.includes("level_5")) {
      badges.push("level_5");
      this.triggerBadgeNotification("Cendekiawan Muda", "Telah mencapai level belajar 5.");
    }

    // 4. Perfect Score badge (100% on a quiz)
    const hasPerfectScore = this.state.user.quizHistory.some(h => h.score === h.total);
    if (hasPerfectScore && !badges.includes("perfect_score")) {
      badges.push("perfect_score");
      this.triggerBadgeNotification("Pujangga Sempurna", "Mendapatkan skor 100% pada kuis.");
    }
  }

  triggerBadgeNotification(title, desc) {
    // Dispatch alert event for app to show a custom glassmorphism modal celebration
    window.dispatchEvent(new CustomEvent('badgeearned', { detail: { title, desc } }));
  }

  // Add Question CRUD
  addQuestion(questionObj) {
    questionObj.id = "custom-" + Date.now();
    this.state.questions.push(questionObj);
    this.saveState();
  }

  editQuestion(id, updatedObj) {
    const idx = this.state.questions.findIndex(q => q.id === id);
    if (idx !== -1) {
      this.state.questions[idx] = { ...this.state.questions[idx], ...updatedObj };
      this.saveState();
    }
  }

  deleteQuestion(id) {
    this.state.questions = this.state.questions.filter(q => q.id !== id);
    this.saveState();
  }

  // Forum interactions
  addForumPost(title, content) {
    const post = {
      id: "post-" + Date.now(),
      title: title,
      content: content,
      author: this.state.user.username,
      university: this.state.user.university,
      upvotes: 0,
      replies: []
    };
    this.state.forumPosts.unshift(post);
    this.saveState();
  }

  upvotePost(id) {
    const post = this.state.forumPosts.find(p => p.id === id);
    if (post) {
      post.upvotes += 1;
      this.saveState();
    }
  }

  addForumReply(postId, content) {
    const post = this.state.forumPosts.find(p => p.id === postId);
    if (post) {
      post.replies.push({
        author: this.state.user.username,
        university: this.state.user.university,
        content: content,
        upvotes: 0
      });
      this.saveState();
    }
  }
}

// Instantiate and attach globally
const AppState = new StateManager();
window.AppState = AppState;
