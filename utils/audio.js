function setupArchiveAudio(app) {
  const fadeDuration = 500;
  const ambientVolume = 0.45;
  const effectVolume = 0.75;
  const soundButton = document.querySelector(".sound-button");
  const ambientTracks = {
    lake: new Audio("assets/audio/Lake_ambient.mp3"),
    diner: new Audio("assets/audio/Diner_ambient.mp3"),
    billboards: new Audio("assets/audio/Billboards_ambient.mp3"),
  };
  const ambientVolumes = {
    lake: ambientVolume,
    diner: ambientVolume,
    billboards: 0.16,
  };
  const effects = {
    door: new Audio("assets/audio/Door_sound.mp3"),
    frog: new Audio("assets/audio/Frog_sound.mp3"),
    cat: new Audio("assets/audio/Cat_sound.mp3"),
    glitch: new Audio("assets/audio/Glitch_sound.mp3"),
    keyboard: new Audio("assets/audio/Keyboard_sound.mp3"),
  };
  const effectVolumes = {
    door: 0.12,
    frog: 0.22,
    cat: effectVolume,
    glitch: 0.16,
    keyboard: 0.12,
  };

  let soundEnabled = true;
  let audioUnlocked = false;
  let currentAmbientName = null;
  let fadingAmbient = null;
  let pendingAmbientName = null;
  let fadeTimer = null;
  let isTypingSoundPlaying = false;

  Object.entries(ambientTracks).forEach(([name, track]) => {
    track.loop = true;
    track.volume = ambientVolumes[name] || ambientVolume;
  });

  Object.entries(effects).forEach(([name, effect]) => {
    effect.volume = effectVolumes[name] || effectVolume;
  });

  function getCurrentRoomName() {
    return app.currentScreen?.dataset?.room || null;
  }

  function updateSoundButton() {
    if (!soundButton) {
      return;
    }

    soundButton.classList.toggle("is-muted", !soundEnabled);
    soundButton.setAttribute("aria-label", soundEnabled ? "Mute sound" : "Unmute sound");
  }

  function unlockAudio() {
    if (audioUnlocked) {
      return;
    }

    audioUnlocked = true;

    if (soundEnabled) {
      startAmbientForRoom(getCurrentRoomName());
    }
  }

  function stopFadeTimer() {
    if (fadeTimer) {
      window.clearInterval(fadeTimer);
      fadeTimer = null;
    }
  }

  function stopTrack(track, trackName) {
    track.pause();
    track.currentTime = 0;
    track.volume = ambientVolumes[trackName] || ambientVolume;
  }

  function playTrack(track, trackName) {
    track.volume = ambientVolumes[trackName] || ambientVolume;
    track.play().catch(() => {
      audioUnlocked = false;
    });
  }

  function fadeOutCurrentAmbient(afterFade) {
    const trackName = currentAmbientName || fadingAmbient;
    const track = ambientTracks[trackName];

    stopFadeTimer();

    if (!track) {
      currentAmbientName = null;
      fadingAmbient = null;

      if (afterFade) {
        afterFade();
      }

      return;
    }

    fadingAmbient = trackName;
    currentAmbientName = null;
    const trackVolume = ambientVolumes[trackName] || ambientVolume;
    const fadeStep = trackVolume / Math.max(1, fadeDuration / 50);

    fadeTimer = window.setInterval(() => {
      track.volume = Math.max(0, track.volume - fadeStep);

      if (track.volume <= 0.01) {
        stopFadeTimer();
        stopTrack(track, trackName);
        fadingAmbient = null;

        if (afterFade) {
          afterFade();
        }
      }
    }, 50);
  }

  function startAmbientForRoom(roomName) {
    const nextTrack = ambientTracks[roomName];

    if (!audioUnlocked || !soundEnabled || !nextTrack) {
      if (!nextTrack) {
        fadeOutCurrentAmbient();
      }
      return;
    }

    if (currentAmbientName === roomName) {
      return;
    }

    pendingAmbientName = roomName;

    fadeOutCurrentAmbient(() => {
      if (pendingAmbientName !== roomName || !soundEnabled) {
        return;
      }

      currentAmbientName = roomName;
      pendingAmbientName = null;
      playTrack(nextTrack, roomName);
    });
  }

  function stopAllAmbient() {
    stopFadeTimer();
    Object.entries(ambientTracks).forEach(([name, track]) => {
      stopTrack(track, name);
    });
    currentAmbientName = null;
    fadingAmbient = null;
    pendingAmbientName = null;
  }

  function playEffect(name) {
    unlockAudio();

    if (!soundEnabled || !audioUnlocked || !effects[name]) {
      return;
    }

    if (name === "glitch") {
      const glitchEffect = effects.glitch;
      glitchEffect.pause();
      glitchEffect.currentTime = 0;
      glitchEffect.volume = effectVolumes.glitch;
      glitchEffect.play().catch(() => {});
      return;
    }

    const effect = effects[name].cloneNode();
    effect.volume = effectVolumes[name] || effectVolume;
    effect.play().catch(() => {});
  }

  function startTypingSound() {
    const typingSound = effects.keyboard;

    unlockAudio();

    if (!soundEnabled || !audioUnlocked || !typingSound || isTypingSoundPlaying) {
      return;
    }

    isTypingSoundPlaying = true;
    typingSound.loop = true;
    typingSound.volume = effectVolumes.keyboard;
    typingSound.currentTime = 0;
    typingSound.play().catch(() => {
      isTypingSoundPlaying = false;
    });
  }

  function stopTypingSound() {
    const typingSound = effects.keyboard;

    if (!typingSound) {
      return;
    }

    typingSound.pause();
    typingSound.currentTime = 0;
    typingSound.loop = false;
    isTypingSoundPlaying = false;
  }

  function playTypingSound() {
    startTypingSound();
  }

  function syncAmbientWithScreen() {
    const roomName = getCurrentRoomName();

    if (ambientTracks[roomName]) {
      startAmbientForRoom(roomName);
      return;
    }

    fadeOutCurrentAmbient();
  }

  ["click", "keydown", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, unlockAudio, { once: true, passive: true });
  });

  if (soundButton) {
    soundButton.addEventListener("click", (event) => {
      event.stopPropagation();
      unlockAudio();
      soundEnabled = !soundEnabled;
      updateSoundButton();

      if (soundEnabled) {
        syncAmbientWithScreen();
      } else {
        stopTypingSound();
        stopAllAmbient();
      }
    });
  }

  updateSoundButton();

  window.archiveAudio = {
    playEffect,
    playTypingSound,
    startTypingSound,
    stopTypingSound,
    stopAmbient() {
      fadeOutCurrentAmbient();
    },
    syncAmbientWithScreen,
    isSoundEnabled() {
      return soundEnabled;
    },
  };
}
