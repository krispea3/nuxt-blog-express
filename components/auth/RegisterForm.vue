<template>
    <b-form>
      <b-form-group
        id="input-group-1"
        label="Firstname:"
        label-for="input-1">
        <b-form-input :class="{invalid: $v.form.firstName.$error}"
          id="input-1"
          v-model="form.firstName"
          type="text"
          placeholder="Enter firstname"
          @blur="$v.form.firstName.$touch()">
        </b-form-input>
        <div v-if="$v.form.firstName.$dirty">
          <span class="error" v-if="!$v.form.firstName.required">Firstname required</span>
        </div>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Surname:"
        label-for="input-2">
        <b-form-input :class="{invalid: $v.form.surName.$error}"
          id="input-2"
          v-model="form.surName"
          type="text"
          placeholder="Enter surname"
          @blur="$v.form.surName.$touch()">
        </b-form-input>
        <div v-if="$v.form.surName.$dirty">
          <span class="error" v-if="!$v.form.surName.required">Surname required</span>
        </div>

      </b-form-group>

      <b-form-group
        id="input-group-3"
        label="Email address:"
        label-for="input-3"
        description="We'll never share your email with anyone else.">
        <b-form-input :class="{invalid: $v.form.email.$error}"
          id="input-3"
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
        id="input-group-4"
        label="Password:"
        label-for="input-4"
        description="Minimum 8 chars">
        <b-form-input :class="{invalid: $v.form.password.$error}"
          id="input-4"
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

      <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

      <b-button v-if="!user"
        @click="register"
        :disabled="$v.form.$invalid"
        variant="success">
          Register
        <b-spinner v-if="isLoading" small></b-spinner>
      </b-button>
      <b-button v-if="user"
        @click="updateUser"
        :disabled="$v.form.$invalid"
        variant="success">
          Save
        <b-spinner v-if="isLoading" small></b-spinner>
      </b-button>
            <b-button
        @click="$router.go(-1)">
          Cancel
      </b-button>

    </b-form>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  created () {
    if (this.user) {
      this.form = {...this.user}
      // Assigning pseudo password for formvalidation. Will be written no where
      this.form.password = '12345678'
    }
  },
  data () {
    return {
      form: {
        firstName: '',
        surName: '',
        email: '',
        password: ''
      },
    }
  },
  validations: {
    form: {
      firstName: {
        required
      },
      surName: {
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
      this.$store.dispatch('isLoading', true)
      this.$emit('register', this.form)
    },
    updateUser () {
      // remove password from the form
      delete this.form['password']
      this.$store.dispatch('isLoading', true)
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
