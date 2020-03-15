<template>
  <v-container
    :style="{ width: this.$vuetify.breakpoint.mdAndUp ? '50vw' : '95vw' }"
  >
    <!-- UiDialog -->
    <h1>UiDialog</h1>
    <p>props: width(String), persistent(Boolean)</p>
    <p>slots: activator, title, body, content, action-cancel, action-ok</p>
    <v-row justify="space-around">
      <ui-dialog v-model="dialog" :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'"></ui-dialog>
      <ui-dialog v-model="secret" :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'">
        <template slot="activator">
          <ui-button color="warning" @click.native="secret = !secret">
            <template slot="content">
              <v-icon>mdi-lock</v-icon>Secret
            </template>
          </ui-button>
        </template>
        <template slot="title">Secret</template>
        <template slot="content">Secret Content</template>
        <template slot="action-cancel">
          <ui-button outlined color="primary" @click.native="secret = !secret">
            <template slot="content">
              Cancel
            </template>
          </ui-button>
        </template>
        <template slot="action-ok">
          <ui-button color="error" @click.native="secret = !secret">
            <template slot="content">
              Delete
            </template>
          </ui-button>
        </template>
      </ui-dialog>
    </v-row>
    <!-- UiDialog -->
    <!-- UiButton -->
    <h1>UiButton</h1>
    <p>props: color(String), block(Boolean), text(Boolean)</p>
    <p>slots: content</p>
    <h5>Colors</h5>
    <v-row justify="space-around">
      <v-col cols="auto" v-for="type in btnTypes" :key="type">
        <ui-button :color="type"><template slot="content">{{ type }}</template></ui-button>
      </v-col>
    </v-row>
    <h5>Outlined</h5>
    <v-row justify="space-around">
      <v-col cols="auto" v-for="type in btnTypes" :key="type">
        <ui-button :color="type" outlined><template slot="content">{{ type }}</template></ui-button>
      </v-col>
    </v-row>
    <h5>Event (@click.native)</h5>
    <v-row>
      <v-col cols="9">
        <ui-button block @click.native="cnt++">
          <template slot="content">
            Increment
          </template>
        </ui-button>
      </v-col>
      <v-col cols="3">
        <div class="ml-6">counter: {{ cnt }}</div>
      </v-col>
    </v-row>
    <h5>Alert button</h5>
    <v-row>
      <ui-button
        alert
      >
        <template slot="content">owwow</template>
      </ui-button>
    </v-row>
    <!-- UiButton -->
    <!-- UiAlert -->
    <h1>UiAlert</h1>
    <p>props: alertMsg(String), color(String), type(String), icon(String), width(String)</p>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="2">
        <h5>Types</h5>
        <v-row class="my-3" v-for="type in alertTypes">
          <ui-button @click.native="alertType = type">
            <template slot="content">
              {{ type }}
            </template>
          </ui-button>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="9">
        <h5>General</h5>
        <ui-alert v-model="alert" :alertMsg="msg" :type="alertType" width="100%"></ui-alert>
        <h5>Dense</h5>
        <ui-alert v-model="alert" :alertMsg="msg" :type="alertType" dense></ui-alert>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <ui-button @click.native="alert = !alert">
        <template slot="content">
          activator
        </template>
      </ui-button>
      <v-spacer></v-spacer>
    </v-row>
    <!-- UiAlert -->
    <!-- UiCard -->
    <h1>UiCard</h1>
    <p>props: menu(Boolean), markdown(Boolean), mdContent(String)</p>
    <p>slots: title, subtitle, content, action</p>
    <i>replaced by ui-post</i>
    <!-- UiCard -->
  </v-container>
</template>

<script>
export default {

  name: 'Demo',

  data () {
    return {
      dialog: false,
      secret: false,
      cnt: 0,
      btnTypes: ['primary', 'secondary', 'info', 'success', 'warning', 'error'],
      alert: true,
      alertType: 'info',
      alertTypes: ['info', 'success', 'warning', 'error'],
      msg: 'This is custom Alert.',
    }
  }
}
</script>

<style lang="css" scoped>
</style>