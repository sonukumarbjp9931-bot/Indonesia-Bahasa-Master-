/* Main Application entry & Router */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Initialize SPA Routing
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // Run once on load
  
  // Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  const bodyEl = document.body;
  const sunIcon = document.getElementById('theme-sun-icon');
  const moonIcon = document.getElementById('theme-moon-icon');
  
  // Load saved theme
  const savedTheme = localStorage.getItem('bahasamaster_theme') || 'dark';
  if (savedTheme === 'light') {
    bodyEl.classList.add('light-theme');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }

  themeToggleBtn.addEventListener('click', () => {
    bodyEl.classList.toggle('light-theme');
    const isLight = bodyEl.classList.contains('light-theme');
    localStorage.setItem('bahasamaster_theme', isLight ? 'light' : 'dark');
    
    if (isLight) {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  });

  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-visible');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-visible');
    });
  });

  // Profile Edit modal binding
  const profileEditBtn = document.getElementById('profile-edit-btn');
  const profileModal = document.getElementById('profile-modal');
  const profileForm = document.getElementById('profile-form');
  const profileUserInp = document.getElementById('profile-username');
  const profileUniInp = document.getElementById('profile-university');

  profileEditBtn.addEventListener('click', () => {
    const user = AppState.getUser();
    profileUserInp.value = user.username;
    profileUniInp.value = user.university;
    profileModal.classList.add('active');
  });

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    AppState.updateProfile(profileUserInp.value, profileUniInp.value);
    profileModal.classList.remove('active');
    triggerUINotification("Profil Berhasil Diperbarui", "Selamat belajar kembali!");
  });

  // State update event binding
  window.addEventListener('stateupdated', (e) => {
    updateNavStats(e.detail.user);
  });

  // Level up custom event binding
  window.addEventListener('levelup', (e) => {
    const levelNum = e.detail.level;
    document.getElementById('levelup-level-num').innerText = `Level ${levelNum}`;
    document.getElementById('levelup-modal').classList.add('active');
    triggerConfettiCelebration();
  });

  // Badge earned custom event binding
  window.addEventListener('badgeearned', (e) => {
    const { title, desc } = e.detail;
    document.getElementById('badge-title-txt').innerText = title;
    document.getElementById('badge-desc-txt').innerText = desc;
    document.getElementById('badge-modal').classList.add('active');
    triggerConfettiCelebration();
  });

  // Initial stats render
  updateNavStats(AppState.getUser());

  // Run particle background
  initParticles();

  // Create initial icons
  lucide.createIcons();
}

// Update navbar chips
function updateNavStats(user) {
  document.getElementById('nav-streak').innerText = user.streak;
  document.getElementById('nav-xp').innerText = user.xp + (user.level > 1 ? (user.level - 1) * 100 : 0); // Total cumulative XP
}

