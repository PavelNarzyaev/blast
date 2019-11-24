import Model from "../Model";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {
	@property(cc.Label)
	timeLabel: cc.Label = null;

	@property(cc.Label)
	scoresLabel: cc.Label = null;

	onLoad() {
		cc.systemEvent.on(Model.TIMER_EVENT, this.refreshTimer.bind(this));
	}

	start() {
		this.refreshTimer();
	}

	refreshTimer() {
		this.timeLabel.string = Model.gameTimer.toString();
	}

	onDestroy() {
		cc.systemEvent.off(Model.TIMER_EVENT);
	}
}