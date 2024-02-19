import Keycloak from 'keycloak-js'

const keycloakConfig = {
  realm: process.env.VUE_APP_KEYCLOAK_REALM,
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
  url: process.env.VUE_APP_KEYCLOAK_URL,
}

console.log(keycloakConfig)

const keycloak = new Keycloak(keycloakConfig)

export default keycloak