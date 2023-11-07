import moment from 'moment/moment';

import './notes-list.scss';

class NotesList {
	constructor(parentElement, funnybunny) {
		this.parentElement = parentElement;
		this.funnybunny = funnybunny;
		this.element = null;

		this.list = [];
		this.pinnedNote = null;

		this.createNotes = this.createNotes.bind(this);
		this.renderToDOM = this.renderToDOM.bind(this);
		this.removeElement = this.removeElement.bind(this);
		this.reRenderToDOM = this.reRenderToDOM.bind(this);
		this.addNewNote = this.addNewNote.bind(this);
	}

	markUp(note) {
		return `
			<div class="note__header">
				<div class="note__header-date">
					<span class="note__header-date-info">${moment
						.unix(note.date / 1000)
						.format('HH:mm DD.MM.YY')}</span>
					<span class="note__header-date-favorites"></span>
				</div>
				<span class="note__header-pin"></span>
			</div>
			<div class="note__main">${note.text}</div>
			<div class="note__footer">
				<span class="note__footer-pen"></span>
				<span class="note__footer-trash"></span>
			</div>
		`;
	}

	createNotes(noteData) {
		const note = document.createElement('li');
		note.classList.add('note');
		note.setAttribute('data-id', noteData.id);
		note.innerHTML = this.markUp(noteData);

		const favoritesElement = note.querySelector('.note__header-date-favorites');
		if (noteData.favorite) {
			favoritesElement.classList.add('note__header-date-favorites_active');
		}

		favoritesElement.addEventListener('click', () => {
			this.funnybunny.onSetFavorites(noteData.id);
		});

		const pinElement = note.querySelector('.note__header-pin');
		if (noteData.pinned) {
			pinElement.classList.add('note__header-pin_active');
		}

		pinElement.addEventListener('click', () => {
			this.funnybunny.onSetPinned(noteData.id);
		});

		const editBtn = note.querySelector('.note__footer-pen');
		editBtn.addEventListener('click', () => {
			this.funnybunny.onEditNote(noteData.id);
		});

		const deleteBtn = note.querySelector('.note__footer-trash');
		deleteBtn.addEventListener('click', () => {
			this.funnybunny.onDeleteConfirm(noteData.id);
		});

		this.list.push(note);
		return note;
	}

	renderToDOM(notesDataList, animate = true) {
		if (this.element !== null) {
			this.reRenderToDOM(notesDataList, animate);
			return;
		}
		this.element = document.createElement('ul');
		this.element.classList.add('notes-list');

		notesDataList.forEach((noteItem) => {
			if (!noteItem.pinned) {
				const note = this.createNotes(noteItem);
				this.element.insertAdjacentElement('beforeend', note);
			} else {
				const note = this.createNotes(noteItem);
				this.pinnedNote = noteItem;
				this.element.insertAdjacentElement('afterbegin', note);
			}
		});

		this.parentElement.insertAdjacentElement('beforeend', this.element);

		if (!animate) return;

		this.element.classList.add('animate__animated', 'animate__zoomIn');
	}

	removeElement() {
		this.element.classList.remove('animate__animated', 'animate__zoomIn');
		this.element.classList.add('animate__animated', 'animate__zoomOut', 'animate__slow');
		setTimeout(() => {
			this.element.remove();
			this.element = null;
			this.list = [];
		}, 1000);
	}

	reRenderToDOM(notesDataList, animate) {
		if (this.element) {
			this.element.remove();
			this.element = null;
			this.list = [];
		}
		this.renderToDOM(notesDataList, animate);
	}

	addNewNote(noteData) {
		const note = this.createNotes(noteData);
		this.list.push(note);
		this.element.insertAdjacentElement('beforeend', note);
		this.parentElement.scrollTop = 1e9;
	}
}

export default NotesList;
