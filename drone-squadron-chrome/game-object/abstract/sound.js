export default class Sound {
    constructor(sound) {
        this._sound = sound;
        this._has_played = false;
        this._audio = null;
    }

    get has_played() {
        return this._has_played;
    }

    is_playing() {
        return this._audio.duration > 0 && !this._audio.paused;
    }

    play() {
        this._has_played = true;
        this._audio = new Audio(this._sound);
        this._audio.currentTime = 0;
        this._audio.crossOrigin = 'anonymous';
        this._audio.play().finally(() => this._audio = null);
    }
}
