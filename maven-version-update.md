# Version update

* mvn -B build-helper:parse-version versions:set -DnewVersion=\${parsedVersion.majorVersion}.\${parsedVersion.nextMinorVersion}.\0\${parsedVersion.qualifier?} versions:commit
* mvn -B release:clean release:prepare -Darguments="-DskipTests"
* mvn -B release:clean
* mvn -B release:update-versions
* mvn versions:set -DremoveSnapshot
* changelog convetions: <https://www.conventionalcommits.org/en/v1.0.0/>
