const { createApp } = Vue;

createApp({
  data() {
    return {
      message: 'Hello from Vue!',
      imageFile: null
    };
  },
  methods: {
    handleFileChange(event) {
      this.imageFile = event.target.files[0];
    },
    async submitForm() {
      if (!this.imageFile) return;
      const formData = new FormData();
      formData.append('image', this.imageFile);
      try {
        await fetch('/submit', {
          method: 'POST',
          body: formData
        });
        this.imageFile = null;
        document.getElementById('imageInput').value = '';
      } catch (err) {
        console.error(err);
      }
    }
  }
}).mount('#app');
