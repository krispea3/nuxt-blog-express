<template>
  <div>
    <b-form>
      <!-- Title -->
      <b-form-group
        id="input-group-title"
        label="Title"
        label-for="input-title">
        <b-form-input :class="{invalid: $v.formData.title.$error}"
          id="input-title"
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
        id="input-group-description"
        label="Description"
        label-for="input-description">
        <b-form-textarea :class="{invalid: $v.formData.description.$error}"
          id="input-description"
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
        id="input-group-content"
        label="Content"
        label-for="input-content">
        <b-form-textarea :class="{invalid: $v.formData.content.$error}"
          id="input-content"
          v-model="formData.content"
          rows="5"
          placeholder="Enter content"
          @blur="$v.formData.content.$touch()">
        </b-form-textarea>
        <div v-if="$v.formData.content.$dirty">
          <span class="error" v-if="!$v.formData.content.required">Content is required</span>
        </div>
      </b-form-group>
      <!-- Image Upload -->
      <b-form-group
        id="input-group-img_upload"
        label="Upload image"
        label-for="input-img_upload"
        description="Maximum size 5MB">
        <b-form-file :class="{invalid: !validImgSize}"
          id="input-img_upload"
          accept="image/*"
          v-model="img_upload"
          placeholder="Choose a file..."
          drop-placeholder="Drop file here..."
        >
        </b-form-file>
          <div v-if="!validImgSize">
            <span class="error">File is greater than 5MB</span>
          </div>

      </b-form-group>
      <!-- Uploaded image -->
      <b-row v-if="formData.img_original_name != ''">
        <b-col md="4">
          <b-form-group
            id="input-group-img_original_name"
            label="Uploaded image"
            label-for="input-img_original_name">
            <b-form-input
              id="input-img_original_name"
              v-model="formData.img_original_name"
              readonly
            >
            </b-form-input>
          </b-form-group>
        </b-col>
        <b-col align-self="center" md="2">
          <b-button 
            @click="removeImage" 
            class="mt-3" 
            size="sm" 
            variant="danger"
          >
            Remove
            <b-spinner v-if="isLoading.includes('remove')" small></b-spinner>
          </b-button>
        </b-col>
      </b-row>

      <!-- Image Alt -->
      <b-form-group
        id="input-group-imgAlt"
        label="Image alt-tag"
        label-for="input-imgAlt">
        <b-form-input
          id="input-imgAlt"
          v-model="formData.imgalt"
          type="text"
          placeholder="Enter image alt-tag">
        </b-form-input>
      </b-form-group>
      <!-- Draft -->
      <!-- <b-form-checkbox-group v-model="formData.check" id="checkboxes-6" class="mb-3"> -->
        <b-form-checkbox v-model="formData.draft">Draft?</b-form-checkbox>
      <!-- </b-form-checkbox-group> -->

      <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>

      <div class="mt-3">
        <b-button
          :disabled="$v.formData.$invalid"
          @click="saveForm" 
          variant="success">
            Save
            <b-spinner v-if="isLoading.includes('save')" small></b-spinner>
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
          <b-spinner v-if="isLoading.includes('delete')" small></b-spinner>
        </b-button>
        <b-button
          @click="$router.go(-1)">
            Cancel
        </b-button>
      </div>
      
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
        this.formData.img_url = this.post.img_url
        this.formData.img_name = this.post.img_name
        this.formData.img_original_name = this.post.img_original_name
        this.img_upload = null
        this.formData.imgalt = this.post.imgalt
        this.formData.draft = this.post.draft
        this.formData.published = this.post.published
        this.formData.userid = this.post.userid
        this.formData.created = this.post.created
        this.formData.updated = this.post.updated
        this.formData.firstname = this.post.firstname
        this.formData.surname = this.post.surname

      }
    },
    data() {
      return {
        formData: {
          title: '',
          description: '',
          content: '',
          img_url: '',
          img_name: '',
          img_original_name: '',
          imgalt: '',
          draft: false,
          published: true,
          userid: this.$store.getters.user._id,
          firstname: this.$store.getters.user.firstname,
          surname: this.$store.getters.user.surname,
          created: null,
          updated: null
        },
        img_upload: null,
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
    computed: {
      isLoading () {
        return this.$store.getters.isLoading
      },
      validImgSize () {
        if (this.img_upload === null) {
          return true
        }
        if (this.img_upload.size > 5242880) {
          return false
        } else {
          return true
        }
      }
    },
    methods: {
      saveForm () {
        if (this.validImgSize) {
          this.$store.dispatch('isLoading', 'save')
          const payload = {
            formData: this.formData,
            img_upload: this.img_upload
          }
          this.$emit('onSave', payload)
        }
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.formData.text = ''
        this.formData.content = ''
        this.formData.img_url = ''
        this.formData.img_name = ''
        this.formData.img_original_name = ''
        this.formData.imgalt = ''
        this.img_upload = null
        // Trick to reset/clear native browser form validation state
        // this.show = false
        // this.$nextTick(() => {
        //   this.show = true
        // })
      },
      deletePost () {
        this.$store.dispatch('isLoading', 'delete')
        this.$emit('onDelete', this.formData.img_name)
      },
      removeImage () {
        this.$store.dispatch('isLoading', 'remove')
        this.$emit('onRemoveImage', this.formData.img_name)
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
