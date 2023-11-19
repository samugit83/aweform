'use client'

import { Provider, useStore } from 'react-redux';
import store from './store';

export function ReduxProvider({children}) {

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )

}

export {useStore}