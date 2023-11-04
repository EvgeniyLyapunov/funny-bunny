import './note-menu-widget.scss';

class NoteMenuWidget {
	constructor(funnybunny) {
		this.funnybunny = funnybunny;

		this.element = null;
		this.btnNewNote = null;
		this.btnLookAll = null;
		this.btnSearch = null;
		this.btnFavorites = null;

		this.state = null;

		this.markUp = this.markUp.bind(this);
		this.renderToDOM = this.renderToDOM.bind(this);
	}

	markUp() {
		return `
      <li class="note-menu__item">
        <button class="note-menu__item-btn note-menu__item-btn-new btn">Новая</button>
        <span class="note-menu__item-descr">Создать новую текстовую заметку</span>
      </li>
      <li class="note-menu__item">
        <button class="note-menu__item-btn note-menu__item-btn-lookall btn">Смотреть все</button>
        <span class="note-menu__item-descr">Вывести списком все сохранённые заметки</span>
      </li>
      <li class="note-menu__item">
        <button class="note-menu__item-btn note-menu__item-btn-search btn">Поиск</button>
        <span class="note-menu__item-descr">Искать заметки по ключевым словам</span>
      </li>
      <li class="note-menu__item">
        <button class="note-menu__item-btn note-menu__item-btn-favorites btn">Избранное</button>
        <span class="note-menu__item-descr">Вывести списком все заметки, помеченные как избранные</span>
      </li>
    `;
	}

	renderToDOM() {
		this.element = document.createElement('ul');
		this.element.classList.add('note-menu');
		this.element.innerHTML = this.markUp();

		this.btnNewNote = this.element.querySelector('.note-menu__item-btn-new');
		this.btnNewNote.addEventListener('click', () => {
			this.funnybunny.newNoteWidget.slideOn(null);
		});

		this.funnybunny.store.state$.subscribe((value) => {
			this.state = value;
		});
		this.funnybunny.store.getState();

		this.btnLookAll = this.element.querySelector('.note-menu__item-btn-lookall');
		this.btnLookAll.addEventListener('click', () => {
			this.funnybunny.btnNote.click();
			setTimeout(() => {
				this.funnybunny.showAllNotes();
			}, 600);
		});

		return this.element;
	}
}

export default NoteMenuWidget;
