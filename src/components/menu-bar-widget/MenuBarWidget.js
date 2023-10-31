import './menu-bar-widget.scss';

class MenuBarWidget {
	constructor(paraentElement, button, contentWidget) {
		this.paraentElement = paraentElement;
		this.button = button;
		this.contentWidget = contentWidget;

		this.menubarElement = null;

		this.menuShow = this.menuShow.bind(this);
		this.menuClose = this.menuClose.bind(this);

		this.button.addEventListener('click', this.menuShow);
	}

	menuShow() {
		if (!this.menubarElement) {
			this.menubarElement = this.contentWidget.renderToDOM();
			this.paraentElement.insertAdjacentElement('afterbegin', this.menubarElement);
			this.menubarElement.classList.add('show');
			this.button.removeEventListener('click', this.menuShow);
			this.button.addEventListener('click', this.menuClose);
		}
	}

	menuClose() {
		this.menubarElement.classList.remove('show');
		this.menubarElement.classList.add('hide');
		this.button.removeEventListener('click', this.menuClose);
		this.button.addEventListener('click', this.menuShow);
		setTimeout(() => {
			this.menubarElement.remove();
			this.menubarElement = null;
		}, 600);
	}
}

export default MenuBarWidget;
