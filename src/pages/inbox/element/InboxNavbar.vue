<template>
  <SideList v-model="selected" :items="navbar" nav @click="changeFolder">
    <template v-slot:header>
      <ui-dialog v-model="composeDialog" :width="composeDialogWidth" :persistent="true">
        <template v-slot:activator="{ click }">
          <v-btn color="primary" fab @click.native="click" small>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <template v-slot:title>{{ composeDialogTitle }}</template>
        <template v-slot:body>
          <NewMailForm v-model="newMail" ref="_newMailForm" :composeErrMsg="errMsg"/>
        </template>
        <template v-slot:action-ok>
          <ui-button color="primary" @click.native="sendMail">
            <template slot="content">Send</template>
          </ui-button>
        </template>
      </ui-dialog>
      <div class="ml-4">Compose</div>
    </template>
  </SideList>
</template>

<script>
import SideList from "./element/SideList"
import NewMailForm from "./element/NewMailForm"

const API_BASE_URL = '/api';

export default {
  name: 'InboxNavbar',

  components: {
    SideList,
    NewMailForm,
  },

  data() {
    return {
      composeDialog: false,
      navbar: [
        { icon: 'mdi-inbox', title: 'Inbox', value: 0 },
        { icon: 'mdi-send', title: 'Sent', value: 1 },
      ],
      newMail: {
        receivers: [],
        title: '',
        message: ''
      },
      errMsg: '',
    }
  },

  props: {
    selected: {
      type: Number,
      required: true
    }
  },

  computed: {
    composeDialogWidth() {
      return this.$vuetify.breakpoint.smAndDown ? '100vw' : '80vw';
    },
    composeDialogTitle() {
      return this.newMail.title || 'New mail';
    },
    newMailForm() {
      return this.$refs._newMailForm.$refs.form;
    }
  },

  methods: {
    changeFolder(index) {
      this.$emit('change', index);
    },
    sendMail() {
      if(this.newMailForm.validate()) {
        let mail = this.newMail;
        this.$http.post(`${API_BASE_URL}/inbox`, {
          receivers: mail.receivers,
          title: mail.title,
          message: mail.message
        }).then(res => {
          this.composeDialog = false;
          this.newMailForm.reset();
          this.changeFolder(1);
        });
      }
    }
  },
}
</script>