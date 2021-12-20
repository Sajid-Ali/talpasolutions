import Vue from "vue";

import "isomorphic-fetch";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { ApolloClient, createNetworkInterface } from "apollo-client";
import {
  addGraphQLSubscriptions,
} from "subscriptions-transport-ws";

const networkInterface = createNetworkInterface({
  uri: "http://localhost:4001/graphql",
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface
);

const apolloClient = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  connectToDevTools: true,
});

import VueApollo from "vue-apollo";
Vue.use(VueApollo);

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

let loading = 0;

const apolloProvider = new VueApollo({
  clients: {
    a: apolloClient,
  },
  defaultClient: apolloClient,
  defaultOptions: {
    // $loadingKey: 'loading',
  },
  watchLoading(state, mod) {
    loading += mod;
    console.log("Global loading", loading, mod);
  },
  errorHandler(error) {
    console.log("Global error handler");
    console.error(error);
  },
});

import App from "./App.vue";

new Vue({
  el: "#app",
  apolloProvider,
  render: (h) => h(App),
});
