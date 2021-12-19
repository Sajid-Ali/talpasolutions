<template>
  <div id="app">
    <h1>Machines</h1>
    <div v-for="machine in machines" :key="machine.id">
      {{ machine.name }}
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

const pageSize = 10;

const GET_MACHINES = gql`
  query Machines {
    machines {
      id
      name
      lastKnownPosition
      createdAt
      updatedAt
      sensors {
        id
        name
        createdAt
        updatedAt
      }
    }
  }
`;

export default {
  name: "app",
  data() {
    return {
      newTag: null,
      updateCount: 0,
      type: "City",
      skipQuery: false,
      loading: 0,
      tagsLoading: 0,
      tagsPageLoading: 0,
      showTag: "random",
      showMoreEnabled: true,
      page: 0,
    };
  },
  apollo: {
    $client: "a",
    $loadingKey: "loading",

    // Pages
    machines: {
      // GraphQL Query
      query: GET_MACHINES,
      // loadingKey: 'tagsPageLoading',
    },
  },
  methods: {
    createMachine() {
      this.$apollo
        .mutate({
          // Query
          mutation: gql`
            mutation CreateMachine($input: CreateInput!) {
              createMachine(input: $input) {
                id
                name
                lastKnownPosition
                createdAt
                updatedAt
                sensors {
                  id
                  name
                  createdAt
                  updatedAt
                }
              }
            }
          `,
          // Parameters
          variables: {
            input: {},
          },
        })
        .then((data) => {
          // Result
          console.log(data);
        })
        .catch((error) => {
          // Error
          console.error(error);
          // We restore the initial user input
          this.newTag = newTag;
        });
    },
  },
  mounted() {},
};
</script>

<style>
body,
input {
  font-family: Helvetica, sans-serif;
  font-size: 12pt;
}

#app {
  max-width: 500px;
  padding: 12px;
  margin: auto;
  text-align: center;
}

.info,
.loading {
  color: #999;
  margin: 12px;
}

.tag {
  display: inline-block;
  padding: 4px;
  background: #40b883;
  color: white;
  border-radius: 2px;
  margin: 2px;
}

.tag.optimistic {
  background: #b76c40;
}

form {
  margin: 22px;
}

input {
  padding: 8px;
  border: solid 1px #bbb;
  border-radius: 2px;
}

input:focus {
  box-shadow: none;
  outline: none;
  border-color: #40b883;
}

.tag-list {
  text-align: left;
  border: solid 1px #40b883;
  padding: 10px;
  border-radius: 3px;
}

.actions {
  text-align: center;
}
</style>
