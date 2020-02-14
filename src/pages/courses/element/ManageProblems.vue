<template>
  <v-container
    fluid
    width="100%"
    height="100%"
  >
    <v-card height="100%" elevation="2">
      <v-card-title class="font-weight-bold">Manage Problems</v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-chip v-if="items" label class="ml-3">
        {{ 'Total Problems: ' + items.length }}
      </v-chip>
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
            <tr>
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
            <!-- <tr v-for="item in items" :key="item.title">
              <td class="subtitle-1"><a :href="`/course/${item.title}`">{{ item.title }}</a></td>
              <td class="subtitle-1">{{ item.teacher.username }}</td>
              <td class="subtitle-1">
                <span class="pr-1" v-for="ta in item.ta">{{ ta }}</span>
              </td>
            </tr> -->
            <tr v-if="items.length===0">
              <td colspan="6">No data available.</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <ui-dialog v-model="dialog" :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'">
      <template slot="activator"><span></span></template>
      <template slot="title">Add Problems</template>
      <template slot="body">
        <v-card-text>
          <ui-alert
            v-model="errAlert"
            dense
            type="error"
            :alertMsg="errMsg"
          ></ui-alert>
          <v-container fuild>
            <v-row>
              <v-text-field
                v-model="desc.name"
                label="Name*"
                counter="64"
                :rules="nameRules"
                filled
                class="pr-1"
              ></v-text-field>
              <v-select
                v-model="desc.status"
                label="Status*"
                :items="[{text: 'Online', value: 0}, {text: 'Offline', value: 1}]"
                filled
                class="pl-1"
              ></v-select>
            </v-row>
            <v-row>
              <v-textarea
                v-model="desc.desc"
                label="Description*"
                rows="2"
                auto-grow
                filled
              ></v-textarea>
            </v-row>
            <v-row>
              <v-textarea
                v-model="desc.input"
                label="Input"
                rows="2"
                auto-grow
                filled
                class="pr-1"
              ></v-textarea>
              <v-textarea
                v-model="desc.output"
                label="Output"
                rows="2"
                auto-grow
                filled
                class="pl-1"
              ></v-textarea>
            </v-row>
            <v-row class="pb-4">
              <ui-button color="primary" outlined @click.native="editSample(1)">
                <template slot="content">
                  Append an example <v-icon>mdi-plus</v-icon>
                </template>
              </ui-button>
              <v-spacer></v-spacer>
              <ui-button color="secondary" outlined @click.native="editSample(-1)">
                <template slot="content">
                  Remove the lase example <v-icon>mdi-minus</v-icon>
                </template>
              </ui-button>
            </v-row>
            <v-row v-for="idx in sampleLength" :key="idx">
              <v-textarea
                v-model="desc.sampleInput[idx-1]"
                :label="'Sample Input' + idx"
                rows="2"
                auto-grow
                filled
                class="pr-1"
              ></v-textarea>
              <v-textarea
                v-model="desc.sampleOutput[idx-1]"
                :label="'Sample Output' + idx"
                rows="2"
                auto-grow
                filled
                class="pl-1"
              ></v-textarea>
            </v-row>
            <v-row>
              <v-textarea
                v-model="desc.hint"
                label="Hint"
                rows="2"
                auto-grow
                filled
              ></v-textarea>
            </v-row>
          </v-container>
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
      items: [],
      errAlert: false,
      errMsg: '',
      sampleLength: 1,
      desc: {
        name: '',
        status: null,
        desc: '',
        input: '',
        output: '',
        sampleInput: [''],
        sampleOutput: [''],
        hint: '',
      },
      nameRules: [
        v => !!v || 'Please enter the problem name.',
        v => !!v && v.length <= 64 || 'Sorry, the length is at most 64 characters.',
      ],
    }
  },

  methods: {
    editSample(val) {
      if ( val > 0 )   {
        this.desc.sampleInput.splice(-1, 0, '');
        this.desc.sampleOutput.splice(-1, 0, '');
      } else {
        this.desc.sampleInput.splice(-1);
        this.desc.sampleOutput.splice(-1);
      }
      this.sampleLength += val;
      this.sampleLength = Math.max(this.sampleLength, 1);
    }
  }
}
</script>

<style lang="css" scoped>
</style>