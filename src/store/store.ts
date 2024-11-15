import { configureStore } from '@reduxjs/toolkit'
import { createActionLog, ActionLog } from 'redux-action-log'
import rootReducer from './RootReducer'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { Action } from 'redux';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['authReducer'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

//  export const actionLog = createActionLog({ limit: 200 })
export const actionLog: ActionLog<any, Action> = createActionLog({ limit: 200 });

export const setupStore = () => {
    const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
            // enhancers: (getDefaultEnhancers) => {
            //     const defaultEnhancers = getDefaultEnhancers();
            //     return [
            //       ...defaultEnhancers,  
            //       actionLog.enhancer,  
            //     ] as const;  
            //   },
    })
    
    const persistor = persistStore(store)
    console.log(store.getState()); 
    return {
        store: store,
        persistor: persistor,
    }
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['store']['dispatch']
