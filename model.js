const utils = flocc.utils;


// Random numbers consistent when app starts
// utils.seed(11);   // 11 makes electric cars least popular and fossil most popular


// Setting model and graph window sizes
const widthModel = 600;
const heightModel = 600;
const widthGraph = 600;
const heightGraph = 600;


// Setting model parameters
const population = 1;     // Number of agents in model
const subsidy = 0;        // Agent susceptibility to subsidies
const tax = 15;          // Agent susceptibility to tax changes


// Agent model environment setup
const environment = new flocc.Environment();
environment.set("subsidy", subsidy);
environment.set("tax", tax);


// Agent tick interactions
function tick(agent) {
  // get all variables from environment
   let { concern, distance } = agent.getData();

   let tax = environment.get("tax");
   let subsidy = environment.get("subsidy");

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
  scaleReverse(distance, 2, 20, 0.1, 0.8)
  * scale(concern, 0, 100, 0.2, 0.9);

let carPref = // ((100 - tax) / 100);
  scale(distance, 10, 100, 0.1, 0.8) //fruther live more likely car ex 100km 0.8 lilely to use car
  * 0.5 //constant concern when using car
  * scaleReverse(tax, 15, 65, 0.1, 1); //higher tax less likely use car

let eCarPref = 
  scale(distance, 10, 75, 0.1, 0.8)
  * scale(concern, 0, 100, 0.2, 0.9)
  * scale(subsidy, 0, 25, 0.2, 0.8);
 // * 

// add a constant for each of the missing varlibles

// setting agent preference based upon previous calculations
  if (bikePref > carPref && bikePref > eCarPref) {
    agent.set("preference", 1) // bike
  }
  else if (carPref > bikePref && carPref > eCarPref) {
    agent.set("preference", 0) // car
  }
  else {
    agent.set("preference", -1)  // e car
  }

  //DEBUGGING - To remove
  console.log(carPref, bikePref, eCarPref);
  // console.log(concern, distance, tax, subsidy);
}


// Create general population agents and add to environment
function setup() {
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
function reset() {
  environment.clear();
  while (environment.getAgents().length > 0) {
    environment.removeAgent(environment.getAgents()[0]);
  }
}


// Add table to show population preference breakdown
const containerModel = document.getElementById("model-container");
const table = new flocc.TableRenderer(environment, {
  precision: 1,   // Number of floating point decimal places to be shown
  filter: agent => {
    return agent.get("preference")
  }
});
table.columns = [
  "Preference",
  "Number of population",
];
table.mount(containerModel);


// Create the UI interface to change parameters
function ui() {
  new floccUI.Panel(environment, [
    new floccUI.Slider({
      name: "concern",
      label: "Env. concisouness",
      min: 0,
      max: 10,
      step: 1
    }),
    new floccUI.Slider({
      name: "subsidy",
      label: "Green subsidy",
      min: 0,
      max: 1,
      step: 0.01
    }),
    new floccUI.Slider({
      name: "tax",
      label: "Fuel Tax",
      min: 0,
      max: 1,
      step: 0.01
    }),
    new floccUI.Slider({
      name: "distance",
      label: "Avg. distance travelled",
      min: 0,
      max: 100,
      step: 1,
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
    // background: "#FFFFFF",
    height: heightGraph,
    width: widthGraph
  });
  // Brown = fossile fuel powered car (1)
  // Orange = bike (0)
  // Green = ecar (-1)
  graph.metric("preference", {
    color: "brown",
    fn(arr) {
      return arr.filter((currentState) => currentState === 1).length / population;
    }
  });
  graph.metric("preference", {
    color: "orange",
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
  if (environment.get("subsidy") <= 25) {
    environment.set("subsidy", (environment.get("subsidy") + utils.random(0, 0.01))) // let user set increment through sider
  }

  if (environment.get("tax") <= 65) {
    environment.set("tax", (environment.get("tax") + utils.random(0, 0.02)))// let user set increment through sider
  }

  environment.tick({
    randomizeOrder: true,    
  });
  if (environment.time <= 1000) {
    requestAnimationFrame(run);
  };
  
};


setup();
ui();
// run();  // uncomment if the model should run when page is loaded
