<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-3">
          <v-form @submit.prevent="createAccount">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Create account</v-toolbar-title>
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
                prepend-inner-icon="lock"
                name="password"
                label="Password"
                type="password"
                v-model="password"
                outline
              ></v-text-field>
              <v-text-field
                prepend-inner-icon="lock"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                v-model="confirmPassword"
                outline
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-layout align-end justify-end row>
                <div>
                  <v-btn flat to="/login">Login</v-btn>
                </div>
                <div>
                  <v-btn type="submit" color="primary">Create account</v-btn>
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
      confirmPassword: '',
    };
  },
  methods: {
    createAccount() {
      this.$store.dispatch('signup', {
        username: this.username,
        password: this.password,
        confirmPassword: this.confirmPassword,
      });
      this.$router.push(this.$store.state.redirectTo || '/');
    },
  },
};
</script>
