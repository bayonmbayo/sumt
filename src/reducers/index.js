import { combineReducers } from 'redux';
import { quote } from './quote.reducer';
import { transfer } from './transfer.reducer';
import { transfers } from './transfers.reducer';


const rootReducer = combineReducers({
    quote,
    transfer,
    transfers
});

export default rootReducer;