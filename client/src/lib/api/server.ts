interface Body<TVars> {
    query: string
    variables?: TVars
}

interface Error {
    message: string
}

export const server = {
    fetch: async <TData = any, TVars = any>(body: Body<TVars>) => {
        const res = await fetch('/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            throw new Error('failed to fetch from server')
        }

        return res.json() as Promise<{data: TData; errors: Error[]}>
    },
}
