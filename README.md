# artfullylondon-ingest-api-schema

JSON Schema files for the Artfully London ingest system. Includes packaging those files as a python package and as a golang module for consumption by those respective programming languages.

[![CircleCI](https://circleci.com/gh/stevejay/artfullylondon-ingest-api-schema/tree/master.svg?style=svg)](https://circleci.com/gh/stevejay/artfullylondon-ingest-api-schema/tree/master)

## Python

### Python Packaging Information

- https://setuptools.readthedocs.io/en/latest/setuptools.html#including-data-files
- https://packaging.python.org/tutorials/packaging-projects/

## Go

### Go Packaging Information

- https://github.com/tcnksm/ghr
- https://medium.com/@masroor.hasan/publishing-a-go-package-to-github-with-circleci-2-0-41c1bde1493b
- https://github.com/golang/go/wiki/Modules

## TODO

- Get rid of area of london

### Constraints Not Captured

- maxAge >= minAge
- maxCost >= minCost
- timeTo >= timeFrom
- dateTo >= dateFrom

### Overrides

- exhibition event's dateFrom and dateTo values
