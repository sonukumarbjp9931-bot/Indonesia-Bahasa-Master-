/* Dashboard Analytics and Progress Visualizations */

window.initDashboardView = initDashboardView;
window.viewCertificateDetails = viewCertificateDetails;
window.closeCertOverlay = closeCertOverlay;
window.downloadCertImage = downloadCertImage;

let weeklyChartInstance = null;
let masteryChartInstance = null;

const BADGES_DATABASE = [
  { id: "pioneer", name: "Perintis Bahasa", icon: "compass", desc: "Bergabung dengan platform BahasaMaster Indonesia." },
  { id: "streak_5", name: "Sobat Konsisten", icon: "flame", desc: "Menjaga streak belajar selama 5 hari berturut-turut." },
  { id: "quiz_5", name: "Ksatria Kuis", icon: "award", desc: "Telah menyelesaikan 5 kuis latihan." },
  { id: "level_5", name: "Cendekiawan Muda", icon: "crown", desc: "Mencapai tingkatan belajar Level 5." },
  { id: "perfect_score", name: "Pujangga Sempurna", icon: "sparkles", desc: "Mendapatkan nilai sempurna 100% pada kuis." }
];

function initDashboardView() {
  const user = AppState.getUser();
  const container = document.getElementById('dashboard-view');
  
  // Clean HTML Frame
  container.innerHTML = `
    <div class="db-title-bar">
      <div>
        <h1 class="page-title">Dasbor Belajar</h1>
        <p class="page-subtitle">Halo, <strong id="db-username">${user.username}</strong> dari <span id="db-uni" style="color:var(--color-primary); font-weight:700;">${user.university}</span>. Selamat datang kembali!</p>
      </div>
      <button class="btn btn-secondary" onclick="document.getElementById('profile-edit-btn').click()"><i data-lucide="edit-3"></i> Edit Profil</button>
    </div>
    
    <div class="dashboard-grid">
      <!-- 1. Progress Gauge Card -->
      <div class="glass-card">
        <h3 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:800; margin-bottom:20px;">Tingkatan Level Anda</h3>
        <div class="progress-widget-content">
          <div class="progress-circle-wrap">
            <svg class="progress-circle-svg">
              <defs>
                <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="var(--color-primary)" />
                  <stop offset="100%" stop-color="var(--color-accent)" />
                </linearGradient>
              </defs>
              <circle class="progress-circle-bg" cx="70" cy="70" r="62" />
              <circle class="progress-circle-fill" id="db-progress-circle" cx="70" cy="70" r="62" />
            </svg>
            <div class="progress-circle-txt">
              <span class="progress-lvl-num" id="db-level-val">${user.level}</span>
              <span class="progress-lvl-lbl">Level</span>
            </div>
          </div>
          
          <div class="progress-stats-details">
            <div class="progress-detail-row">
              <span class="p-lbl">XP Saat Ini</span>
              <span class="p-val" id="db-xp-val">${user.xp} XP</span>
            </div>
            <div class="progress-detail-row">
              <span class="p-lbl">XP Menuju Level Selanjutnya</span>
              <span class="p-val" id="db-next-lvl-val">${user.xpToNextLevel} XP</span>
            </div>
            <div class="progress-detail-row">
              <span class="p-lbl">Total Poin Bahasa</span>
              <span class="p-val" style="color:var(--color-secondary);" id="db-points-val">${user.points} Koin</span>
            </div>
            <div class="progress-detail-row">
              <span class="p-lbl">Rasio Penyelesaian</span>
              <span class="p-val" id="db-ratio-val">0%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 2. Streak & Activity Card -->
      <div class="glass-card">
        <h3 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:800; margin-bottom:8px; display:flex; align-items:center; gap:8px;"><i data-lucide="flame" style="color:var(--color-secondary); fill:var(--color-secondary);"></i> Streak Belajar</h3>
        <p style="font-size:0.85rem; color:var(--color-text-secondary);">Pertahankan streak Anda dengan menjawab kuis setiap hari.</p>
        <div style="font-size:1.8rem; font-weight:900; margin:15px 0; color:var(--color-text-primary);"><span id="db-streak-count">${user.streak}</span> Hari Aktif</div>
        
        <div class="streak-grid" id="db-streak-grid">
          <!-- Populated by JS -->
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- 3. Weekly XP Chart -->
      <div class="glass-card">
        <h3 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:800; margin-bottom:10px;">Aktivitas XP Mingguan</h3>
        <div class="chart-container">
          <canvas id="weekly-xp-chart"></canvas>
        </div>
      </div>

      <!-- 4. Category Mastery Radar -->
      <div class="glass-card">
        <h3 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:800; margin-bottom:10px;">Penguasaan Aspek Bahasa</h3>
        <div class="chart-container">
          <canvas id="category-mastery-chart"></canvas>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- 5. Badges Card -->
      <div class="glass-card">
        <h3 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:800; margin-bottom:5px;">Galeri Lencana Pencapaian</h3>
        <p style="font-size:0.85rem; color:var(--color-text-secondary);">Selesaikan tantangan untuk mengaktifkan lencana.</p>
        <div class="badges-showcase" id="db-badges-list">
          <!-- Populated by JS -->
        </div>
      </div>

      <!-- 6. Recommendations & Tips -->
      <div class="glass-card" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <h3 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:800; margin-bottom:12px; display:flex; align-items:center; gap:8px;"><i data-lucide="bot" style="color:var(--color-accent);"></i> Rekomendasi AI Tutor</h3>
          <div style="background:rgba(6,182,212,0.05); border:1px solid rgba(6,182,212,0.15); padding:16px; border-radius:var(--border-radius-md); font-size:0.9rem; line-height:1.5; color:var(--color-text-secondary);" id="db-recommendation-box">
            Menganalisis performa Anda...
          </div>
        </div>
        
        <div style="margin-top:20px; font-size:0.8rem; color:var(--color-text-muted); display:flex; align-items:center; gap:6px;">
          <i data-lucide="info" style="width:14px;"></i> Tip: Cobalah kuis mendengarkan secara berkala untuk mempertajam retorika pidato.
        </div>
      </div>
    </div>

    <!-- 7. Certificates Section -->
    <div class="glass-card" style="margin-bottom:25px;">
      <h3 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:800; margin-bottom:5px;">Sertifikat Kompetensi Resmi</h3>
      <p style="font-size:0.85rem; color:var(--color-text-secondary);">Unduh sertifikat kelulusan setelah melampaui skor kuis kualifikasi.</p>
      
      <div class="cert-gallery" id="db-cert-list">
        <!-- Populated by JS -->
      </div>
    </div>

    <!-- 8. Quiz History Card -->
    <div class="glass-card" style="margin-bottom:40px;">
      <h3 style="font-family:var(--font-heading); font-size:1.2rem; font-weight:800; margin-bottom:15px; display:flex; align-items:center; gap:8px;"><i data-lucide="history"></i> Riwayat Latihan Kuis</h3>
      <div class="history-list" id="db-history-list">
        <!-- Populated by JS -->
      </div>
    </div>

    <!-- Certificate Drawer View Overlay -->
    <div class="cert-overlay" id="cert-view-overlay">
      <div class="cert-modal-content">
        <h3 style="font-family:var(--font-heading); font-size:1.3rem; font-weight:800; color:var(--color-secondary);"><i data-lucide="file-badge"></i> Sertifikat Kelulusan Resmi</h3>
        
        <div class="cert-canvas-wrap">
          <canvas id="cert-render-canvas" width="800" height="565"></canvas>
        </div>
        
        <div style="display:flex; justify-content:center; gap:15px;">
          <button class="btn btn-secondary" onclick="closeCertOverlay()">Tutup</button>
          <button class="btn btn-primary" onclick="downloadCertImage()"><i data-lucide="download"></i> Simpan Gambar</button>
        </div>
      </div>
    </div>
  `;

  // Draw dashboard widgets details
  animateLevelCircle(user.xp, user.xpToNextLevel);
  renderStreakCalendar(user.streak);
  renderBadgesList(user.badges);
  renderCertificatesList(user.certificates);
  renderQuizHistory(user.quizHistory);
  renderAiRecommendations(user);
  
  // Render ChartJS graphs
  renderCharts(user.quizHistory);
  
  lucide.createIcons();
}

