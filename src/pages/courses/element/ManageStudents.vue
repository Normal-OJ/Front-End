<template>
  <v-container
    fluid
    width="100%"
    height="100%"
  >
    <v-card height="100%" elevation="2">
      <v-card-title class="font-weight-bold">Manage Students</v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-chip v-if="items" label class="ml-3">
        {{ 'Total Students: ' + items.length }}
      </v-chip>
      <v-simple-table class="px-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="font-weight-bold subtitle-1 text--primary">Username</th>
              <th class="font-weight-bold subtitle-1 text--primary">Display Name</th>
              <th class="font-weight-bold subtitle-1 text--primary">Role</th>
              <th class="font-weight-bold subtitle-1 text--primary">Operations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="4" class="px-0">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    tile
                    elevation="0"
                    :style="{ cursor: 'pointer', backgroundColor: hover ? '#eee' : '#fff' }"
                    @click="dialog = true"
                  >
                    <v-card-title class="subtitle-1"><v-icon color="black">mdi-plus</v-icon>Add Students</v-card-title>
                  </v-card>
                </v-hover>
              </td>
            </tr>
            <tr v-for="(item, idx) in items" :key="item.title">
              <td class="subtitle-1">{{ item.username }}</td>
              <td class="subtitle-1">{{ item.displayName }}</td>
              <td class="subtitle-1">Student</td>
              <td class="subtitle-1">
                <ui-button class="mr-1" color="info">
                  <template slot="content">
                    <v-icon>mdi-chart-bar</v-icon>
                  </template>
                </ui-button>
                <ui-button color="error" @click.native="del(idx)">
                  <template slot="content">
                    <v-icon>mdi-account-remove</v-icon>
                  </template>
                </ui-button>
              </td>
            </tr>
            <tr v-if="items.length===0">
              <td colspan="3">No data available.</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <ui-dialog v-model="dialog" :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'"
      @cancel="cancel" persistent
    >
      <template slot="activator"><span></span></template>
      <template slot="title">Add Students</template>
      <template slot="body">
        <v-card-text>
          <ui-alert
            v-model="errAlert"
            dense
            type="error"
            :alertMsg="errMsg"
          ></ui-alert>
          <v-combobox
            label="Users"
            v-model="newUsers"
            :items="users"
            item-text="username"
            chips
            multiple
          ></v-combobox>
        </v-card-text>
      </template>
      <template slot="action-cancel">
        <ui-button outlined color="secondary" @click.native="cancel">
          <template slot="content">Cancel</template>
        </ui-button>
      </template>
      <template slot="action-ok">
        <ui-button color="primary" @click.native="submit">
          <template slot="content">Submit</template>
        </ui-button>
      </template>
    </ui-dialog>
  </v-container>
</template>

<script>
export default {

  name: 'ManageStudents',

  props: {
    items: {
      type: Array,
      required: true,
    },
    users: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      dialog: false,
      errAlert: false,
      errMsg: '',
      newUsers: [],
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.newUsers = [];
    },
    submit() {
      // console.dir(this.newUsers);
      var data = {};
      this.items.forEach(ele => {
        data[ele.username] = ele.displayName;
      })
      this.newUsers.forEach(ele => {
        data[ele.username] = ele.displayName;
      })
      this.$http.put(`/api/course/${this.$route.params.name}`,
                    {
                      TAs: [],
                      studentNicknames: data,
                    })
        .then((res) => {
          this.$router.go(0);
        })
        .catch((err) => {

        })
    },
    del(idx) {
      this.items.splice(idx,1);
      this.submit();
    },
  }
}
</script>

<style lang="css" scoped>
</style>