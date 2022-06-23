# Generic Graphql API Action

> A GitHub Action to send queries to generic GraphQL APIs

Creates a `data` output with the results, and can be configured to save the results to a file

[![Build Status](https://github.com/five-billion/generic-graphql-action/workflows/Test/badge.svg)](https://github.com/five-billion/generic-graphql-action/actions)

## Usage

Full example

```yml
name: Log latest release
on:
  push:
    branches:
      - master

jobs:
  logLatestRelease:
    runs-on: ubuntu-latest
    steps:
      - uses: five-billion/generic-graphql-action@v1.x
        id: get_launches
        with:
          api_endpoint: "https://api.spacex.land/graphql/"
          headers: '{ "some-header-key": "some-header-value" }'
          write_to: launches.json
          variables: '{ "limit": 5, "sort": "launch_date_utc" }'
          query: |
            query First5Launches($limit: Int, $sort: String) {
              launches(limit: $limit, sort: $sort) {
                mission_name
                mission_id
                rocket {
                  rocket_name
                  rocket {
                    company
                    name
                    mass {
                      kg
                    }
                  }
                }
                launch_site {
                  site_name
                }
                launch_date_utc
              }
            }
      - run: "echo 'first launch mission_name ${{ steps.get_launches.outputs.data.launches[0] }}'"
```

To access deep values of `outputs.data`, use [`fromJSON()`](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#fromjson).

## Configuration

| Input          | Type                | Required | Description                                                                                          |
| -------------- | ------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `api_endpoint` | String              | `YES`    | Full url to the GraphQL endpoint (i.e. `https://api.spacex.land/graphql`)                            |
| `query`        | String              | `YES`    | The GraphQL query to run                                                                             |
| `variables`    | JSON encoded String | `NO`     | Any GraphQL variables to include with the query as a JSON String                                     |
| `write_to`     | String              | `NO`     | A path to write the raw response to (i.e. `./data/launches.json`)                                    |
| `headers`      | JSON encoded String | `NO`     | Any headers to apply to the API call as a JSON String (i.e. `' { "Authorization" : "Bearer xxx" }'`) |

## Debugging

To see additional debug logs, create a secret with the name: `ACTIONS_STEP_DEBUG` and value `true`.

## How it works

The actions sets `data` output to the response data. Note that it is a string, you should use [`fromJSON()`](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#fromjson) to access any value of the response. The action also sets `headers` (again, to a JSON string) and `status`.

## License

[MIT](LICENSE)
