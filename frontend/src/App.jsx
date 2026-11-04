import { useState } from 'react'
import './App.css'

function App() {

  const [listings, setListings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  async function loadListings(searchQuery, requestedPage) {
    setLoading(true)
    setError('')

    const params = new URLSearchParams(searchQuery)
    params.set('page', String(requestedPage))
    params.set('limit', '5')

    try {
      const response = await fetch(`/api/listings?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not load listings.')
      }

      setListings(data.results)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (requestError) {
      setError(requestError.message)
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const params = new URLSearchParams()

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string' && value.trim()) {
        params.set(key, value.trim())
      }
    }

    const newQuery = params.toString()
    setQuery(newQuery)
    loadListings(newQuery, 1)
  }







  return (
    <main>
      <header>
        <p>PROPERTY SEARCH</p>
        <h1>Find your next home</h1>
        <p>Search available listings by location, price, and features. Powered by Max Karltun</p>
      </header>

      <section>


        <h2>Search listings</h2>
        <form onSubmit={handleSearch}>


          <label>
            Keyword
            <input name="keyword" placeholder="Address or description" />
          </label>

          <label>
            City
            <input name="city" placeholder="e.g. Springfield" />
          </label>

          <label>
            Maximum price
            <input name="maxPrice" type="number" min="0" placeholder="No limit" />
          </label>

          <label>
            Minimum bedrooms
            <input name="minBedrooms" type="number" min="0" placeholder="Any" />
          </label>

          <label>
            Rank near budget
            <input name="budget" type="number" min="1" placeholder="Optional" />
          </label>

          <button type="submit">Search</button>
        </form>
      </section>

      <section>
        <h2>Listings</h2>


      {loading && <p>Loading listings...</p>}
{error && <p role="alert">{error}</p>}
{!loading && !error && listings.length === 0 && (
  <p>Search to see matching listings.</p>
)}


{listings.length > 0 && (
<>
<div style={{ overflowX: 'auto' }}>
  <table>
    <thead>
      <tr>
        <th>Address</th>
        <th>City</th>
        <th>Price</th>
        <th>Beds</th>
        <th>Baths</th>
        <th>Sq. ft.</th>
        <th>Listed</th>
      </tr>
    </thead>
    <tbody>
      {listings.map((listing) => (
        <tr key={listing.id}>
          <td>{listing.address}</td>
          <td>{listing.city}, {listing.state} {listing.zip}</td>
          <td>${listing.price.toLocaleString()}</td>
          <td>{listing.bedrooms}</td>
          <td>{listing.bathrooms}</td>
          <td>{listing.sqft.toLocaleString()}</td>
          <td>{listing.listedDate}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<nav aria-label="Listings pages">
  <button
    disabled={page <= 1 || loading}
    onClick={() => loadListings(query, page - 1)}
    type="button"
  >
    Previous
  </button>

  <span> Page {page} of {totalPages} </span>

  <button
    disabled={page >= totalPages || loading}
    onClick={() => loadListings(query, page + 1)}
    type="button"
  >
    Next
  </button>
</nav>

</>
)}



      </section>
    </main>
  )
}

export default App



