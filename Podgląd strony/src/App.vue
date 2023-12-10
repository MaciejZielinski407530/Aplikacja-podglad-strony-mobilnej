<template>
  <div>
    <h1>Podgląd strony mobilnej</h1>
    <div class="chat">
      <button @click="sendMessage">Pobierz screenshot</button>
    </div>  
  </div>
</template>



<script>
import domtoimage from 'dom-to-image-more';
export default {
  data() {
    return {
      message: 'Pobierz',
      messages: [],
      imageElement: null,
    };
  },
  mounted() {
    const ws = new WebSocket('ws://192.168.1.238:3000');
    
    ws.onmessage = (event) => {
      this.messages.push(event.data);

      const elementToCapture = document.createElement('div');
      elementToCapture.innerHTML = event.data;               // Odebranie body strony mobilnej

      const options = {
        width: 720, // Nowa szerokość w pikselach
        height: 640, // Nowa wysokość w pikselach
      };

      domtoimage.toPng(elementToCapture, options)
        .then(function (dataUrl) {
          if (this.imageElement) {    // Usuwanie starego zdjęcia ze strony
            this.imageElement.parentNode.removeChild(this.imageElement);
          }
          
          const img = new Image();         
          img.src = dataUrl;      

          document.body.appendChild(img); // Dodanie zdjęcia do body
          this.imageElement = img;
        }.bind(this))
        .catch(function (error) {
          console.error('Error capturing webpage:', error);
        });
    };
   
    this.ws = ws;
  },
  methods: {
    sendMessage() {                 // Wysłanie wiadomości
      this.ws.send(this.message);
    },
  },
};
</script>

