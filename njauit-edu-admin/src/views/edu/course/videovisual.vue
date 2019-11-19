<template>
  <div id="app">
    <div style="float: left;width: 550px;">
      直播
      <ali-player
        @play="play($event)"
        :useFlashPrism="true"
        :autoplay="true"
        :isLive="true"
        :rePlay="false"
        :showBuffer="true"
        showBarTime="5000"
        width="500px"
        height="400px"
        controlBarVisibility="hover"
        source="rtmp://play.lingtek.com/live/sichuan?auth_key=1557395010-0-0-c6ba31a6d5501e9108ec955f669ae283"
      ></ali-player>
    </div>

    <div style="float: left;">
      点播
      <ali-player
        @play="play"
        :useFlashPrism="true"
        :autoplay="true"
        :isLive="false"
        :rePlay="false"
        :showBuffer="true"
        showBarTime="5000"
        width="500px"
        height="400px"
        controlBarVisibility="hover"
        source="http://player.alicdn.com/video/aliyunmedia.mp4"
      ></ali-player>
    </div>
  </div>
</template>

<script>
import aliplayer from "./components/AliPlayer.vue";
export default {
  name: "app",

  components: {
    "ali-player": aliplayer
  },
  methods: {
    play(event) {
      console.log(event);
    }
  }
};
</script>

