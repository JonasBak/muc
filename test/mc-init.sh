#!/bin/sh

sleep 4 # Wait for minio to start up

mc config host add minio http://minio:9000 "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY" --api s3v4

mc admin policy add minio read-list /read-list.json

mc admin user add minio muc-user abc0987654321

mc admin policy set minio read-list user=muc-user

for bucket in music testing-gql testing-minio; do
	mc mb -p minio/$bucket

	echo "test" | mc pipe "minio/$bucket/Phlake/Slush Hours/01 Costa Rica.flac"
	echo "test" | mc pipe "minio/$bucket/Phlake/Slush Hours/02 Angel Zoo.flac"
	echo "test" | mc pipe "minio/$bucket/Phlake/Slush Hours/03 Like You.flac"
	echo "test" | mc pipe "minio/$bucket/Phlake/Slush Hours/04 May Be.flac"
	echo "test" | mc pipe "minio/$bucket/Phlake/Slush Hours/05 Pregnant.flac"
	echo "test" | mc pipe "minio/$bucket/Phlake/Slush Hours/06 Moldavia.flac"
	echo "test" | mc pipe "minio/$bucket/Phlake/Slush Hours/07 Stallin'.flac"
	echo "test" | mc pipe "minio/$bucket/Phlake/Slush Hours/08 Something Better.flac"
	echo "test" | mc pipe "minio/$bucket/Phlake/Slush Hours/09 Breakup Business.flac"
	echo "test" | mc pipe "minio/$bucket/Phlake/Slush Hours/10 So Faded.flac"
	echo "test" | mc pipe "minio/$bucket/Phlake/Slush Hours/11 New Slow.flac"
	echo "test" | mc pipe "minio/$bucket/Phlake/Slush Hours/12 Dress Off.flac"
	echo "test" | mc pipe "minio/$bucket/Phlake/Slush Hours/cover.jpg"
	echo "test" | mc pipe "minio/$bucket/Mikhael Paskalev/Heavy/01 Jet Plane.flac"
	echo "test" | mc pipe "minio/$bucket/Mikhael Paskalev/Heavy/02 Shotgun.flac"
	echo "test" | mc pipe "minio/$bucket/Mikhael Paskalev/Heavy/03 Needles in Our Hearts.flac"
	echo "test" | mc pipe "minio/$bucket/Mikhael Paskalev/Heavy/04 Heavy.flac"
	echo "test" | mc pipe "minio/$bucket/Mikhael Paskalev/Heavy/05 Baby.flac"
	echo "test" | mc pipe "minio/$bucket/Mikhael Paskalev/Heavy/06 Burn.flac"
	echo "test" | mc pipe "minio/$bucket/Mikhael Paskalev/Heavy/07 Witness.flac"
	echo "test" | mc pipe "minio/$bucket/Mikhael Paskalev/Heavy/08 Bad Boy.flac"
	echo "test" | mc pipe "minio/$bucket/Mikhael Paskalev/Heavy/09 Push.flac"
	echo "test" | mc pipe "minio/$bucket/Mikhael Paskalev/Heavy/10 The Surf.flac"
	echo "test" | mc pipe "minio/$bucket/Mikhael Paskalev/Heavy/11 Ride or Die.flac"
	echo "test" | mc pipe "minio/$bucket/Mikhael Paskalev/Heavy/cover.jpg"
done
