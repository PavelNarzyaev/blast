const { ccclass } = cc._decorator;

@ccclass
export default class SceneStart extends cc.Component {
	onButtonStartClick(): void {
		cc.director.loadScene('game');
	}
}
