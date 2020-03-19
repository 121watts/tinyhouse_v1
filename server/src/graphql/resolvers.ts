import {IResolvers} from 'apollo-server-express'
import {listings, Listing} from '../listings'

export const resolvers: IResolvers = {
    Query: {
        listings: (): Listing[] => listings,
    },
    Mutation: {
        deleteListing: (_root, {id}: {id: string}): Listing | Error => {
            const listing = listings.find(listing => listing.id === id)

            if (!listing) {
                throw new Error('listing not found')
            }

            return listing
        },
    },
}
