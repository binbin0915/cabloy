// eslint-disable-next-line
export default function(Vue) {
  return {
    state: {
      loggedIn: false,
      user: null,
      hashInit: null,
    },
    mutations: {
      login(state, { loggedIn, user }) {
        state.loggedIn = loggedIn;
        state.user = user;
      },
      logout(state) {
        state.loggedIn = false;
        state.user = null;
      },
      setHashInit(state, hashInit) {
        state.hashInit = hashInit;
      },
    },
  };
}
