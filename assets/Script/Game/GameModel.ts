export default class GameModel {
	public static TIMER_EVENT: string = 'timerEvent';
	public static TIME_OUT_EVENT: string = 'timeOutEvent';
	public static POINTS_CHANGED_EVENT: string = 'pointsChangedEvent';
	private static timer: number;
	private static timerId: number;
	private static points: number = 0;
	private static targetPoints: number = 0;
	private static progress: number = 0;

	public static launchTimer(time: number): void {
		GameModel.timer = time;
		GameModel.timerId = window.setInterval(function () {
			GameModel.timer--;
			let event: cc.Event.EventCustom;
			if (GameModel.timer > 0) {
				event = new cc.Event.EventCustom(GameModel.TIMER_EVENT, false);
			} else {
				GameModel.stopTimer();
				event = new cc.Event.EventCustom(GameModel.TIME_OUT_EVENT, false);
			}
			cc.systemEvent.dispatchEvent(event);
		}, 1000);
	}

	public static getTimer(): number {
		return GameModel.timer;
	}

	public static stopTimer(): void {
		window.clearInterval(GameModel.timerId);
	}

	public static addPointsForGroup(groupLength: number): void {
		let addingPoints: number = 0;
		while (groupLength > 1) {
			addingPoints += groupLength * 10;
			groupLength--;
		}
		GameModel.setPoints(GameModel.getPoints() + addingPoints);
	}

	public static resetPoints(): void {
		GameModel.setPoints(0);
	}

	public static getPoints(): number {
		return GameModel.points;
	}

	private static setPoints(value: number): void {
		GameModel.points = value;
		this.recalculateProgress();
		cc.systemEvent.dispatchEvent(new cc.Event.EventCustom(GameModel.POINTS_CHANGED_EVENT, false));
	}

	public static setTargetPoints(value: number): void {
		GameModel.targetPoints = value;
		this.recalculateProgress();
	}

	public static recalculateProgress(): void {
		GameModel.progress = GameModel.targetPoints ? Math.min(GameModel.points / GameModel.targetPoints, 1) : 0;
	}

	public static getProgress(): number {
		return GameModel.progress;
	}
}
