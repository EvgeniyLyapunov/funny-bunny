import './loading.scss';

class LoadingSpinner {
	constructor(parentElement) {
		this.parentElement = parentElement;
		this.element = null;

		this.removeElement = this.removeElement.bind(this);
	}

	markUp() {
		return `
      <div class='lds-roller'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    `;
	}

	renderToDOM() {
		this.element = document.createElement('div');
		this.element.classList.add('loading');
		this.element.innerHTML = this.markUp();
		this.parentElement.insertAdjacentElement('afterbegin', this.element);
	}

	removeElement() {
		this.element.remove();
		this.element = null;
	}
}

export default LoadingSpinner;
