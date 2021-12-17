export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.isPlaying = false;
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.view.renderStartPlay();
    }

    update() {
        this.game.moveFigurDown();
        this.updateView();
    }

    pause() {
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
    }

    play() {
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
    }

    startTimer() {
        const speed = 1000 - this.game.getState().level * 100

        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.update();
            }, speed > 0 ? speed : 100);
        }
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    updateView() {
        const state = this.game.getState();

        if (state.gameOver) {
            this.view.renderEndPlay(state);
        }
        else if (this.isPlaying) {
            this.view.render(this.game.getState());
        } else {
            this.view.renderPause();
        }
    }

    reset() {
        this.game.reset();
        this.play();
    }

    handleKeyDown(e) {
        switch (e.key) {
            case 'Enter':
                if (this.game.getState().gameOver) {
                    this.reset();
                }
                else if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
                break;
            case 'ArrowLeft':
                this.game.moveFigurLeft();
                this.updateView();
                break;
            case 'ArrowUp':
                this.game.rotateFigur();
                this.updateView();
                break;
            case 'ArrowRight':
                this.game.moveFigurRight();
                this.updateView();
                break;
            case 'ArrowDown':
                this.game.moveFigurDown();
                this.updateView();
                break;
        }
    }
}