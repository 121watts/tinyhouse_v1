interface Body<TVars> {
    query: string
    variables?: TVars
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

        return res.json() as Promise<{data: TData}>
    },
}
