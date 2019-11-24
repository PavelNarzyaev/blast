import Model from "../Model";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneFinish extends cc.Component {
	@property(cc.Label)
	protected label: cc.Label = null;

	protected start(): void {
		if (Model.win) {
			this.label.string = 'You win!';
		} else {
			this.label.string = 'You lose!';
		}
	}

	protected onButtonAgainClick(): void {
		cc.director.loadScene('game');
	}
}
