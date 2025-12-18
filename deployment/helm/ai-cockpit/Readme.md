# AI Cockpit Helm chart

This chart deploys AI Cockpit application on a Kubernetes cluster. Please note, that Cockpit needs other components for full functionality. 
Thus see [deployment repo](https://github.com/starwit/ai-cockpit-deployment) how to install all components.

## Cockpit Components

Following list shows, how to configure Cockpit's connection to all necessary/optional components using Helm chart.

### Database connection
Cockpit runs on top of a PostgreSQL database and Helm chart does __not__ install a PostgreSQL instance. It is recommended to 
use a technology like Helmfile to install database. Coordinates of database are configured in values.yaml like so:
```yaml
database:
  hostname: localhost
  port: 5432
  database: ai-cockpit
  username: ai-cockpit
  password: ai-cockpit
```

### Authentication
Access to Cockpit can be controlled using Keycloak / openID. The following section shows,
how to enable and configure Keycloak instance, that Cockpit shall use.
```yaml
auth:
  enabled: false
  keycloakRealmUrlInternal: http://internal-hostname/realms/aicockpit
  keycloakRealmUrlExternal: https://external-hostname/realms/aicockpit
  clientId: aicockpit
  clientSecret: aicockpit 
```
Internal URL is used to communicate within a Kubernetes cluster and is also useful for 
local testing.

### Binary Data Storage
To store binary content like images or videos Cockpit uses MinIO. To use MinIO Cockpit
needs these coordinates:

```yaml
minio:
  user: minioadmin
  password: minioadmin
  endpoint: http://localhost:9000
```

### SBOM Generator / Transparency API

Some Cockpit features are implemented by micro services, that needs to be installed 
seperately. As these are usually deployed to the same Kubernetes cluster, one
can use Helmfile to auto-configre necessary configuration. Following config items
can however be use for local development.

```yaml
sbom:
  enabled: false
  generator:
    uri: http://localhost:8080

aiapi:
  transparency:
    enabled: false
    uri: http://localhost:8081
```

## Example Values

Example for customValues.yaml

```yaml
# Define an ingress to application
ingress:
  enabled: true
  annotations: 
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: aic.starwit-infra.de # hostname
      paths:
        - path: /ai-cockpit # this is the path your app will be running under
          pathType: ImplementationSpecific
  tls: # if set, TLS will be activated
    - secretName: aic.starwit-infra.de
      hosts:
        - aic.starwit-infra.de

# Configuration to protect application by Keycloak login
auth:
  enabled: false
  keycloakRealmUrlInternal: http://internal-hostname/realms/aicockpit
  keycloakRealmUrlExternal: https://external-hostname/realms/aicockpit
  clientId: aicockpit
  clientSecret: aicockpit 

# MinIO that serves binary data, to explain decisions
minio:
  user: minioadmin
  password: minioadmin
  endpoint: http://test-minio.minio.svc.cluster.local:9000 # API endopint != UI

# SBOM PDF/Spreadsheet generator
sbom:
  enabled: false
  generator:
    uri: http://localhost:8080

# API for modules to register
aiapi:
  transparency:
    enabled: false
    uri: http://localhost:8081

# Configure a Docker container with sample data to import
sampledata:
  enabled: false
  image: starwitorg/ai-cockpit-sampledata:latest
  importFolder: traffic
  language: en
```