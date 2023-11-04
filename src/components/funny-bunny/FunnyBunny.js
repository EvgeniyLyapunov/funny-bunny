import MenuBarWidget from '../menu-bar-widget/MenuBarWidget';
import NoteMenuWidget from '../note-menu-widget/NoteMenuWidget';
import NewNoteWidget from '../new-note-widget/NewNoteWidget';
import NotesList from '../notes-list/NotesList';
import ConfirmModal from '../confirm-modal/ConfirmModal';
import { titleMsgStream, titleMsgObserver } from '../message-from-title-widget/messageFromTitle';
import { getRequest, postRequest, putRequest, deleteRequest } from '../../services/httpService';
import Store from '../../store/Store';

import './funny-bunny.scss';
import rabbit from './rabbit-girlfriend.png';

class FunnyBunny {
	constructor(parentElement) {
		this.parentElement = parentElement;
		this.element = null;
		this.viewElement = null;
		this.title = null;

		this.btnNote = null;

		this.state = null;
		this.activeElementInView = [];

		this.store = new Store();
		this.store.state$.subscribe((value) => {
			this.state = value;
		});

		this.noteMenuWidget = new NoteMenuWidget(this);
		this.newNoteWidget = new NewNoteWidget(this.parentElement, this);
		this.notesList = null;

		this.onSubmitNewNote = this.onSubmitNewNote.bind(this);
		this.showAllNotes = this.showAllNotes.bind(this);
		this.onSetFavorites = this.onSetFavorites.bind(this);
		this.onSetPinned = this.onSetPinned.bind(this);
		this.onEditNote = this.onEditNote.bind(this);
		this.onDeleteNote = this.onDeleteNote.bind(this);
	}

	markUp() {
		return `
      <div class="funny-bunny__top">
        <div class="funny-bunny__top-header">
          <div class="funny-bunny__top-header-pic-box">
            <img class="funny-bunny__top-header-img" src=${rabbit} alt="funny bunny">
          </div>
          <h1 class="funny-bunny__top-header-title">funny bunny</h1>
        </div>
      </div>
      <div class="funny-bunny__control">
        <button class="btn">Сервисы</button>
        <button class="btn">Добавить</button>
        <button class="btn">Загрузки</button>
        <button class="btn">Избранное</button>
        <button class="btn btn-note">Заметка</button>
      </div>
      <div class="funny-bunny__view">
        <ul class="funny-bunny__view-list"></ul>
      </div>
    `;
	}

	async renderToDOM() {
		this.element = document.createElement('div');
		this.element.classList.add('funny-bunny');
		this.element.innerHTML = this.markUp();
		this.parentElement.insertAdjacentElement('afterbegin', this.element);

		this.viewElement = this.element.querySelector('.funny-bunny__view');
		this.notesList = new NotesList(this.viewElement, this);
		this.title = this.element.querySelector('.funny-bunny__top-header-title');

		this.btnNote = this.element.querySelector('.btn-note');
		new MenuBarWidget(this.viewElement, this.btnNote, this.noteMenuWidget, this);

		try {
			const result = await getRequest();
			if (result.status === 200) {
				this.store.getSavedState(result.data);
			}
		} catch (error) {
			const titleStream$ = titleMsgStream(this.title, 'Сохранёные заметки не загружены');
			titleStream$.subscribe(titleMsgObserver);
		}

		this.newNoteWidget.renderToDOM();
	}

