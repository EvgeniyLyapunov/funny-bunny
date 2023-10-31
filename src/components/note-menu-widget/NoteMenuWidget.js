import './note-menu-widget.scss';

class NoteMenuWidget {
	constructor(fdWidget) {
		this.fdWidget = fdWidget;
		this.element = null;

		this.markUp = this.markUp.bind(this);
		this.renderToDOM = this.renderToDOM.bind(this);
	}

	markUp() {
		return `
      <li class="note-menu__item">
        <button class="note-menu__item-btn btn">Новая</button>
        <span class="note-menu__item-descr">Создать новую текстовую заметку</span>
      </li>
      <li class="note-menu__item">
        <button class="note-menu__item-btn btn">Смотреть все</button>
        <span class="note-menu__item-descr">Вывести списком все сохранённые заметки</span>
      </li>
      <li class="note-menu__item">
        <button class="note-menu__item-btn btn">Поиск</button>
        <span class="note-menu__item-descr">Искать заметки по ключевым словам</span>
      </li>
      <li class="note-menu__item">
        <button class="note-menu__item-btn btn">Избранное</button>
        <span class="note-menu__item-descr">Вывести списком все заметки, помеченные как избранные</span>
      </li>
    `;
	}

	renderToDOM() {
		this.element = document.createElement('ul');
		this.element.classList.add('note-menu');
		this.element.innerHTML = this.markUp();

		return this.element;
	}
}

export default NoteMenuWidget;
