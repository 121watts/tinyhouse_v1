import {useCallback, useEffect, useState, useReducer, Reducer} from 'react'
import {server} from './server'
import {RemoteDataState} from 'src/types'

interface State<TData> {
    data: TData | null
    loading: RemoteDataState
}

interface QueryResult<TData> extends State<TData> {
    refetch: () => void
}

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

type QueryReducer<TData> = Reducer<State<TData>, Action<TData>>

export const useQuery = <TData = any>(query: string): QueryResult<TData> => {
    const [state, dispatch] = useReducer<QueryReducer<TData>>(reducer, {
        data: null,
        loading: 'not started',
    })

    const fetch = useCallback(() => {
        const fetchApi = async () => {
            try {
                dispatch({type: 'FETCH'})
                const {data, errors} = await server.fetch<TData>({query})

                if (errors && errors.length) {
                    throw new Error(errors[0].message)
                }

                dispatch({type: 'FETCH_SUCCESS', payload: data})
            } catch (error) {
                dispatch({type: 'FETCH_ERROR'})
                throw console.error(error)
            }
        }

        fetchApi()
    }, [query])

    useEffect(() => {
        fetch()
    }, [fetch])

    return {...state, refetch: fetch}
}