	async onSubmitNewNote(note) {
		let result;

		if (this.newNoteWidget.noteForEdit) {
			result = await putRequest('/notes', JSON.stringify(note));
		} else {
			result = await postRequest('/notes', JSON.stringify(note));
		}

		if (!result.data) {
			const titleStream$ = titleMsgStream(this.title, 'Ошибка при сохранении!');
			titleStream$.subscribe(titleMsgObserver);
			return;
		}

		if (this.newNoteWidget.noteForEdit) {
			this.store.saveChangedNote(result.data);
		} else {
			this.store.saveNewNote(result.data);
		}

		if (this.activeElementInView.length > 0) {
			if (this.newNoteWidget.noteForEdit) {
				this.notesList.reRenderToDOM(this.state.notes, false);
				this.newNoteWidget.noteForEdit = null;
			} else {
				this.notesList.addNewNote(result.data);
			}
		}

		this.newNoteWidget.noteForEdit = null;
		const titleStream$ = titleMsgStream(this.title, 'Заметка успешно сохранена!');
		titleStream$.subscribe(titleMsgObserver);
	}

	showAllNotes() {
		this.notesList.renderToDOM(this.state.notes, true);
		this.activeElementInView.push(this.notesList);
	}

	async onSetFavorites(id) {
		const favoriteNote = this.state.notes.filter((n) => n.id === id)[0];

		favoriteNote.favorite = favoriteNote.favorite === true ? false : true;

		const result = await putRequest('/notes', JSON.stringify(favoriteNote));
		if (!result.data) {
			const titleStream$ = titleMsgStream(this.title, 'Ошибка при добавлении в избранное!');
			titleStream$.subscribe(titleMsgObserver);
			return;
		}

		this.store.saveChangedNote(result.data);
		this.notesList.renderToDOM(result.data, false);

		if (favoriteNote.favorite) {
			const titleStream$ = titleMsgStream(this.title, 'Заметка добавлена в избранные!');
			titleStream$.subscribe(titleMsgObserver);
		} else {
			const titleStream$ = titleMsgStream(this.title, 'Заметка удалена из избранных!');
			titleStream$.subscribe(titleMsgObserver);
		}
	}

	async onSetPinned(id) {
		const pinnedNow = this.state.notes.filter((n) => n.id === id)[0];
		if (this.notesList.pinnedNote && this.notesList.pinnedNote !== pinnedNow) {
			const titleStream$ = titleMsgStream(this.title, 'Закрепить можно только одну заметку!');
			titleStream$.subscribe(titleMsgObserver);
			return;
		}

		if (this.notesList.pinnedNote === pinnedNow) {
			pinnedNow.pinned = false;
			this.notesList.pinnedNote = null;
		} else {
			pinnedNow.pinned = true;
			this.notesList.pinnedNote = pinnedNow;
		}

		const result = await putRequest('/notes', JSON.stringify(pinnedNow));

		if (!result.data) {
			const titleStream$ = titleMsgStream(this.title, 'Ошибка при закреплении заметки!');
			titleStream$.subscribe(titleMsgObserver);
			return;
		}

		this.store.saveChangedNote(result.data);
		this.notesList.renderToDOM(result.data, false);

		if (pinnedNow.pinned) {
			const titleStream$ = titleMsgStream(this.title, 'Заметка закреплена в начале списка!');
			titleStream$.subscribe(titleMsgObserver);
		} else {
			const titleStream$ = titleMsgStream(this.title, 'Заметка откреплена!');
			titleStream$.subscribe(titleMsgObserver);
		}
	}

	onEditNote(id) {
		const selectedNote = this.state.notes.filter((n) => n.id === id)[0];
		this.newNoteWidget.slideOn(selectedNote);
	}

	onDeleteConfirm(id) {
		const deleteConfirmModal = new ConfirmModal(this.viewElement, this, id);
		deleteConfirmModal.renderToDOM();
	}

	async onDeleteNote(id) {
		const result = await deleteRequest('/notes', id);

		if (!result.data) {
			const titleStream$ = titleMsgStream(this.title, 'Ошибка при удалении заметки!');
			titleStream$.subscribe(titleMsgObserver);
			return;
		}

		this.store.saveChangedNote(result.data);
		this.notesList.renderToDOM(result.data, false);

		const titleStream$ = titleMsgStream(this.title, 'Заметка удалена!');
		titleStream$.subscribe(titleMsgObserver);
	}
}

export default FunnyBunny;
