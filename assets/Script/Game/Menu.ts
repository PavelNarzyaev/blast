import GameModel from "./GameModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {
	@property(cc.Label)
	protected timeLabel: cc.Label = null;

	@property(cc.Label)
	protected scoresLabel: cc.Label = null;

	private lastSeconds: boolean = false;

	protected onLoad(): void {
		cc.systemEvent.on(GameModel.TIMER_EVENT, this.refreshTimer, this);
		cc.systemEvent.on(GameModel.POINTS_CHANGED_EVENT, this.refreshPoints, this);
	}

	protected start(): void {
		this.refreshTimer();
		this.refreshPoints();
	}

	private refreshTimer(): void {
		if (GameModel.gameTimer <= 5 && !this.lastSeconds) {
			this.lastSeconds = true;
			this.timeLabel.node.color = new cc.Color(255, 0, 0);
		}
		this.timeLabel.string = GameModel.gameTimer.toString();
	}

	private refreshPoints(): void {
		this.scoresLabel.string = GameModel.getPoints().toString();
	}

	protected onDestroy(): void {
		cc.systemEvent.off(GameModel.TIMER_EVENT, this.refreshTimer, this);
		cc.systemEvent.off(GameModel.POINTS_CHANGED_EVENT, this.refreshPoints, this);
	}
}