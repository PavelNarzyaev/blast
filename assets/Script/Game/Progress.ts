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
		cc.systemEvent.on(GameModel.MOVE_EVENT, this.refresh, this);
	}

	protected start(): void {
		this.refresh();
	}

	private refresh(): void {
		this.bar.node.width = this.minBarWidth + (this.maxBarWidth - this.minBarWidth) * GameModel.getProgress();
	}

	protected onDestroy(): void {
		cc.systemEvent.off(GameModel.MOVE_EVENT, this.refresh, this);
	}
}