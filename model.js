const utils = flocc.utils;


//Setting model and graph window sizes
const widthModel = 600;
const heightModel = 600;
const widthGraph = 600;
const heightGraph = 300;


//Setting Model Parameters
const population = 10;



//Agent Model Setup
const environment = new flocc.Environment();
const containerModel = document.getElementById("model-container");
const renderer = new flocc.CanvasRenderer(environment, {
    background: "#FFFFFF",
    widthModel,
    heightModel
});
renderer.mount(containerModel);


//Graph Setup
const containerGraph = document.getElementById("graph-container");
const chart = new flocc.LineChartRenderer(environment, {
  autoScale: false,
  background: "#FFFFFF",
  widthGraph,
  heightGraph
});
chart.mount(containerGraph);


//Create Agents
function setup() {
  for (var i = 0; i <= population; i++) {
    const agent = new flocc.Agent({
      x: utils.uniform() * widthModel, //agent starts randomly on x axis
      y: heightModel / 2,              //agent starting position in middle of model
      shape: "circle",                 //shape of agent (can be circle, rect, triangle or arrow)
      size: 3,                         //size of rendered agent in px
      preference: utils.random()       //generate random preference 0,1
    });
    
    //!TESTING DELETE
    console.log(agent.getData());

    agent.set(tick);

    environment.addAgent(agent);
  }
}


function tick(agent) {

}


environment.time; //returns the number of ticks that have passed


function run() {
  environment.tick({ randomizeOrder: true });
  requestAnimationFrame(run);
}


setup();
run();


//TODO 
//Change agent color based upon their preference (same as graph color)
