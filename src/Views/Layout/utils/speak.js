// speak.js
export const speak = (text) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.cancel(); // Stop any previous speech
        speechSynthesis.speak(utterance);
    } else {
        console.warn("Speech synthesis not supported in this browser.");
    }
};
