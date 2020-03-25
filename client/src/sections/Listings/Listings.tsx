import React, {FC} from 'react'
import {server, useQuery} from '../../lib/api'
import {ListingsData, DeleteListingData, DeleteListingVars} from './types'

const LISTINGS = `
    query Listings {
        listings {
            id
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            numOfBaths
            rating
        }
    }
`

const DELETE_LISTING = `
    mutation DeleteListing($id: ID!) {
        deleteListing(id: $id) {
            id
        }
    }
`

interface Props {
    title: string
}

export const Listings: FC<Props> = ({title}) => {
    const {data, refetch, loading} = useQuery<ListingsData>(LISTINGS)

    const deleteListing = async (id: string) => {
        await server.fetch<DeleteListingData, DeleteListingVars>({
            query: DELETE_LISTING,
            variables: {id},
        })

        refetch()
    }

    const listingsList = (
        <ul>
            {data?.listings?.map(listing => {
                return (
                    <li key={listing.id}>
                        {listing.title}
                        <button onClick={() => deleteListing(listing.id)}>
                            Delete a Listing
                        </button>
                    </li>
                )
            })}
        </ul>
    )

    if (loading === 'error') {
        return <h2>Uh oh! Something went wrong -- please try again 😿</h2>
    }

    if (loading === 'loading') {
        return <h2>Loading...</h2>
    }

    return (
        <div>
            <h2>{title}</h2>
            {listingsList}
            <button>Query Listings</button>
        </div>
    )
}
