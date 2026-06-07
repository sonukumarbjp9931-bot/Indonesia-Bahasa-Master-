/* General Helpers & Browser API Utilities */

window.triggerConfettiCelebration = triggerConfettiCelebration;
window.triggerUINotification = triggerUINotification;

// Synthesizer Audio Context
const SynthAudio = {
  ctx: null,
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  
  playTone(freq, type, duration, delay = 0, volume = 0.15) {
    try {
      this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      
      gainNode.gain.setValueAtTime(volume, this.ctx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + duration);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) {
      console.warn("Audio Context blocked or not supported on this browser.", e);
    }
  }
};

// Expose sounds globally
window.playCorrectSound = () => {
  SynthAudio.playTone(523.25, 'sine', 0.15); // C5
  SynthAudio.playTone(659.25, 'sine', 0.25, 0.08); // E5
};

window.playIncorrectSound = () => {
  SynthAudio.playTone(196.00, 'triangle', 0.25); // G3
  SynthAudio.playTone(146.83, 'triangle', 0.35, 0.08); // D3
};

window.playLevelUpSound = () => {
  // Fanfare chord progression
  const notes = [261.63, 329.63, 392.00, 523.25]; // C chord ascending
  notes.forEach((freq, idx) => {
    SynthAudio.playTone(freq, 'sawtooth', 0.5, idx * 0.1, 0.08);
  });
};

// Celebrate Confetti burst
function triggerConfettiCelebration() {
  // Play Level up sound too
  window.playLevelUpSound();

  if (window.confetti) {
    const count = 150;
    const defaults = {
      origin: { y: 0.6 },
      zIndex: 9999
    };

    function fire(particleRatio, opts) {
      window.confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      }));
    }

    // Colors: Red (Indonesian), Gold (Secondary), Cyan (Accent)
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#e11d48', '#f59e0b', '#ffffff']
    });
    fire(0.2, {
      spread: 60,
      colors: ['#e11d48', '#06b6d4', '#ffffff']
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#e11d48', '#f59e0b', '#06b6d4']
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#e11d48', '#ffffff']
    });
  }
}

// Slide-in Toast Notification
function triggerUINotification(title, message) {
  // Check if sound should play (default click)
  SynthAudio.playTone(440, 'sine', 0.08, 0, 0.05);

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 9999;
      max-width: 350px;
      width: 90%;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'glass-card';
  toast.style.cssText = `
    padding: 16px 20px;
    background: rgba(15, 23, 42, 0.9);
    border: 1px solid var(--color-primary);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    animation: toast-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform: translateX(120%);
    opacity: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `;

  // Apply light theme style overrides dynamically
  if (document.body.classList.contains('light-theme')) {
    toast.style.background = 'rgba(255, 255, 255, 0.95)';
    toast.style.borderColor = 'var(--color-primary)';
  }

  toast.innerHTML = `
    <strong style="color: var(--color-primary); font-family: var(--font-heading); font-size: 0.95rem; font-weight: 800;">${title}</strong>
    <span style="color: var(--color-text-secondary); font-size: 0.85rem; line-height: 1.4;">${message}</span>
  `;

  container.appendChild(toast);

  // Add keyframe style dynamically if not exists
  if (!document.getElementById('toast-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-animation-styles';
    style.innerHTML = `
      @keyframes toast-slide-in {
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes toast-fade-out {
        to {
          transform: translateY(20px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Remove toast after 4s
  setTimeout(() => {
    toast.style.animation = 'toast-fade-out 0.4s ease forwards';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

// Hook core events in window
window.addEventListener('click', (e) => {
  // Connect Audio Context on first student interaction to bypass browser policies
  SynthAudio.init();
});
