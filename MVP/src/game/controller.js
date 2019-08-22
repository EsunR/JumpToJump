import gameView from './view';
import gameModel from './model';

class GameController {
  constructor() {
    this.gameView = gameView;
    this.gameModel = gameModel;
  }

  showGameOverPage = () => {
    this.gameView.showGameOverPage()
  }

  gameRestart = () => {
    this.gameView.gameRestart()
  }

  initPages() {
    const gamePageCallbacks = {
      showGameOverPage: this.showGameOverPage
    }
    const gameOverPageCallbacks = {
      gameRestart: this.gameRestart
    }
    
    // 注入的callbaks最终传入到页面实例上
    this.gameView.initGamePage(gamePageCallbacks)
    this.gameView.initGameOverPage(gameOverPageCallbacks)
  }
}

export default new GameController()