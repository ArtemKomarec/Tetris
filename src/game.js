export default class Game {

    static points = {
        '1': 40,
        '2': 100,
        '3': 300,
        '4': 1200
    }

    // синтаксис полей или свойств класса 

    constructor() {
        this.reset();
    }

    get level() {
        return Math.floor(this.lines * 0.1);
    }

    getState() {
        const playField = this.createPlayField();
        const { y: figurY, x: figurX, blocks } = this.activeFigur;

        for (let y = 0; y < this.playField.length; y++) {
            playField[y] = [];
            for (let x = 0; x < this.playField[y].length; x++) {
                playField[y][x] = this.playField[y][x];

            }
        }

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    playField[figurY + y][figurX + x] = blocks[y][x];
                }

            }

        }

        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextFigur: this.nextFigur,
            playField,
            gameOver: this.defeat
        };
    }

    reset() {
      this.score = 0;
      this.lines = 0;
      this.defeat = false;
      this.playField = this.createPlayField();
      this.activeFigur = this.createFigur();
      this.nextFigur = this.createFigur();
    }

    createPlayField() {
        const playField = [];
        for (let y = 0; y < 20; y++) {
            playField[y] = []
            for (let x = 0; x < 10; x++) {
                playField[y][x] = 0;

            }
        }
        return playField;
    }

    createFigur() {
        const number = Math.floor(Math.random() * 7);
        const type = 'IJLOSTZ'[number];

        const figur = {};

        switch (type) {
            case 'I':
                figur.blocks = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ];
                break;
            case 'J':
                figur.blocks = [
                    [0, 0, 0],
                    [2, 2, 2],
                    [0, 0, 2]
                ];
                break;
            case 'L':
                figur.blocks = [
                    [0, 0, 0],
                    [3, 3, 3],
                    [3, 0, 0]
                ];
                break;
            case 'O':
                figur.blocks = [
                    [0, 0, 0, 0],
                    [0, 4, 4, 0],
                    [0, 4, 4, 0],
                    [0, 0, 0, 0]
                ];
                break;
            case 'S':
                figur.blocks = [
                    [0, 0, 0],
                    [0, 5, 5],
                    [5, 5, 0]
                ];
                break;
            case 'T':
                figur.blocks = [
                    [0, 0, 0],
                    [6, 6, 6],
                    [0, 6, 0]
                ];
                break;
            case 'Z':
                figur.blocks = [
                    [0, 0, 0],
                    [7, 7, 0],
                    [0, 7, 7]
                ];
                break;
            default:
                throw new Error('Неизвестный тип фигуры');
        }

        figur.x = Math.floor((10 - figur.blocks[0].length) / 2);
        figur.y = -1;

        return figur;
    }

    moveFigurLeft() {
        this.activeFigur.x -= 1;

        if (this.isFigurOut()) {
            this.activeFigur.x += 1;
        }
    }

    moveFigurRight() {
        this.activeFigur.x += 1;

        if (this.isFigurOut()) {
            this.activeFigur.x -= 1;
        }
    }

    moveFigurDown() {
        if (this.defeat) return;
        this.activeFigur.y += 1;

        if (this.isFigurOut()) {
            this.activeFigur.y -= 1;
            this.lockFigur();
            const deleteLines = this.clearLines();
            this.updateScore(deleteLines);
            this.updateFigure();
        }

        if (this.isFigurOut()) {
            this.defeat = true;
        }
    }

    rotateFigur() {
        const blocks = this.activeFigur.blocks;
        const length = blocks.length;
        const temp = []
        for (let i = 0; i < length; i++) {
            temp[i] = new Array(length).fill(0);
        }
        for (let y = 0; y < length; y++) {
            for (let x = 0; x < length; x++) {
                temp[x][y] = blocks[length - 1 - y][x]
            }
        }

        this.activeFigur.blocks = temp;
        if (this.isFigurOut()) {
            this.activeFigur.blocks = blocks;
        }

    }

    isFigurOut() {
        const { y: figurY, x: figurX, blocks } = this.activeFigur;
        const playField = this.playField;
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x] &&
                    ((playField[figurY + y] === undefined || playField[figurY + y][figurX + x] === undefined) ||
                        playField[figurY + y][figurX + x])) {
                    return true;
                }
            }
        }

        return false;

    }

    lockFigur() {
        const { y: figurY, x: figurX, blocks } = this.activeFigur;
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    this.playField[figurY + y][figurX + x] = blocks[y][x];
                }

            }
        }
    }

    clearLines() {
        let lines = [];
        const rows = 20;
        const columns = 10;
        for (let y = rows - 1; y >= 0; y--) {
            let numbersOfBlocks = 0;
            for (let x = 0; x < columns; x++) {
                if (this.playField[y][x]) {
                    numbersOfBlocks += 1;
                }

            }

            if (numbersOfBlocks == 0) {
                break;
            } else if (numbersOfBlocks < columns) {
                continue;
            } else {
                lines.unshift(y);
            }
        }

        for (let index of lines) {
            this.playField.splice(index, 1);
            this.playField.unshift(new Array(columns).fill(0));
        }

        return lines.length;
    }

    updateScore(deleteLines) {
        if (deleteLines > 0) {
            this.score += Game.points[deleteLines] * (this.level + 1);
            this.lines += deleteLines;
        }
    }

    updateFigure() {
        this.activeFigur = this.nextFigur;
        this.nextFigur = this.createFigur();
    }
}