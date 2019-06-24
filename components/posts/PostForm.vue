<template>
  <div>
    <b-form>
      <!-- Title -->
      <b-form-group
        id="input-group-1"
        label="Title"
        label-for="input-1">
        <b-form-input :class="{invalid: $v.formData.title.$error}"
          id="input-1"
          v-model="formData.title"
          type="text"
          placeholder="Enter title"
          @blur="$v.formData.title.$touch()">
        </b-form-input>
        <div v-if="$v.formData.title.$dirty">
          <span class="error" v-if="!$v.formData.title.required">Title is required</span>
          <span class="error" v-if="!$v.formData.title.maxLength">Title can only contain 30 chars</span>
        </div>
      </b-form-group>
      <!-- Description -->
      <b-form-group
        id="input-group-1"
        label="Description"
        label-for="input-1">
        <b-form-textarea :class="{invalid: $v.formData.description.$error}"
          id="input-1"
          v-model="formData.description"
          type="text"
          placeholder="Enter description"
          @blur="$v.formData.description.$touch()">
        </b-form-textarea>
        <div v-if="$v.formData.description.$dirty">
          <span class="error" v-if="!$v.formData.description.required">Description is required</span>
          <span class="error" v-if="!$v.formData.description.maxLength">Description can only contain 80 chars</span>
        </div>
      </b-form-group>
      <!-- Content -->
      <b-form-group
        id="input-group-1"
        label="Content"
        label-for="input-1">
        <b-form-textarea :class="$v.formData.content.$error"
          id="input-1"
          v-model="formData.content"
          rows="5"
          placeholder="Enter content"
          @blur="$v.formData.content.$touch()">
        </b-form-textarea>
        <div v-if="$v.formData.content.$dirty">
          <span class="error" v-if="!$v.formData.content.required">Content is required</span>
        </div>
      </b-form-group>
      <!-- Image URL -->
      <b-form-group
        id="input-group-1"
        label="Image URL"
        label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="formData.imgUrl"
          type="text"
          placeholder="Enter image URL">
        </b-form-input>
      </b-form-group>
      <!-- Image Alt -->
      <b-form-group
        id="input-group-1"
        label="Image alt-tag"
        label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="formData.imgAlt"
          type="text"
          placeholder="Enter image alt-tag">
        </b-form-input>
      </b-form-group>

      <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

      <b-button
        :disabled="$v.formData.$invalid"
        @click="saveForm" 
        variant="success">
          Save
          <b-spinner v-if="isSaving" small></b-spinner>
      </b-button>
      <b-button 
        type="reset"
        variant="primary">
          Reset
      </b-button>
      <b-button v-if="post" 
        @click="deletePost" 
        variant="danger">
          Delete
        <b-spinner v-if="isDeleting" small></b-spinner>
      </b-button>
      <b-button
        @click="$router.go(-1)">
          Cancel
      </b-button>
    </b-form>
  </div>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'

  export default {
    created () {
      if (this.post) {
        this.formData.title = this.post.title
        this.formData.description = this.post.description
        this.formData.content = this.post.content
        this.formData.imgUrl = this.post.imgUrl
        this.formData.imgAlt = this.post.imgAlt
        this.formData.author = this.post.author
        this.formData.created = this.post.created
        this.formData.updated = this.post.updated
      }
    },
    data() {
      return {
        isSaving: false,
        isDeleting: false,
        formData: {
          title: '',
          description: '',
          content: '',
          imgUrl: '',
          imgAlt: '',
          author: '',
          created: null,
          updated: null
        },
      }
    },
    validations: {
      formData: {
        title: {
          required,
          maxLength: maxLength(30)
        },
        description: {
          required,
          maxLength: maxLength(80)
        },
        content: {
          required
        },
      }
    },
    props: {
      post: {
        type: Object,
        required: false
      },
      error: String
    },
    methods: {
      saveForm () {
        this.isSaving = true
        this.formData.updated = new Date()
        const user = this.$store.getters.user
        const author = user.firstName + ' ' + user.surName
        this.formData.author = author

        if (!this.post) {
          this.formData.created = new Date()
        }
        this.$emit('onSave', this.formData)
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.formData.text = ''
        this.formData.content = ''
        this.formData.imgUrl = ''
        this.formData.imgAlt = ''
        // Trick to reset/clear native browser form validation state
        // this.show = false
        // this.$nextTick(() => {
        //   this.show = true
        // })
      },
      deletePost () {
        this.isDeleting = true
        this.$emit('onDelete')
      }
    }
      // onSubmit(evt) {
      //   evt.preventDefault()
        // alert(JSON.stringify(this.form))
      // },
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
