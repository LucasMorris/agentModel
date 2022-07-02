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


// Agent model environment setup
const environment = new flocc.Environment();
environment.set("financial", financial);      
environment.set("concern", concern);
environment.set("subsidy", subsidy);
environment.set("tax", tax);
environment.set("distance", distance);


// Set agent starting data
const preference = utils.random();


// Create agent to represent government making subsity and tax decisions
function tick(agent) {
  // skip first tick to allow graph to plot starting values
  if(environment.time === 0) {
    return;
  }
  // TODO finish implementing logic that allows agents to interact with environment and change preference
  
  const { financial, concern, subsidy, tax, distance } = environment.getData();

  const { preference } = agent.getData();

  // !don't thnk this check is needed
  // if(preference === 0) {
  //   return;
  // }



}


// Graph setup (maybe add into the setup() frunction???)
const containerGraph = document.getElementById("graph-container");
const graph = new flocc.LineChartRenderer(environment, {
  autoScale: true,    // Allows x axis to adjust as time increases
  background: "#FFFFFF",
  widthGraph,
  heightGraph
});
// TODO Show agent's transport preference based upon graph line color
// Brown = fossile fuel powered car (1)
// Yellow = public transport (0)
// Green = electric car (-1)
graph.metric("preference", {
  color: "brown",

}
)
graph.mount(containerGraph);


// Add table to show population preference breakdown
// !MUST EDIT AND ADAPT
const containerModel = document.getElementById("model-container");
const table = new flocc.TableRenderer(environment, {
  precision: 1,   // Number of floating point decimal places to be shown
  filter: agent => {
    return agent.get(preference)
  }
});
table.columns = [
  "Preference",
  "Number of population",
];
table.mount(containerModel);


// Create general population agents and add to environment
function setup() {
  environment.time = 0;
  environment.clear();
  for(var i = 0; i <= population; i++) {
    const agent = new flocc.Agent( {
      // TODO ADD interaction values. Check these are correct
      preference: utils.sample([-1, 0, 1], [1, 1, 4])
    });
    agent.set(tick);
    environment.addAgent(agent);
  }
}


// Create the UI interface to change parameters
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
      label: "Reset",       // !Known bug: when reset is clicked, new ui box is created in background
      onClick() {
        setup();
        ui();
      }
    }),
  ])
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
