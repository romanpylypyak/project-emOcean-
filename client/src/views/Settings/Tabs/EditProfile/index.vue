<template>
  <q-page>
    <q-form class="q-gutter-md" @submit="onSubmit" @reset="onReset">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Avatar</div>
        </q-card-section>
        <q-card-section>
          <template v-if="!isNewAvatarSelected">
            <div class="row justify-center">
              <avatar :img="profile.avatarUrl" />
            </div>
          </template>
          <template v-else>
            <edit-image
              :src="photoUrl"
              class="avatar"
              ref="avatarEditor"
              @on-created-blob="onCreatedAvatarBlob"
            />
          </template>
          <div class="row justify-center q-mt-sm">
            <label for="inputAvatar" ref="photoUrlLabel">
              <input
                ref="avatar"
                type="file"
                id="inputAvatar"
                accept="image/*"
                @input="uploadImageUrl($event, 'avatar')"
                class="uploadImage"
              />
              <q-btn
                round
                color="secondary"
                icon="cloud_upload"
                @click="btnUploadPhotoUrl"
                class="q-mr-md"
              />
            </label>
            <q-btn round color="negative" icon="delete" @click="deletePhotoUrl" />
          </div>
        </q-card-section>
      </q-card>

      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Cover photo</div>
        </q-card-section>
        <q-card-section>
          <template v-if="!isNewCoverPhotoSelected">
            <div class="row justify-center">
              <img
                v-if="isProfileLoaded"
                :src="profile.backgroundUrl !== '' ? profile.backgroundUrl : DefaultCoverPhoto"
                class="coverPhoto"
              />
            </div>
          </template>
          <template v-else>
            <edit-image
              class="backgroundImage"
              :src="backgroundUrl"
              :aspectRatio="aspectRatioRectangle"
              ref="coverPhotoEditor"
              @on-created-blob="onCreatedCoverPhotoBlob"
            />
          </template>
          <div class="row justify-center q-mt-sm">
            <label
              for="inputCoverPhoto"
              ref="backgroundUrlLabel"
            >
              <input
                ref="background"
                type="file"
                id="inputCoverPhoto"
                accept="image/*"
                @input="uploadImageUrl($event, 'background')"
                class="uploadImage"
              />
              <q-btn
                round
                color="secondary"
                icon="cloud_upload"
                @click="btnUploadBackgroundUrl"
                class="q-mr-md"
              />
            </label>
            <q-btn round color="negative" icon="delete" @click="deleteBackgroundUrl" />
          </div>
        </q-card-section>
      </q-card>

      <q-card class="my-card q-pb-md">
        <q-card-section>
          <div class="text-h6">Personal info</div>
        </q-card-section>
        <q-card-section>
          <q-input
            label="Username"
            placeholder="Add your username"
            v-model="profile.nickname"
            :rules="[requiredField, checkNicknameField]"
            lazy-rules
          />
          <q-input
            label="Bio"
            type="textarea"
            placeholder="Add a bio to your profile"
            v-model="profile.bio"
            autogrow
            counter
            :rules="[checkUserDescriptionField]"
          />
          <q-input
            label="Status"
            type="textarea"
            placeholder="Add a status to your profile"
            v-model="profile.status"
            autogrow
            counter
            :rules="[checkUserDescriptionField]"
          />
        </q-card-section>
      </q-card>

      <q-card class="my-card q-pb-sm">
        <q-card-section>
          <div class="text-h6">Social medias</div>
        </q-card-section>
        <q-card-section>
          <q-input
            label="YouTube"
            placeholder="Add YouTube link to your profile"
            v-model="profile.socialAccounts.youtube"
            :rules="[checkURL]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon class="fab fa-youtube youtube" />
            </template>
          </q-input>
          <q-input
            label="Instagram"
            placeholder="Add Instagram link to your profile"
            v-model="profile.socialAccounts.instagram"
            :rules="[checkURL]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon class="fab fa-instagram instagram" />
            </template>
          </q-input>
          <q-input
            label="Facebook"
            placeholder="Add Facebook link to your profile"
            v-model="profile.socialAccounts.facebook"
            :rules="[checkURL]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon class="fab fa-facebook-f facebook" />
            </template>
          </q-input>
        </q-card-section>
      </q-card>

      <div class="q-pt-md">
        <q-btn
          label="Edit profile"
          type="submit"
          rounded
          color="secondary"
        >
          <q-spinner-bars
            class='q-ml-md'
            color='primary'
            size='1em'
            v-show='isLoading'
          />
        </q-btn>
        <q-btn label="Reset" type="reset" color="secondary" flat rounded class="q-ml-sm" />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import DefaultCoverPhoto from '@/assets/img/cover_photo.jpg'
