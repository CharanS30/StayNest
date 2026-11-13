const mongoose = require("mongoose");
const Listing = require("../models/listing");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

require("dotenv").config();

const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({
    accessToken: mapToken
});

async function updateGeometry() {

    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.ATLASDB_URL);

    console.log("Connected to MongoDB Atlas");

    // Find listings that don't have geometry
    const listings = await Listing.find({
        geometry: { $exists: false }
    });

    console.log(`Found ${listings.length} listings without geometry`);

    for (let listing of listings) {

        try {

            console.log(`Geocoding: ${listing.location}`);

            let response = await geocodingClient.forwardGeocode({
                query: listing.location,
                limit: 1
            }).send();

            if (!response.body.features.length) {
                console.log(`❌ Location not found: ${listing.location}`);
                continue;
            }

            listing.geometry = response.body.features[0].geometry;

            await listing.save();

            console.log(`✅ Updated: ${listing.title}`);

        } catch (err) {

            console.log(`❌ Error for ${listing.title}:`, err.message);

        }
    }

    console.log("Geometry update completed");

    await mongoose.connection.close();
}

updateGeometry();