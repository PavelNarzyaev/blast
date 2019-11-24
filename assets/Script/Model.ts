export default class Model {
	public static TIMER_EVENT: string = 'timerEvent';
	public static TIME_OUT_EVENT: string = 'timeOutEvent';
	public static win = false;
	public static gameTimer: number;
	private static timerId: number;
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
}
