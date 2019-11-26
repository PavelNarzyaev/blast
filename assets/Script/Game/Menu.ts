import GameModel from "./GameModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {
	@property(cc.Label)
	protected movesLabel: cc.Label = null;

	@property(cc.Label)
	protected scoresLabel: cc.Label = null;

	protected onLoad(): void {
		cc.systemEvent.on(GameModel.MOVE_EVENT, this.refresh, this);
	}

	protected start(): void {
		this.refresh();
	}

	private refresh(): void {
		this.movesLabel.string = GameModel.getRemainingMoves().toString();
		this.scoresLabel.string = GameModel.getPoints().toString();
	}

	protected onDestroy(): void {
		cc.systemEvent.off(GameModel.MOVE_EVENT, this.refresh, this);
	}
}