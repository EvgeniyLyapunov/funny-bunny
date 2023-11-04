const ACTIONS = {
	getState: 'GETSTATE',
	saveNewNote: 'SAVENEWNOTE',
	saveChangedNote: 'SAVECHANGEDNOTE',
	deleteNote: 'DELETENOTE',
	getSavedState: 'GETSAVEDSTATE',
};

function reduce(state, action) {
	switch (action.type) {
		case ACTIONS.getState:
			return state;
		case ACTIONS.saveNewNote:
			return { ...state, notes: [...state.notes, action.payload] };
		case ACTIONS.saveChangedNote:
			return { ...state, notes: [...action.payload] };
		case ACTIONS.deleteNote:
			const notes = state.notes.filter((n) => n.id !== action.payload);
			return { ...state, notes: [...notes] };
		case ACTIONS.getSavedState:
			return { ...state, ...action.payload };
		default:
			return state;
	}
}

export { ACTIONS, reduce };
