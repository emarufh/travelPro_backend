const Place = require("../models/Places");

module.exports = {
  addPlaces: async (req, res, next) => {
    const {
      country_id,
      title,
      description,
      contact_id,
      imageUrl,
      rating,
      review,
      location,
      latitude,
      longitude,
    } = req.body;

    try {
      const newPlace = new Place({
        country_id,
        title,
        description,
        contact_id,
        imageUrl,
        rating,
        review,
        location,
        latitude,
        longitude,
      });

      await newPlace.save();

      res.status(201).json({ status: true });
    } catch (error) {
      return next(error);
    }
  },

  getPlaces: async (req, res, next) => {
    try {
      const places = await Place.find(
        {},
        "_id title rating review imageUrl country_id"
      );

      res.status(200).json({ places });
    } catch (error) {
      return next(error);
    }
  },

  getPlace: async (req, res, next) => {
    const placeId = req.params.id;

    try {
      const place = await Place.findById(placeId, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      }).populate({
        path: "popular",
        select: "title rating review imageUrl location",
      });

      res.status(200).json({ place });
    } catch (error) {
      return next(error);
    }
  },

  getPlacesByCountry: async (req, res, next) => {
    const countryId = req.params.id;

    try {
      const places = await Place.find(
        { country_id: countryId },
        {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      );

      if (places.length === 0) {
        return res.status(200).json([]);
      }

      res.status(200).json({ places });
    } catch (error) {
      return next(error);
    }
  },

  search: async (req, res, next) => {
    try {
      const results = await Place.aggregate([
        {
          $search: {
            index: "places",
            text: {
              query: req.params.key,
              path: {
                wildcard: "*",
              },
            },
          },
        },
      ]);

      res.status(200).json(results);
    } catch (error) {
      return next(error);
    }
  },
};
