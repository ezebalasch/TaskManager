function playTaskAudio(title, detail) {
    const config = JSON.parse(localStorage.getItem('speechSynthesisConfig')) || {
        voice: null,
        rate: 1,
        pitch: 1,
    };

    function speakText() {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = `Tarea: ${title}. Detalle: ${detail}`;
        utterance.rate = config.rate || 1; 
        utterance.pitch = config.pitch || 1; 

        const voices = speechSynthesis.getVoices();
        if (config.voice) {
            const selectedVoice = voices.find(voice => voice.name === config.voice);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
        }

        speechSynthesis.speak(utterance);
    }

    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', speakText);
    } else {
        speakText();
    }
}