import Avatar from '@/components/Avatar.vue'
import EditImage from './EditImage.vue'
import {
  requiredField,
  checkNicknameField,
  checkUserDescriptionField,
  checkURL
} from '@/utilities/validation.js'
import { uploadAvatar, uploadBackground } from '@/services/profile.js'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Avatar,
    EditImage
  },

  data () {
    const emptyProfile = {
      nickname: '',
      bio: '',
      status: '',
      avatarUrl: '',
      backgroundUrl: '',
      socialAccounts: {
        youtube: '',
        instagram: '',
        facebook: ''
      }
    }
    return {
      aspectRatioRectangle: 16 / 9,
      uploadPhotoMaxSize: 2097152,
      photoUrl: '',
      backgroundUrl: '',
      profile: { ...emptyProfile },
      emptyProfile,
      notifyParameters: {
        textColor: 'white',
        actions: [{ icon: 'close', color: 'white' }],
        timeout: 3000
      },
      isNewAvatarUploaded: false,
      isNewCoverPhotoUploaded: false,
      DefaultCoverPhoto,
      isLoading: false,
      isProfileLoaded: false
    }
  },

  computed: {
    ...mapGetters({
      profileGetter: 'profile/myProfile'
    }),

    isNewAvatarSelected () {
      return this.photoUrl !== ''
    },

    isNewCoverPhotoSelected () {
      return this.backgroundUrl !== ''
    }
  },

  watch: {
    profileGetter (newValue) {
      this.loadDataFromStore()
      this.isProfileLoaded = true
    }
  },

  created () {
    this.getMyProfile()
      .catch(() => {
        this.$q.notify({
          ...this.notifyParameters,
          color: 'negative',
          message: 'Couldn\'t load data. Please try again or contact the support.'
        })
      })
  },

  methods: {
    ...mapActions({
      getMyProfile: 'profile/getMyProfile'
    }),

    btnUploadPhotoUrl () {
      this.$refs.photoUrlLabel.click()
    },

    deletePhotoUrl (val) {
      this.photoUrl = ''
      this.profile.avatarUrl = ''
    },

    uploadImageUrl (val, imageType) {
      if (val.target.files[0].size > this.uploadPhotoMaxSize) {
        this.$q.notify({
          ...this.notifyParameters,
          color: 'negative',
          message: 'File is too big.'
        })
        if (imageType === 'background') {
          this.$refs.background.val = ''
        } else {
          this.$refs.avatar.val = ''
        }
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        if (imageType === 'background') {
          this.backgroundUrl = reader.result
        } else {
          this.photoUrl = reader.result
        }
      }
      reader.readAsDataURL(val.target.files[0])
    },

    btnUploadBackgroundUrl () {
      this.$refs.backgroundUrlLabel.click()
    },

    deleteBackgroundUrl (val) {
      this.backgroundUrl = ''
      this.profile.backgroundUrl = ''
    },

    onCreatedAvatarBlob (blob) {
      const avatarFormData = new FormData()
      avatarFormData.append('file', blob)

      uploadAvatar(avatarFormData, { type: 'avatar' })
        .then((res) => {
          this.profile.avatarUrl = res.data.imageUrl
          this.isNewAvatarUploaded = true
          this.sendProfile()
        })
        .catch(() => {
          this.isLoading = false
          this.$q.notify({
            ...this.notifyParameters,
            color: 'negative',
            message: 'Couldn\'t save avatar. Please try again or contact the support.'
          })
        })
    },

    onCreatedCoverPhotoBlob (blob) {
      const coverPhotoFormData = new FormData()
      coverPhotoFormData.append('file', blob)

      uploadBackground(coverPhotoFormData, { type: 'background' })
        .then((res) => {
          this.profile.backgroundUrl = res.data.imageUrl
          this.isNewCoverPhotoUploaded = true
          this.sendProfile()
        })
        .catch(() => {
          this.isLoading = false
          this.$q.notify({
            ...this.notifyParameters,
            color: 'negative',
            message: 'Couldn\'t save cover photo. Please try again or contact the support.'
          })
        })
    },

    onSubmit () {
      this.isLoading = true
      this.isNewAvatarUploaded = false
      this.isNewCoverPhotoUploaded = false
      if (this.isNewAvatarSelected) {
        this.$refs.avatarEditor.getCroppedData()
      }
      if (this.isNewCoverPhotoSelected) {
        this.$refs.coverPhotoEditor.getCroppedData()
      }
      this.sendProfile()
    },

    sendProfile () {
      if ((this.isNewAvatarSelected && !this.isNewAvatarUploaded) || (this.isNewCoverPhotoSelected && !this.isNewCoverPhotoUploaded)) {
        return
      }
      const profile = { ...this.profile, socialAccounts: [] }
      Object.keys(this.profile.socialAccounts).forEach(item => {
        profile.socialAccounts.push({ type: item, link: this.profile.socialAccounts[item] })
      })
      if (!profile.preferences) { profile.preferences = [] }

      this.$store.dispatch('profile/updateMyProfile', profile)
        .then(() => {
          this.$q.notify({
            ...this.notifyParameters,
            color: 'primary',
            message: 'Your profile was edited.'
          })
          this.photoUrl = ''
          this.backgroundUrl = ''
        })
        .catch(err => {
          this.$q.notify({
            ...this.notifyParameters,
            color: 'negative',
            message: err && err.response && err.response.data ? err.response.data.error : 'Unknown error.'
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    onReset () {
      this.loadDataFromStore()
      this.backgroundUrl = ''
      this.photoUrl = ''
    },

    checkProfileImage (val) {
      return this.profile[val] && JSON.stringify(this.profile[val]) === JSON.stringify({})
    },

    loadDataFromStore () {
      const socialAccounts = {}
      if (this.profileGetter.socialAccounts) {
        this.profileGetter.socialAccounts.forEach(item => {
          socialAccounts[item.type] = item.link
        })
      }
      this.profile = { ...this.emptyProfile, ...this.profileGetter, socialAccounts }
      if (this.checkProfileImage('avatarUrl')) {
        this.profile.avatarUrl = ''
      }
      if (this.checkProfileImage('backgroundUrl')) {
        this.profile.backgroundUrl = ''
      }
    },

    requiredField,
    checkNicknameField,
    checkUserDescriptionField,
    checkURL
  }
}
</script>

<style lang="scss" scoped>
.coverPhoto {
  max-width: 100%;
  @media (min-width: 600px) {
    max-width: 500px;
  }
}

.uploadImage {
  display: none;
}
</style>

<style lang="scss">
.inputFile {
  display: none;
}

.inputFile .q-field__control:before,
.q-field__control:after {
  content: none;
}

.avatar .cropper-view-box,
.avatar .cropper-face {
  border-radius: 50%;
}

.facebook {
  color: #3b5999;
}

.youtube {
  color: #ff0000;
}

.instagram {
  color: #e4405f;
}

.backgroundImage .vueCropperWrapper {
  max-width: 100%;
  @media (min-width: 600px) {
    max-width: 500px;
  }
}
</style>
