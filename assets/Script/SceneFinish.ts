import Model from "./Model";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneFinish extends cc.Component {
	@property(cc.Label)
	label: cc.Label = null;

	start() {
		if (Model.win) {
			this.label.string = 'You win!';
		} else {
			this.label.string = 'You lose!';
		}
	}

	onButtonAgainClick() {
		cc.director.loadScene('game');
	}
}
