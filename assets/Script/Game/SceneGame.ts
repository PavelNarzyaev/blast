import Model from "../Model";
import GameModel from "./GameModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneGame extends cc.Component {
	@property
	protected movesLimit: number = 10;

	@property
	protected targetPoints: number = 2500;

	protected onLoad(): void {
		cc.systemEvent.on(GameModel.MOVE_EVENT, this.onMove, this);
	}

	protected start(): void {
		GameModel.init(this.movesLimit, this.targetPoints);
	}

	private onMove(): void {
		if (GameModel.getProgress() == 1) {
			this.loadSceneFinish(true);
		} else if (GameModel.getRemainingMoves() <= 0) {
			this.loadSceneFinish(false);
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
		cc.systemEvent.off(GameModel.MOVE_EVENT, this.onMove, this);
	}
}
