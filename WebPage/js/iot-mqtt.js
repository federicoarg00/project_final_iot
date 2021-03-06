var clientId = "rt" + Math.random();
// Create a client instance
var client = new Paho.MQTT.Client("54.204.32.210", 9001, clientId); //Colocar la ip elástica

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});
var Vmotor      = 0;
var calidad_air = -1;
var temp_hall   = -1;

function adelante() {
    message = new Paho.MQTT.Message('1');
    message.destinationName = 'iot/car/motor'
    client.send(message);
}

function atras() {
    message = new Paho.MQTT.Message('2');
    message.destinationName = 'iot/car/motor'
    client.send(message);
}

function izquierda() {
    message = new Paho.MQTT.Message('3');
    message.destinationName = 'iot/car/motor'
    client.send(message);
}

function derecha() {
    message = new Paho.MQTT.Message('4');
    message.destinationName = 'iot/car/motor'
    client.send(message);
}

function detener() {
    message = new Paho.MQTT.Message('0');
    message.destinationName = 'iot/car/motor'
    client.send(message);
}

function desactivar() {
  message = new Paho.MQTT.Message('6');
  message.destinationName = 'iot/car'
  client.send(message);
  document.getElementById("act").innerHTML = "Desactivado";
}

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("Conectado MQTT");
  //client.subscribe("iot/car/motor");
  client.subscribe("iot/car/rpm");
  client.subscribe("iot/car/mq135");
  client.subscribe("iot/house/hall");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("Conexión perdida: "+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  //console.log(message.destinationName+": "+message.payloadString);

  if (message.destinationName == 'iot/car/rpm') {
      //document.getElementById('rpm').textContent = message.payloadString;
      Vmotor = parseInt(message.payloadString);
      //console.log(message.payloadString);
  }

  if (message.destinationName == 'iot/car/mq135') {
      //document.getElementById('caire').textContent = message.payloadString;
      calidad_air = parseInt(message.payloadString);
      //console.log(message.payloadString);
  }

  if (message.destinationName == 'iot/house/hall') {
      temp_hall = parseFloat(message.payloadString);
      if (temp_hall >= 40) {
        message = new Paho.MQTT.Message('5');
        message.destinationName = 'iot/car'
        client.send(message);
        document.getElementById("act").innerHTML = "Activado";
      }
  }

}