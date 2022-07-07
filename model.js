const utils = flocc.utils;


// Random numbers consistent when app starts
utils.seed(11);   // 11 makes electric cars least popular and fossil most popular


// Setting model and graph window sizes
const widthModel = 600;
const heightModel = 600;
const widthGraph = 600;
const heightGraph = 600;


// Setting model parameters
const population = 100;     // Number of agents in model
const financial = 0.3;      // Agent financial situtaion
const concern = 0.2;        // Agent concern for environment
const subsidy = 0.5;        // Agent susceptibility to subsidies
const tax = 0.2;            // Agent susceptibility to tax changes
const distance = 0.6        // Agent distance to work/destination


// Agent model environment setup
const environment = new flocc.Environment();
environment.set("financial", financial);      
environment.set("concern", concern);
environment.set("subsidy", subsidy);
environment.set("tax", tax);
environment.set("distance", distance);


// Set agent starting data
// const preference = utils.random();


// Create agent to represent government making decisions
function tick(agent) {
  // skip first tick to allow graph to plot starting values
  // if(environment.time === 0) {
  //   return;
  // }
  // TODO finish implementing logic that allows agents to interact with environment and change preference
  
  // const { financial, concern, subsidy, tax, distance } = environment.getData();

  // const { preference } = agent.getData();


  const r = utils.uniform();

  console.log(r)

  if(r < 0.001) {
    return {
      preference: -1
    }
  }
  else return;



}

// function tick(agent) {
//   // skip first tick to allow graph to plot starting values
//   if(environment.time === 0) {
//     return;
//   }
//   // TODO finish implementing logic that allows agents to interact with environment and change preference
  
//   const { financial, concern, subsidy, tax, distance } = environment.getData();

//   const { preference } = agent.getData();

//   console.log(preference)

//   // if agent has electric no interaction
//   if(preference === -1) {
//     return;
//   }

//   // Interact with general population
//   let genPop
//   do {
//     genPop = utils.sample(environment.getAgents());
//   }
//   while(genPop === agent);

//   const genPopPref = genPop.get("preference");

//   const r = utils.uniform();

//   if(r < 0.2) {
//     return {
//       preference: -1
//     }
//   }
//   else return;

//   // agent needs to be tempeted away from fossil
//   if(genPopPref === 1) {
//     // if their concern is high they will switch
//     if(r < concern) {
//       genPop.set("preference", preference);
//     }
//     // But it is possible that tax levels on fuel are low which causes them to stay?
//     else if(r < concern + concern * tax) {
//       genPop.set("preference", -1 * preference);
//     }
//   }

//   else if(preference !== genPopPref) {
//     if((r < concern * subsidy * distance)) genPop.set("preference", -1)
//   }
//   else {
//     if(r < concern * subsidy * financial) genPop.set("preference", -1)
//   }
// }



// Create general population agents and add to environment
function setup() {
  environment.time = 0;
  environment.clear();
  for(var i = 0; i <= population; i++) {
    const agent = new flocc.Agent( {
      // TODO ADD interaction values. Check these are correct
      preference: utils.sample([-1, 0, 1], [1, 1, 1]),    // Sample gets a random value (array to select from [] and wieghts [])
      // preference: 0   // All agents start with preference 0 (FOR TESTING)
      tick: tick,
    });
    // agent.set(tick);
    environment.addAgent(agent);
  }
}


// Graph setup (maybe add into the setup() frunction?)



// Add table to show population preference breakdown
// !MUST EDIT AND ADAPT TO SHOW DETAILED BREAKDOWN
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


// !Where setup used to be:

// Create the UI interface to change parameters
// TODO Does graph need to be nested here so interactions work?
// TODO Move into separeate UI file?
function ui() {
  new floccUI.Panel(environment, [
    new floccUI.Slider({
      name: "financial",
      label: "Purchasing power",
      min: 0,
      max: 1,
      step: 0.01
    }),
    new floccUI.Slider({
      name: "concern",
      label: "Env. concisouness",
      min: 0,
      max: 1,
      step: 0.01
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
      label: "Fossile Fuel Tax",
      min: 0,
      max: 1,
      step: 0.01
    }),
    new floccUI.Slider({
      name: "distance",
      label: "Avg. distance travelled",
      min: 0,
      max: 1,
      step: 0.01,
    }),
    new floccUI.Button({
      label: "Start",
      onClick() {
        // TODO Add functionality to start model
      }
    }),
    new floccUI.Button({
      label: "Pause",
      onClick() {
        // TODO add functionality to pause        
      }
    }),
    new floccUI.Button({
      label: "Reset",       // !Known bug: when reset is clicked, new ui box is created in background. move graph out?
      onClick() {
        setup();
        ui();  
      }
    }),
  ])
  const containerGraph = document.getElementById("graph-container");
  const graph = new flocc.LineChartRenderer(environment, {
    autoScale: true,    // Allows x axis to adjust as time increases
    // background: "#FFFFFF",
    height: heightGraph,
    width: widthGraph
  });
  // TODO Show agent's transport preference based upon graph line color
  // Brown = fossile fuel powered car (1)
  // Orange = public transport (0)
  // Green = electric car (-1)
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
  environment.tick({ randomizeOrder: true });
  if (environment.time <= 1000) {
    requestAnimationFrame(run);
  };
};


setup();
ui();
run();
