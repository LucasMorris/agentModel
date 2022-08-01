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
// const financial = 0.3;      // Agent financial situtaion
const subsidy = 0.1;        // Agent susceptibility to subsidies
const tax = 0.2;          // Agent susceptibility to tax changes
// const distance = 20;       // Agent distance to work/destination
// const concern = 0.5;        // Agent concern for environment


// Agent model environment setup
const environment = new flocc.Environment();
// environment.set("financial", financial);      
environment.set("subsidy", subsidy);
environment.set("tax", tax);


// Agent tick interactions
function tick(agent) {
// TODO finish implementing logic that allows agents to interact with environment and change preference


   let { concern, distance } = agent.getData();

   let tax = environment.get("tax");
   let subsidy = environment.get("subsidy");

 
// distance


// concern 

// tax 
// if tax > 

// preference 1=car, 0=bike, -1=ecar

let carPref = ((100 - tax) / 100);

let bikePref = (concern / 20) * ((20 - Math.min(distance, 20)) / 20); //if further than 20 km then too far to cylce

let eCarPref = (-1);

if(bikePref > carPref) {
  agent.set("preference", 1)
}
else if (bikePref > eCarPref ) {
  agent.set("preference", 0)
}
else {
  agent.set("preference", -1)
}

console.log(carPref, bikePref);


  // const r = utils.uniform();

  // console.log(r)

  // if(r < 0.001) {
  //   return {
  //     preference: -1
  //   }
  // }
  // else return;

}


// Create general population agents and add to environment
function setup() {
  environment.time = 0;
  environment.clear();
  for(var i = 0; i <= population; i++) {
    const agent = new flocc.Agent( {
      // preference: utils.sample([-1, 0, 1 ], [1, 1, 1]), //!REMOVE as it will be calcualted
      distance: utils.random(0, 100),
      concern: utils.gaussian(10, 1),
      tick: tick,
    });  
    //agent.set(tick);
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
    // new floccUI.Slider({
    //   name: "financial",
    //   label: "Purchasing power",
    //   min: 0,
    //   max: 1,
    //   step: 0.01
    // }),
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
        // setup();
        // ui();
        // run();
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
  environment.set("subsidy", environment.get("subsidy") + )
  environment.set("tax", environment.get("tax") + 0.1);
  environment.tick({
    randomizeOrder: true,    
  });
  //!add when time increases environemental conceinecs increases (set env conc to 0.5 at start and multiply by 1.1 by each step)
  if (environment.time <= 1000) {
    requestAnimationFrame(run);
  };
  
};


setup();
ui();
run();


//ENVIRONMENT has factors that change over time that influence what the prerference development is 
//even with low env conc, a high tax will lead to a switch to green cars 
