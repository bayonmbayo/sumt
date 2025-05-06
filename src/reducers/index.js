import { combineReducers } from 'redux';
import { profil, profiles } from './profile.reducer';
import { quote } from './quote.reducer';
import { transfer } from './transfer.reducer';
import { transfers } from './transfers.reducer';
import { user } from './user.reducer';


const rootReducer = combineReducers({
    quote,
    transfer,
    transfers,
    user,
    profil,
    profiles
});

export default rootReducer;