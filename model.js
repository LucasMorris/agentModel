const utils = flocc.utils;


// Random numbers consistent when app starts
utils.seed(1);


// Setting model and graph window sizes
const widthModel = 600;
const heightModel = 600;
const widthGraph = 600;
const heightGraph = 300;


// Setting model parameters
const population = 100;     // Number of agents in model
const financial = 0.3;      // Agent financial situtaion
const concern = 0.1;        // Agent concern for environment
const subsidy = 0.5;        // Agent susceptibility to subsidies
const tax = 0.2;            // Agent susceptibility to tax changes
const distance = 0.6        // Agent distance to work/destination


// // Agent visual model setup
// const environment = new flocc.Environment();
// const containerModel = document.getElementById("model-container");
// const renderer = new flocc.CanvasRenderer(environment, {
//     background: "#FFFFFF",
//     widthModel,
//     heightModel
// });
// renderer.mount(containerModel);


// Agent model environment setup
const environment = new flocc.Environment();
environment.set("financial", financial);      
environment.set("concern", concern);
environment.set("subsidy", subsidy);
environment.set("tax", tax);
environment.set("distance", distance);


// Create agent to represent government making subsity and tax decisions
function tick(agent) {
  // skip first tick to allow graph to plot starting values
  if(environment.time === 0) {
    return
  };


}

// Graph setup
const containerGraph = document.getElementById("graph-container");
const graph = new flocc.LineChartRenderer(environment, {
  autoScale: false,
  background: "#FFFFFF",
  widthGraph,
  heightGraph
});
graph.mount(containerGraph);


// // Create agents to be shown on model
// function setup() {
//   for (var i = 0; i <= population; i++) {
//     const agent = new flocc.Agent({
//       x: utils.uniform() * widthModel, //agent starts randomly on x axis
//       y: heightModel / 2,              //agent starting position in middle of model
//       shape: "circle",                 //shape of agent (can be circle, rect, triangle or arrow)
//       size: 3,                         //size of rendered agent in px
//       preference: utils.random()       //generate random preference 0,1
//     });
    
//     // !TESTING DELETE
//     console.log(agent.getData());

//     agent.set(tick);

//     environment.addAgent(agent);
//   }
// }


// Create the UI interface to change parameters
function ui() {
  new floccUI.Panel(environment, [
    new floccUI.Slider({
      name: "financial",
      min: 0,
      max: 1,
      step: 0.1
    }),
    new floccUI.Slider({
      name: "concern",
      min: 0,
      max: 1,
      step: 0.1
    }),
    new floccUI.Slider({
      name: "subsidy",
      min: 0,
      max: 1,
      step: 0.1
    }),
    new floccUI.Slider({
      name: "tax",
      min: 0,
      max: 1,
      step: 0.1
    }),
    new floccUI.Slider({
      name: "distance",
      min: 0,
      max: 1,
      step: 0.1
    }),
    new floccUI.Button({
      label: "Reset",
      onClick() {
        setup();
        ui();
      }
    })
  ])
}



function run() {
  environment.tick({ randomizeOrder: true });
  if (environment.time <= 1000) {
    requestAnimationFrame(run);
  };
};


// setup();
ui();
run();


// TODO 
// Change agent color based upon their preference (same as graph color)
