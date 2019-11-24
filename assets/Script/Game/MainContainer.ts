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
		this.alignElements();
	}

	private alignElements(): void {
		this.resizeField();
		this.resizeMenu();
		this.resizeProgress();

		const gap: number = this.node.width * this.gapBetweenFieldAndMenu;
		const totalWidth: number = this.field.node.width + gap + (this.menu.node.width * this.menu.node.scale);
		this.field.node.x = (this.node.width - totalWidth) / 2;
		this.menu.node.x = this.field.node.x + this.field.node.width + gap;
	}

	private resizeField(): void {
		const viewportFrameWidth: number = this.node.width * this.fieldFrameWidth - this.field.calculateViewportHorizontalMargins();
		const viewportFrameHeight: number = this.node.height * this.fieldFrameHeight - this.field.calculateViewportVerticalMargins();
		const viewportFrameAspectRatio: number = viewportFrameWidth / viewportFrameHeight;
		const viewportAspectRatio: number = this.field.calculateViewportAspectRatio();

		if (viewportAspectRatio > viewportFrameAspectRatio) {
			this.field.node.width = viewportFrameWidth + this.field.calculateViewportHorizontalMargins();
			this.field.node.height = viewportFrameWidth / viewportAspectRatio + this.field.calculateViewportVerticalMargins();
		} else if (viewportAspectRatio < viewportFrameAspectRatio) {
			this.field.node.height = viewportFrameHeight + this.field.calculateViewportVerticalMargins();
			this.field.node.width = viewportFrameHeight * viewportAspectRatio + this.field.calculateViewportHorizontalMargins();
		} else {
			this.field.node.width = viewportFrameWidth + this.field.calculateViewportHorizontalMargins();
			this.field.node.height = viewportFrameHeight + this.field.calculateViewportVerticalMargins();
		}
	}

	private resizeMenu(): void {
		const scaleByWidth: number = this.node.width * this.menuFrameWidth / this.menu.node.width;
		const scaleByHeight: number = this.node.height * this.menuFrameHeight / this.menu.node.height;
		this.menu.node.scale = Math.min(scaleByWidth, scaleByHeight);
	}

	private resizeProgress(): void {
		const scaleByWidth: number = this.node.width * this.progressFrameWidth / this.progress.node.width;
		const scaleByHeight: number = this.node.height * this.progressFrameHeight / this.progress.node.height;
		this.progress.node.scale = Math.min(scaleByWidth, scaleByHeight);
	}

	protected onDestroy(): void {
		this.node.off(cc.Node.EventType.SIZE_CHANGED, this.alignElements, this);
	}
}