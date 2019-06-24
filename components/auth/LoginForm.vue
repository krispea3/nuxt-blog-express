<template>
    <b-form>
      <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
        description="We'll never share your email with anyone else.">
        <b-form-input :class="{invalid: $v.form.email.$error}"
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          @blur="$v.form.email.$touch()">
        </b-form-input>
        <div v-if="$v.form.email.$dirty">
          <span class="error" v-if="!$v.form.email.email">Invalid email</span>
          <span class="error" v-if="!$v.form.email.required">Email required</span>
        </div>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Password:"
        label-for="input-2"
        description="At least 8 chars required">
        <b-form-input :class="{invalid: $v.form.password.$error}"
          id="input-2"
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

      <b-button
        @click="login"
        :disabled="$v.form.$invalid" 
        variant="success">
          Login
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

export default {
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
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8)
      }
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
    login () {
      this.$store.dispatch('isLoading', true)
      this.$emit('login', this.form)
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
