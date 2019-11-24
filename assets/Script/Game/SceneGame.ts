import Model from "../Model";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneGame extends cc.Component {
	@property
	protected startGameTime: number = 99;

	@property
	protected targetPoints: number = 5000;

	protected onLoad(): void {
		cc.systemEvent.on(Model.TIME_OUT_EVENT, this.onTimeOut.bind(this));
		cc.systemEvent.on(Model.POINTS_CHANGED_EVENT, this.onPointsChanged.bind(this));
	}

	protected start(): void {
		Model.launchTimer(this.startGameTime);
		Model.resetPoints();
		Model.setTargetPoints(this.targetPoints);
	}

	private onTimeOut(): void {
		this.loadSceneFinish(false);
	}

	private onPointsChanged(): void {
		if (Model.getProgress() == 1) {
			this.loadSceneFinish(true);
		}
	}

	protected onButtonWinClick(): void {
		this.loadSceneFinish(true);
	}

	protected onButtonLoseClick(): void {
		this.loadSceneFinish(false);
	}

	private loadSceneFinish(win: boolean): void {
		Model.win = win;
		cc.director.loadScene('finish');
	}

	protected onDestroy(): void {
		Model.stopTimer();
		cc.systemEvent.off(Model.TIME_OUT_EVENT);
		cc.systemEvent.off(Model.POINTS_CHANGED_EVENT);
	}
}
