# artfullylondon-ingest-api-schema

Shared schema for the Artfully London ingest system
[![CircleCI](https://circleci.com/gh/stevejay/artfullylondon-ingest-api-schema/tree/master.svg?style=svg)](https://circleci.com/gh/stevejay/artfullylondon-ingest-api-schema/tree/master)

## Python

### Python Packaging Information

- https://setuptools.readthedocs.io/en/latest/setuptools.html#including-data-files
- https://packaging.python.org/tutorials/packaging-projects/

```
cd ./python
setup.py dir
pip install setuptools
pip install wheel
pip install twine
python3 setup.py sdist bdist_wheel
python3 -m twine upload dist/*
```

// maxAge >= minAge
// maxCost >= minCost
// timeTo >= timeFrom
// dateTo >= dateFrom
