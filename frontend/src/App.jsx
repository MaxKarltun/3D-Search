import { useEffect, useState } from 'react'
import './App.css'

function HomeMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg className="globe-art" viewBox="0 0 48 48">
        <defs>
          <radialGradient id="globe-surface" cx="30%" cy="24%" r="80%">
            <stop offset="0%" stopColor="#79d7e5" />
            <stop offset="58%" stopColor="#2785a4" />
            <stop offset="100%" stopColor="#14506f" />
          </radialGradient>
          <clipPath id="globe-clip">
            <circle cx="24" cy="24" r="21.5" />
          </clipPath>
        </defs>
        <ellipse cx="25" cy="26.5" rx="21" ry="20.5" fill="#062c40" opacity=".34" />
        <circle cx="24" cy="23" r="22.5" fill="url(#globe-surface)" />
        <g clipPath="url(#globe-clip)">
          <path d="M4 13C9 5 17 2 25 2c-8 4-11 9-12 15-3 1-6 0-9-4Z" fill="#d9fbff" opacity=".24" />
          <path d="M2 25c7-8 14-10 22-10 10 0 17 3 22 9" fill="none" stroke="#d7f7ff" strokeOpacity=".18" strokeWidth="1.2" />
          <circle cx="24" cy="23" r="21.5" fill="none" stroke="#e7fbff" strokeOpacity=".3" strokeWidth="1" />
        </g>
        <path d="m12 22.5 12.5-11 12.5 11v2l-12.5-9-12.5 9Z" fill="#123d54" opacity=".75" />
        <path d="M16 22v14l2 2h16l-1-2V22Z" fill="#b9e8ef" />
        <path d="m11.5 21 12.5-11 12.5 11-2 2.2L24 13.5l-10.5 9.7Z" fill="#fff" />
        <path d="M15.5 20.5v15h17v-15l-2.2 1.8v10.5H18.2V22.3Z" fill="#eefaff" stroke="#fff" strokeLinejoin="round" strokeWidth="1.2" />
        <path d="M22 35.5v-9h4v9" fill="#216b87" />
        <path d="M18.5 23.5h3v3h-3zM26.5 23.5h3v3h-3z" fill="#216b87" />
        <path d="M24 10v3.5l10.5 9.7 2-2.2Z" fill="#d3f4fa" opacity=".86" />
        <circle cx="24" cy="23" r="22.5" fill="none" stroke="#0a354b" strokeOpacity=".6" strokeWidth="1.5" />
        <ellipse cx="17" cy="8" rx="8" ry="2.6" fill="#fff" opacity=".16" transform="rotate(-35 17 8)" />
      </svg>
    </span>
  )
}

function HouseScene() {
  return (
    <div className="scene-wrap" aria-label="A dimensional illustration of a modern home">
      <div className="scene-grid" />
      <div className="scene-orbit scene-orbit-one" />
      <div className="scene-orbit scene-orbit-two" />
      <div className="scene-ground">
        <div className="house">
          <div className="house-roof" />
          <div className="house-body">
            <div className="house-window house-window-one" />
            <div className="house-window house-window-two" />
            <div className="house-door" />
          </div>
          <div className="house-side" />
          <div className="house-side-window" />
        </div>
        <div className="scene-step scene-step-one" />
        <div className="scene-step scene-step-two" />
      </div>
      <div className="scene-pin scene-pin-price">
        <span className="pin-dot" />
        <span>Homes from <strong>$399k</strong></span>
      </div>
      <div className="scene-pin scene-pin-place">
        <span className="pin-icon">↗</span>
        <span><strong>Fairfax, VA</strong><small>12 places to call home</small></span>
      </div>
      <div className="scene-spark scene-spark-one">✳</div>
      <div className="scene-spark scene-spark-two">✳</div>
      <span className="scene-caption">A new point of view.</span>
    </div>
  )
}

