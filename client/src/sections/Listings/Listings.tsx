import React, {FC} from 'react'
import {gql} from 'apollo-boost'
import {useQuery, useMutation} from 'react-apollo'
import {Listings as ListingsData} from './__generated__/Listings'
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from './__generated__/DeleteListing'

const LISTINGS = gql`
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

const DELETE_LISTING = gql`
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
  const {data, refetch, loading, error} = useQuery<ListingsData>(LISTINGS)

  const [
    deleteListing,
    {loading: deleteLoading, error: errorLoading},
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING)

  const handleDeleteListing = async (id: string) => {
    await deleteListing({variables: {id}})
    refetch()
  }

  const listingsList = (
    <ul>
      {data?.listings?.map((listing) => {
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

  if (error) {
    return <h2>{errorText}</h2>
  }

  if (loading) {
    return <h2>Loading...</h2>
  }

  const deleteLoadingMessage = deleteLoading && <h4>Deletion in progress</h4>

  const deleteError = errorLoading && <h4>{errorText}</h4>

  return (
    <div>
      <h2>{title}</h2>
      {listingsList}
      {deleteLoadingMessage}
      {deleteError}
    </div>
  )
}
