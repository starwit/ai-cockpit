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

# import sample data, NOTE: this will not happen, if any data is already present
sampledata:
  enabled: true
  importFolder: traffic
  language: en

```