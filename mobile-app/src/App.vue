

<template>
  <div id ="app">
    <h1>{{ currentTime }}</h1>
    <router-view />
  </div>
</template>
 
<script>
//import domtoimage from 'dom-to-image-more';
 
export default {
  data() {
    return {
      currentTime: this.getCurrentTime(),
      message: "",
      messages: [],
    };
  },
  mounted() {
    const ws = new WebSocket('ws://192.168.1.238:3000');
    setInterval(this.updateCurrentTime, 1000);
    ws.onmessage = (event) => {
      this.messages.push(event.data);
      this.captureScreenshot();
      this.ws.send(this.message);
    };

    this.ws = ws;
  },

  methods: {
    getCurrentTime() {
      const now = new Date();
      return now.toLocaleTimeString();
    },
    updateCurrentTime() {
      this.currentTime = this.getCurrentTime();
    },
    captureScreenshot() {
      this.message = document.body.innerHTML;
    },

  }
};
</script>
 