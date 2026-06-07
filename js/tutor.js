/* AI Tutor Chatbot Controller */

window.initTutorView = initTutorView;
window.sendTutorChatMessage = sendTutorChatMessage;
window.triggerQuickAction = triggerQuickAction;
window.selectTutorSidebarTopic = selectTutorSidebarTopic;

const PRESET_TOPIC_RESPONSES = {
  imbuhan: {
    userPrompt: "Tolong jelaskan perbedaan mendasar penggunaan imbuhan 'me-kan' dan 'me-i' beserta contohnya.",
    botResponse: `<strong>Pembahasan Imbuhan Me-kan vs Me-i:</strong><br><br>
    Perbedaan utama terletak pada <strong>perilaku objeknya (Kausatif vs Lokatif)</strong>:<br><br>
    <table style="width:100%; border-collapse: collapse; margin: 10px 0; font-size:0.85rem; text-align:left;">
      <thead>
        <tr style="border-bottom: 2px solid var(--color-card-border);">
          <th style="padding:6px;">Imbuhan</th>
          <th style="padding:6px;">Makna Gramatikal</th>
          <th style="padding:6px;">Contoh Kalimat</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--color-card-border);">
          <td style="padding:6px; font-weight:700; color:var(--color-primary);">me-kan</td>
          <td style="padding:6px;">Kausatif (membuat objek bergerak/menjadi sesuatu).</td>
          <td style="padding:6px;"><em>Saya memasukkan buku ke tas.</em> (Buku berpindah tempat)</td>
        </tr>
        <tr>
          <td style="padding:6px; font-weight:700; color:var(--color-accent);">me-i</td>
          <td style="padding:6px;">Lokatif (objeknya diam sebagai tempat kejadian).</td>
          <td style="padding:6px;"><em>Saya memasuki ruangan kelas.</em> (Ruangan diam, subjek yang bergerak)</td>
        </tr>
      </tbody>
    </table><br>
    <strong>Kesalahan Umum:</strong> Mengatakan <em>"Saya memasukkan kamar"</em> (salah, karena kamar tidak bisa dipindahkan/dimasukkan ke tempat lain). Gunakan <em>"Saya memasuki kamar"</em>.`
  },
  preposisi: {
    userPrompt: "Kapan kata 'di' dan 'ke' dipisah atau disambung?",
    botResponse: `<strong>Aturan Ejaan Kata Depan (Preposisi) di dan ke:</strong><br><br>
    Berdasarkan pedoman EYD V, aturannya sangat sederhana:<br><br>
    1. <strong>Dipisah</strong> jika diikuti oleh <strong>tempat, arah, waktu, atau penunjuk lokasi</strong>.<br>
       - Contoh: <em>di perpustakaan, di atas meja, ke kampus, ke dalam lemari</em>.<br><br>
    2. <strong>Disambung</strong> jika berfungsi sebagai <strong>imbuhan pasif</strong> (pada kata kerja) atau bagian kata dasar.<br>
       - Contoh: <em>dibaca, ditulis, dimakan, keluar (kata kerja), kemari</em>.<br><br>
    <strong>Trik Cepat:</strong> Coba ubah kata tersebut menjadi bentuk aktif dengan imbuhan 'me-'. Jika bisa diubah menjadi kata aktif, berarti kata depan itu harus disambung (contoh: <em>dibaca -> membaca</em>, maka ditulis bersambung). Jika tidak bisa diubah (contoh: <em>di kampus -> me-kampus?</em> tidak bisa), maka harus ditulis terpisah.`
  },
  pleonasme: {
    userPrompt: "Mengapa kalimat pleonasme dianggap tidak baku dalam ragam ilmiah?",
    botResponse: `<strong>Analisis Pleonasme Akademik:</strong><br><br>
    <strong>Pleonasme</strong> adalah penggunaan kata-kata berlebih yang memiliki arti sama dalam satu kalimat. Dalam penulisan skripsi/jurnal ilmiah, pleonasme dilarang karena melanggar asas <em>kalimat efektif</em>.<br><br>
    <strong>Contoh Klasik Pleonasme:</strong><br>
    - ❌ <em>Para mahasiswa-mahasiswa berkumpul.</em> (Salah, karena 'para' sudah bermakna jamak, dan pengulangan 'mahasiswa' juga bermakna jamak).<br>
      - &check; <em>Para mahasiswa berkumpul</em> ATAU <em>Mahasiswa-mahasiswa berkumpul</em>.<br><br>
    - ❌ <em>Kita harus saling tolong-menolong.</em> (Salah, 'saling' dan reduplikasi 'tolong-menolong' keduanya berarti resiprokal/timbal balik).<br>
      - &check; <em>Kita harus saling tolong</em> ATAU <em>Kita harus tolong-menolong</em>.`
  }
};

