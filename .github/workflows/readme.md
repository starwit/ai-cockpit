# Workflow Description

Workflows for software quality check, build, packaging, and release creation were established:

* **build-publish-latest.yml (Build and publish latest imageh)** to test docker builds and pushes on your own branch. Includes a build number that can be used to force Helm installation with specific build
* **createRelease.yml (Create release and tag)**
    * use `prerelease` to check release creation or create a release for testing
    * use `major` or `minor` and execute script on main branch: to build additional major and minor release
    * :bangbang: If you are executing patch or higher release on another branch than main, release numbering might get broken.
* **pr-build.yml:** minimal checks that are run for any pull request.
