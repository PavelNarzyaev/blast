const { ccclass } = cc._decorator;

@ccclass
export default class SceneStart extends cc.Component {
	protected onButtonStartClick(): void {
		cc.director.loadScene('game');
	}
}
