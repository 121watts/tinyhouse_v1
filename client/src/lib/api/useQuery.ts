import {useCallback, useEffect, useState} from 'react'
import {server} from './server'
import {RemoteDataState} from 'src/types'

interface State<TData> {
    data: TData | null
    loading: RemoteDataState
}

interface QueryResult<TData> extends State<TData> {
    refetch: () => void
}

export const useQuery = <TData = any>(query: string): QueryResult<TData> => {
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
