import {IResolvers} from 'apollo-server-express'
import {Database, Listing} from '../../lib/types'
import {ObjectId} from 'mongodb'

export const listingResolvers: IResolvers = {
  Query: {
    listings: async (
      _root,
      _args,
      {db}: {db: Database}
    ): Promise<Listing[]> => {
      return await db.listings.find().toArray()
    },
  },
  Mutation: {
    deleteListing: async (
      _root,
      {id}: {id: string},
      {db}: {db: Database}
    ): Promise<Listing> => {
      const result = await db.listings.findOneAndDelete({
        _id: new ObjectId(id),
      })

      if (!result.value) {
        throw new Error(`listing with id ${id} not found`)
      }

      return result.value
    },
  },
  Listing: {
    id: (listing: Listing): string => listing._id.toString(),
  },
}
