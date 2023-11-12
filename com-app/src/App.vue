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
      message: 'hello',
      messages: [],
      imageElement: null,
    };
  },
  mounted() {
    const ws = new WebSocket('ws://192.168.1.238:3000');
    
    ws.onmessage = (event) => {
      this.messages.push(event.data);

      const elementToCapture = document.createElement('div');
      elementToCapture.innerHTML = event.data;

      const options = {
        width: 1200, // Nowa szerokość w pikselach
        height: 1600, // Nowa wysokość w pikselach
      };

      domtoimage.toPng(elementToCapture, options)
        .then(function (dataUrl) {
          if (this.imageElement) {
            this.imageElement.parentNode.removeChild(this.imageElement);
          }
          // Create an image element and set its source to the captured image
          const img = new Image();
          
          img.src = dataUrl; 
          // Append the image to the document body or any other container
          document.body.appendChild(img);
          this.imageElement = img;
        }.bind(this))
        .catch(function (error) {
          console.error('Error capturing webpage:', error);
        });
    };
   
    this.ws = ws;
  },
  methods: {
    sendMessage() {
      this.ws.send(this.message);
    },
  },
};
</script>

