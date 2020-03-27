import React, {FC} from 'react'
import {useQuery, useMutation} from '../../lib/api'
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

  const [deleteListing, {loading: deleteLoading}] = useMutation<
    DeleteListingData,
    DeleteListingVars
  >(DELETE_LISTING)

  const handleDeleteListing = async (id: string) => {
    await deleteListing({id})
    refetch()
  }

  const listingsList = (
    <ul>
      {data?.listings?.map(listing => {
        return (
          <li key={listing.id}>
            {listing.title}
            <button onClick={() => handleDeleteListing(listing.id)}>
              Delete a Listing
            </button>
          </li>
        )
      })}
    </ul>
  )

  const errorText = 'Uh oh! Something went wrong -- please try again 😿'

  if (loading === 'error') {
    return <h2>{errorText}</h2>
  }

  if (loading === 'loading') {
    return <h2>Loading...</h2>
  }

  const deleteLoadingMessage = deleteLoading === 'loading' && (
    <h4>Deletion in progress</h4>
  )

  const deleteError = deleteLoading === 'error' && <h4>{errorText}</h4>

  return (
    <div>
      <h2>{title}</h2>
      {listingsList}
      {deleteLoadingMessage}
      {deleteError}
    </div>
  )
}
