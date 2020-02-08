<template>
  <v-form ref="form">
    <ui-alert
      v-model="composeErr"
      type="error"
      transition="scroll-y-transition"
      :alertMsg="composeErrMsg"
    />
    <v-select
      v-model="selectedCourse"
      label="Course (Public can view all users)"
      :items="courseList"
    />
    <v-autocomplete
      label="To"
      v-model="value.receivers"
      v-show="selectedCourse"
      :items="userList"
      :rules="[v => !!v.length || 'Sorry, you have to select at least one User']"
      chips
      multiple
      item-text="name"
    >
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>User not found</v-list-item-title>
        </v-list-item>
      </template>
      <template v-slot:selection="{ attrs, item, selected }">
        <v-chip
          v-bind="attrs"
          :input-value="selected"
          color="primary"
          class="white--text"
          close
          @click:close="removeReciver(item)"
        ><span v-text="item.name"/></v-chip>
      </template>
      <template v-slot:prepend-item>
        <v-list-item @click="selectAll">
          <v-list-item-title>Select All</v-list-item-title>
        </v-list-item>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title v-html="item.name"/>
        </v-list-item-content>
      </template>
    </v-autocomplete>
    <v-text-field 
      v-model="value.title"
      label="Title" 
      counter="32" 
      :rules="[v => !!v && v.length <= 32 || 'Sorry, the length must be ≤ 32 characters']" 
    />
    <v-textarea 
      v-model="value.message"
      label="Message" 
      :rules="[v => !!v || 'Sorry, cannot send empty message']"
    />
  </v-form>
</template>

<script>
const API_BASE_URL = '/api';

export default {
  name: 'NewMailForm',

  data() {
    return {
      courseList: [],
      selectedCourse: '',
      userList: [],
    }
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
    composeErrMsg: {
      type: String,
      default: ''
    }
  },

  computed: {
    composeErr() {
      return Boolean(this.composeErrMsg);
    }
  },

  watch: {
    selectedCourse() {
      this.$http.get(`${API_BASE_URL}/course/${this.selectedCourse}`)
        .then(res => this.userList = Object.keys(res.data.data.studentNicknames).map(c => ({
          name: c
        })).concat([{
          name: res.data.data.teacher.username
        }]).concat(res.data.data.TAs.map(ta => {
          name: ta.username
        })));
    }
  },

  methods: {
    removeReciver(item) {
      const index = this.value.receivers.indexOf(item.name);
      if (index >= 0) this.value.receivers.splice(index, 1);
    },
    selectAll() {
      this.value.receivers = this.userList.map(u => u.name);
    }
  },

  beforeMount() {
    this.$http.get(`${API_BASE_URL}/course`)
      .then(res => this.courseList = res.data.data.map(c => c.course));
  },

  beforeUpdate() {
    this.$nextTick(() => {
      if(this.value.receivers.length) {
        this.selectedCourse = 'Public';
      }
    });
  }
}
</script>