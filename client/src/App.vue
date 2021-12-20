<template>
  <div id="app">
    <div>
      <div class="row">
        <div class="col-6">
          <h1>Machines</h1>
          <b-button v-b-modal.machine-modal>Create Machine</b-button>
          <b-table
            responsive="sm"
            :fields="fields"
            :items="machineList"
            :busy="machineLoader"
            @row-clicked="getMachineSensors"
          >
            <template #table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
              </div>
            </template>
          </b-table>
        </div>
        <div class="col-6">
          <h1>Machine's Sensors</h1>
          <b-button v-b-modal.sensor-modal>Create Sensor</b-button>
          <b-table
            responsive="sm"
            :items="sensors"
            :busy="sensorLoader"
            v-if="sensors.length"
          >
            <template #table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
              </div>
            </template>
          </b-table>
          <p v-if="!sensors.length">Machine's sensor not exist</p>
        </div>
      </div>
    </div>
    <b-modal id="machine-modal" title="Create Machine" hide-footer>
      <b-form-group
        id="machine-group-1"
        label="Machine Name"
        label-for="machine-name"
      >
        <b-form-input
          id="machine-name"
          v-model="machine.name"
          type="text"
          placeholder="Enter machine name"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="machine-last-group"
        label="Last known position"
        label-for="last-position"
      >
        <b-form-input
          id="last-position"
          v-model="machine.lastKnownPosition"
          type="text"
          placeholder="Enter last known position"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="create-machine-button-group"
        label="Create Machine"
        label-for="create-machine-botton"
      >
        <b-button @click="createMachine">Create Machine</b-button>
      </b-form-group>
    </b-modal>

    <b-modal id="sensor-modal" title="Create Sensor" hide-footer>
      <b-form-group
        id="sensor-group-1"
        label="Sensor Name"
        label-for="sensor-name"
      >
        <b-form-input
          id="sensor-name"
          v-model="sensor.name"
          type="text"
          placeholder="Enter sensor name"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="sensor-select-group"
        label="Select Machine"
        label-for="select-machine"
      >
        <b-form-select
          id="select-machine"
          v-model="sensor.machine_id"
        >
          <template #first>
            <b-form-select-option value="null" disabled>
              Please select machine
            </b-form-select-option>
          </template>
          <template v-for="machine in machineList">
            <b-form-select-option :value="machine.id" :key="machine.id">{{machine.name}}</b-form-select-option>
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group
        id="create-button-group"
        label="Create Sensor"
        label-for="create-sensor-botton"
      >
        <b-button @click="createSensor">Create Sensor</b-button>
      </b-form-group>
    </b-modal>
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
    }
  }
`;

const GET_MACHINE_SENSORS = gql`
  query GetSensorByMachineId($machineId: Int!) {
    getSensorByMachineId(machine_id: $machineId) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export default {
  name: "app",
  data() {
    return {
      machine: {
        name: "",
        lastKnownPosition: ""
      },
      sensor: {
        name: "",
        machine_id: "",
      },
      fields: [
        {
          key: "id",
          sortable: false,
        },
        {
          key: "name",
          sortable: false,
        },
        {
          key: "lastKnownPosition",
          label: "Last Location",
          sortable: false,
        },
        {
          key: "createdAt",
          sortable: false,
        },
        {
          key: "updatedAt",
          sortable: false,
        },
      ],
      machineList: [],
      sensors: [],
      sensorLoader: false,
      machineLoader: false,
    };
  },
  apollo: {
    machines: {
      // GraphQL Query
      query: GET_MACHINES,
      // loadingKey: 'tagsPageLoading',
    },
  },
  methods: {
    createSensor() {
      this.$apollo
        .mutate({
          // Query
          mutation: gql`
            mutation CreateSensor($input: CreateSensorInput!) {
              createSensor(input: $input) {
                id
                name
                createdAt
                updatedAt
              }
            }
          `,
          // Parameters
          variables: {
            input: {
              name: this.sensor.name,
              machine_id: +this.sensor.machine_id
            },
          },
          fetchPolicy: 'network-only'
        })
        .then((data) => {
          // Result
          this.$bvModal.hide("sensor-modal");
          console.log(data);
        })
        .catch((error) => {
          // Error
          console.error(error);
        });
    },
    getMachineSensors(record) {
      this.sensorLoader = true;
      this.$apollo
        .query({
          // Query
          query: GET_MACHINE_SENSORS,
          variables: {
            machineId: +record.id,
          },
          fetchPolicy: 'network-only',
        })
        .then((data) => {
          const { getSensorByMachineId } = data.data;
          this.sensors = getSensorByMachineId;
          this.sensorLoader = false;
        })
        .catch((error) => {
          // Error
          this.sensorLoader = false;
          console.error(error);
        });
    },
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
            input: {
              name: this.machine.name,
              lastKnownPosition: this.machine.lastKnownPosition
            },
          },
          fetchPolicy: 'network-only'
        })
        .then((data) => {
          
          this.machineList = [...this.machineList, data.data.createMachine];
          this.$bvModal.hide("machine-modal");
        })
        .catch((error) => {
          // Error
          console.error(error);
        });
    },
    getMachines() {
      this.machineLoader = true;
      this.$apollo
      .query({
        // Query
        query: GET_MACHINES,
        fetchPolicy: 'network-only'
      },
      )
      .then((data) => {
        const { machines } = data.data;
        this.machineList = machines;
        this.machineLoader = false;
      })
      .catch((error) => {
        // Error
        this.machineLoader = false;
        console.error(error);
      });
    }
  },
  mounted() {
    this.getMachines();
  },
};
</script>

<style>
body,
input {
  font-family: Helvetica, sans-serif;
  font-size: 12pt;
}

#app {
  max-width: 100%;
  padding: 15px;
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
