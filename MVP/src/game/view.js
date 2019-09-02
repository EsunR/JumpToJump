import GamePage from '../pages/game-page';
import GameOverPage from '../pages/game-over-page';

class GameView {
  constructor() {

  }

  // GamePage 相关
  initGamePage(callbacks) {
    this.gamePage = new GamePage(callbacks)
    this.gamePage.init()
  }

  showGamePgae() {
    this.gameOverPage.hide()
    this.gamePage.show()
  }

  gameRestart() {
    this.gamePage.restart()
    this.gameOverPage.hide()
  }

  // GameOverPage 相关
  initGameOverPage(callbacks) {
    this.gameOverPage = new GameOverPage(callbacks)
    this.gameOverPage.init({
      scene: this.gamePage.scene
    })
  }

  showGameOverPage() {
    this.gameOverPage.show()
  }
}

export default new GameView()