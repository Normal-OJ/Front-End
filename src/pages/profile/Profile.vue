<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col
        cols="4"
      >
        <v-card
          class="ma-5 pa-8"
          elevation="0"
        >
          <v-row
            justify="center"
            class="mb-5"
          >
            <v-avatar
              size="120"
            >
              <v-img
                :src="avatar"
                alt="avatar"
              ></v-img>
            </v-avatar>
          </v-row>
          <v-row
            justify="center"
            class="text-h4 mb-1 "
          >
            {{info.displayedName}}
          </v-row>
          <v-row
            justify="center"
            class="text-h5"
          >
            {{info.username}}
          </v-row>
          <v-row
            justify="center"
            class="text-subtitle grey--text mb-2"
          >
            (系級學號資料)
            <!-- {{info.XXX}} -->
          </v-row>
          <v-row
            justify="center"
          >
            <v-textarea
              outlined
              :disabled="introEditDisabled"
              label="intro"
              :value="info.bio"
            >
            </v-textarea>
          </v-row>
          <v-row
            justify="end"
          >
            <v-btn
              v-if="introEditDisabled"  
              rounded
              color="primary"
              @click="introEditDisabled = !introEditDisabled"
            >
              Edit
              <v-icon right>
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn
              v-if="!introEditDisabled"  
              outlined
              rounded
              color="primary"
              @click="introEditDisabled = !introEditDisabled"
            >
              Save
              <v-icon right>
                mdi-content-save
              </v-icon>
            </v-btn>
          </v-row>
        </v-card>
      </v-col>
      <!-- <v-spacer></v-spacer>
      <v-divider vertical class="mx-1"></v-divider>
      <v-spacer></v-spacer> -->
      <v-col
        cols="8"
      >
        <v-row
          justify="center"
        >
          <v-tabs
            v-model="profiletab"
            color="primary"
            slider-color="primary"
            grow
          >
            <v-tab>
              Overview
            </v-tab>
            <v-tab>
              Edit Information
            </v-tab>
            <v-tab>
              Setting
            </v-tab>
            <v-tab-item>
              <v-card
                tile
                elevation="0"
              >
                <v-card-title primary-title>
                  Problem Solving This Year
                </v-card-title>
                (還在研讀活躍表寫法)
                <div class="graph">
                  <ul class="months">
                    <li>Jan</li>
                    <li>Feb</li>
                    <li>Mar</li>
                    <li>Apr</li>
                    <li>May</li>
                    <li>Jun</li>
                    <li>Jul</li>
                    <li>Aug</li>
                    <li>Sep</li>
                    <li>Oct</li>
                    <li>Nov</li>
                    <li>Dec</li>
                  </ul>
                  <ul class="days">
                    <li>Sun</li>
                    <li>Mon</li>
                    <li>Tue</li>
                    <li>Wed</li>
                    <li>Thu</li>
                    <li>Fri</li>
                    <li>Sat</li>
                  </ul>
                  <ul class="squares"></ul>
                </div>
              </v-card>
              <v-card
                elevation="0"
                class="px-5 pb-5"
              >
                <v-card-title primary-title>
                  Current Course
                </v-card-title>
                <v-row
                  class="pt-1 justify-space-around"
                >
                  <v-card
                    v-for="item in currentCourse"
                    :key="item.title"
                    outlined
                    class="mx-1 my-1 stripe"
                    height="100px"
                    width="300px"
                    style="cursor: pointer"
                    @click="$router.push('/course/'+item.name)"
                  >
                    <v-card-title
                      class="text-subtitle primary--text"
                    >
                      {{item.title}}
                    </v-card-title>
                    <span
                      class="pa-5"
                    >
                      {{item.teacher}}
                    </span>
                  </v-card>
                </v-row>
                  <!-- <v-row>
                    <v-cols
                      cols="12"
                    >
                    </v-cols>
                  </v-row> -->
                <!-- <v-container
                  fluid
                >
                </v-container> -->
              </v-card>
            </v-tab-item>
            <v-tab-item
              class="px-5"
            >
              <v-alert
                v-show="errAlert === 'profile'"
                dense
                :type="errType"
                dismissible
              >
                {{errMsg}}
              </v-alert>
              <!-- <v-alert
                v-show="errAlert === 'profile'"
                dense
                :type="errType"
                :alertMsg="errMsg"
              >
              </v-alert>
              <v-btn
                @click="snackbar = true"
              >
                open
              </v-btn>
              <v-snackbar
                v-model="snackbar"
                timeout="5000"
              >
                {{errMsg}}
                <template v-slot:action="{ attrs }">
                  <v-btn
                    color="blue"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                  >
                    Close
                  </v-btn>
                </template>
              </v-snackbar> -->
              <v-card
                tile
                elevation="0"
              >
                <v-card-title primary-title>
                  Change Password
                </v-card-title>
                <v-form
                  ref="passwordForm"
                  v-model="passwordForm"
                  lazy-validation
                >
                  <v-container>
                    <v-row>
                      <v-col
                        cols="4"
                      >
                        <v-text-field
                          v-model="password.oldPassword"
                          label="Current Password"
                          :append-icon="showPassword.oldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPassword.oldPassword ? 'text' : 'password'"
                          :rules="[v => !!v || 'Please enter current password.']"
                          @click:append="showPassword.oldPassword = !showPassword.oldPassword"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col
                        cols="4"
                      >
                        <v-text-field
                          v-model="password.newPassword"
                          label="New Password"
                          :append-icon="showPassword.newPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPassword.newPassword ? 'text' : 'password'"
                          :rules="[v => !!v || 'Please enter new password.']"
                          @click:append="showPassword.newPassword = !showPassword.newPassword"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col
                        cols="4"
                      >
                        <v-text-field
                          v-model="password.confirm"
                          label="Confirm New Password"
                          :append-icon="showPassword.confirm ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPassword.confirm ? 'text' : 'password'"
                          :rules="[v => !!v && v===password.newPassword || 'You should enter the same password with the new one.']"
                          @click:append="showPassword.confirm = !showPassword.confirm"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
                <v-row
                  justify="end"
                  class="pb-5 px-10"
                >
                  <v-btn
                    color="primary"
                    @click="changePassword"
                    rounded
                  >
                    Save
                    <v-icon right>
                      mdi-content-save
                    </v-icon>
                  </v-btn>
                </v-row>
              </v-card>
              <v-card
                tile
                elevation="0"
              >
                <v-card-title primary-title>
                  Change Displayed Name
                </v-card-title>
                <v-form
                  ref="displayedNameForm"
                  v-model="displayedNameForm"
                  lazy-validation
                >
                  <v-text-field
                    v-model="displayedName"
                    label="New Displayed Name"
                    :rules="[v => !!v && v!=info.displayedName || 'Please enter new displayed name.']"
                    outlined
                    class="mx-2"
                  >
                  </v-text-field>
                </v-form>
                <v-row
                  justify="end"
                  class="pb-5 px-10"
                >
                  <v-btn
                    color="primary"
                    @click="changeDisplayedName"
                    rounded
                  >
                    Save
                    <v-icon right>
                      mdi-content-save
                    </v-icon>
                  </v-btn>
                </v-row>
              </v-card>
              <v-card
                tile
                elevation="0"
              >
                <v-card-title primary-title>
                  Change E-mail Address
                </v-card-title>
                <v-form
                  ref="emailForm"
                  v-model="emailForm"
                  lazy-validation
                >
                  <v-text-field
                    v-model="email"
                    label="New E-mail address"
                    :rules="[v => !!v && v != info.email || 'Please enter new E-mail address.']"
                    outlined
                    class="mx-2"
                  >
                  </v-text-field>
                </v-form>
                <v-row
                  justify="end"
                  class="pb-5 px-10"
                >
                  <v-btn
                    color="primary"
                    @click="changeEmail"
                    rounded
                  >
                    Save
                    <v-icon right>
                      mdi-content-save
                    </v-icon>
                  </v-btn>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item
              class="px-5"
            >
              <v-card
                v-for="item in settingList"
                :key="item.title"
                tile
                elevation="0"
              >
                <v-card-title primary-title>
                  {{item.title}}
                </v-card-title>
                <!-- {{item.options}} -->
                <v-select
                  :items="item.options"
                  v-model="settingSelect[item.title]"
                  return-object
                  item-text="state"
                  item-value="value"
                  class="mx-10"
                >
                </v-select>
              </v-card>
              <v-row
                justify="end"
                class="py-10 px-10"
              >
                <v-btn
                  color="primary"
                  @click="updateSetting"
                  rounded
                >
                  Save
                  <v-icon right>
                    mdi-content-save
                  </v-icon>
                </v-btn>
              </v-row>
              <!-- {{settingSelect}} -->
            </v-tab-item>
          </v-tabs>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

