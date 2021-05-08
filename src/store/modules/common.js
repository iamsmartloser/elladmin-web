const state = {
  selectedCity: null,
}

const mutations = {
  SET_SELECTED_CITY: (state, payload) => {
    state.selectedCity.opened = payload
  },

}

const actions = {
  setSelectedCity({ commit },payload) {
    console.log('payload',payload)
    commit('SET_SELECTED_CITY')
  },
}

export default {
  state,
  mutations,
  actions
}
