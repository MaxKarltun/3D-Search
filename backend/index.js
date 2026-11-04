const express = require("express");
const listings = require("./data/sample_listings.json");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/listings", (req, res) => {
  const { city, keyword } = req.query;
  const maxPrice = req.query.maxPrice === undefined
    ? undefined
    : Number(req.query.maxPrice);
const budget = req.query.budget === undefined
  ? undefined
  : Number(req.query.budget);


  if (budget !== undefined && (!Number.isFinite(budget) || budget <= 0)) {
  return res.status(400).json({ error: "budget must be a positive number" });
}

  const minBedrooms = req.query.minBedrooms === undefined
    ? undefined
    : Number(req.query.minBedrooms);

  if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) {
    return res.status(400).json({ error: "maxPrice must be a non-negative number" });
  }

  if (minBedrooms !== undefined && (!Number.isInteger(minBedrooms) || minBedrooms < 0)) {
    return res.status(400).json({ error: "minBedrooms must be a non-negative integer" });
  }

  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));

  const filtered = listings.filter((listing) => {
    if (
      typeof city === "string" &&
      !listing.city.toLowerCase().includes(city.toLowerCase())
    ) {
      return false;
    }

    if (maxPrice !== undefined && listing.price > maxPrice) {
      return false;
    }

    if (minBedrooms !== undefined && listing.bedrooms < minBedrooms) {
      return false;
    }

    if (typeof keyword === "string" && keyword.trim()) {
      const searchableText = [
        listing.address,
        listing.city,
        listing.state,
        listing.zip,
        listing.description,
      ].join(" ").toLowerCase();

      if (!searchableText.includes(keyword.trim().toLowerCase())) {
        return false;
      }
    }

    return true;
  });



const ranked = [...filtered].sort((a, b) => {
  if (budget !== undefined) {
    const budgetDifference =
      Math.abs(a.price - budget) - Math.abs(b.price - budget);

    if (budgetDifference !== 0) {
      return budgetDifference;
    }
  }

  return b.listedDate.localeCompare(a.listedDate);
});


const start = (page - 1) * limit;
const results = ranked.slice(start, start + limit);



  





  res.json({
    page,
    limit,
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / limit),
    results,
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});