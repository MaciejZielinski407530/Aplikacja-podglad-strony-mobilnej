

<template>
  <div class="container" style="display: flex; justify-content: center; align-items: center; height: 300px;"> 
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/AGH_University_of_Science_and_Technology_Logo.svg/800px-AGH_University_of_Science_and_Technology_Logo.svg.png" alt="Logo AGH" style="width: 180px; height: 280px;">
  </div>
  <div id ="app">
    <h1 :style="{ color: 'blue', fontSize: 64 + 'px', textAlign: 'center' }">{{ currentTime }}</h1>
    <router-view />
  </div>
  <div style="display: flex; justify-content: center; align-items: center;">
    <button @click="toggleColor" style="margin-right: 20px;">Zmień kolor</button>
    <div 
      class="square" 
      :style="{ width: '50px', height: '50px', marginTop: '20px', backgroundColor: isColorActive ? 'yellow' : 'red' }">
    </div>
  </div>
 
</template>
 
<script>
import { ref } from 'vue';
export default {
  data() {
    return {   
      isColorActive: ref(false),
      currentTime: this.getCurrentTime(),
      message: "",
      messages: [],
    };
  },
  mounted() {
    const ws = new WebSocket('ws://192.168.1.238:3000');
    
    setInterval(this.updateCurrentTime, 1000); // Odświeżanie czasu co sekundę
    
    ws.onmessage = (event) => {
      this.messages.push(event.data);
      this.captureScreenshot();     
      this.ws.send(this.message);
    };

    this.ws = ws;
  },

  methods: {
    getCurrentTime() {                          // Pobranie czasu
      const now = new Date();
      return now.toLocaleTimeString();
    },
    updateCurrentTime() {                       // Aktualizacja czasu
      this.currentTime = this.getCurrentTime();
    },
    toggleColor() {
      this.isColorActive = !this.isColorActive; // Odwrócenie stanu po kliknięciu
    },
    captureScreenshot() {                       // Pobranie body strony
      this.message = document.body.innerHTML;
    },

  }
};
</script>
