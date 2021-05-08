export default class AudioManager {
    _isPlaying = false;
    _audio = {};

    get isPlaying() {
        return this._isPlaying;
    }

    async setAudioFile(name, filePath, mimeType = 'audio/wav') {
        const response = await fetch(filePath,
            {
                method: 'get',
                headers: {'Accept': mimeType},
            });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        this._audio[name] = new Audio(url);
    }

    play(name, volume = 1, loop = false) {
        if(!name in this._audio) return;
        try {
            this._audio[name].addEventListener('ended', () => {
                this._isPlaying = false;
            });
            this._isPlaying = true;
            this._audio[name].loop = loop
            this._audio[name].volume = volume;
            this._audio[name].play();
        } catch(e) {
            this._isPlaying = false;
        }
    }

    stop(name) {
        if(!name in this._audio) return;
        try {
            this._audio[name].pause();
            this._isPlaying = false;
        } catch(e) {
            this._isPlaying = true;
        }
    }
}
