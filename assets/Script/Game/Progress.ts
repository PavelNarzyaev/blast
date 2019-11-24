import GameModel from "./GameModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Progress extends cc.Component {
	@property(cc.Sprite)
	protected bar: cc.Sprite = null;

	@property
	protected minBarWidth: number = 53;

	@property
	protected maxBarWidth: number = 756;

	protected onLoad(): void {
		cc.systemEvent.on(GameModel.POINTS_CHANGED_EVENT, this.refreshBar, this);
	}

	protected start(): void {
		this.refreshBar();
	}

	private refreshBar(): void {
		this.bar.node.width = this.minBarWidth + (this.maxBarWidth - this.minBarWidth) * GameModel.getProgress();
	}

	protected onDestroy(): void {
		cc.systemEvent.off(GameModel.POINTS_CHANGED_EVENT, this.refreshBar, this);
	}
}