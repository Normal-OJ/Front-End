<template>
  <v-container>
    <h3>UiDialog</h3>
    <p>props: width(String), persistent(Boolean)</p>
    <p>slots: activator, title, content, action-cancel, action-ok</p>
    <v-row>
      <ui-dialog v-model="dialog">
        <template slot="activator">
          Custom
        </template>
      </ui-dialog>
    </v-row>
    <v-divider></v-divider>
    <h3>UiButton</h3>
    <p>props: color(String), block(Boolean), text(Boolean)</p>
    <p>slots: content</p>
    <v-row>
      <ui-button @click.native="cnt++">
        <template slot="content">
          Increment
        </template>
      </ui-button>
      <div class="ml-6">counter: {{ cnt }}</div>
    </v-row>
    <v-divider></v-divider>
    <h3>UiAlert</h3>
    <p>props: alertMsg(String), color(String), type(String), icon(String), width(String)</p>
    <h5>Types Example</h5>
    <v-row>
      <v-col cols="2">
        <v-row class="my-3" v-for="type in types">
          <ui-button @click.native="alertType = type">
            <template slot="content">
              {{ type }}
            </template>
          </ui-button>
        </v-row>
      </v-col>
      <v-col cols="10">
        <ui-alert v-model="alert" :alertMsg="msg" :type="alertType" width="100%"></ui-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

  name: 'Demo',

  data () {
    return {
      dialog: false,
      cnt: 0,
      types: ['info', 'success', 'warning', 'error'],
      alert: true,
      alertType: 'info',
      msg: 'This is custom Alert.',
    }
  }
}
</script>

<style lang="css" scoped>
</style>