// Router logic
function handleRoute() {
  const hash = window.location.hash || '#home';
  const viewName = hash.substring(1);
  
  // Hide all sections, show target
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });
  
  const targetSection = document.getElementById(`${viewName}-view`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Update nav link active state
  document.querySelectorAll('.nav-links .nav-item').forEach(item => {
    if (item.getAttribute('data-view') === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Trigger page specific loading functions
  if (viewName === 'home') {
    renderHomeView();
  } else if (viewName === 'quiz') {
    if (window.initQuizView) window.initQuizView();
  } else if (viewName === 'dashboard') {
    if (window.initDashboardView) window.initDashboardView();
  } else if (viewName === 'tutor') {
    if (window.initTutorView) window.initTutorView();
  } else if (viewName === 'social') {
    if (window.initSocialView) window.initSocialView();
  } else if (viewName === 'admin') {
    if (window.initAdminView) window.initAdminView();
  }

  window.scrollTo(0, 0);
  lucide.createIcons();
}

// Render Homepage dynamically
function renderHomeView() {
  const user = AppState.getUser();
  const container = document.getElementById('home-view');
  
  container.innerHTML = `
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-info">
        <div class="hero-tag">Aplikasi EdTech Mahasiswa</div>
        <h1 class="hero-headline">Kuasai Bahasa Indonesia Dengan Cerdas</h1>
        <p class="hero-subheadline">Tingkatkan tata bahasa, pemahaman membaca, dan kemampuan menulis akademik Anda melalui kuis interaktif berstandar nasional yang disesuaikan untuk kebutuhan perguruan tinggi.</p>
        <div class="hero-actions">
          <a href="#quiz" class="btn btn-primary"><i data-lucide="play"></i> Mulai Belajar</a>
          <button onclick="takePlacementTest()" class="btn btn-secondary"><i data-lucide="compass"></i> Tes Penempatan</button>
        </div>
      </div>
      
      <div class="hero-visuals">
        <!-- Floating cards -->
        <div class="glass-card floating-card fc-1">
          <div class="floating-card-header">
            <span>Pemula (Lvl 1)</span>
            <i data-lucide="award" style="color: var(--color-primary);"></i>
          </div>
          <div class="floating-card-title">Apa lawan kata dari 'Tesis'?</div>
          <div class="floating-card-options">
            <div class="floating-card-opt">Hipotesis</div>
            <div class="floating-card-opt correct">Antitesis</div>
            <div class="floating-card-opt">Sintesis</div>
          </div>
        </div>
        
        <div class="glass-card floating-card fc-2">
          <div class="floating-card-header">
            <span>Mahir (Lvl 5)</span>
            <i data-lucide="trending-up" style="color: var(--color-accent);"></i>
          </div>
          <div class="floating-card-title">Cari padanan kata 'Gawai':</div>
          <div class="floating-card-options">
            <div class="floating-card-opt active">Gadget</div>
            <div class="floating-card-opt">Online</div>
            <div class="floating-card-opt">Software</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Section -->
    <div class="section-spacer">
      <div class="stats-grid">
        <div class="glass-card stat-card interactive">
          <div class="stat-card-icon"><i data-lucide="book-open"></i></div>
          <div class="stat-card-number" data-target="50000">50,000+</div>
          <div class="stat-card-label">Soal Latihan</div>
        </div>
        <div class="glass-card stat-card interactive">
          <div class="stat-card-icon"><i data-lucide="users-2"></i></div>
          <div class="stat-card-number" data-target="20000">20,000+</div>
          <div class="stat-card-label">Mahasiswa Aktif</div>
        </div>
        <div class="glass-card stat-card interactive">
          <div class="stat-card-icon"><i data-lucide="school"></i></div>
          <div class="stat-card-number" data-target="500">500+</div>
          <div class="stat-card-label">Kampus Terdaftar</div>
        </div>
        <div class="glass-card stat-card interactive">
          <div class="stat-card-icon"><i data-lucide="smile"></i></div>
          <div class="stat-card-number" data-target="95">95%</div>
          <div class="stat-card-label">Tingkat Kepuasan</div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="section-spacer">
      <div class="section-header">
        <div class="section-subtitle">Fitur Utama</div>
        <h2 class="section-title">Metode Belajar Bahasa Masa Kini</h2>
      </div>
      
      <div class="features-grid">
        <div class="glass-card feature-card">
          <div class="feature-card-icon"><i data-lucide="languages"></i></div>
          <h3 class="feature-card-title">Vocabulary Mastery</h3>
          <p class="feature-card-desc">Pelajari padanan kosakata formal, istilah serapan sains, dan diksi jurnalistik Indonesia.</p>
        </div>
        <div class="glass-card feature-card">
          <div class="feature-card-icon"><i data-lucide="pencil-ruler"></i></div>
          <h3 class="feature-card-title">Grammar Excellence</h3>
          <p class="feature-card-desc">Latihan struktur kalimat baku (SPOK), pleonasme, penulisan imbuhan me-kan/me-i, dan ejaan EYD V.</p>
        </div>
        <div class="glass-card feature-card">
          <div class="feature-card-icon"><i data-lucide="text-quote"></i></div>
          <h3 class="feature-card-title">Reading Comprehension</h3>
          <p class="feature-card-desc">Pahami wacana akademis tingkat tinggi, jurnal ilmiah, esai, opini, dan telaah teks klasik.</p>
        </div>
        <div class="glass-card feature-card">
          <div class="feature-card-icon"><i data-lucide="ear"></i></div>
          <h3 class="feature-card-title">Listening Comprehension</h3>
          <p class="feature-card-desc">Uji pemahaman mendengarkan Anda melalui teks suara berkualitas tinggi secara langsung.</p>
        </div>
        <div class="glass-card feature-card">
          <div class="feature-card-icon"><i data-lucide="bot"></i></div>
          <h3 class="feature-card-title">AI Tutor Explanations</h3>
          <p class="feature-card-desc">Dapatkan penjelasan analitis terperinci secara langsung dari asisten kecerdasan buatan kami.</p>
        </div>
        <div class="glass-card feature-card">
          <div class="feature-card-icon"><i data-lucide="bar-chart-3"></i></div>
          <h3 class="feature-card-title">Progress Analytics</h3>
          <p class="feature-card-desc">Grafik mingguan dan dasbor interaktif memantau kemajuan serta penguasaan kosa kata Anda.</p>
        </div>
        <div class="glass-card feature-card">
          <div class="feature-card-icon"><i data-lucide="award"></i></div>
          <h3 class="feature-card-title">Achievement Badges</h3>
          <p class="feature-card-desc">Dapatkan koleksi lencana dan naikkan level karakter belajar Anda dengan XP poin.</p>
        </div>
        <div class="glass-card feature-card">
          <div class="feature-card-icon"><i data-lucide="file-badge"></i></div>
          <h3 class="feature-card-title">Official Certificate</h3>
          <p class="feature-card-desc">Unduh sertifikat kelulusan dalam format PDF setelah Anda berhasil menuntaskan semua tingkat belajar.</p>
        </div>
      </div>
    </div>

    <!-- Learning Path Section -->
    <div class="section-spacer">
      <div class="section-header">
        <div class="section-subtitle">Alur Belajar</div>
        <h2 class="section-title">Peta Kompetensi Mahasiswa</h2>
      </div>
      
      <div class="timeline-path">
        <div class="timeline-line"></div>
        
        <div class="timeline-step" onclick="startQuizForLevel('pemula')">
          <div class="glass-card timeline-content interactive">
            <h3 class="timeline-lvl"><i data-lucide="baby" style="color: var(--color-primary);"></i> Pemula (Level 1)</h3>
            <p class="timeline-desc">Konsep dasar, sapaan formal, ejaan dasar kata depan di/ke, dan pengenalan kalimat nominal dasar.</p>
            <div class="timeline-play-chip"><i data-lucide="play-circle"></i> Mulai Kuis</div>
          </div>
          <div class="timeline-node">1</div>
        </div>

        <div class="timeline-step" onclick="startQuizForLevel('menengah')">
          <div class="glass-card timeline-content interactive">
            <h3 class="timeline-lvl" style="color: var(--color-accent);"><i data-lucide="trending-up"></i> Menengah (Level 2-4)</h3>
            <p class="timeline-desc">Kalimat majemuk, istilah serapan teknologi/gadget, membaca wacana komprehensif, dan melatih mendengarkan berita.</p>
            <div class="timeline-play-chip" style="color: var(--color-accent);"><i data-lucide="play-circle"></i> Mulai Kuis</div>
          </div>
          <div class="timeline-node">2</div>
        </div>

        <div class="timeline-step" onclick="startQuizForLevel('mahir')">
          <div class="glass-card timeline-content interactive">
            <h3 class="timeline-lvl" style="color: var(--color-secondary);"><i data-lucide="graduation-cap"></i> Mahir (Level 5-7)</h3>
            <p class="timeline-desc">Menemukan pleonasme kalimat, pemahaman budaya Indonesia, analisis kalimat rancu, serta penulisan karya ilmiah.</p>
            <div class="timeline-play-chip" style="color: var(--color-secondary);"><i data-lucide="play-circle"></i> Mulai Kuis</div>
          </div>
          <div class="timeline-node">3</div>
        </div>

        <div class="timeline-step" onclick="startQuizForLevel('profesional')">
          <div class="glass-card timeline-content interactive">
            <h3 class="timeline-lvl" style="color: #8b5cf6;"><i data-lucide="shield-alert"></i> Profesional (Level 8+)</h3>
            <p class="timeline-desc">Penulisan esai akademik formal, retorika pidato, kritik sastra, menyunting naskah artikel, dan studi kebahasaan tingkat lanjut.</p>
            <div class="timeline-play-chip" style="color: #8b5cf6;"><i data-lucide="play-circle"></i> Mulai Kuis</div>
          </div>
          <div class="timeline-node">4</div>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="section-spacer">
      <div class="section-header">
        <div class="section-subtitle">Testimoni</div>
        <h2 class="section-title">Apa Kata Rekan Mahasiswa?</h2>
      </div>
      
      <div class="testimonial-grid">
        <div class="glass-card testi-card">
          <p class="testi-quote">"BahasaMaster membantu saya memahami penulisan kutipan dan kalimat baku untuk skripsi saya. Sangat interaktif!"</p>
          <div class="testi-profile">
            <div class="testi-avatar">R</div>
            <div>
              <div class="testi-name">Rian Hidayat</div>
              <div class="testi-uni">Fakultas Teknik, Universitas Indonesia</div>
            </div>
          </div>
        </div>
        <div class="glass-card testi-card">
          <p class="testi-quote">"Fitur kuis mendengarkan dan kuis budaya Minangkabau sungguh keren. Belajar bahasa tidak lagi membosankan."</p>
          <div class="testi-profile">
            <div class="testi-avatar">S</div>
            <div>
              <div class="testi-name">Sarah Amalia</div>
              <div class="testi-uni">Fakultas Sastra, Universitas Gadjah Mada</div>
            </div>
          </div>
        </div>
        <div class="glass-card testi-card">
          <p class="testi-quote">"AI Tutor-nya sangat membantu ketika saya salah menyusun kalimat. Penjelasannya mendalam dan mudah dipahami."</p>
          <div class="testi-profile">
            <div class="testi-avatar">A</div>
            <div>
              <div class="testi-name">Aditya Putra</div>
              <div class="testi-uni">Sekolah Bisnis, Institut Teknologi Bandung</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer-wrap">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="#home" class="logo">
            <div class="logo-icon">BM</div>
            <span>BahasaMaster</span>
          </a>
          <p class="footer-brand-desc">Platform edukasi berbasis gamifikasi untuk meningkatkan kecakapan bahasa Indonesia formal bagi mahasiswa akademik nasional.</p>
        </div>
        
        <div class="footer-links-group">
          <div class="footer-col">
            <span class="footer-title">Platform</span>
            <a href="#quiz">Mulai Belajar</a>
            <button onclick="takePlacementTest()" style="background:none;border:none;color:inherit;font-size:inherit;text-align:left;cursor:pointer;">Tes Penempatan</button>
            <a href="#tutor">Tutor AI</a>
          </div>
          <div class="footer-col">
            <span class="footer-title">Dukungan</span>
            <a href="#home">Kebijakan Privasi</a>
            <a href="#home">Syarat & Ketentuan</a>
            <a href="#home">Hubungi Kami</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <span>&copy; 2026 BahasaMaster Indonesia. Hak Cipta Dilindungi.</span>
        <span>Bangga Berbahasa Indonesia</span>
      </div>
    </footer>
  `;
  
  // Setup stats numbers counters animation
  animateStats();
  
  // Create icons inside home view
  lucide.createIcons();
}

// Stats counters animation helper
function animateStats() {
  const statsNumEls = document.querySelectorAll('.stat-card-number');
  statsNumEls.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    let count = 0;
    const duration = 1500; // 1.5s
    const stepTime = Math.max(Math.floor(duration / target), 15);
    
    const timer = setInterval(() => {
      count += Math.ceil(target / 40);
      if (count >= target) {
        clearInterval(timer);
        el.innerText = target.toLocaleString('id-ID') + (target === 95 ? "%" : "+");
      } else {
        el.innerText = count.toLocaleString('id-ID') + (target === 95 ? "%" : "+");
      }
    }, stepTime);
  });
}

// Particle Canvas Background
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = Math.random() * 0.2 - 0.1;
      this.speedY = Math.random() * 0.2 - 0.1;
      this.color = Math.random() > 0.5 ? 'rgba(225, 29, 72, 0.15)' : 'rgba(6, 182, 212, 0.15)';
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.x > canvas.width) this.x = 0;
      else if (this.x < 0) this.x = canvas.width;
      
      if (this.y > canvas.height) this.y = 0;
      else if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  function init() {
    particlesArray = [];
    const numParticles = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < numParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  }
  
  init();
  animate();
}

// Redirect helpers
function startQuizForLevel(level) {
  window.location.hash = '#quiz';
  setTimeout(() => {
    if (window.selectQuizCategory) {
      window.selectQuizCategory(level);
    }
  }, 100);
}

function takePlacementTest() {
  window.location.hash = '#quiz';
  setTimeout(() => {
    if (window.startPlacementQuiz) {
      window.startPlacementQuiz();
    }
  }, 100);
}
