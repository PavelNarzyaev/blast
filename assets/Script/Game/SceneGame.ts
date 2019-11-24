import Model from "../Model";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneGame extends cc.Component {
	@property
	startGameTime: number = 99;

	onLoad() {
		Model.launchTimer(this.startGameTime);
		cc.systemEvent.on(Model.TIME_OUT_EVENT, this.onTimeOut.bind(this));
	}

	onTimeOut() {
		this.loadSceneFinish(false);
	}

	onButtonWinClick(): void {
		this.loadSceneFinish(true);
	}

	onButtonLoseClick(): void {
		this.loadSceneFinish(false);
	}

	loadSceneFinish(win: boolean): void {
		Model.win = win;
		cc.director.loadScene('finish');
	}

	onDestroy() {
		Model.stopTimer();
		cc.systemEvent.off(Model.TIME_OUT_EVENT);
	}
}
