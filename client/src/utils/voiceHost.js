// client/src/utils/voiceHost.js - Web Speech API Voice Host
export function speak(text, lang = 'zh-CN') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (typeof localStorage !== 'undefined' && localStorage.getItem('muted') === 'true') return;

  try {
    window.speechSynthesis.cancel();
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Speech synthesis error:', err);
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.error('Speech cancel error:', err);
    }
  }
}

export default { speak, stopSpeech };