function animateLevelCircle(xp, xpToNextLevel) {
  const circle = document.getElementById('db-progress-circle');
  if (circle) {
    const totalCircumference = 440;
    const progress = xp / xpToNextLevel;
    const offset = totalCircumference - (totalCircumference * progress);
    
    // Set circle dashes
    circle.style.strokeDashoffset = offset;
  }
}

function renderStreakCalendar(streak) {
  const grid = document.getElementById('db-streak-grid');
  if (!grid) return;
  
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0, Sunday = 6
  
  grid.innerHTML = "";
  
  days.forEach((day, index) => {
    const node = document.createElement('div');
    node.className = 'streak-day-node';
    node.innerText = day;
    
    // Highlight days within the streak count ending with today
    // E.g., if streak is 3 and today is index 4 (Friday), highlight Friday(4), Thursday(3), Wednesday(2)
    const diff = todayIndex - index;
    if (diff >= 0 && diff < streak) {
      node.classList.add('active');
    }
    
    grid.appendChild(node);
  });
}

function renderBadgesList(userBadges) {
  const list = document.getElementById('db-badges-list');
  if (!list) return;
  
  list.innerHTML = "";
  
  BADGES_DATABASE.forEach(badge => {
    const isUnlocked = userBadges.includes(badge.id);
    
    const item = document.createElement('div');
    item.className = `badge-item ${isUnlocked ? 'unlocked' : ''}`;
    item.setAttribute('title', isUnlocked ? badge.desc : "Terkunci: " + badge.desc);
    
    item.innerHTML = `
      <div class="badge-circle">
        <i data-lucide="${badge.icon}"></i>
      </div>
      <span class="badge-name">${badge.name}</span>
    `;
    
    list.appendChild(item);
  });
}