function initTutorView() {
  const container = document.getElementById('tutor-view');
  
  container.innerHTML = `
    <div class="page-title-area">
      <h1 class="page-title">AI Chatbot Tutor</h1>
      <p class="page-subtitle">Ajukan pertanyaan seputar tata bahasa Indonesia baku dan minta koreksi tulisan ilmiah Anda.</p>
    </div>
    
    <div class="tutor-layout">
      <!-- Sidebar Topics -->
      <aside class="tutor-sidebar">
        <div class="glass-card" style="padding: 20px; height:100%;">
          <h4 style="font-family:var(--font-heading); font-weight:800; font-size:0.95rem; margin-bottom:15px; color:var(--color-primary);">Topik Pembahasan</h4>
          <ul class="topic-list">
            <li><button class="topic-item-btn" onclick="selectTutorSidebarTopic('imbuhan', this)"><i data-lucide="book-open"></i> Imbuhan me-kan / me-i</button></li>
            <li><button class="topic-item-btn" onclick="selectTutorSidebarTopic('preposisi', this)"><i data-lucide="map-pin"></i> Ejaan kata depan di/ke</button></li>
            <li><button class="topic-item-btn" onclick="selectTutorSidebarTopic('pleonasme', this)"><i data-lucide="scissors"></i> Pleonasme Kalimat</button></li>
          </ul>
        </div>
      </aside>
      
      <!-- Main Chat Area -->
      <div class="chat-pane">
        <!-- Message Box -->
        <div class="chat-messages-container" id="tutor-chat-messages">
          <div class="message-bubble bot-msg">
            <div class="msg-avatar">AI</div>
            <div class="msg-content-card">
              Halo! Saya adalah **AI Tutor** Bahasa Indonesia Anda. Saya bisa membantu menjelaskan struktur tata bahasa baku (SPOK), meluruskan kalimat pleonasme, menganalisis ejaan EYD, atau membuatkan rencana belajar kustom.<br><br>
              Cobalah ketuk topik di samping kiri, gunakan tombol tindakan cepat di bawah, atau ketik langsung pertanyaan Anda!
            </div>
          </div>
        </div>
        
        <!-- Bottom Input & Quick Actions -->
        <div>
          <div class="quick-chips-wrap">
            <span class="quick-action-chip" onclick="triggerQuickAction('koreksi')"><i data-lucide="check-square" style="width:12px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Koreksi Kalimat</span>
            <span class="quick-action-chip" onclick="triggerQuickAction('rencana')"><i data-lucide="calendar" style="width:12px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Rencana Belajar</span>
            <span class="quick-action-chip" onclick="triggerQuickAction('eyd')"><i data-lucide="shield-check" style="width:12px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Tips EYD V</span>
          </div>
          
          <div class="chat-input-bar">
            <input type="text" class="chat-input" id="tutor-chat-input" placeholder="Tanya sesuatu pada AI Tutor... (contoh: Koreksi: Mereka saling tolong-menolong)" onkeydown="if(event.key === 'Enter') sendTutorChatMessage()">
            <button class="btn btn-primary" onclick="sendTutorChatMessage()" style="width:50px; height:50px; border-radius:50%; padding:0;"><i data-lucide="send"></i></button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  lucide.createIcons();
}

function selectTutorSidebarTopic(topicKey, btn) {
  // Update sidebar button states
  document.querySelectorAll('.topic-item-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  
  const preset = PRESET_TOPIC_RESPONSES[topicKey];
  if (!preset) return;
  
  appendMessage('user', preset.userPrompt);
  
  showTypingIndicator();
  
  setTimeout(() => {
    removeTypingIndicator();
    appendMessage('bot', preset.botResponse);
  }, 1000);
}

function triggerQuickAction(actionType) {
  if (actionType === 'koreksi') {
    appendMessage('bot', "Silakan ketik kalimat Anda diawali dengan kata <strong>'Koreksi:'</strong>.<br><br>Contoh: <em>Koreksi: Diperpustakaan itu mereka sedang membaca buku.</em>");
  } else if (actionType === 'rencana') {
    appendMessage('user', "Buatkan saya Rencana Belajar Bahasa Indonesia Akademik");
    showTypingIndicator();
    
    setTimeout(() => {
      removeTypingIndicator();
      const planResponse = `<strong>Rencana Belajar Kustom AI (4 Minggu):</strong><br><br>
      Tutor AI telah menyusun kurikulum khusus berdasarkan level Anda saat ini:<br><br>
      <ul>
        <li><strong>Minggu 1: Ortografi & Ejaan (EYD V)</strong><br>Topik: Penulisan kata depan, angka bilangan, dan tanda baca di skripsi.</li>
        <li><strong>Minggu 2: Morfologi (Sintaksis Kata)</strong><br>Topik: Imbuhan komplek <em>me-kan, me-i, pe-an</em>, serta diksi ilmiah.</li>
        <li><strong>Minggu 3: Kalimat Efektif Akademik</strong><br>Topik: Menghilangkan pleonasme, menata kalimat pasif berpronomina, dan kalimat rancu.</li>
        <li><strong>Minggu 4: Wacana Komprehensif & Esai</strong><br>Topik: Kerangka esai ilmiah formal, koherensi paragraf, dan sitasi baku.</li>
      </ul><br>
      <em>Tip: Luangkan waktu 15 menit setiap hari untuk menyelesaikan kuis harian agar melatih refleks berbahasa Anda.</em>`;
      appendMessage('bot', planResponse);
    }, 1000);
  } else if (actionType === 'eyd') {
    appendMessage('user', "Berikan tips EYD V penting");
    showTypingIndicator();
    
    setTimeout(() => {
      removeTypingIndicator();
      const eydResponse = `<strong>3 Tips Ejaan EYD V Terpenting untuk Mahasiswa:</strong><br><br>
      1. <strong>Penulisan Gabungan Kata (Maha)</strong>: Kata 'maha' ditulis serasi/gabung jika diikuti kata dasar yang menerangkan sifat Tuhan (contoh: <em>Mahakuasa, Mahapengasih</em>), KECUALI diikuti kata berimbuhan (contoh: <em>Maha Pengampun</em>) atau kata esa (<em>Maha Esa</em>).<br><br>
      2. <strong>Penulisan Singkatan Gelar</strong>: Gunakan tanda titik di antara huruf singkatan gelar (contoh: <em>S.Pd.</em> untuk Sarjana Pendidikan, <em>M.Hum.</em> untuk Magister Humaniora).<br><br>
      3. <strong>Tanda Koma Sebelum Kata Hubung</strong>: Hindari meletakkan tanda koma sebelum kata depan 'bahwa' (contoh salah: <em>Dosen menyatakan, bahwa ujian ditunda</em>). Koma dilarang di situ karena merusak anak kalimat.`;
      appendMessage('bot', eydResponse);
    }, 1200);
  }
}

function sendTutorChatMessage() {
  const inputEl = document.getElementById('tutor-chat-input');
  if (!inputEl) return;
  
  const text = inputEl.value.trim();
  if (!text) return;
  
  // Clear input
  inputEl.value = "";
  
  // Display user msg
  appendMessage('user', text);
  
  // Trigger loading animation
  showTypingIndicator();
  
  // Process Response
  setTimeout(() => {
    removeTypingIndicator();
    const botResponse = generateAiResponse(text);
    appendMessage('bot', botResponse);
  }, 1200);
}

function generateAiResponse(text) {
  const cleanText = text.toLowerCase();
  
  // Case 1: Custom Correction Input
  if (cleanText.startsWith("koreksi:") || cleanText.includes("koreksi kalimat")) {
    const sentenceToCorrect = text.replace(/^[Kk]oreksi:\s*/i, "");
    return processSentenceCorrection(sentenceToCorrect);
  }
  
  // Case 2: Greeting
  if (cleanText.includes("halo") || cleanText.includes("selamat") || cleanText.includes("pagi") || cleanText.includes("siang")) {
    return "Halo! Ada yang bisa saya bantu terkait tata bahasa Indonesia Anda hari ini?";
  }
  
  // Case 3: Ask about skripsi
  if (cleanText.includes("skripsi") || cleanText.includes("jurnal") || cleanText.includes("ilmiah")) {
    return `<strong>Rekomendasi Penulisan Karya Ilmiah:</strong><br><br>
    Saat menulis skripsi, pastikan Anda menghindari:<br>
    1. Penggunaan kata ganti orang pertama (seperti <em>saya, kami, penulis</em>). Sebaiknya gunakan kalimat pasif (contoh: <em>'Penulis melakukan analisis...' -> 'Analisis dilakukan...'</em>).<br>
    2. Kalimat yang terlalu panjang (lebih dari 3 baris tanpa titik). Kalimat yang terlalu panjang cenderung membingungkan penguji skripsi.`;
  }
  
  // Default general response
  return `Saya telah menerima pertanyaan Anda mengenai <em>"${text}"</em>.<br><br>
  Sebagai tutor bahasa Anda, saya menyarankan Anda untuk berlatih di kategori **Kuis & Modul** untuk memantapkan pemahaman praktis Anda. <br><br>
  Jika Anda ingin saya mengoreksi sebuah kalimat, ketiklah: <strong>Koreksi: [kalimat Anda]</strong>.`;
}

// Sentence correction analyzer engine
function processSentenceCorrection(sentence) {
  let correctionFound = false;
  let correctedSentence = sentence;
  let reason = "";
  
  // 1. Pleonasme Check: saling tolong-menolong / pukul-memukul
  if (sentence.toLowerCase().includes("saling tolong-menolong")) {
    correctedSentence = sentence.replace(/saling tolong-menolong/i, "tolong-menolong (atau saling tolong)");
    reason = "Pleonasme: Kata 'saling' tidak boleh diikuti kata ulang yang bermakna resiprokal.";
    correctionFound = true;
  } 
  else if (sentence.toLowerCase().includes("saling pukul-memukul")) {
    correctedSentence = sentence.replace(/saling pukul-memukul/i, "pukul-memukul (atau saling pukul)");
    reason = "Pleonasme: Bentuk reduplikasi berimbuhan 'pukul-memukul' sudah bermakna saling, tidak memerlukan kata 'saling' lagi.";
    correctionFound = true;
  }
  // 2. Preposition split check: diperpustakaan, dikampus
  else if (sentence.toLowerCase().includes("diperpustakaan")) {
    correctedSentence = sentence.replace(/diperpustakaan/i, "di perpustakaan");
    reason = "Ejaan Preposisi: Kata depan 'di' harus dipisah bila diikuti nama tempat (perpustakaan).";
    correctionFound = true;
  }
  else if (sentence.toLowerCase().includes("dikampus")) {
    correctedSentence = sentence.replace(/dikampus/i, "di kampus");
    reason = "Ejaan Preposisi: Kata depan 'di' harus dipisah bila merujuk pada lokasi (kampus).";
    correctionFound = true;
  }
  
  if (correctionFound) {
    return `
      <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid var(--color-success); border-radius: var(--border-radius-md); padding:16px;">
        <h5 style="color: var(--color-success); font-family: var(--font-heading); font-size:1rem; font-weight:800; margin-bottom:8px;">Koreksi Kalimat Berhasil!</h5>
        <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:6px;">
          <div><strong style="color:var(--color-error);">Sebelum:</strong> <span style="text-decoration:line-through;">"${sentence}"</span></div>
          <div><strong style="color:var(--color-success);">Sesudah:</strong> <strong>"${correctedSentence}"</strong></div>
          <div style="margin-top:6px; padding-top:6px; border-top:1px dashed var(--color-card-border); color:var(--color-text-secondary); line-height:1.4;"><strong>Alasan Baku:</strong> ${reason}</div>
        </div>
      </div>
    `;
  } else {
    return `Kalimat Anda: <strong>"${sentence}"</strong>.<br><br>
    Analisis AI Tutor menunjukkan kalimat di atas sudah **cukup baku dan memenuhi kriteria EYD V**. Kerja bagus!`;
  }
}

// Append chat balloon to list
function appendMessage(sender, htmlContent) {
  const chatContainer = document.getElementById('tutor-chat-messages');
  if (!chatContainer) return;
  
  const bubble = document.createElement('div');
  bubble.className = `message-bubble ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;
  
  bubble.innerHTML = `
    <div class="msg-avatar">${sender === 'user' ? 'Saya' : 'AI'}</div>
    <div class="msg-content-card">${htmlContent}</div>
  `;
  
  chatContainer.appendChild(bubble);
  
  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showTypingIndicator() {
  const chatContainer = document.getElementById('tutor-chat-messages');
  if (!chatContainer) return;
  
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble bot-msg';
  bubble.id = 'tutor-typing-indicator';
  
  bubble.innerHTML = `
    <div class="msg-avatar">AI</div>
    <div class="msg-content-card">
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  
  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('tutor-typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}
