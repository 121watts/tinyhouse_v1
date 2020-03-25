import {useCallback, useEffect, useState} from 'react'
import {server} from './server'

export type RemoteDataState = 'not started' | 'loading' | 'error' | 'done'

interface State<TData> {
    data: TData | null
    loading: RemoteDataState
}

export const useQuery = <TData = any>(query: string) => {
    const [state, setState] = useState<State<TData>>({
        data: null,
        loading: 'not started',
    })

    const fetch = useCallback(() => {
        const fetchApi = async () => {
            try {
                setState({data: null, loading: 'loading'})
                const {data, errors} = await server.fetch<TData>({query})

                if (errors && errors.length) {
                    setState({data, loading: 'error'})
                    throw new Error(errors[0].message)
                }

                setState({data, loading: 'done'})
            } catch (error) {
                setState({data: null, loading: 'error'})
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
