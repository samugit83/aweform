import {configureStore} from '@reduxjs/toolkit'
import manageformReducer from './reduxfeat/manageformslice.js'

export default configureStore({
    reducer: {
        manageform: manageformReducer
    }
});