const API_BASE_URL = '/api';

export default {
  name: 'Profile',

  data() {
    return {
      introEditDisabled: true,
      
      settingList: null,

      fakeSettingList:
      [
        {
          title: 'Setting A',
          options: [
            {state: "o1", value: "1"},
            {state: "o2", value: "2"},
            {state: "o3", value: "3"}
          ],
        },
        {
          title: "Setting B",
          options: [
            {state: "o1", value: "1"},
            {state: "o2", value: "2"},
            {state: "o3", value: "3"}
          ],
        },
        {
          title: "Setting C",
          options: [
            {state: "o1", value: "1"},
            {state: "o2", value: "2"},
            {state: "o3", value: "3"}
          ],
        }
      ],

      settingSelect: null,
      fakeSettingSelect:
      {
        'Setting A': "1",
        'Setting B': "1",
        'Setting C': "1",
      },

      passwordForm: false,
      showPassword: {
        oldPassword: false,
        newPassword: false,
        confirm: false
      },
      password: {
        'newPassword': '',
        'oldPassword': '',
      },

      displayedNameForm: false,
      displayedName: '',

      emailForm: false,
      email: '',

      info: {
        'username': '',
        'email': '',
        'displayedName': '',
        'bio': '',
      },

      currentCourse: [],
      fakeCurrentCourse:
      [
        {
          title: "Course A",
          name: "CA",
          teacher: "XXX"
        },
        {
          title: "Course B",
          name: "CB",
          teacher: "YYY"
        },
        {
          title: "Course C",
          name: "CC",
          teacher: "ZZZ"
        }
      ],
      snackbar: false,
      avatar: this.setAvatar(''),
      errAlert: '',
      errType: 'error',
      errMsg: '',
      profileForm: false
    }
  },

  // data: () => ({
  //     passwdForm: false,
  //     passwd: {
  //       'newPassword': '',
  //       'oldPassword': '',
  //     },
  //     info: {
  //       'username': '',
  //       'email': '',
  //       'displayedName': '',
  //       'bio': '',
  //     },
  //     avatar: this.setAvatar(''),
  //     errAlert: '',
  //     errType: 'error',
  //     errMsg: '',
  //     profileForm: false
  // }),

  beforeMount() {
    this.getProfile();
    this.randomSquares();
  },

  methods: {
    randomSquares() {
      const squares = document.querySelector('.squares');
      for (var i = 1; i < 365; i++) {
        const level = Math.floor(Math.random() * 3);  
        squares.insertAdjacentHTML('beforeend', `<li data-level="${level}"></li>`);
      }
    },
    getProfile() {
      // this.$http.get(`${API_BASE_URL}/profile`)
      //   .then((res) => {
      //     // console.log(res.data.data);
      //     this.info = res.data.data;
      //   })
      //   .catch((err) => {
      //     // console.log(err);
      //   })
      if (this.$cookies.isKey('jwt')) {
        this.payload = this.parseJwt(this.$cookies.get('jwt'));
        if (this.payload.active === true) {
          this.info.username = this.payload.username;
          this.info.email = this.payload.email;
          this.info.displayedName = this.payload.profile.displayedName;
          this.info.bio = this.payload.profile.bio;
          this.avatar = this.setAvatar(this.payload.md5);

          // fakedata
          this.settingList = this.fakeSettingList;
          this.settingSelect = this.fakeSettingSelect;
          this.currentCourse = this.fakeCurrentCourse;
        }
      } else {
        this.$router.push('/');
      }
    },
    setAvatar(payload) {
      var d = encodeURI("https://noj.tw/defaultAvatar.png");
      return `https://www.gravatar.com/avatar/${payload}?d=${d}&s=100`;
    },
    parseJwt(token) {
      console.log(atob(token.split('.')[1]));
      return JSON.parse(atob(token.split('.')[1])).data;
    },
    changePassword() {
      if (this.$refs.passwordForm.validate()) {
        this.$http.post(`${API_BASE_URL}/auth/change-password`, this.password)
          .then((res) => {
            this.errMsg = 'Password changed successfully!';
            this.errType = 'success';
            this.errAlert = 'password';
            // console.log(res);
          })
          .catch((err) => {
            this.errMsg = 'Sorry, your password do not match.';
            this.errType = 'error';
            this.errAlert = 'password';
            // console.log(err);
          })

        if(this.errType == 'error'){
          this.snackbar = true;
        }
      }
    },
    changeEmail() {
      if (this.$refs.emailForm.validate()) {
        this.$http.post(`${API_BASE_URL}/profile`, this.info)
          .then((res) => {
            this.errMsg = 'Information updated successfully!';
            this.errType = 'success';
            this.errAlert = 'profile';
            // console.log(res);
          })
          .catch((err) => {
            this.errMsg = 'Invalid profile!';
            this.errType = 'error';
            this.errAlert = 'profile';
          })

        if(this.errType == 'error'){
          this.snackbar = true;
        }
      }
    },
    changeDisplayedName() {
      if (this.$refs.displayedNameForm.validate()) {
        this.$http.post(`${API_BASE_URL}/profile`, this.info)
          .then((res) => {
            this.errMsg = 'Information updated successfully!';
            this.errType = 'success';
            this.errAlert = 'profile';
            // console.log(res);
          })
          .catch((err) => {
            this.errMsg = 'Invalid profile!';
            this.errType = 'error';
            this.errAlert = 'profile';
          })

        if(this.errType == 'error'){
          this.snackbar = true;
        }
      }
    },
    updateSetting() {
      
    }
  }
}
</script>

