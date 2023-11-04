import { Subject, startWith, scan, share } from 'rxjs';
import { ACTIONS, reduce } from './actions';

class Store {
	constructor() {
		this.initialState = {
			notes: [],
		};
		this.actions$ = new Subject();
		this.state$ = this.actions$.asObservable().pipe(
			startWith({ type: 'INITIALIZATION' }),
			scan((state, action) => reduce(state, action), this.initialState),
			share()
		);
	}

	dispatch(type, payload = null) {
		this.actions$.next({ type, payload });
	}

	getSavedState(value = null) {
		this.dispatch(ACTIONS.getSavedState, value);
	}

	getState(value = null) {
		this.dispatch(ACTIONS.getState, value);
	}

	saveChangedNote(value = null) {
		this.dispatch(ACTIONS.saveChangedNote, value);
	}

	saveNewNote(value = null) {
		this.dispatch(ACTIONS.saveNewNote, value);
	}

	deleteNote(value = null) {
		this.dispatch(ACTIONS.deleteNote, value);
	}
}

export default Store;
