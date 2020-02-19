<template>
  <div>
    <v-row v-for="(item, idx) in items" :key="idx" justify="center" class="my-3">
      <v-card :width="$vuetify.breakpoint.smAndDown ? '75vw' : '50vw'">
        <v-row>
          <v-card-subtitle v-text="item.created"></v-card-subtitle>
        </v-row>
        <v-row>
          <v-col cols="auto">
            <v-avatar class="ma-3">
              <v-img :src="getAvatar('me')"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="auto">
            <v-card-subtitle class="text--primary">a;selkfj</v-card-subtitle>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
    <v-row justify="center" class="my-3">
      <v-card :width="$vuetify.breakpoint.smAndDown ? '75vw' : '50vw'">
        <v-row>
          <v-col cols="1" class="pb-0">
            <v-avatar class="mx-3">
              <v-img :src="getAvatar('me')"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="11" class="pb-0">
            <v-textarea
              class="mx-3"
              outlined
              rows="1"
              auto-grow
              placeholder="leave a comment"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="auto" class="pt-0">
            <ui-button class="mx-3">
              <template slot="content">send</template>
            </ui-button>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
  </div>
</template>

<script>
export default {

  name: 'ShowReply',

  props: {
    items: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {

    }
  },

  methods: {
    getAvatar(payload) {
      if ( payload === 'me' ) payload = this.getPayload().md5;
      var d = encodeURI("noj.tw/defaultAvatar.png");
      return `https://www.gravatar.com/avatar/${payload}?d=${d}`;
    },
    getPayload() {
      if ( this.$cookies.isKey('jwt') ) {
        var payload = this.parseJwt(this.$cookies.get('jwt'));
        if ( payload.active === false ) {
          this.$router.push('/');
        } else {
          return payload;
        }
      } else {
        this.$router.push('/');
      }
    },
    parseJwt(token) {
      return JSON.parse(atob(token.split('.')[1])).data;
    },
    timeFormat(time) {
      var tmp = new Date(time * 1000);
      var year = tmp.getFullYear();
      var month = '0' + (tmp.getMonth()+1);
      var date = '0' + tmp.getDate();
      var hour = '0' + tmp.getHours();
      var min = '0' + tmp.getMinutes();
      var sec = '0' + tmp.getSeconds();
      var time = year + '/' + month.substr(-2) + '/' + date.substr(-2) + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2);
      return time;
    },
  }
}
</script>

<style lang="css" scoped>
</style>