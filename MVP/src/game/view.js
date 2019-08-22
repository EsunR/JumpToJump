import GamePage from '../pages/game-page';
import GameOverPage from '../pages/game-over-page';

class GameView {
  constructor() {

  }

  showGameOverPage() {
    this.gameOverPage.show()
  }

  gameRestart() {
    this.gamePage.restart()
  }

  initGameOverPage(callbacks) {
    this.gameOverPage = new GameOverPage(callbacks)
    this.gameOverPage.init({
      scene: this.gamePage.scene
    })
  }

  initGamePage(callbacks) {
    this.gamePage = new GamePage(callbacks)
    this.gamePage.init()
  }
}

export default new GameView()