<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-3">
          <v-form @submit.prevent="login">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-text-field
                prepend-inner-icon="person"
                name="username"
                label="Username"
                type="text"
                v-model="username"
                outline
              ></v-text-field>
              <v-text-field
                id="password"
                prepend-inner-icon="lock"
                name="password"
                label="Password"
                type="password"
                v-model="password"
                outline
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-layout align-end justify-end row>
                <div>
                  <v-btn flat to="/signup">Create account</v-btn>
                </div>
                <div>
                  <v-btn type="submit" color="primary">Login</v-btn>
                </div>
              </v-layout>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password,
      });
      this.$router.push(this.$store.state.redirectTo || '/');
    },
  },
};
</script>
