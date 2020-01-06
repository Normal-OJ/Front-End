<template>
  <v-card>
    <v-card-title>
      Announcement
    </v-card-title>
    <div
      style="margin: 10px; max-height: 80vh; overflow: auto;"
    >
      <v-card v-for="(item, index) in items" :key="index"
        style="margin: 10px;"
        title="Click to view this announcement."
        v-on:click="viewAnn(index)"
      >
        <v-card-title>
          {{item.title}}
          <v-spacer></v-spacer>
          <span
            v-if="viewedAnnIndex !== index"
            class="caption grey--text"
          >
            {{item.lastUpdater}}
            at
            <span class="indigo--text">{{item.lastUpdatedTime.split(' ')[0]}}</span>
            {{item.lastUpdatedTime.split(' ')[1]}}
          </span>
        </v-card-title>

        <v-card-text
          v-if="viewedAnnIndex === index"
          class="black--text mask"
        >
          <span class="caption grey--text">
            Created: {{item.author}} at 
            <span class="indigo--text">{{item.createdTime.split(' ')[0]}}</span>
            {{item.createdTime.split(' ')[1]}}
            <span v-if="item.createdTime !== item.lastUpdatedTime">
              <br>
              Modified: {{item.lastUpdater}} at
              <span class="indigo--text">{{item.lastUpdatedTime.split(' ')[0]}}</span>
              {{item.lastUpdatedTime.split(' ')[1]}}
            </span>
          </span>
          <vue-markdown :source="item.content"></vue-markdown>
        </v-card-text>
      </v-card>
    </div>
  </v-card>
</template>

<script>

const API_BASE_URL = '/api';
import VueMarkdown from 'vue-markdown'

export default {

  name: 'Announcement',

  components: {
    VueMarkdown,
  },

  data () {
    return {
      items: [],
      viewedAnnIndex: -1
    }
  },

  beforeMount () {
    // this.getAnnouncements();
    this.useFakeData();
  },

  methods: {
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

    viewAnn(index) {
      if (index == this.viewedAnnIndex)
        this.viewedAnnIndex = -1;
      else
        this.viewedAnnIndex = index;
    },

    getAnnouncements() {
      this.$http.get(`${API_BASE_URL}/ann/Public`)
        .then((res) => {
          console.log(res)
          res.data.data.forEach(ele => {
            this.items.push({
              'annId': ele.annId,
              'title': ele.title,
              'author': ele.creater,
              'content': ele.markdown,
              'createdTime': this.timeFormat(ele.createTime),
              'lastUpdatedTime': this.timeFormat(ele.updateTime),
              'lastUpdater': ele.updater});
          })
        })
        .catch((err) => {
          console.log(err);
        });
    },

    useFakeData() {
      let ann = [
        {
          annId: 1,
          title: 'Welcome',
          creater: 'sys',
          markdown: '一级標題\n=======\n## 二级標題\n段落以空白行分隔。\n行末兩個空格  産生斷行。\n文本屬性：_斜體_、\n**粗體**、`等寬字型Monospace`。\n水平線：\n---\n列表：\n  * 張三\n  * 李四\n  * 王二\n編號列表：\n  1. 不論\n  2. 三七\n  3. 二十一\n[連結][示例]。\n  [示例]: http://example.com\n![圖](Icon-pictures.png "icon")\n> Markdown使用電郵用字元「>」來引用。\n行間<abbr title="Hypertext Markup Language">HTML</abbr>亦受支援。',
          createTime: 1578315258,
          updateTime: 1578315258,
          updater: 'sys4'
        },
        {
          annId: 2,
          title: 'Welcome 2',
          creater: 'sys2',
          markdown: 'Wellcome BBBBBYou!!\nWellcome You!!\nWellcome You!!\nWellcome You!!\n',
          createTime: 1578330258,
          updateTime: 1578330258,
          updater: 'sys5'
        },
        {
          annId: 3,
          title: 'Welcome 3',
          creater: 'sys3',
          markdown: 'Wellcome CCCCCYou!!\nWellcome You!!\nWellcome You!!\nWellcome You!!\n',
          createTime: 1578360258,
          updateTime: 1578390258,
          updater: 'sys6'
        },
      ];
      console.log(ann);
      ann.forEach(ele => {
        this.items.push({
          'annId': ele.annId,
          'title': ele.title,
          'author': ele.creater,
          'content': ele.markdown,
          'createdTime': this.timeFormat(ele.createTime),
          'lastUpdatedTime': this.timeFormat(ele.updateTime),
          'lastUpdater': ele.updater});
      });
      console.log(this.items);
    }
  }
}
</script>

<style lang="css" scoped>
</style>