<style>
.stripe {
  background: linear-gradient(
        -45deg, 
        rgba(126, 197, 255, 0.5) 0, rgba(126, 197, 255, 0.5) 25%, transparent 25%, transparent 50%, 
        rgba(126, 197, 255, 0.5) 50%, rgba(126, 197, 255, 0.5) 75%, transparent 75%, transparent
      );
  background-size: 5px 5px;
}

.months {
  grid-area: months;
}

.days {
  grid-area: days;
}

.squares {
  grid-area: squares;
}

.graph {
  display: inline-grid;
  grid-template-areas: "empty months" "days squares";
  grid-gap: 10px;
  grid-template-columns: auto 1fr;
}

:root {
  --square-size: 15px;
  --square-gap: 5px;
  --week-width: calc(var(--square-size) + var(--square-gap));
}

.months {
  display: grid;
  grid-template-columns: calc(var(--week-width) * 4) /* Jan */
                        calc(var(--week-width) * 4) /* Feb */
                        calc(var(--week-width) * 4) /* Mar */
                        calc(var(--week-width) * 5) /* Apr */
                        calc(var(--week-width) * 4) /* May */
                        calc(var(--week-width) * 4) /* Jun */
                        calc(var(--week-width) * 5) /* Jul */
                        calc(var(--week-width) * 4) /* Aug */
                        calc(var(--week-width) * 4) /* Sep */
                        calc(var(--week-width) * 5) /* Oct */
                        calc(var(--week-width) * 4) /* Nov */
                        calc(var(--week-width) * 5) /* Dec */;
}

.days,
.squares {
  display: grid;
  grid-gap: var(--square-gap);
  grid-template-rows: repeat(7, var(--square-size));
}

.squares {
  grid-auto-flow: column;
  grid-auto-columns: var(--square-size);
}

/* Other styling */
ul {
    list-style-type: none;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 12px;
}

.graph {
  padding: 20px;
  border: 1px #e1e4e8 solid;
  margin: 20px;
}

.days li:nth-child(odd) {
  visibility: hidden;
}

.squares li {
  background-color: #ebedf0;
}

.squares li[data-level="1"] {
  background-color: #c6e48b;
}

.squares li[data-level="2"] {
  background-color: #7bc96f;
}

.squares li[data-level="3"] {
  background-color: #196127;
}
</style>