import {useState, useReducer, Reducer} from 'react'
import {server} from './server'
import {RemoteDataState} from 'src/types'

interface State<TData> {
    data: TData | null
    loading: RemoteDataState
}

type MutationTuple<TData, TVars> = [
    (variables?: TVars | undefined) => Promise<void>,
    State<TData>
]

type Action<TData> =
    | {type: 'FETCH'}
    | {type: 'FETCH_SUCCESS'; payload: TData}
    | {type: 'FETCH_ERROR'}

const reducer = <TData>(
    state: State<TData>,
    action: Action<TData>
): State<TData> => {
    switch (action.type) {
        case 'FETCH':
            return {...state, loading: 'loading'}
        case 'FETCH_SUCCESS':
            return {...state, data: action.payload, loading: 'done'}
        case 'FETCH_ERROR':
            return {...state, loading: 'error'}
        default:
            throw new Error()
    }
}
type MutationReducer<TData> = Reducer<State<TData>, Action<TData>>

export const useMutation = <TData = any, TVars = any>(
    query: string
): MutationTuple<TData, TVars> => {
    const [state, dispatch] = useReducer<MutationReducer<TData>>(reducer, {
        data: null,
        loading: 'not started',
    })

    const fetch = async (variables?: TVars) => {
        try {
            dispatch({type: 'FETCH'})
            const {data, errors} = await server.fetch<TData, TVars>({
                query,
                variables,
            })

            if (errors && errors.length) {
                throw new Error(errors[0].message)
            }

            dispatch({type: 'FETCH_SUCCESS', payload: data})
        } catch (error) {
            dispatch({type: 'FETCH_ERROR'})
            throw console.error(error)
        }
    }

    return [fetch, state]
}
