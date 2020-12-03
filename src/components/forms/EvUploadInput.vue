<template>
  <label class="my-2 flex flex-row justify-center flex-wrap">
    <span class="text-white bg-gray-500 rounded py-2 px-1 w-full text-center">{{ label }}</span>
    <input ref="input" class="hidden" type="file" value="" @change="handleChange">
    <ul>
      <li v-for="(file, idx) in files" :key="idx">
        {{ file.name }}
      </li>
    </ul>
  </label>
</template>

<script>
export default {
  name: "EvUploadInput",
  props: {
    label: null,
    value: null,
    /**
     * 이 값이 있으면 자동으로 업로드가 됩니다.
     */
    action: String,
    name: {
      type: String,
      default: 'file'
    }
  },
  data() {
    return {
      files: []
    }
  },
  methods: {
    handleChange(e) {
      this.files = e.target.files;
      if (this.action && this.files.length) {
        this.uploadToServer();
        return;
      }
      this.$emit('input', this.files);
    },
    uploadToServer() {
      const form = new FormData();

      form.append(this.name, this.files[0]);

      /*axios.post(this.action, form, {
        'Content-Type': 'multipart/form-data'
      }).then(
          (res) => {
            if (res.data.message) {
              this.$message.success(res.data.message);
            }
            this.$emit('success', res.data);
          }
      )*/
    }
  }
}
</script>

<style scoped>

</style>