function App() {
  const [listings, setListings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const app = document.querySelector('.app-shell')

    if (!app || !('IntersectionObserver' in window)) {
      return undefined
    }

    const targets = app.querySelectorAll('[data-scroll-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          target.classList.toggle('is-visible', isIntersecting)
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )

    app.classList.add('scroll-motion-ready')
    targets.forEach((target) => observer.observe(target))

    return () => {
      observer.disconnect()
      app.classList.remove('scroll-motion-ready')
    }
  }, [listings])

  async function loadListings(searchQuery, requestedPage) {
    setLoading(true)
    setError('')
    setHasSearched(true)

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
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (requestError) {
      setError(requestError.message)
      setListings([])
      setTotal(0)
      setTotalPages(0)
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
    <main className="app-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="3D Search home">
          <HomeMark />
          <span>3D<span className="brand-light">SEARCH</span></span>
        </a>
        <a className="topbar-link" href="#search">
          Find your place <span aria-hidden="true">↘</span>
        </a>
      </nav>

      <header className="hero" id="top">
        <div className="hero-copy" data-scroll-reveal>
          <p className="eyebrow"><span className="eyebrow-line" /> A DIFFERENT KIND OF HOME SEARCH
          <br></br>
           by Max Karltun</p>
          <h1 className="cascade-heading">
            <span className="cascade-line">
              <span className="cascade-word" style={{ '--word-index': 0 }}>Space</span>{' '}
              <span className="cascade-word" style={{ '--word-index': 1 }}>to</span>
            </span>
            <span className="cascade-line">
              <span className="cascade-word" style={{ '--word-index': 2 }}>see</span>{' '}
              <span className="cascade-word" style={{ '--word-index': 3 }}>yourself</span>{' '}
              <span className="cascade-word highlight-word" style={{ '--word-index': 4 }}>there.</span>
            </span>
          </h1>
          <p className="hero-description">
            Find a place that feels like yours. Explore homes by the details that matter,
            then get a fresh perspective on what’s possible.
          </p>
          <a className="hero-cta" href="#search">
            Explore homes <span className="cta-arrow" aria-hidden="true">↓</span>
          </a>
          <div className="hero-note">
            <span className="note-mark">✳</span>
            <span>Good homes. New perspective.</span>
          </div>
        </div>
        <div className="scene-scroll-frame" data-scroll-reveal>
          <HouseScene />
        </div>
        <div className="hero-index" aria-hidden="true">01 — 03</div>
      </header>

      <section className="search-section" id="search" aria-labelledby="search-title">
        <div className="section-heading" data-scroll-reveal>
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> YOUR NEXT CHAPTER</p>
            <h2 id="search-title">Find your kind of place.</h2>
          </div>
          <p className="section-aside">Start with the essentials.<br />The right home will follow.</p>
        </div>

        <form className="search-panel" data-scroll-reveal onSubmit={handleSearch}>
          <label className="search-field search-field-keyword">
            <span className="field-label"><span className="field-icon">⌕</span> WHAT ARE YOU LOOKING FOR?</span>
            <input name="keyword" placeholder="Neighborhood, street, or a feeling..." />
          </label>
          <label className="search-field">
            <span className="field-label"><span className="field-icon">⌖</span> WHERE</span>
            <input name="city" placeholder="City or ZIP" />
          </label>
          <label className="search-field">
            <span className="field-label"><span className="field-icon">$</span> MAX PRICE</span>
            <input name="maxPrice" type="number" min="0" placeholder="No limit" />
          </label>
          <label className="search-field">
            <span className="field-label"><span className="field-icon">⌂</span> BEDROOMS</span>
            <input name="minBedrooms" type="number" min="0" placeholder="Any" />
          </label>
          <label className="search-field">
            <span className="field-label"><span className="field-icon">↗</span> NEAR YOUR BUDGET</span>
            <input name="budget" type="number" min="1" placeholder="Optional" />
          </label>
          <button className="search-button" type="submit" disabled={loading}>
            {loading ? 'Searching' : 'Find my place'}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
        <div className="search-footnote" data-scroll-reveal><span /> Thoughtful searches. No endless scrolling.</div>
      </section>

      <section className="listings-section" aria-labelledby="listings-title">
        <div className="listings-heading" data-scroll-reveal>
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> THE POSSIBILITIES</p>
            <h2 id="listings-title">{hasSearched ? 'Places worth a closer look.' : 'A few places to spark a thought.'}</h2>
          </div>
          {hasSearched && !error && (
            <p className="result-count" aria-live="polite">
              <span>{total}</span> {total === 1 ? 'home' : 'homes'} found
            </p>
          )}
        </div>

        <div className="results-content" aria-live="polite">
          {loading && <p className="results-message">Finding places that fit...</p>}
          {error && <p className="results-message results-error" role="alert">{error}</p>}
          {!loading && !error && listings.length === 0 && (
            <div className="empty-state">
              <span className="empty-mark">⌂</span>
              <p>{hasSearched ? 'No homes match those details just yet. Try widening your search.' : 'Your search starts above. Tell us a little about what feels like home.'}</p>
            </div>
          )}

          {listings.length > 0 && (
            <>
              <div className="listing-grid">
                {listings.map((listing, index) => (
                  <article
                    className={`listing-card listing-card-${index % 4}`}
                    data-scroll-reveal
                    key={listing.id}
                    style={{ '--reveal-index': index }}
                  >
                    <div className="listing-art" aria-hidden="true">
                      <span className="art-sun" />
                      <span className="art-hill art-hill-back" />
                      <span className="art-hill art-hill-front" />
                      <span className="art-house">
                        <span className="art-roof" />
                        <span className="art-windows"><i /><i /><i /></span>
                        <span className="art-door" />
                      </span>
                      <span className="listing-art-label">A place to land <span>✳</span></span>
                      <span className="listing-number">0{index + 1}</span>
                    </div>
                    <div className="listing-info">
                      <div className="listing-price-row">
                        <p className="listing-price">${listing.price.toLocaleString()}</p>
                        <span className="listing-status"><span /> Available</span>
                      </div>
                      <h3>{listing.address}</h3>
                      <p className="listing-location">{listing.city}, {listing.state} {listing.zip}</p>
                      <div className="listing-details">
                        <span><strong>{listing.bedrooms}</strong> beds</span>
                        <span><strong>{listing.bathrooms}</strong> baths</span>
                        <span><strong>{listing.sqft.toLocaleString()}</strong> sq ft</span>
                      </div>
                      <p className="listing-description">{listing.description}</p>
                    </div>
                  </article>
                ))}
              </div>
              {totalPages > 1 && (
                <nav className="pagination" aria-label="Listings pages">
                  <button
                    className="page-button"
                    disabled={page <= 1 || loading}
                    onClick={() => loadListings(query, page - 1)}
                    type="button"
                  >
                    <span aria-hidden="true">←</span> Previous
                  </button>
                  <span className="page-count">PAGE <strong>{page}</strong> OF {totalPages}</span>
                  <button
                    className="page-button"
                    disabled={page >= totalPages || loading}
                    onClick={() => loadListings(query, page + 1)}
                    type="button"
                  >
                    Next <span aria-hidden="true">→</span>
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      <footer className="footer" data-scroll-reveal>
        <a className="brand footer-brand" href="#top">
          <HomeMark />
          <span>3D<span className="brand-light">SEARCH</span></span>
        </a>
        <p>Find a place. Find a feeling.</p>
        <span className="footer-credit">A fresh perspective on home.</span>
      </footer>
    </main>
  )
}

export default App
