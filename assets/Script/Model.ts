export default class Model {
	public static TIMER_EVENT: string = 'timerEvent';
	public static TIME_OUT_EVENT: string = 'timeOutEvent';
	public static POINTS_CHANGED_EVENT: string = 'pointsChangedEvent';
	public static win = false;
	public static gameTimer: number;
	private static timerId: number;
	private static points: number = 0;
	private static targetPoints: number = 0;
	private static progress: number = 0;

	public static launchTimer(time: number): void {
		Model.gameTimer = time;
		Model.timerId = window.setInterval(function () {
			Model.gameTimer--;
			let event: cc.Event.EventCustom;
			if (Model.gameTimer > 0) {
				event = new cc.Event.EventCustom(Model.TIMER_EVENT, false);
			} else {
				Model.stopTimer();
				event = new cc.Event.EventCustom(Model.TIME_OUT_EVENT, false);
			}
			cc.systemEvent.dispatchEvent(event);
		}, 1000);
	}

	public static stopTimer(): void {
		window.clearInterval(Model.timerId);
	}

	public static addPointsForGroup(groupLength: number): void {
		let addingPoints: number = 0;
		while (groupLength > 1) {
			addingPoints += groupLength * 10;
			groupLength--;
		}
		Model.setPoints(Model.getPoints() + addingPoints);
	}

	public static resetPoints(): void {
		Model.setPoints(0);
	}

	public static getPoints(): number {
		return Model.points;
	}

	private static setPoints(value: number): void {
		Model.points = value;
		this.recalculateProgress();
		cc.systemEvent.dispatchEvent(new cc.Event.EventCustom(Model.POINTS_CHANGED_EVENT, false));
	}

	public static setTargetPoints(value: number): void {
		Model.targetPoints = value;
		this.recalculateProgress();
	}

	public static recalculateProgress(): void {
		Model.progress = Model.targetPoints ? Math.min(Model.points / Model.targetPoints, 1) : 0;
	}

	public static getProgress(): number {
		return Model.progress;
	}
}
