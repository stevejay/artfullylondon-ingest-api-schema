# artfullylondon-ingest-api-schema

Shared schema for the Artfully London ingest system.

[![CircleCI](https://circleci.com/gh/stevejay/artfullylondon-ingest-api-schema/tree/master.svg?style=svg)](https://circleci.com/gh/stevejay/artfullylondon-ingest-api-schema/tree/master)

## Python

### Python Packaging Information

- https://setuptools.readthedocs.io/en/latest/setuptools.html#including-data-files
- https://packaging.python.org/tutorials/packaging-projects/

## TODO

- Sort out title and descriptions.

### Constraints Not Captured

- maxAge >= minAge
- maxCost >= minCost
- timeTo >= timeFrom
- dateTo >= dateFrom

- rename description to descriptionHTML ??
- tags on performances
- add londonArea to venue?
- add schema value?

exports.LOCATION_AREA_TYPE_CENTRAL = 'Central';
exports.LOCATION_AREA_TYPE_WEST = 'West';
exports.LOCATION_AREA_TYPE_NORTH = 'North';
exports.LOCATION_AREA_TYPE_EAST = 'East';
exports.LOCATION_AREA_TYPE_SOUTH_EAST = 'SouthEast';
exports.LOCATION_AREA_TYPE_SOUTH_WEST = 'SouthWest';
