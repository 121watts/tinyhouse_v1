import {useState, TdHTMLAttributes} from 'react'
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

export const useMutation = <TData = any, TVars = any>(
    query: string
): MutationTuple<TData, TVars> => {
    const [state, setState] = useState<State<TData>>({
        data: null,
        loading: 'not started',
    })

    const fetch = async (variables?: TVars) => {
        try {
            setState({loading: 'loading', data: null})

            const {data, errors} = await server.fetch<TData, TVars>({
                query,
                variables,
            })

            if (errors && errors.length) {
                throw new Error(errors[0].message)
            }

            setState({data, loading: 'done'})
        } catch (error) {
            setState({data: null, loading: 'error'})
            throw console.error(error)
        }
    }

    return [fetch, state]
}
