import { UserConstants } from 'Constants';

export function users(state = {}, action) {
    switch (action.type) {
        // case UserConstants.GETALL_REQUEST:
        //   return {
        //     loading: true
        //   };
        // case UserConstants.GETALL_SUCCESS:
        //   return {
        //     items: action.users
        //   };
        // case UserConstants.GETALL_FAILURE:
        //   return { 
        //     error: action.error
        //   };
        case UserConstants.DELETE_REQUEST:
            // add 'deleting:true' property to user being deleted
            return {
                ...state,
                items: state.items.map(user =>
                    user.id === action.id
                        ? { ...user, deleting: true }
                        : user
                )
            };
        default:
            return state;
    }
}