<template>
  <v-container>
    <v-row
      v-for="i in 3"
      :key="i"
    >
      <v-col 
        cols="4"
        v-for="j in 3"
        :key="j"
      >
        <v-card>
          <v-card-title>
            <span
            >{{ 'Status ' + String((i-1)*3+(j-1)-1) }}</span>
            <span
              class="headline"
              :style="{ color: COLOR[(i-1)*3+(j-1)] }"
            >{{ ': ' + STATUS[(i-1)*3+(j-1)] }}</span>
          </v-card-title>
          <v-card-text
            :style="{ backgroundColor: COLOR[(i-1)*3+(j-1)], height: '20vh', color: 'white', textAlign: 'center' }"
            class="display-3"
          ><span
            :style="{ verticalAlign: 'middle' }"
            >{{ COLOR[(i-1)*3+(j-1)] }}</span>
            <!-- <p class="title">{{ REASON[(i-1)*3+(j-1)] }}</p> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

  name: 'Home',

  data () {
    return {
      STATUS: ['Pending', 'Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceed', 'Memory Limit Exceed', 'Runtime Error', 'Judge Error', 'Output Limit Exceed'],
      COLOR: ['#4E342E', '#00C853', '#F44336', '#DD2C00', '#9C27B0', '#FF9800', '#2196F3', '#93282C', '#BF360C'],
      REASON: [
        'Your code is pending by our judge, please wait.',
        'You solved the problem! Congrats!',
        'Output is not correct. keep going!',
        'Your code cannot be compiled correctly.',
        'Runtime of your program is over the limit.',
        'Memory Usage of your program over the limit.',
        'Errors occurred while your prgram was running or invalid system call.',
        'Bang! you broke our judge, please contact us.',
        'Output of your program is over the limit (1GB).',
      ],
    }
  }
}
</script>

<style lang="css" scoped>
</style>