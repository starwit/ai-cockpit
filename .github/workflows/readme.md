# Workflow Description

Workflows for software quality check, build, packaging, and release creation were established:

## build-publish-latest.yml

Build and publish latest image to test docker builds and pushes on your own branch. Includes a build number that can be used to force Helm installation with specific build

## createRelease.yml

Creates a new release for jar (pom), github release documentation, docker image and helm chart.

* you can define a version like major.minor.patch-build, e.g. 1.1.0-2
* if you don't define a version, the current version from maven pom will be used without suffix SNAPSHOT
* after release build, the version will be incremented in poms
* e.g. release build for 1.1.0-2:
  * changelog will be updated
  * release 1.1.0-2 is built as maven artefact and created in github
  * tag 1.1.0-2 is created
  * docker image with release version is created an pushed to registry
  * helm chart is created with release version and pushed to registry
  * poms are updated to 1.1.0-3-SNAPSHOT

## pr-build.yml

Minimal checks and build that are run for any pull request
