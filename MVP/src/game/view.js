import GamePage from '../pages/game-page';
import GameOverPage from '../pages/game-over-page';
import GameStartPage from '../pages/game-start-page';

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
    this.gameStartPage.hide()
  }

  // GameOverPage 相关
  initGameOverPage(callbacks) {
    this.gameOverPage = new GameOverPage(callbacks)
    this.gameOverPage.init({
      scene: this.gamePage.scene
    })
  }

  showGameOverPage(newScore) {
    this.gameOverPage.show(newScore)
  }

  // GameStartPage 相关
  initGameStartPage(callbacks) {
    this.gameStartPage = new GameStartPage(callbacks)
    this.gameStartPage.init({
      scene: this.gamePage.scene
    })
  }
  
  showGameStartPage() {
    this.gameStartPage.show()
  }
}

export default new GameView()