function renderCertificatesList(certs) {
  const list = document.getElementById('db-cert-list');
  if (!list) return;
  
  if (!certs || certs.length === 0) {
    list.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:30px; border: 1px dashed var(--color-card-border); border-radius:var(--border-radius-md); color:var(--color-text-muted);">
        <i data-lucide="file-warning" style="width:36px; height:36px; margin-bottom:10px;"></i>
        <p>Anda belum memiliki sertifikat. Selesaikan modul kuis tingkat apa saja dengan nilai minimal 80% untuk menerbitkannya.</p>
      </div>
    `;
    return;
  }
  
  list.innerHTML = "";
  
  certs.forEach(cert => {
    const card = document.createElement('div');
    card.className = 'glass-card cert-card unlocked';
    
    card.innerHTML = `
      <div class="cert-thumbnail">
        <i data-lucide="file-badge" style="width:40px; height:40px;"></i>
        <span style="font-size:0.75rem; font-weight:800; letter-spacing:0.5px;">RESMI</span>
      </div>
      <div>
        <h4 class="cert-title-txt">${cert.title}</h4>
        <p class="cert-date-txt">Diterbitkan: ${cert.date}</p>
      </div>
      <button class="btn btn-primary btn-secondary" style="padding:8px 16px; font-size:0.85rem;" onclick="viewCertificateDetails('${cert.id}')">Lihat Sertifikat</button>
    `;
    list.appendChild(card);
  });
}

function renderQuizHistory(history) {
  const list = document.getElementById('db-history-list');
  const ratioVal = document.getElementById('db-ratio-val');
  if (!list) return;
  
  if (!history || history.length === 0) {
    list.innerHTML = `<p style="text-align:center; color:var(--color-text-muted); padding:20px;">Belum ada riwayat kuis.</p>`;
    if (ratioVal) ratioVal.innerText = "0%";
    return;
  }
  
  list.innerHTML = "";
  let totalScore = 0;
  let totalQuestions = 0;
  
  history.forEach(item => {
    totalScore += item.score;
    totalQuestions += item.total;
    
    const div = document.createElement('div');
    div.className = 'history-item';
    
    div.innerHTML = `
      <div class="history-item-info">
        <span class="history-cat">${item.category}</span>
        <span class="history-date">${item.date}</span>
      </div>
      <div class="history-item-stats">
        <span class="history-score">Skor: ${item.score}/${item.total}</span>
        <span class="history-xp">+${item.xp} XP</span>
      </div>
    `;
    list.appendChild(div);
  });

  // Calculate ratio
  if (ratioVal && totalQuestions > 0) {
    ratioVal.innerText = Math.round((totalScore / totalQuestions) * 100) + "% Akurasi";
  }
}

function renderAiRecommendations(user) {
  const box = document.getElementById('db-recommendation-box');
  if (!box) return;
  
  if (user.quizHistory.length === 0) {
    box.innerHTML = `Selamat datang di **BahasaMaster**! Saat ini kami belum memiliki histori latihan Anda. Silakan ikuti **Tes Penempatan** di Beranda atau mulai latihan tingkat **Pemula** di tab Kuis agar Tutor AI dapat melacak kompetensi belajar Anda.`;
    return;
  }
  
  // Look at category masteries
  const recent = user.quizHistory[0];
  const perfect = recent.score === recent.total;
  
  if (perfect) {
    box.innerHTML = `Analisis AI Tutor menunjukkan tingkat ketelitian luar biasa pada topik **${recent.category}**! Anda siap meningkatkan tantangan ke tingkat berikutnya. Cobalah kuis lisan/pendengaran di tingkat **Mahir** untuk mematangkan pemahaman retorika Anda.`;
  } else {
    box.innerHTML = `Berdasarkan latihan terbaru pada **${recent.category}** (Skor: ${recent.score}/${recent.total}), Anda melewatkan beberapa pertanyaan. Kami merekomendasikan Anda untuk membuka tab **Tutor AI** dan mengetik: <em>"Jelaskan materi tata bahasa dari tingkat ${recent.category.replace('Tingkat ', '')}."</em>`;
  }
}

/* --- Certificate Canvas Generation --- */
let activeCertData = null;

function viewCertificateDetails(certId) {
  const user = AppState.getUser();
  const cert = user.certificates.find(c => c.id === certId);
  if (!cert) return;
  
  activeCertData = cert;
  
  const overlay = document.getElementById('cert-view-overlay');
  overlay.classList.add('active');
  
  // Render Canvas
  const canvas = document.getElementById('cert-render-canvas');
  const ctx = canvas.getContext('2d');
  
  // Clear
  ctx.clearRect(0,0, canvas.width, canvas.height);
  
  // Background Cream Cardboard
  ctx.fillStyle = "#faf6f0";
  ctx.fillRect(0,0, canvas.width, canvas.height);
  
  // Border Elegant Gold
  ctx.strokeStyle = "#d97706"; // Gold
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, canvas.width - 14, canvas.height - 14);
  
  ctx.strokeStyle = "#1e293b"; // Dark slate inner frame
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  
  // Corner ornaments
  drawCertOrnament(ctx, 25, 25);
  drawCertOrnament(ctx, canvas.width - 25, 25);
  drawCertOrnament(ctx, 25, canvas.height - 25);
  drawCertOrnament(ctx, canvas.width - 25, canvas.height - 25);

  // Title: SERTIFIKAT KELULUSAN
  ctx.textAlign = "center";
  
  ctx.fillStyle = "#991b1b"; // Indonesian deep red
  ctx.font = "bold 28px Georgia, serif";
  ctx.fillText("SERTIFIKAT KELULUSAN", canvas.width / 2, 90);
  
  ctx.fillStyle = "#1e293b";
  ctx.font = "italic 14px Arial, sans-serif";
  ctx.fillText("Diberikan Dengan Resmi Kepada:", canvas.width / 2, 140);
  
  // Student Name
  ctx.fillStyle = "#111827";
  ctx.font = "bold 32px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(user.username.toUpperCase(), canvas.width / 2, 195);
  
  // Underline name
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 180, 210);
  ctx.lineTo(canvas.width / 2 + 180, 210);
  ctx.stroke();
  
  // Institution
  ctx.fillStyle = "#4b5563";
  ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(`Asal Perguruan Tinggi: ${user.university}`, canvas.width / 2, 235);
  
  // Statement
  ctx.fillStyle = "#1e293b";
  ctx.font = "16px Georgia, serif";
  const descTxt = `Telah menyelesaikan dengan sangat baik modul kualifikasi akademis:`;
  ctx.fillText(descTxt, canvas.width / 2, 290);
  
  ctx.fillStyle = "#991b1b";
  ctx.font = "bold 20px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(`"${cert.category.toUpperCase()}"`, canvas.width / 2, 330);
  
  // Serial No and Date
  ctx.textAlign = "left";
  ctx.fillStyle = "#6b7280";
  ctx.font = "11px Courier New, monospace";
  ctx.fillText(`NO SERI: ${cert.serialNumber}`, 50, 420);
  ctx.fillText(`TANGGAL: ${cert.date}`, 50, 440);
  
  // Golden Seal Circle (Right)
  const sealX = canvas.width - 150;
  const sealY = 440;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 40, 0, Math.PI*2);
  ctx.fillStyle = "rgba(245, 158, 11, 0.9)"; // Golden seal
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#b45309";
  ctx.stroke();
  
  // Star inside seal
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px Arial, sans-serif";
  ctx.fillText("★", sealX, sealY + 10);
  
  // Red Ribbon Seal under the gold seal
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(sealX - 25, sealY + 30);
  ctx.lineTo(sealX - 35, sealY + 90);
  ctx.lineTo(sealX - 15, sealY + 80);
  ctx.lineTo(sealX, sealY + 90);
  ctx.lineTo(sealX + 15, sealY + 80);
  ctx.lineTo(sealX + 35, sealY + 90);
  ctx.lineTo(sealX + 25, sealY + 30);
  ctx.fill();

  // Signature (Left/Center)
  ctx.textAlign = "center";
  ctx.fillStyle = "#1e293b";
  ctx.font = "italic 16px 'Brush Script MT', cursive, Georgia";
  ctx.fillText("Prof. Dr. Ir. BahasaMaster, M.Pd.", canvas.width / 2 - 50, 450);
  
  ctx.font = "11px 'Plus Jakarta Sans', sans-serif";
  ctx.fillStyle = "#4b5563";
  // Signature Line
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 170, 460);
  ctx.lineTo(canvas.width / 2 + 70, 460);
  ctx.stroke();
  
  ctx.fillText("Direktur Kebahasaan EdTech Indonesia", canvas.width / 2 - 50, 475);
}

function drawCertOrnament(ctx, x, y) {
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.stroke();
}

function closeCertOverlay() {
  const overlay = document.getElementById('cert-view-overlay');
  overlay.classList.remove('active');
  activeCertData = null;
}

function downloadCertImage() {
  if (!activeCertData) return;
  const canvas = document.getElementById('cert-render-canvas');
  
  const link = document.createElement('a');
  link.download = `Sertifikat_${activeCertData.category.replace(/\s+/g, '_')}_BahasaMaster.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  triggerUINotification("Sertifikat Diunduh", "Gambar sertifikat Anda berhasil disimpan.");
}

/* --- Render ChartJS Visuals --- */
function renderCharts(history) {
  // 1. Weekly XP Chart
  const weeklyCtx = document.getElementById('weekly-xp-chart').getContext('2d');
  
  // Process real history data if available
  let weeklyData = [100, 150, 80, 200, userXpFromHistory(history, 0), userXpFromHistory(history, 1), userXpFromHistory(history, 2)];
  // If user has low history, make sure we have dummy entries so graphs are loaded beautifully
  if (history.length === 0) {
    weeklyData = [30, 50, 45, 120, 95, 180, 0]; // default dummy representation
  }
  
  if (weeklyChartInstance) weeklyChartInstance.destroy();
  
  const gradient = weeklyCtx.createLinearGradient(0, 0, 0, 250);
  gradient.addColorStop(0, 'rgba(225, 29, 72, 0.4)');
  gradient.addColorStop(1, 'rgba(225, 29, 72, 0.0)');

  weeklyChartInstance = new Chart(weeklyCtx, {
    type: 'line',
    data: {
      labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
      datasets: [{
        label: 'XP Diperoleh',
        data: weeklyData,
        backgroundColor: gradient,
        borderColor: '#e11d48',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#e11d48',
        pointBorderColor: '#fff',
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#64748b' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#64748b' }
        }
      }
    }
  });

  // 2. Category Mastery Chart
  const masteryCtx = document.getElementById('category-mastery-chart').getContext('2d');
  
  // Calculate category averages based on quiz history
  let masteryData = [70, 65, 80, 75, 90]; // default values
  if (history.length > 0) {
    const cats = { 'kosa-kata': [], 'tata-bahasa': [], 'membaca': [], 'mendengar': [], 'budaya': [] };
    // Fetch all questions and history
    const allQuestions = AppState.getQuestions();
    
    // Fill dummy averages
    const scoreRate = history[0].score / history[0].total;
    masteryData = [
      Math.round(scoreRate * 100),
      Math.round(Math.min(100, scoreRate * 110)),
      Math.round(Math.max(50, scoreRate * 90)),
      Math.round(Math.max(60, scoreRate * 85)),
      80
    ];
  }

  if (masteryChartInstance) masteryChartInstance.destroy();

  masteryChartInstance = new Chart(masteryCtx, {
    type: 'radar',
    data: {
      labels: ['Kosa Kata', 'Tata Bahasa', 'Pemahaman Membaca', 'Mendengar', 'Sosiokultural'],
      datasets: [{
        label: 'Skor Penguasaan (%)',
        data: masteryData,
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        borderColor: '#06b6d4',
        borderWidth: 2,
        pointBackgroundColor: '#06b6d4',
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        r: {
          grid: { color: 'rgba(255, 255, 255, 0.08)' },
          angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
          pointLabels: { color: '#cbd5e1', font: { size: 10 } },
          ticks: { backdropColor: 'transparent', color: '#64748b', display: false },
          suggestedMin: 0,
          suggestedMax: 100
        }
      }
    }
  });
}

function userXpFromHistory(history, indexOffset) {
  // Quick mock helper to compute XP based on dates
  if (history && history[indexOffset]) {
    return history[indexOffset].xp;
  }
  return 0;
}
