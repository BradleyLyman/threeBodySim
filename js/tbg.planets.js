/*
 * tbg.planets.js
 * This is where all of the non-visualization code for the sim will
 * live.
 */

/*jslint        browser : true, continue : true,
  devel  : true, indent : 2,      maxerr : 50,
  newcap : true, nomen  : true, plusplus : true,
  regexp : true, sloppy : true,     vars : false,
  white  : true
*/
/*global $, tbg, THREE */

// Modlue /tbg.planets/
tbg.planets = (function() {
  // ----------------- BEGIN MODULE SCOPE VARIABLES -----------------
  var
    configMap = {
      G        : 6.67e-11,
      stepTime : 1.0 / 60.0
    },

    stateMap = {
      planet1 : {
        pos  : new THREE.Vector2( 0, 0 ),
        vel  : new THREE.Vector2( 0, 0 ),
        mass : 1
      },
      planet2 : {
        pos  : new THREE.Vector2( 50, 0 ),
        vel  : new THREE.Vector2( 0, 0 ),
        mass : 1
      }
    },

    initModule, getPlanetPositions, simulationStep;
  // ------------------ END MODULE SCOPE VARIABLES ------------------


  // -------------------- BEGIN UTILITY METHODS ---------------------
  // --------------------- END UTILITY METHODS ----------------------


  // ---------------------- BEGIN DOM METHODS -----------------------
  // ----------------------- END DOM METHODS ------------------------


  // -------------------- BEGIN EVENT HANDLERS ----------------------
  // --------------------- END EVENT HANDLERS -----------------------


  // -------------------- BEGIN PUBLIC METHODS ----------------------
  // Begin Public method /initModule/
  initModule = function () {
    stateMap.planet1.pos.set( 50, 0 );
    stateMap.planet2.pos.set( -50, 0 );

  };
  // End Public method /initModule/

  // Begin Public method /simulationStep/
  // Purpose   : Step the simulation forwards 1 tick.
  // Arguments : none
  // Return    : none
  //
  simulationStep = function() {
    var
      p1Accel = new THREE.Vector2( -20, 0 ),
      p2Accel = new THREE.Vector2( 20, 0 ),
      p1Vel   = new THREE.Vector2(),
      p2Vel   = new THREE.Vector2();

    p1Accel.multiplyScalar( configMap.stepTime );
    p2Accel.multiplyScalar( configMap.stepTime );

    stateMap.planet1.vel.add( p1Accel );
    stateMap.planet2.vel.add( p2Accel );

    p1Vel.copy( stateMap.planet1.vel );
    p2Vel.copy( stateMap.planet2.vel );
    p1Vel.multiplyScalar( configMap.stepTime );
    p2Vel.multiplyScalar( configMap.stepTime );

    stateMap.planet1.pos.add( p1Vel );
    stateMap.planet2.pos.add( p2Vel );
  };
  // End Public method /simulationStep/

  // Begin Public method /getPlanetPositions/
  // Purpose :
  //   Return a list of planet position vectors for use when rendering.
  // Returns :
  //   An array of 2 vectors representing the center of each planet.
  //
  getPlanetPositions = function() {
    return [
      new THREE.Vector3( stateMap.planet1.pos.x, stateMap.planet1.pos.y, 0 ),
      new THREE.Vector3( stateMap.planet2.pos.x, stateMap.planet2.pos.y, 0 )
    ];
  };
  // End Public method /getPlanetPositions/
  // --------------------- END PUBLIC METHODS -----------------------

  return {
    initModule         : initModule,
    getPlanetPositions : getPlanetPositions,
    simulationStep     : simulationStep
  };
}());
