export default class Debug {
    constructor() {
        this._gameGridToggle = false;
        this._scannerRadiusToggle = false;
        this._scannerPathToggle = false;
        this._droneNameToggle = false;
        this._droneDataToggle = false;
        this._gameGridLog = false;
    }

    get droneDataToggle() {
        return this._droneDataToggle;
    }

    get gameGridLog() {
        return this._gameGridLog;
    }

    set gameGridLog(value) {
        this._gameGridLog = value;
    }

    get gameGridToggle() {
        return this._gameGridToggle;
    }

    get droneNameToggle() {
        return this._droneNameToggle;
    }

    get scannerPathToggle() {
        return this._scannerPathToggle;
    }

    get scannerRadiusToggle() {
        return this._scannerRadiusToggle;
    }

    initialiseListeners() {
        this.addGameGridToggleListener();
        this.addScannerRadiusToggleListener();
        this.addScannerPathToggleListener();
        this.addNameToggleListener();
        this.addDataToggleListener();
        // this.addGameGridLogListener();
    }

    addGameGridLogListener() {
        document.getElementById('game-grid-log')
            .addEventListener('click', (e) => {
                this._gameGridLog = !this._gameGridLog;
            });
    }

    addGameGridToggleListener() {
        document.getElementById('game-grid-toggle')
            .addEventListener('click', (e) => {
                e.target.classList.toggle('toggled');
                this._gameGridToggle = !this._gameGridToggle;
            });
    }

    addScannerRadiusToggleListener() {
        document.getElementById('scanner-radius-toggle')
            .addEventListener('click', (e) => {
                e.target.classList.toggle('toggled');
                this._scannerRadiusToggle = !this._scannerRadiusToggle;
            });
    }

    addScannerPathToggleListener() {
        document.getElementById('scanner-path-toggle')
            .addEventListener('click', (e) => {
                e.target.classList.toggle('toggled');
                this._scannerPathToggle = !this._scannerPathToggle;
            });
    }

    addNameToggleListener() {
        document.getElementById('name-toggle')
            .addEventListener('click', (e) => {
                e.target.classList.toggle('toggled');
                this._droneNameToggle = !this._droneNameToggle;
            });
    }

    addDataToggleListener() {
        document.getElementById('data-toggle')
            .addEventListener('click', (e) => {
                e.target.classList.toggle('toggled');
                this._droneDataToggle = !this._droneDataToggle;
            });
    }
}
