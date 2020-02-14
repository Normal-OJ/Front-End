<template>
  <v-container
    fluid
    width="100%"
    height="100%"
  >
    <v-card height="100%" elevation="2">
      <v-card-title class="font-weight-bold">Manage Problems</v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-simple-table class="px-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="font-weight-bold subtitle-1 text--primary">ID</th>
              <th class="font-weight-bold subtitle-1 text--primary">Name</th>
              <th class="font-weight-bold subtitle-1 text--primary">Status</th>
              <th class="font-weight-bold subtitle-1 text--primary">Type</th>
              <th class="font-weight-bold subtitle-1 text--primary">Tags</th>
              <th class="font-weight-bold subtitle-1 text--primary">Operations</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="perm!==-1 && perm <= 1">
              <td colspan="6" class="px-0">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    tile
                    elevation="0"
                    :style="{ cursor: 'pointer', backgroundColor: hover ? '#eee' : '#fff' }"
                    @click="dialog = true"
                  >
                    <v-card-title class="subtitle-1"><v-icon color="black">mdi-plus</v-icon>Add Problems</v-card-title>
                  </v-card>
                </v-hover>
              </td>
            </tr>
            <tr v-for="item in items" :key="item.title">
              <td class="subtitle-1"><a :href="`/course/${item.title}`">{{ item.title }}</a></td>
              <td class="subtitle-1">{{ item.teacher.username }}</td>
              <td class="subtitle-1">
                <span class="pr-1" v-for="ta in item.ta">{{ ta }}</span>
              </td>
            </tr>
            <tr v-if="items.length===0">
              <td colspan="6">No data available.</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <ui-dialog v-model="dialog" :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'">
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
            item-name="username"
            chips
            multiple
          ></v-combobox>
        </v-card-text>
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

  data () {
    return {
      dialog: false,
      users: [],
      items: [],
      perm: true,
      errAlert: false,
      errMsg: '',
      newUsers: [],
    }
  }
}
</script>

<style lang="css" scoped>
</style>