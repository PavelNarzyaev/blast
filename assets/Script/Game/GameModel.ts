export default class GameModel {
	public static MOVE_EVENT: string = 'moveEvent';
	private static points: number = 0;
	private static remainingMoves: number = 0;
	private static targetPoints: number = 0;
	private static progress: number = 0;

	public static init(movesLimit: number, targetPoints: number): void {
		this.remainingMoves = movesLimit;
		this.targetPoints = targetPoints;
		this.points = 0;
		this.progress = 0;
	}

	public static getRemainingMoves(): number {
		return GameModel.remainingMoves;
	}

	public static getPoints(): number {
		return GameModel.points;
	}

	public static getProgress(): number {
		return GameModel.progress;
	}

	public static move(groupLength: number): void {
		this.addPointsForGroup(groupLength);
		this.remainingMoves--;
		cc.systemEvent.dispatchEvent(new cc.Event.EventCustom(GameModel.MOVE_EVENT, false));
	}

	private static addPointsForGroup(groupLength: number): void {
		let addingPoints: number = 0;
		while (groupLength > 1) {
			addingPoints += groupLength * 10;
			groupLength--;
		}
		GameModel.points += addingPoints;
		GameModel.progress = Math.min(GameModel.points / GameModel.targetPoints, 1);
	}
}
