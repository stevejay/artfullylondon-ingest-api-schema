# artfullylondon-ingest-api-schema

Shared schema for the Artfully London ingest system.

[![CircleCI](https://circleci.com/gh/stevejay/artfullylondon-ingest-api-schema/tree/master.svg?style=svg)](https://circleci.com/gh/stevejay/artfullylondon-ingest-api-schema/tree/master)

## Python

### Python Packaging Information

- https://setuptools.readthedocs.io/en/latest/setuptools.html#including-data-files
- https://packaging.python.org/tutorials/packaging-projects/

## Schema

### Constraints Not Captured

- maxAge >= minAge
- maxCost >= minCost
- timeTo >= timeFrom
- dateTo >= dateFrom
