const utils = flocc.utils;


// Random numbers consistent when app starts
// utils.seed(11);   // 11 makes electric cars least popular and fossil most popular


// Setting model and graph window sizes
const widthModel = 600;
const heightModel = 600;
const widthGraph = 600;
const heightGraph = 600;


// Setting model parameters
const population = 100;     // Number of agents in model
const subsidy = 0;        // Agent susceptibility to subsidies
const tax = 15;          // Agent susceptibility to tax changes
const subsidyFixed = 1;   //allows subsidy to increase by default
const taxFixed = 1;       //allows tax to increase by default
const subsidyIncrement = 0;
const taxIncrement = 0;
const bikeDistMax = 20;
const bikeDistMin = 2;


// Agent model environment setup
const environment = new flocc.Environment();
environment.set("population", population);
environment.set("subsidy", subsidy);
environment.set("tax", tax);
environment.set("subsidyFixed", subsidyFixed);
environment.set("taxFixed", taxFixed);
environment.set("subsidyIncrement", subsidyIncrement);
environment.set("taxIncrement", taxIncrement);
environment.set("bikeDistMax", bikeDistMax);
environment.set("bikeDistMin", bikeDistMin);


// Agent tick interactions
function tick(agent) {
  // get all variables from environment
   let { concern, distance } = agent.getData();
   let tax = environment.get("tax");
   let subsidy = environment.get("subsidy");
   
  //trials
  let bikeMax = environment.get("bikeDistMax");
  let bikeMin = environment.get("bikeDistMin");

// preference 1=car, 0=bike, -1=ecar
function scaleReverse(x, lx, hx, lo, ho) {
  var o = ((hx - lx) - (x - lx)) / (hx - lx) * (ho - lo) + lo;
  return Math.max(Math.min(o, ho), lo);
}

// * x - actual input
// * lx, hx - range of domain (values of actual input)
// * lo, ho - output range within 0 .. 1
function scale(x, lx, hx, lo, ho) {
  var o = (x - lx) / (hx - lx) *(ho - lo) + lo;
  return Math.max(Math.min(o, ho), lo);
}

let bikePref = 
  scaleReverse(distance, bikeMin, bikeMax, 0.1, 0.8)  // defaults were 2, 20 for min and max
  * scale(concern, 0, 100, 0.2, 0.9)
  * 0.1  // tax constant
  * 0.2;  // subsidy constant

let carPref = 
  scale(distance, 10, 100, 0.1, 0.8) //fruther live more likely car ex 100km 0.8 lilely to use car
  * 0.5 //constant concern when using car
  * scaleReverse(tax, 15, 65, 0.1, 1) //higher tax less likely use car
  * 0.2;  // subisdy constant

let eCarPref = 
  scale(distance, 10, 75, 0.1, 0.8)
  * scale(concern, 0, 100, 0.2, 0.9)
  * 0.3  // tax constant
  * scale(subsidy, 0, 25, 0.2, 0.8);

// setting agent preference based upon previous calculations
  if (bikePref > carPref && bikePref > eCarPref) {
    agent.set("preference", 1) // bike
  }
  else if (carPref > bikePref && carPref > eCarPref) {
    agent.set("preference", 0) // car
  }
  else {
    agent.set("preference", -1)  // ecar
  }

  //DEBUGGING
  // console.log(carPref, bikePref, eCarPref);
  //console.log(concern, distance, tax, subsidy);
  // console.log(tax);
  // console.log(bikeMin, bikeMax);
}


// Create general population agents and add to environment
function setup() {
  let population = environment.get("population");
  environment.time = 0;
  environment.clear();
  for(var i = 0; i < population; i++) {
    const agent = new flocc.Agent( {
      distance: utils.random(1, 10) * utils.random(1, 10),
      concern: utils.gaussian(50, 10),
      tick: tick,
    });  
    //agent.set(tick);
    environment.addAgent(agent);
  }
}


// Add table to show population preference breakdown
// const containerModel = document.getElementById("model-container");
// const table = new flocc.TableRenderer(environment, {
//   precision: 1,   // Number of floating point decimal places to be shown
//   filter: agent => {
//     return agent.get("preference")
//   }
// });
// table.columns = [
//   "Preference",
//   "Number of population",
// ];
// table.mount(containerModel);


// Create the UI interface to change parameters
function ui() {
  new floccUI.Panel(environment, [
    new floccUI.Radio({
      choices: [0, 1],
      choiceLabels: ["Yes", "No"],
      label: "fixed subsidy", // BUG does not show
      name: "subsidyFixed",
      value: subsidyFixed
    }),
    new floccUI.Radio({
      name: "taxFixed",
      label: "fixed tax", // BUG does not show
      choices: [0, 1],
      choiceLabels: ["Yes", "No"],
      value: taxFixed
    }),
    new floccUI.Slider({
      name: "subsidyIncrement",
      label: "Green Subsidy Increment",
      min: 0,
      max: 15,
      step: 1 
    }),
    new floccUI.Slider({
      name: "taxIncrement",
      label: "Fuel Tax Increment",
      min: 0,
      max: 25,
      step: 1 
    }),
    new floccUI.Slider({
      name: "subsidy",
      label: "Green Subsidy",
      min: 0,
      max: 25,
      step: 1
    }),
    new floccUI.Slider({
      name: "tax",
      label: "Fuel Tax",
      min: 0,
      max: 70,
      step: 1
    }),
    new floccUI.Input({
      name: "bikeDistMin",
      label: "Minimum cycling distance"
    }),
    new floccUI.Input({
      name: "bikeDistMax",
      label: "Max cycling distance"
    }),
    new floccUI.Input({
      name: "population",
      label: "Agent Population"
    }),
    new floccUI.Button({
      label: "Start",
      onClick() {
        setup();
        run();
      }
    })
  ])
  const containerGraph = document.getElementById("graph-container");
  const graph = new flocc.LineChartRenderer(environment, {
    autoScale: true,    // Allows x axis to adjust as time increases
    background: "#FFFFFF",
    height: heightGraph,
    width: widthGraph
  });
  // Brown = fossile fuel powered car (0)
  // Orange = bike (1)
  // Green = ecar (-1)
  graph.metric("preference", {
    color: "orange",
    fn(arr) {
      return arr.filter((currentState) => currentState === 1).length / population;
    }
  });
  graph.metric("preference", {
    color: "brown",
    fn(arr) {
      return arr.filter((currentState) => currentState === 0).length / population;
    }
  });
  graph.metric("preference", {
    color: "green",
    fn(arr) {
      return arr.filter((currentState) => currentState === -1).length / population;
    }
  });
  graph.mount(containerGraph);
}


function run() {
  if (environment.get("subsidyFixed") === 1) {
    if (environment.get("subsidy") <= 25) {
      environment.set("subsidy", (environment.get("subsidy") + utils.random(0, (environment.get("subsidyIncrement") / 1000) ))) // 0.01  // let user set increment through sider
    };
  }

  if (environment.get("taxFixed") === 1) {
    if (environment.get("tax") <= 65) {
      environment.set("tax", (environment.get("tax") + utils.random(0, (environment.get("taxIncrement") / 1000) )))  // 0.02 // let user set increment through sider
    };
  }

  environment.tick({
    randomizeOrder: true,    
  });
  if (environment.time <= 1000) {
    requestAnimationFrame(run);
  };
};


// setup();
ui();
// run();  // uncomment if the model should run when page is loaded
