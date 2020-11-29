import * as ActionTypes from './ActionTypes';

export const comments = (state = { errMess: null, comments: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_COMMENTS:
            return {...state, errMess: null, comments: action.payload};

        case ActionTypes.COMMENTS_FAILED:
            return {...state, errMess: action.payload};

        case ActionTypes.ADD_COMMENT:
            console.log('Action payload is :', action.payload)
            action.payload.id = state.comments.length;
            return {...state, errMess: null, comments: state.comments.concat(action.payload)};

        default:
            return state;
    }
};