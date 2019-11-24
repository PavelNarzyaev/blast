import Model from "../Model";
import GameModel from "./GameModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneGame extends cc.Component {
	@property
	protected startGameTime: number = 99;

	@property
	protected targetPoints: number = 5000;

	protected onLoad(): void {
		cc.systemEvent.on(GameModel.TIME_OUT_EVENT, this.onTimeOut, this);
		cc.systemEvent.on(GameModel.POINTS_CHANGED_EVENT, this.onPointsChanged, this);
	}

	protected start(): void {
		GameModel.launchTimer(this.startGameTime);
		GameModel.resetPoints();
		GameModel.setTargetPoints(this.targetPoints);
	}

	private onTimeOut(): void {
		this.loadSceneFinish(false);
	}

	private onPointsChanged(): void {
		if (GameModel.getProgress() == 1) {
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
		GameModel.stopTimer();
		cc.systemEvent.off(GameModel.TIME_OUT_EVENT, this.onTimeOut, this);
		cc.systemEvent.off(GameModel.POINTS_CHANGED_EVENT, this.onPointsChanged, this);
	}
}
