<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-half">
            <div class="notification is-success has-text-centered" v-if="validUser">
              Valid User - Email Exists
            </div>
            <div class="notification is-danger has-text-centered" v-if="invalidCredentials">
              {{ invalidMessage }}
            </div>
            <div class="card">
              <div class="card-content">
                <div class="field animated flipInX has-text-centered" v-if="errors.email || errors.password">
                  <span class="tag is-danger">Email or Password is incorrect</span>
                </div>
                <div class="field">
                  <label class="label">Email</label>
                  <div class="control has-icons-left has-icons-right">
                    <input
                      class="input"
                      type="email"
                      v-model="user.email"
                      v-on:input="checkFormFields"
                      v-bind:class="{ 'is-danger': errors.email, 'is-danger': error.email }"
                      placeholder="joey@google.com">
                    <span class="icon is-small is-left">
                        <i class="fas fa-envelope"></i>
                      </span>
                    <span class="icon is-small is-right" v-if="errors.email || error.email">
                        <i class="fas fa-exclamation-triangle"></i>
                      </span>
                  </div>
                  <p class="help is-danger" v-if="error.email">{{error.email}}</p>
                </div>
                <div class="field">
                  <label class="label">Password</label>
                  <div class="control has-icons-left has-icons-right">
                    <input
                      class="input"
                      type="password"
                      v-model="user.password"
                      v-on:input="checkFormFields"
                      v-bind:class="{'is-danger': errors.password, 'is-danger': error.password }"
                      placeholder="supersecretpassword">
                    <span class="icon is-small is-left">
                        <i class="fas  fa-unlock-alt"></i>
                      </span>
                    <span class="icon is-small is-right" v-if="errors.password || error.password">
                        <i class="fas fa-exclamation-triangle"></i>
                      </span>
                  </div>
                  <p class="help is-danger" v-if="error.password">{{error.password}}</p>
                </div>

                <div class="field is-grouped">
                  <div class="control">
                    <button class="button is-link" v-on:click="validateForm()">Submit</button>
                  </div>
                  <div class="control">
                    <button class="button is-text">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>


<script>
  import _ from 'lodash';
  import Authentication from '@/services/Authentication'

  export default {
    name: 'Login',
    data() {
      return {
        user: {
          email: '',
          password: ''
        },
        errors: {},
        validUser: false,
        invalidCredentials: false,
        invalidMessage: '',
        error: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      checkFormFields:  _.debounce(function () {
        this.invalidMessage = ''
        this.invalidCredentials = false
        this.validUser = false
        if (this.user.email) {
          this.error.email = ''
        }
        if (this.user.password) {
          this.error.password = ''
        }
      }, 500),
      validateForm() {
        if (!this.user.email) {
          this.error.email = 'Email is required'
        } else {
          this.error.email = ''
        }
        if (!this.user.password) {
          this.error.password = 'Password is required'
        } else {
          this.error.password = ''
        }
        if (!this.error.email && !this.error.password) {
          this.confirmUser()
        }

      },
      async confirmUser() {
        await Authentication.loginUser(this.user).then(res => {
          if (res.data.errors) {
            console.log('THERE ARE ERRORS')
            this.errors = res.data.errors
            console.log(this.errors)
//            this.errorMsg('Please fill out all form fields')
          } else if (res.data.status === 400) {
            this.invalidMessage = 'Email does not exist!'
            this.invalidCredentials = true // display this somewhere to show bad credentials
          } else if (res.data.status === 401) {
            this.invalidMessage = 'Invalid email or password!'
            this.invalidCredentials = true // display this somewhere to show bad credentials
          } else {
            console.log(res) // display content being sent back.....
            this.validUser = true // display this somewhere to know successful credentials

            // redirect to profile

          }
        })
      }
    }
  }
</script>
