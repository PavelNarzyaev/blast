import Model from "../Model";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {
	@property(cc.Label)
	timeLabel: cc.Label = null;

	@property(cc.Label)
	scoresLabel: cc.Label = null;

	lastSeconds: boolean = false;

	onLoad() {
		cc.systemEvent.on(Model.TIMER_EVENT, this.refreshTimer.bind(this));
		cc.systemEvent.on(Model.POINTS_CHANGED_EVENT, this.refreshPoints.bind(this));
	}

	start() {
		this.refreshTimer();
		this.refreshPoints();
	}

	refreshTimer() {
		if (Model.gameTimer <= 5 && !this.lastSeconds) {
			this.lastSeconds = true;
			this.timeLabel.node.color = new cc.Color(255, 0, 0);
		}
		this.timeLabel.string = Model.gameTimer.toString();
	}

	refreshPoints() {
		this.scoresLabel.string = Model.getPoints().toString();
	}

	onDestroy() {
		cc.systemEvent.off(Model.TIMER_EVENT);
		cc.systemEvent.off(Model.POINTS_CHANGED_EVENT);
	}
}