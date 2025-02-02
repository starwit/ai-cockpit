# Starwit's AI Cockpit

AI cockpit aims at building a human control interface to AI systems. It is supposed to cover requirements from EU's AI act. More details can be found at <https://www.kicockpit.eu/>. All shared components necessary for this repo can be found [here](https://github.com/KI-Cockpit/ai-cockpit-api). There you also can find more info about all other activities & results of this project.

This project was partly funded by the government of the federal republic of Germany. It is part of a research project aiming to keep _humans in command_ and is organized by the Federal Ministry of Labour and Social Affairs.

![BMAS](docs/imgs/BMAS_Logo.svg)

## Deployment

Cockpit is a part of a bundle of services. For deployment options see <https://github.com/starwit/ai-cockpit-deployment>

## License

Software in this repository is licensed under the AGPL-3.0 license. See [license agreement](LICENSE) for more details.

### Prerequisites

The following components and tools are necessary to build & run AICockpit in your dev environment.

* Java JDK 21 or later
* Maven 3
* NodeJs (16.9.1) and NPM (8.3.2) - [NodeJS Install](https://nodejs.org/en/download/package-manager/)
* Postgres (available for development via docker-compose scripts)
* using Keycloak is optional

#### Maven Dependency

Project needs a library from an AI cockpit Github repo and thus you need to adapt your Maven settings (usually located here ~/.m2/settings.xml). Following example of a complete settings.xml shows you necessary additions. Please note, that you need username/Github token replaced by values, from your user.

```XML
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                      http://maven.apache.org/xsd/settings-1.0.0.xsd">

  <activeProfiles>
    <activeProfile>github</activeProfile>
  </activeProfiles>

  <profiles>
    <profile>
      <id>github</id>
      <repositories>
        <repository>
          <id>central</id>
          <url>https://repo1.maven.org/maven2</url>
        </repository>
        <repository>
            <id>github</id>
            <url>https://maven.pkg.github.com/starwit/vision-api</url>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </repository>
      </repositories>
    </profile>
  </profiles>

  <servers>
    <server>
      <id>github</id>
      <username>username</username>
      <password>TOKEN</password>
    </server>
  </servers>
</settings>
```

### How to build

In order to run a local development environment execute the following steps.
__Please note__: all steps need to be executed from base folder of repositories.

1) go to the deployment folder and start the environment (database and keycloak) via docker-compose:

    ```bash
    cd deployment
    docker compose up
    ```

2) go to `webclient/app` and install the frontend applications dependencies

    ```bash
    cd webclient/app
    npm install
    ```

3) build the project

    ```bash
    mvn clean install -P frontend
    ```

    There are two layout options. If you want to build your application with KI-Cockpit layout, you need to set environment variable VITE_THEME=kic VITE_THEME=kic and VITE_TITLE="Human in Command" before starting the build.

4) start project

    ```bash
    java -jar application/target/application-0.0.1-SNAPSHOT.jar
    ```

Once all steps ran successfully application will be reachable with the following coordinates:

* application can be reached under <http://localhost:8081/ai-cockpit/>
* swagger under <http://localhost:8081/ai-cockpit/swagger-ui/>
* If you are using keycloak:
  * default user/password is admin/admin
  * keycloak can be reached under <http://localost:8081/auth>

#### Optional Minio

If you want to start the Application with Minio then you need to run:

  ```bash
    cd deployment
    docker compose -f docker-compose-minio up
  ```

The Minio WebApp is available under localhost:9001 and the shell Application is available under localhost:9000.
You need to upload a videos a bucket named __anomalies__ link video files in decision data accordingly.

#### Test Action Execution

* start [alert-viewer](https://github.com/starwit/alert-viewer)
* add endpoint to your demodata:

  ```json
    {
      "state": "NEW",
      "endpoint": "localhost:8080/api/alert",
      "decisionType": {
        "id": 1
      },
      "action": []
    }
  ```

* start project

#### Import Sample Data

##### Run demo setups

AI cockpit is aimed to serve in as many application domains as possible. Thus cockpit can be started such that decision and action types can be imported. This is controlled by two fields in application properties:

```bash
# setup scenario & demo data
scenario.setup=true
scenario.importFolder=experiment-setup/traffic/
```

In folder [experiment-setup](experiment-setup/) you will find a growing number of demo data sets. Each folder can contain three files

* miticationtypes.json - Definition of possible action types
* decisiontypes.json - Definition of possible analysis results
* demodata.json - actual samples for observed/analyzed situtions and proposed actions

File with demo data can contain marker __DATETIME__ as value for decision creation time. This will then on import be replaced by a date time in the past relative to import time.

##### Timed decision import to local dev instances

AI Cockpit inserts upon first start a set of decision and action types. If you want to insert actual
decisions you can use a script in folder experiment-setup. The following code snippet shows
example usage:

  ```bash
    cd experiment-setup
    ./fillDatabaseScript.sh http://localhost:8081/ai-cockpit/api/decision demo_setup.json 10
  ```

Params are dev instance location (no auth), file with data to import and duration between inserts. Please note, that this will work only in a local development setup without authentication.

This script also allows you, to test how decisions are flowing into AI Cockpit. __Note__: you will
have to prepare video data on a Minio instance.

### Debugging

#### Frontend Debugging

For debugging, you can start the frontend separately.

```shell
cd webclient/app
npm start
```

If you want to build your application with KI-Cockpit layout, you need to set environment variable VITE_THEME=kic and VITE_TITLE="Human in Command" before starting the build. or execute:

```shell
npm start --mode kic
```

NPM server starts under localhost:3000/starwit/ by default

! If you are using the installation with keycloak, make sure you are logged in before first usage - just go to localhost:8081/starwit in your browser.

#### Backend Debugging

You can start the spring boot application in debug mode. See Spring Boot documentation for further details. The easiest way is, to use debug functionality integrated with your IDE like VS Code.

### Postgres Client

The database is available under localhost:3006

```properties
Username:starwit
Database:starwit
Password:starwit
```

PGAdmin is recommended to access database for development purpose. It can be deployed via docker-compose file.

### Starting without Keycloak/Authentication

If you want to start your application without keycloak, you need to change spring boot profile to dev in application\src\main\resources\application.properties.

```properties
spring.profiles.active=dev
```

or define env-variable

```bash
SPRING_PROFILES_ACTIVE=dev
```

Start the database without keycloak:

```bash
cd deployment
docker compose up
```

## Architecture & Concepts

AI Cockpit is composed by a number of components. The following diagram shows, how those components are working together.

![composition](./docs/imgs/Service-Composition-Architecture.drawio.svg)

### Data Model

AI Cockpit needs a data model to collect system decisions and their resulting actions. The following class diagram shows the core data model.

![architecture](./docs/imgs/architecture.drawio.svg)
