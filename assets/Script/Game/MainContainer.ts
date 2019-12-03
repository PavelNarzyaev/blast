import Field from "./Field";
import Menu from "./Menu";
import Progress from "./Progress";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainContainer extends cc.Component {
	@property(Field)
	protected field: Field = null;

	@property
	protected fieldFrameWidth: number = .5;

	@property
	protected fieldFrameHeight: number = .75;

	@property
	protected gapBetweenFieldAndMenu: number = .05;

	@property(Menu)
	protected menu: Menu = null;

	@property
	protected menuFrameWidth: number = .35;

	@property
	protected menuFrameHeight: number = .5;

	@property(Progress)
	protected progress: Progress = null;

	@property
	protected progressFrameWidth: number = .8;

	@property
	protected progressFrameHeight: number = .1;

	protected onLoad(): void {
		this.node.on(cc.Node.EventType.SIZE_CHANGED, this.alignElements, this);
	}

	protected start(): void {
		this.field.alignNode();
		this.alignElements();
	}

	private alignElements(): void {
		this.field.node.scale = this.calculateNodeScale(this.field.node, this.fieldFrameWidth, this.fieldFrameHeight);
		this.menu.node.scale = this.calculateNodeScale(this.menu.node, this.menuFrameWidth, this.menuFrameHeight);
		this.progress.node.scale = this.calculateNodeScale(this.progress.node, this.progressFrameWidth, this.progressFrameHeight);

		const gap: number = this.node.width * this.gapBetweenFieldAndMenu;
		const totalWidth: number = (this.field.node.width * this.field.node.scale) + gap + (this.menu.node.width * this.menu.node.scale);
		this.field.node.x = (this.node.width - totalWidth) / 2;
		this.menu.node.x = this.field.node.x + (this.field.node.width * this.field.node.scale) + gap;
	}

	private calculateNodeScale(node: cc.Node, frameWidth: number, frameHeight: number): number {
		const scaleByWidth: number = this.node.width * frameWidth / node.width;
		const scaleByHeight: number = this.node.height * frameHeight / node.height;
		return Math.min(scaleByWidth, scaleByHeight);
	}

	protected onDestroy(): void {
		this.node.off(cc.Node.EventType.SIZE_CHANGED, this.alignElements, this);
	}
}