/* Admin Panel Controller */

window.initAdminView = initAdminView;
window.submitCustomQuestion = submitCustomQuestion;
window.deleteQuestionItem = deleteQuestionItem;
window.exportStudentReports = exportStudentReports;

function initAdminView() {
  const container = document.getElementById('admin-view');
  const questions = AppState.getQuestions();
  const leaderboard = AppState.getLeaderboard();
  
  // Calculate average level
  const avgLevel = Math.round(leaderboard.reduce((acc, curr) => acc + curr.level, 0) / leaderboard.length);
  
  container.innerHTML = `
    <div class="page-title-area">
      <h1 class="page-title">Sistem Administrasi Dosen</h1>
      <p class="page-subtitle">Kelola database soal ujian nasional, tinjau performa statistik mahasiswa, dan unduh laporan kelulusan.</p>
    </div>
    
    <div class="admin-layout">
      <!-- Admin Summary Metrics -->
      <div class="admin-stats-grid">
        <div class="glass-card stat-card">
          <div class="stat-card-icon"><i data-lucide="help-circle"></i></div>
          <div class="stat-card-number">${questions.length}</div>
          <div class="stat-card-label">Total Bank Soal</div>
        </div>
        <div class="glass-card stat-card">
          <div class="stat-card-icon"><i data-lucide="users"></i></div>
          <div class="stat-card-number">${leaderboard.length}</div>
          <div class="stat-card-label">Mahasiswa Terdaftar</div>
        </div>
        <div class="glass-card stat-card">
          <div class="stat-card-icon"><i data-lucide="award"></i></div>
          <div class="stat-card-number">Level ${avgLevel}</div>
          <div class="stat-card-label">Rata-Rata Kompetensi</div>
        </div>
        <div class="glass-card stat-card">
          <div class="stat-card-icon"><i data-lucide="school"></i></div>
          <div class="stat-card-number" style="font-size:1.5rem; line-height:2.2;">Univ. Indonesia</div>
          <div class="stat-card-label">Kontributor Utama</div>
        </div>
      </div>
      
      <!-- Split panel: CRUD Forms and Student Tables -->
      <div class="dashboard-grid">
        <!-- A. Question Creator Form -->
        <div class="glass-card">
          <h3 class="admin-table-title" style="margin-bottom:20px;"><i data-lucide="plus-circle" style="color:var(--color-primary);"></i> Tambah Soal Latihan Baru</h3>
          <form id="admin-question-form" onsubmit="submitCustomQuestion(event)">
            <div class="form-grid-2">
              <div class="form-group">
                <label for="q-level">Level Kompetensi</label>
                <select id="q-level" required>
                  <option value="pemula">Pemula (Level 1)</option>
                  <option value="menengah">Menengah (Level 2-4)</option>
                  <option value="mahir">Mahir (Level 5-7)</option>
                  <option value="profesional">Profesional (Level 8+)</option>
                </select>
              </div>
              <div class="form-group">
                <label for="q-category">Aspek Bahasa</label>
                <select id="q-category" required>
                  <option value="kosa-kata">Kosa Kata</option>
                  <option value="tata-bahasa">Tata Bahasa</option>
                  <option value="membaca">Pemahaman Membaca</option>
                  <option value="mendengar">Mendengar (Audio)</option>
                  <option value="budaya">Kebudayaan Indonesia</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="q-question-text">Teks Pertanyaan</label>
              <input type="text" id="q-question-text" placeholder="Masukkan kalimat pertanyaan..." required>
            </div>
            
            <div class="form-grid-2">
              <div class="form-group">
                <label for="q-opt-a">Pilihan A</label>
                <input type="text" id="q-opt-a" placeholder="Pilihan A" required>
              </div>
              <div class="form-group">
                <label for="q-opt-b">Pilihan B</label>
                <input type="text" id="q-opt-b" placeholder="Pilihan B" required>
              </div>
            </div>
            
            <div class="form-grid-2">
              <div class="form-group">
                <label for="q-opt-c">Pilihan C</label>
                <input type="text" id="q-opt-c" placeholder="Pilihan C" required>
              </div>
              <div class="form-group">
                <label for="q-opt-d">Pilihan D</label>
                <input type="text" id="q-opt-d" placeholder="Pilihan D" required>
              </div>
            </div>
            
            <div class="form-group">
              <label for="q-answer">Pilihan Jawaban yang Benar</label>
              <select id="q-answer" required>
                <option value="a">Pilihan A</option>
                <option value="b">Pilihan B</option>
                <option value="c">Pilihan C</option>
                <option value="d">Pilihan D</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="q-explanation">Pembahasan & Analisis Soal</label>
              <textarea id="q-explanation" style="min-height:80px; resize:vertical; font-size:0.85rem;" placeholder="Tuliskan analisis alasan jawaban benar..." required></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width:100%;"><i data-lucide="save"></i> Simpan Soal ke Server</button>
          </form>
        </div>
        
        <!-- B. Leaderboard Overview -->
        <div class="glass-card admin-table-card">
          <div class="admin-table-header">
            <h3 class="admin-table-title"><i data-lucide="trophy" style="color:var(--color-secondary);"></i> Rekapitulasi Nilai Nasional</h3>
            <button class="btn btn-secondary" style="padding:6px 12px; font-size:0.8rem;" onclick="exportStudentReports()"><i data-lucide="download"></i> Ekspor Laporan</button>
          </div>
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Nama Mahasiswa</th>
                  <th>Kampus / Universitas</th>
                  <th>Tingkat</th>
                  <th>Total XP</th>
                </tr>
              </thead>
              <tbody>
                ${leaderboard.map(student => `
                  <tr>
                    <td style="font-weight:700;">${student.name}</td>
                    <td style="color:var(--color-text-secondary);">${student.university}</td>
                    <td>Level ${student.level}</td>
                    <td style="font-weight:800; color:var(--color-accent);">${student.xp} XP</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- C. Bank Soal Manager -->
      <div class="glass-card admin-table-card">
        <div class="admin-table-header">
          <h3 class="admin-table-title"><i data-lucide="database" style="color:var(--color-accent);"></i> Bank Soal Aktif</h3>
        </div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Aspek</th>
                <th>Tipe Soal</th>
                <th>Isi Soal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="admin-questions-tbody">
              <!-- Populated by JS -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  // Render active database list
  renderAdminQuestionsList(questions);
  
  lucide.createIcons();
}

