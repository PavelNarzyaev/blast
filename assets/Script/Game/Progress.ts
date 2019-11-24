import Model from "../Model";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Progress extends cc.Component {
	@property(cc.Sprite)
	bar: cc.Sprite = null;

	@property
	minBarWidth: number = 53;

	@property
	maxBarWidth: number = 756;

	onLoad() {
		cc.systemEvent.on(Model.POINTS_CHANGED_EVENT, this.refreshBar.bind(this));
	}

	start() {
		this.refreshBar();
	}

	refreshBar() {
		this.bar.node.width = this.minBarWidth + (this.maxBarWidth - this.minBarWidth) * Model.getProgress();
	}

	onDestroy() {
		cc.systemEvent.off(Model.POINTS_CHANGED_EVENT);
	}
}