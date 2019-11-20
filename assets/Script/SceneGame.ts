import Model from "./Model";

const { ccclass } = cc._decorator;

@ccclass
export default class SceneGame extends cc.Component {
	onButtonWinClick(): void {
		Model.win = true;
		this.loadSceneFinish();
	}

	onButtonLoseClick(): void {
		Model.win = false;
		this.loadSceneFinish();
	}

	loadSceneFinish(): void {
		cc.director.loadScene('finish');
	}
}