function renderAdminQuestionsList(questions) {
  const tbody = document.getElementById('admin-questions-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = "";
  
  questions.forEach(q => {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
      <td><span class="q-badge" style="text-transform:uppercase;">${q.level}</span></td>
      <td><span class="q-badge">${q.category}</span></td>
      <td><span style="font-size:0.8rem; font-weight:700;">${q.type}</span></td>
      <td style="color:var(--color-text-secondary); max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${q.question}</td>
      <td>
        <button class="btn-danger-sm" onclick="deleteQuestionItem('${q.id}')">Hapus</button>
      </td>
    `;
    
    tbody.appendChild(tr);
  });
}

function submitCustomQuestion(e) {
  e.preventDefault();
  
  const level = document.getElementById('q-level').value;
  const category = document.getElementById('q-category').value;
  const questionText = document.getElementById('q-question-text').value.trim();
  const optA = document.getElementById('q-opt-a').value.trim();
  const optB = document.getElementById('q-opt-b').value.trim();
  const optC = document.getElementById('q-opt-c').value.trim();
  const optD = document.getElementById('q-opt-d').value.trim();
  const answerLetter = document.getElementById('q-answer').value;
  const explanation = document.getElementById('q-explanation').value.trim();
  
  // Map answer letters to value
  let answerVal = optA;
  if (answerLetter === 'b') answerVal = optB;
  else if (answerLetter === 'c') answerVal = optC;
  else if (answerLetter === 'd') answerVal = optD;
  
  const questionObj = {
    level: level,
    category: category,
    type: "multiple-choice", // CRUD outputs MC by default
    question: questionText,
    options: [optA, optB, optC, optD],
    answer: answerVal,
    explanation: explanation,
    vocabBreakdown: {},
    grammarExplanation: "Soal ini ditambahkan secara khusus oleh Admin Akademik BahasaMaster.",
    tip: "Perhatikan struktur subjek, predikat, objek, dan keterangan."
  };
  
  AppState.addQuestion(questionObj);
  
  // Reset Form
  document.getElementById('admin-question-form').reset();
  
  // Re-render
  initAdminView();
  
  triggerUINotification("Soal Berhasil Ditambahkan", "Tersedia secara instan di bank soal kuis.");
}

function deleteQuestionItem(id) {
  AppState.deleteQuestion(id);
  initAdminView();
  triggerUINotification("Soal Berhasil Dihapus", "Bank soal telah diperbarui.");
}

function exportStudentReports() {
  const data = {
    timestamp: new Date().toISOString(),
    users: AppState.getUser(),
    leaderboards: AppState.getLeaderboard(),
    questionsCount: AppState.getQuestions().length
  };
  
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement('a');
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `Laporan_Akademik_BahasaMaster_${Date.now()}.json`);
  link.click();
  
  triggerUINotification("Laporan Diekspor", "File JSON laporan berhasil diunduh.");
}
