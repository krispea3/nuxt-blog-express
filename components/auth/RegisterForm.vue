<template>
    <b-form>
      <b-form-group
        id="input-group-firstname"
        label="firstname:"
        label-for="input-firstname">
        <b-form-input :class="{invalid: $v.form.firstname.$error}"
          id="input-firstname"
          v-model="form.firstname"
          type="text"
          placeholder="Enter firstname"
          @blur="$v.form.firstname.$touch()">
        </b-form-input>
        <div v-if="$v.form.firstname.$dirty">
          <span class="error" v-if="!$v.form.firstname.required">firstname required</span>
        </div>
      </b-form-group>

      <b-form-group
        id="input-group-surname"
        label="Surname:"
        label-for="input-surname">
        <b-form-input :class="{invalid: $v.form.surname.$error}"
          id="input-surname"
          v-model="form.surname"
          type="text"
          placeholder="Enter surname"
          @blur="$v.form.surname.$touch()">
        </b-form-input>
        <div v-if="$v.form.surname.$dirty">
          <span class="error" v-if="!$v.form.surname.required">Surname required</span>
        </div>

      </b-form-group>

      <b-form-group
        id="input-group-email"
        label="Email address:"
        label-for="input-email"
        description="We'll never share your email with anyone else.">
        <b-form-input :class="{invalid: $v.form.email.$error}"
          id="input-email"
          v-model="form.email"
          type="email"
          :disabled="user ?true :false"
          placeholder="Enter email"
          @blur="$v.form.email.$touch()">
        </b-form-input>
        <div v-if="$v.form.email.$dirty">
          <span class="error" v-if="!$v.form.email.email">Invalid email</span>
          <span class="error" v-if="!$v.form.email.required">Email required</span>
          <span class="error" v-if="!$v.form.email.unique">This email address is already registered. Please Login</span>
        </div>
      </b-form-group>

      <b-form-group v-if="!user"
        id="input-group-password"
        label="Password:"
        label-for="input-password"
        description="Minimum 8 chars">
        <b-form-input :class="{invalid: $v.form.password.$error}"
          id="input-password"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          @blur="$v.form.password.$touch()">
        </b-form-input>
        <div v-if="$v.form.password.$dirty">
          <span class="error" v-if="!$v.form.password.required">Password required</span>
          <span class="error" v-if="!$v.form.password.minLength">Password needs at least 8 chars</span>
        </div>
      </b-form-group>

      <b-form-group v-if="!user"
        id="input-group-confirmPassword"
        label="Confirm password:"
        label-for="input-confirmPassword">
        <b-form-input :class="{invalid: $v.form.confirmPassword.$error}"
          id="input-confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          placeholder="Confirm password"
          @blur="$v.form.confirmPassword.$touch()">
        </b-form-input>
        <div v-if="$v.form.confirmPassword.$dirty">
          <span class="error" v-if="!$v.form.confirmPassword.passwordConfirmed">Passwords don't match</span>
        </div>
      </b-form-group>


      <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

      <b-button v-if="!user"
        @click="register"
        :disabled="$v.form.$invalid"
        variant="success">
          Register
        <b-spinner v-if="isLoading.includes('register')" small></b-spinner>
      </b-button>
      <b-button v-if="user"
        @click="updateUser"
        :disabled="$v.form.$invalid"
        variant="success">
          Save
        <b-spinner v-if="isLoading.includes('update')" small></b-spinner>
      </b-button>
            <b-button
        @click="$router.go(-1)">
          Cancel
      </b-button>

    </b-form>
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  created () {
    if (this.user) {
      this.form = {...this.user}
      // Assigning pseudo password for formvalidation. Will be written no where
      this.form.password = '12345678'
      this.form.confirmPassword = '12345678'
    }
  },
  data () {
    return {
      form: {
        firstname: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
    }
  },
  validations: {
    form: {
      firstname: {
        required
      },
      surname: {
        required
      },
      email: {
        required,
        email,
        unique: (vm, val) => {
          // Don't check email if its empty or it's Edit profile
          if (val === '' || vm.user) return true
          return axios.get('https://nuxt-blog-9be94.firebaseio.com/users.json?orderBy="email"&equalTo="' + val + '"')
            .then(res => {
              return Object.keys(res.data).length === 0
            })
        }
      },
      password: {
        required,
        minLength: minLength(8)
      },
      confirmPassword: {
          passwordConfirmed: sameAs('password')
      } 
    }
  },
  props: {
    user: {
      type: Object,
      required: false
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    isLoading () {
      return this.$store.getters.isLoading
    }
  },
  methods: {
    register () {
      delete this.form['confirmPassword']
      this.$store.dispatch('isLoading', 'register')
      this.$emit('register', this.form)
    },
    updateUser () {
      // remove password from the form
      delete this.form['password']
      delete this.form['confirmPassword']
      this.$store.dispatch('isLoading', 'update')
      this.$emit('updateUser', this.form)
    }
  }

}
</script>

<style scoped>
  .error {
    color: red;
    font-size: 80%;
    margin-top: 5px;
  }
  .invalid {
    border: 1px solid red;
  }
</style>
