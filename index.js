const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET","POST"]
  }
});

const cubicleData = [
  //{ cubicle: 'none', status:'free'}
];


//app.get('/', (req, res) => {
//  res.sendFile(__dirname + '/index.html');
//});



io.on('connection', (socket) => {
  console.log("new connection");
    io.emit('cubicleupdate', latestData());


  socket.on('postupdate', (msg) => {
    console.log('postupdate: ' + msg.cubicle);

        removeCubicles(msg);
        io.emit('cubicleupdate', latestData());
  });
  socket.on('getlatest', (msg) => {
    console.log('getlatest: ' + msg);
        io.emit('cubicleupdate', latestData());
      });

  socket.on('addfreecubicle', (msg) => {
      console.log('addfreecubicle: ' + msg.cubicle);

      addFreeCubicle(msg);
        io.emit('cubicleupdate', latestData());
  });

});



http.listen(4000, () => {
  console.log('listening on *:3000');
});

const latestData = () => {
  let latest = JSON.stringify(cubicleData);
  console.log("latest data:"+latest);
  return latest;

};

const addFreeCubicle = (state) => {

  console.log("adding to array:"+state.cubicle);
  cubicleData.push(state);

  let add = JSON.stringify(cubicleData);
  return add;

};

const removeCubicles = (state) => {

  console.log("updating:"+state.cubicle);

  let remove = 0;

  cubicleData.forEach((item, i) => {
    if (item.cubicle == state.cubicle) remove = i;

  });


  let inuse = cubicleData.splice(remove,1);
  console.log(inuse);

  let rem_data = JSON.stringify(cubicleData);
  console.log(cubicleData);
  return rem_data;

};
