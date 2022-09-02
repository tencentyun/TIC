import Vue from 'vue';
import Vuex from 'vuex';
import Config from '../config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isSignalReady: false,
    isTiwReady: false, // 白板是否已经Ready
    classInfo: {
      sdkAppId: Config.sdkAppId,
      userId: sessionStorage.getItem('TIW_CLASSINFO_USERID'),
      userSig: sessionStorage.getItem('TIW_CLASSINFO_USERSIG'),
      classId: sessionStorage.getItem('TIW_CLASSINFO_CLASSID'),
    },
    current: {
      toolType: 0,
      fileInfo: {},
    },

    boardSetting: {

    },

    rightBarShow: false,
  },

  mutations: {
    classInfo(state, payload) {
      sessionStorage.setItem('TIW_CLASSINFO_USERID', payload.userId);
      sessionStorage.setItem('TIW_CLASSINFO_USERSIG', payload.userSig);
      sessionStorage.setItem('TIW_CLASSINFO_CLASSID', payload.classId);

      state.classInfo.userId = payload.userId;
      state.classInfo.classId = payload.classId;
      state.classInfo.userSig = payload.userSig;
    },

    setSignalReady(state, payload) {
      state.isSignalReady = payload;
    },

    setTiwReady(state, payload) {
      state.isTiwReady = payload;
    },

    setRightBarShow(state, payload) {
      state.rightBarShow = payload;
    },

    setCurrentFile(state, payload) {
      state.current.fileInfo = payload;
    },

    updateBoardSetting(state, payload) {
      const t = state.current.boardSetting;
      state.current.boardSetting = {
        ...t,
        ...payload,
      };
    },
  },

  actions: {

    setSignalReady({ commit }, payload) {
      commit('setSignalReady', payload);
    },

    setTiwReady({ commit }, payload) {
      commit('setTiwReady', payload);
    },

    setRightBarShow({ commit }, payload) {
      commit('setRightBarShow', payload);
    },

    setCurrentFile({ commit }, payload) {
      commit('setCurrentFile', payload);
    },

    updateBoardSetting({ commit }, payload) {
      commit('updateBoardSetting', payload);
    },
  },
});
