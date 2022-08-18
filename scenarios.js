// Default scenarios to speed up setting up environment

function scenarioOne() {
    environment.set("population", 100)
    environment.set("subsidy", 0)
    environment.set("tax", 15)
    environment.set("subsidyFixed", 1)          // not fixed
    environment.set("taxFixed", 1)              //not fixed
    environment.set("subsidyIncrement", 10)
    environment.set("taxIncrement", 20)
    environment.set("bikeDistMax", 20)
    environment.set("bikeDistMin", 2);
}

function scenarioTwo() {
    environment.set("population", 200)
    environment.set("subsidy", 5)
    environment.set("tax", 18)
    environment.set("subsidyFixed", 1)          // not fixed
    environment.set("taxFixed", 0)              // fixed
    environment.set("subsidyIncrement", 12)
    environment.set("taxIncrement", 0)
    environment.set("bikeDistMax", 30)
    environment.set("bikeDistMin", 2);
}

function scenarioThree() {
    environment.set("population", 300)
    environment.set("subsidy", 0)
    environment.set("tax", 25)
    environment.set("subsidyFixed", 1)          // not fixed
    environment.set("taxFixed", 1)              //not fixed
    environment.set("subsidyIncrement", 5)
    environment.set("taxIncrement", 10)
    environment.set("bikeDistMax", 30)
    environment.set("bikeDistMin", 2);
}
