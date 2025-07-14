const { createApp } = Vue;

createApp({
  data() {
    return {
      message: 'Hello from Vue!',
      inputText: ''
    };
  },
  methods: {
    async submitForm() {
      try {
        await fetch('/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: this.inputText })
        });
        this.inputText = '';
      } catch (err) {
        console.error(err);
      }
    }
  }
}).mount('#app');
