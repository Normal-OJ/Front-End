<template>
	<v-content>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="2">
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-btn color="primary" fab>
                  <v-icon large>mdi-plus-thick</v-icon>
                </v-btn>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Compose</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list nav dense>
            <v-list-item-group color="primary">
              <v-list-item 
                v-for="item in navbar"
                :key="item.time"
                link
              >
                <v-list-item-icon>
                  <v-icon>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{item.title}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="3">
          <v-list 
            three-line
            v-for="(item, i) in mail"
            :key="i"
          >
            <v-list-item @click="">
              <v-list-item-avatar>
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{item.subject}}</v-list-item-title>
                <v-list-item-subtitle>{{item.sender}} - {{item.time}}</v-list-item-subtitle>
                <v-list-item-subtitle>{{item.content}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider inset></v-divider>
          </v-list>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="6">
          <v-card elevation="0">
            <v-card-title></v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
	</v-content>
</template>

<script>
export default {

  name: 'Inbox',

  data () {
    return {
    	navbar: [
    		{ icon: 'mdi-inbox', title: 'Inbox'},
    		{ icon: 'mdi-send', title: 'Sent'},
    		{ icon: 'mdi-file', title: 'Draft'},
    		{ icon: 'mdi-delete', title: 'Trash'}
    	],
      mail: [
        { sender: 'Uier',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          subject: 'ntnu csie summer camp',
          content: 'As title, u! As title, u! As title, u! As title, u! As title, u!',
          time: '12:03'
        },
        { sender: 'cpj',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          subject: 'test',
          content: 'As title.',
          time: '18:03'
        },
        { sender: 'aflafl',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          subject: 'ooo',
          content: '0991234567890qwertyuioasdfghjklz xcvbnm,098765edkdftgyhunfd6csxexbabiubcuibgfwvgurefviuegrvfuervfuwrvfiwugvfuevfugrvfuwvrfuviugfevrugfvrguv',
          time: '10:10'
        }
      ]
    }
  }
}
</script>

<style lang="css" scoped>
</style>