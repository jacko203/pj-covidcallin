const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET","POST","OPTIONS"],
    credentials: true
  }
});

const cubicleData = [
  //{ cubicle: 'none', status:'free'}
];


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});  // for testing purposes



io.on('connection', (socket) => {
  // console.log("new connection");
    io.emit('cubicleupdate', latestData());


  socket.on('postupdate', (msg) => {
    console.log('postupdate: ' + msg.cubicle);

        try {
          let r = removeCubicles(msg);
         //console.log("success removing cubicle:"+r);
          io.emit('cubicleupdate', latestData());
        } catch (e) {
          console.log(e);
          io.emit('notfree',latestData());
        }
  });
  socket.on('getlatest', (msg) => {
    //console.log('getlatest: ' + msg);
        io.emit('cubicleupdate', latestData());
      });

  socket.on('addfreecubicle', (msg) => {
      //console.log('addfreecubicle: ' + msg.cubicle);

      try {
        let r = addFreeCubicle(msg);
        //console.log("success adding cubicle:"+r);
        io.emit('cubicleupdate', r);
      } catch (e) {
        console.log(e);
        io.emit('adderror', latestData());
      }
  });

});



http.listen(4000, () => {
  console.log('listening on *:4000');
});

const latestData = () => {
  let latest = JSON.stringify(cubicleData);
  //console.log("latest data:"+latest);


  return latest;

};

const addFreeCubicle = (state) => {

  //console.log("adding to array:"+state.cubicle);

  if (cubicleData.some(c => c.cubicle === state.cubicle)) {
    console.log("already in array");
    throw new Error("already in array");
  }

  let update = {cubicle:state.cubicle.id, status: state.status};

  cubicleData.push(state);

  console.log(JSON.stringify(cubicleData));

  let add = JSON.stringify(cubicleData);
  return add;

};

const removeCubicles = (state) => {

  //console.log("updating:"+state.cubicle);

  let remove = -1;


  remove = cubicleData.findIndex(i => i.cubicle === state.cubicle);

  //console.log("remove:"+remove+" meaning: "+cubicleData[remove].cubicle);
    //if (item.cubicle == state.cubicle) remove = i;
    if (remove != -1) {
    //console.log("found");

    let inuse = cubicleData.splice(remove,1);
    console.log(inuse);

    let rem_data = JSON.stringify(cubicleData);
    console.log(cubicleData);
    return rem_data;
  }
  else {
    console.log("not found");
    throw new Error("Not free");
  }



};
