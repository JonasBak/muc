# muc

> Use a minio/S3 bucket as a library for a web music player. Made to be easy to set up, lightweight (hopefully), and to not change your actual music files in any way.

## Getting started

Create a new user on minio/S3 following [this guide](https://docs.min.io/docs/minio-multi-user-quickstart-guide.html), write down the credentials.

The user is only supposed to be able to read and list objects, so using the same guide, create the following policy (note that the bucket-name here is `music`), and apply the policy for the created user.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::music/*"
      ],
      "Sid": ""
    }
  ]
}
```

To configure muc, copy `config.example.yml` to `config.yml` and edit the fields. If you don't want this file to contain secrets, you can provide them through environment variables.

To install all frontend dependencies, run `yarn`.

## Running

Run the backend with `muc serve`. A graphiql page will be available at [localhost:3030](http://localhost:3030/) for debugging. See all available options with `muc help`

Run the frontend with `yarn dev`. It will be available at [localhost:3000](http://localhost:3000/)

## Development

If you don't have a minio instance running, you can run `docker-compose -f ./test/docker-compose.yml up -d` to start and set up a local minio instance with the user `muc-user/abc0987654321` and some dummy data. Start the backend with `CONFIG_FILE="test/config.test.yml" go run .`. Note that none of the "music" files actually can be played, as they are filled with dummy data, making it hard to test the frontend with this.

If the graphql schema in `schema.graphiql` is changed, run `yarn gen:graphql` to regenerate the typescript types used in the frontend.

If you want to add a new query from the frontend, add the query to a file in `webapp/graphql/`, and run `yarn gen:graphql`. After this the query will be available as a method on the `graphqlClient` object.

## Testing

Run tests with `go test -v ./...`

To run tests against minio, first run `docker-compose -f ./test/docker-compose.yml up -d` to start and initialize minio. Then run `TEST_AGAINST_MINIO=true go test ./...` to run all tests.
