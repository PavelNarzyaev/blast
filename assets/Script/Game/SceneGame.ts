import Model from "../Model";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneGame extends cc.Component {
	@property
	startGameTime: number = 99;

	@property
	targetPoints: number = 5000;

	onLoad() {
		cc.systemEvent.on(Model.TIME_OUT_EVENT, this.onTimeOut.bind(this));
		cc.systemEvent.on(Model.POINTS_CHANGED_EVENT, this.onPointsChanged.bind(this));
	}

	start() {
		Model.launchTimer(this.startGameTime);
		Model.resetPoints();
		Model.setTargetPoints(this.targetPoints);
	}

	onTimeOut() {
		this.loadSceneFinish(false);
	}

	onPointsChanged() {
		if (Model.getProgress() == 1) {
			this.loadSceneFinish(true);
		}
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
		cc.systemEvent.off(Model.POINTS_CHANGED_EVENT);
	}
}
