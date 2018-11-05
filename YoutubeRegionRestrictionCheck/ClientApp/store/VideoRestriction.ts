import {fetch, addTask} from 'domain-task';
import {Action, Reducer, ActionCreator} from 'redux';
import {AppThunkAction} from "./";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface VideoRestrictionState {
    isLoading: boolean;
    videoUrl?: string;
    status: VideoRestrictionStatus;
}

export interface VideoRestrictionStatus {
    id: string;
    title: string;
    regionRestriction: object;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestVideoRestrictionStatus {
    type: 'REQUEST_VIDEO_RESTRICTION_STATUS';
    videoUrl: string;
}

interface ReceiveVideoRestrictionStatus {
    type: 'RECEIVE_VIDEO_RESTRICTION_STATUS';
    videoUrl: string;
    status: VideoRestrictionStatus;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestVideoRestrictionStatus | ReceiveVideoRestrictionStatus;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestVideoRestrictionStatus: (videoUrl: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        if (videoUrl !== getState().videoRestriction.videoUrl) {
            console.log("Are we here to change state ?");
            let fetchTask = fetch(`api/VideoRestriction/GetVideoRestrictionStatus?videoUrl=${ videoUrl }`)
                .then(response => response.json() as Promise<VideoRestrictionStatus>)
                .then(data => {
                    console.log(data);
                    dispatch({type: 'RECEIVE_VIDEO_RESTRICTION_STATUS', videoUrl: videoUrl, status: data});
                });

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({type: 'REQUEST_VIDEO_RESTRICTION_STATUS', videoUrl: videoUrl});
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: VideoRestrictionState = {status: {id: "", title: "", regionRestriction: {}}, isLoading: false};

export const reducer: Reducer<VideoRestrictionState> = (state: VideoRestrictionState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_VIDEO_RESTRICTION_STATUS':
            console.log("Are we here to request ?");
            return {
                ...state,
                videoUrl: action.videoUrl,
                status: state.status,
                isLoading: true
            };
        case 'RECEIVE_VIDEO_RESTRICTION_STATUS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.videoUrl === state.videoUrl) {
                console.log("Are we here to receive ?");
                console.log(action.status);
                return {
                    ...state,
                    videoUrl: action.videoUrl,
                    status: action.status,
                    isLoading: false
                };
            }
            break;
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
