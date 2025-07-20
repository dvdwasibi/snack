import { createClient, SupabaseClient, User } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

declare const Vue: any;

type AppData = {
  message: string;
  imageFile: File | null;
  userEmail: string | null;
};

const { createApp } = Vue;

const supabaseUrl: string = (window as any).SUPABASE_URL;
const supabaseKey: string = (window as any).SUPABASE_KEY;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

createApp({
  data(): AppData {
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
    async updateUser(this: any): Promise<void> {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      this.userEmail = session ? session.user.email : null;
      if (session) {
        await this.ensureUserRecord(session.user);
      }
    },
    async ensureUserRecord(this: any, user: User): Promise<void> {
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
    async signIn(this: any): Promise<void> {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    },
    async signOut(this: any): Promise<void> {
      await supabase.auth.signOut();
      await this.updateUser();
    },
    handleFileChange(this: any, event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        this.imageFile = input.files[0];
      }
    },
    async submitForm(this: any): Promise<void> {
      if (!this.imageFile) return;
      const formData = new FormData();
      formData.append('image', this.imageFile);
      try {
        await fetch('/submit', {
          method: 'POST',
          body: formData
        });
        this.imageFile = null;
        const input = document.getElementById('imageInput') as HTMLInputElement;
        if (input) {
          input.value = '';
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
}).mount('#app');
