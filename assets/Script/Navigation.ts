const {ccclass} = cc._decorator;

@ccclass
export default class Navigation extends cc.Component {
	private sceneNameByKeyCode: object = {};

	start() {
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

		this.sceneNameByKeyCode[49] = 'start';
		this.sceneNameByKeyCode[50] = 'game';
		this.sceneNameByKeyCode[51] = 'finish';
	}

	private onKeyDown(e: KeyboardEvent): void {
		const sceneName: string = this.sceneNameByKeyCode[e.keyCode];
		if (sceneName) {
			cc.director.loadScene(sceneName);
		}
	}
}
