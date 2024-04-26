const app = new Vue({
  el: "#app",
  setup() {
    Vue.config.devtools = true;
  },

  data: {
    centerButton: "Старт",
    playing: false,
    score: 0,
    isWon: false,
    isWrong: false,
    difficulty: 1500,
    sequence: [],
    sequenceInterval: null,
    playerSequence: [],
    sounds: ["./sounds/simonSound1.mp3", "./sounds/simonSound2.mp3", "./sounds/simonSound3.mp3", "./sounds/simonSound4.mp3"],
    isClickable: false,
    isLit: {
      1: false,
      2: false,
      3: false,
      4: false,
    },
  },

  computed: {
    showScore() {
      if (this.isWon) {
        return "Начать сначала?";
      }
      return "Счет: " + this.score;
    },
  },
  methods: {
    startGame() {
      this.playing = true;
      this.sequence = [];
      this.playerSequence = [];
      this.centerButton = "Сброс";
      this.isWon = false;
      this.isWrong = false;
      this.score = 0;
      clearInterval(this.sequenceInterval);
      this.showSequence();
    },
    clicked(tile) {
      if (this.isClickable) {
        this.playSound(tile);
        this.lightUp(tile);
        this.playerSequence.push(tile);
        this.checkWinLose();
      }
    },
    checkWinLose() {
      for (let i = 0; i < this.playerSequence.length; i++) {
        if (this.playerSequence[i] !== this.sequence[i]) {
          this.playerSequence = [];
          this.centerButton = "Неверно!";
          this.isWrong = true;
          setTimeout(() => {
            this.centerButton = "Сброс";
            this.isWrong = false;
          }, 1000);
          this.showSequence(true);
        }
      }
      if (this.playerSequence.length === this.sequence.length) {
        this.playerSequence = [];
        this.score++;
        if (this.score === 10) {
          this.centerButton = "Победа!";
          this.isClickable = false;
          this.isWon = true;
        } else {
          this.showSequence();
        }
      }
    },

    playSound(tile) {
      let sound = new Audio(`${this.sounds[tile - 1]}`);
      sound.muted = false;
      sound.volume = 0.2;
      sound.play();
    },

    lightUp(tile) {
      this.isLit[tile] = true;
      setTimeout(() => {
        this.isLit[tile] = false;
      }, 300);
    },

    changeDiff(difficulty) {
      let newDiff = difficulty;
      this.difficulty = newDiff;
    },

    showSequence(wrong) {
      let currentIndex = 0;
      let speed = this.difficulty;
      this.isClickable = false;
      if (!wrong) {
        this.sequence.push(Math.floor(Math.random() * 4 + 1));
      }
      this.sequenceInterval = setInterval(() => {
        if (currentIndex >= this.sequence.length) {
          clearInterval(this.sequenceInterval);
          return (this.isClickable = true);
        }
        this.playSound(this.sequence[currentIndex]);
        this.lightUp(this.sequence[currentIndex]);
        currentIndex++;
      }, speed);
    },
  },
});
