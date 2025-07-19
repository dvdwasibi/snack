const { createApp } = Vue;
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = window.SUPABASE_URL;
const supabaseKey = window.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

createApp({
  data() {
    return {
      message: 'Hello from Vue!',
      imageFile: null,
      userEmail: null
    };
  },
  mounted() {
    this.updateUser();
    supabase.auth.onAuthStateChange(() => this.updateUser());
  },
  methods: {
    async updateUser() {
      const { data: { session } } = await supabase.auth.getSession();
      this.userEmail = session ? session.user.email : null;
      if (session) {
        await this.ensureUserRecord(session.user);
      }
    },
    async ensureUserRecord(user) {
      const { error } = await supabase.from('users').upsert(
        {
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          stripeAccountId: ''
        },
        { onConflict: 'email' }
      );
      if (error) {
        console.error('Failed to sync user:', error);
      }
    },
    async signIn() {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    },
    async signOut() {
      await supabase.auth.signOut();
      await this.updateUser();
    },
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
