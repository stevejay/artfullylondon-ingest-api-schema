# artfullylondon-ingest-api-schema

Shared schema for the Artfully London ingest system.

[![CircleCI](https://circleci.com/gh/stevejay/artfullylondon-ingest-api-schema/tree/master.svg?style=svg)](https://circleci.com/gh/stevejay/artfullylondon-ingest-api-schema/tree/master)

## Python

### Python Packaging Information

- https://setuptools.readthedocs.io/en/latest/setuptools.html#including-data-files
- https://packaging.python.org/tutorials/packaging-projects/

## Go

- https://github.com/tcnksm/ghr
- https://medium.com/@masroor.hasan/publishing-a-go-package-to-github-with-circleci-2-0-41c1bde1493b

```
go get -u github.com/tcnksm/ghr
go get -u github.com/mitchellh/gox
go get -u github.com/go-bindata/go-bindata/...
```

```
~/go/bin/go-bindata -pkg "ingestschema" -prefix "schema/" -o ./go/bindata.go schema/...
~/go/bin/gox -os="linux darwin windows" -arch="amd64" -output="go-dist/artfullylondon-ingest-api-schema_{{.OS}}_{{.Arch}}" ./go/...
cd go-dist/ && gzip *
```

```
~/go/bin/ghr -t 5.......7 -u stevejay -r artfullylondon-ingest-api-schema-golang v0.17.0 ./go
```

## TODO

### Constraints Not Captured

- maxAge >= minAge
- maxCost >= minCost
- timeTo >= timeFrom
- dateTo >= dateFrom
