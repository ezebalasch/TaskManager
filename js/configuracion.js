const LOCAL_STORAGE_KEY = 'speechSynthesisConfig';

const defaultConfig = {
    voice: null, 
    rate: 1, 
    pitch: 1 
};

function saveConfigToLocalStorage(config) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
}

function getConfigFromLocalStorage() {
    const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
}

function populateVoicesSelect(voices, selectedVoice) {
    const selectElement = document.getElementById('voicesSelect');
    if (!selectElement) return;
    selectElement.innerHTML = '';

    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        if (voice.name === selectedVoice) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}

function initConfigModal() {
    const config = getConfigFromLocalStorage();

    const populateVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            populateVoicesSelect(voices, config.voice);
        }
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoices;
    } else {
        populateVoices();
    }

    const rateSlider = document.getElementById('rateSlider');
    const pitchSlider = document.getElementById('pitchSlider');
    const saveConfigBtn = document.getElementById('saveConfigBtn');

    if (rateSlider) rateSlider.value = config.rate;
    if (pitchSlider) pitchSlider.value = config.pitch;

    if (saveConfigBtn) {
        saveConfigBtn.addEventListener('click', () => {
            const selectedVoice = document.getElementById('voicesSelect').value;
            const rate = parseFloat(rateSlider.value);
            const pitch = parseFloat(pitchSlider.value);

            const newConfig = { voice: selectedVoice, rate, pitch };
            saveConfigToLocalStorage(newConfig);

            Swal.fire('Configuración guardada', '', 'success');
        });
    }
}

document.getElementById('configuracionLink').addEventListener('click', () => {
    Swal.fire({
        title: 'Configuración',
        html: `
            <div class="mb-4 text-start">
                <label for="voicesSelect">Voz:</label>
                <select id="voicesSelect" class="form-control"></select>
            </div>
            <div class="text-start">
                <label for="rateSlider">Velocidad:</label>
                <input type="range" id="rateSlider" min="-0.9" max="1.2" step="0.1" value="1">
            </div>
            <div class="text-start">
                <label for="pitchSlider">Tono:</label>
                <input type="range" id="pitchSlider" min="-0.9" max="2.2" step="0.1" value="1">
            </div>
            <div class="text-center mt-3">
                <button id="saveConfigBtn" class="btn btn-primary">Guardar configuración</button>
            </div>
        `,
        confirmButtonText: 'Cerrar',
        didOpen: () => {
            initConfigModal();
        }
    });
});
