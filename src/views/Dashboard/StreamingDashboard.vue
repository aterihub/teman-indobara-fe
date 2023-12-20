<template>
  <div>
    <video ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default {
  mounted() {
    // Initialize video.js
    this.player = videojs(this.$refs.videoPlayer, {
      controls: true,
      autoplay: true,
    });

    // Set the video source to the streaming URL
    this.player.src({
      src: 'ws://192.168.0.4:9999', // Replace with your actual streaming URL
      type: 'application/x-mpegURL',
    });
  },
  beforeDestroy() {
    // Clean up the video player instance
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>

  <!-- const rtspStreamUrl = 'http://47.91.108.9:6604/3/3?AVType=1&jsession=78654fa88ef24523b6c1f1fed83082bd&DevIDNO=020231030002&Channel=0&Stream=0' -->
