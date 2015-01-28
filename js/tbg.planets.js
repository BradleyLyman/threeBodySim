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
      G        : 1,
      stepTime : 1.0 / 240.0
    },

    stateMap = {
      planet1 : {
        pos  : new THREE.Vector2( 0, 0 ),
        vel  : new THREE.Vector2( 0, 150 ),
        mass : 4e+6
      },
      planet2 : {
        pos  : new THREE.Vector2( 50, 0 ),
        vel  : new THREE.Vector2( 0, -150 ),
        mass : 4e+6
      },
      particle : {
        pos  : new THREE.Vector2( 11, 0 ),
        vel  : new THREE.Vector2( 0, 0 )
      }
    },

    calcGravityForce, calcParticleAccel,

    initModule, getPlanetPositions, simulationStep, getParticlePosition, resetParticle;
  // ------------------ END MODULE SCOPE VARIABLES ------------------


  // -------------------- BEGIN UTILITY METHODS ---------------------
  // Begin Utility method /calcParticleAccel/
  // Purpose :
  //   Calculate the acceleration on the particle due to the planets.
  // Returns :
  //   Vector2 which represents the acceleration due to gravity.
  //
  calcParticleAccel = function() {
    var
      r1            = new THREE.Vector2(),
      r2            = new THREE.Vector2(),
      f1            = new THREE.Vector2(),
      f2            = new THREE.Vector2(),
      totalForce    = new THREE.Vector2(),
      dist1, dist2;

    r1.subVectors( stateMap.planet1.pos, stateMap.particle.pos );
    dist1 = r1.lengthSq();
    r1.normalize();

    r2.subVectors( stateMap.planet2.pos, stateMap.particle.pos );
    dist2 = r2.lengthSq();
    r2.normalize();

    f1.copy( r1 );
    f1.multiplyScalar( configMap.G * stateMap.planet1.mass / dist1 );
    if ( dist1 <= 0.1 ) {
      f1 = new THREE.Vector2( 0, 0 );
    }

    f2.copy( r2 );
    f2.multiplyScalar( configMap.G * stateMap.planet2.mass / dist2 );
    if ( dist2 <= 0.1 ) {
      f2 = new THREE.Vector2( 0, 0 );
    }

    totalForce.addVectors( f1, f2 );
    return totalForce;
  };
  // End Utility method /calcParticleAccel/

  // Begin Utility method /calcGravityForce/
  // Purpose :
  //   Calculate the force due to gravity between the two planets.
  // Returns :
  //   Vector2 which represents the force due to gravity on planet1
  //   by planet2.
  //
  calcGravityForce = function() {
    var
      r = new THREE.Vector2(),
      sqrDist = 0,
      force = new THREE.Vector2();

    r.subVectors( stateMap.planet2.pos, stateMap.planet1.pos );

    sqrDist = r.lengthSq();

    // avoid divide by zero
    if ( sqrDist <= 0.5 ) {
      return new THREE.Vector2( 0, 0 );
    }

    r.normalize();

    force.copy( r );
    force.multiplyScalar( configMap.G * (stateMap.planet1.mass * stateMap.planet2.mass) / sqrDist );
    return force;
  };
  // End Utility method /calcGravityForce/
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
      force         = calcGravityForce(),
      p1Accel       = new THREE.Vector2(),
      p2Accel       = new THREE.Vector2(),
      p1Vel         = new THREE.Vector2(),
      p2Vel         = new THREE.Vector2(),
      particleVel   = new THREE.Vector2(),
      particleAccel = calcParticleAccel();

    p1Accel.copy( force );
    p2Accel.copy( force );
    p2Accel.multiplyScalar( -1 );
    p1Accel.multiplyScalar( (1 / stateMap.planet1.mass) * configMap.stepTime );
    p2Accel.multiplyScalar( (1 / stateMap.planet2.mass) * configMap.stepTime );

    stateMap.planet1.vel.add( p1Accel );
    stateMap.planet2.vel.add( p2Accel );

    p1Vel.copy( stateMap.planet1.vel );
    p2Vel.copy( stateMap.planet2.vel );
    p1Vel.multiplyScalar( configMap.stepTime );
    p2Vel.multiplyScalar( configMap.stepTime );

    stateMap.planet1.pos.add( p1Vel );
    stateMap.planet2.pos.add( p2Vel );

    particleAccel.multiplyScalar( configMap.stepTime );

    stateMap.particle.vel.add( particleAccel );
    particleVel.copy( stateMap.particle.vel );
    particleVel.multiplyScalar( configMap.stepTime );

    stateMap.particle.pos.add( particleVel );
  };
  // End Public method /simulationStep/

  // Begin Public method /getPlanetPositions/
  // Purpose :
  //   Return a list of planet position vectors for use when rendering.
  // Returns :
  //   An array of 3 vectors representing the center of each planet.
  //
  getPlanetPositions = function() {
    return [
      new THREE.Vector3( stateMap.planet1.pos.x, stateMap.planet1.pos.y, 0 ),
      new THREE.Vector3( stateMap.planet2.pos.x, stateMap.planet2.pos.y, 0 )
    ];
  };
  // End Public method /getPlanetPositions/

  // Begin Public method /getParticlePosition/
  // Purpose :
  //   Retrieve the particle's current position.
  // Returns :
  //   A 3 vector representing the center of the particle.
  //
  getParticlePosition = function() {
    return new THREE.Vector3( stateMap.particle.pos.x, stateMap.particle.pos.y, 0 );
  };
  // End Public method /getParticlePosition/

  // Begin Public method /resetParticle/
  // Purpose   :
  //   Reset the particle's position to and velocity.
  // Arguments :
  //   pos - The particle's new starting position.
  // Returns   : none
  //
  resetParticle = function( pos ) {
    stateMap.particle.vel = new THREE.Vector2( 0, 0 );
    stateMap.particle.pos.copy( pos );
  };
  // End Public method /resetParticle/
  // --------------------- END PUBLIC METHODS -----------------------

  return {
    initModule          : initModule,
    getPlanetPositions  : getPlanetPositions,
    simulationStep      : simulationStep,
    getParticlePosition : getParticlePosition,
    resetParticle       : resetParticle
  };
}());
