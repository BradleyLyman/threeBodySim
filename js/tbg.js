/*
 * tbg.js
 * Main program module for the Three Body Grav. Simulation.
 */

/*jslint        browser : true, continue : true,
  devel  : true, indent : 2,      maxerr : 50,
  newcap : true, nomen  : true, plusplus : true,
  regexp : true, sloppy : true,     vars : false,
  white  : true
*/
/*global $, tbg, THREE */

// Modlue /tbg/
var tbg = (function() {
  // ----------------- BEGIN MODULE SCOPE VARIABLES -----------------
  var
    configMap = {
      planetMaterial      : null,
      particleMaterial    : null,
      worldSize           : 150,
      worldDims           : { width : 0, height : 0 },
      particleTrailLength : 1000
    },

    stateMap = {
      scene              : null,
      camera             : null,
      renderer           : null,
      planet1Mesh        : null,
      planet2Mesh        : null,
      particleGeometry   : null,
    },

    initParticleGeometry, resetParticleGeometry,
    addPointToParticleTrail,

    onMouseUp, onWindowResize, render,

    initModule;
  // ------------------ END MODULE SCOPE VARIABLES ------------------


  // -------------------- BEGIN UTILITY METHODS ---------------------
  // Begin Utility method /initParticleGeometry/
  // Purpose   :
  //   Fill the particleGeometry with particleTrailLength points.
  // Arguments : none
  // Action    :
  //   Calls tbg.planets.getParticlePosition and uses it to populate
  //   the particleGeometry's verticies with copies of the position.
  // Returns   : none
  //
  initParticleGeometry = function() {
    var
      i,
      particlePos = tbg.planets.getParticlePosition();

    stateMap.particleGeometry = new THREE.Geometry();
    for ( i = 0; i < configMap.particleTrailLength; i++ ) {
      stateMap.particleGeometry.vertices.push(
        new THREE.Vector3().copy( particlePos )
      );
    }
  };
  // End Utility method /initParticleGeometry/

  // Begin Utility method /resetParticleGeometry/
  // Purpose :
  //   Move all points in the particle trail to the particle's
  //   current position.
  //
  resetParticleGeometry = function() {
    var
      i,
      particlePos = tbg.planets.getParticlePosition();

    for ( i = 0; i < configMap.particleTrailLength; i++ ) {
      stateMap.particleGeometry.vertices[i].copy( particlePos );
    }
  };
  // End Utility method /resetParticleGeomewtry/

  // Begin Utility method /addPointToParticleTrail/
  // Purpose   :
  //   Cycle the contents of the particle geometry to add the current
  //   position to the particle trail.
  // Arguments : none
  // Returns   : none
  //
  addPointToParticleTrail = function() {
    var
      i;

    for ( i = 1; i < configMap.particleTrailLength; i++ ) {
      stateMap.particleGeometry.vertices[ i-1 ].copy(
        stateMap.particleGeometry.vertices[ i ]
      );
    }

    stateMap.particleGeometry.vertices[ configMap.particleTrailLength-1 ].copy(
      tbg.planets.getParticlePosition()
    );
    stateMap.particleGeometry.verticesNeedUpdate = true;
  };
  // End Utility method /addPointToParticleTrail/
  // --------------------- END UTILITY METHODS ----------------------


  // ---------------------- BEGIN DOM METHODS -----------------------
  // ----------------------- END DOM METHODS ------------------------


  // -------------------- BEGIN EVENT HANDLERS ----------------------
  // Begin Event handler /onWindowResize/
  onWindowResize = function() {
    var
      aspect = window.innerHeight / window.innerWidth,
      size   = configMap.worldSize * aspect;

    stateMap.camera.top    = size;
    stateMap.camera.bottom = -size;
    stateMap.camera.updateProjectionMatrix();

    configMap.worldDims.height = 2*size;

    stateMap.renderer.setSize( window.innerWidth, window.innerHeight );
  };
  // End Event handler /onWindowResize/

  // Begin Event handler /onMouseUp/
  // Purpose :
  //   Reset the particle to the mouse's location.
  //
  onMouseUp = function( event ) {
    var
      mX, mY;
    console.log( event.pageX, event.pageY );
    mX = ( event.pageX - window.innerWidth/2 ) * configMap.worldDims.width / window.innerWidth;
    mY = ( window.innerHeight/2 - event.pageY ) * configMap.worldDims.height / window.innerHeight;

    tbg.planets.resetParticle( new THREE.Vector2( mX, mY ) );
    resetParticleGeometry();
  };
  // End Event handler /onMouseUp/

  // Begin Event handler /render/
  //
  render = function() {
    var
      planetPositions = tbg.planets.getPlanetPositions();

    window.requestAnimationFrame( render );

    addPointToParticleTrail();

    stateMap.planet1Mesh.position.copy( planetPositions[0] );
    stateMap.planet2Mesh.position.copy( planetPositions[1] );
    stateMap.renderer.render( stateMap.scene, stateMap.camera );

    tbg.planets.simulationStep();
  };
  // End Event handler /render/
  // --------------------- END EVENT HANDLERS -----------------------


  // -------------------- BEGIN PUBLIC METHODS ----------------------
  // Begin Public method /initModule/
  initModule = function () {
    var
      aspect = window.innerHeight / window.innerWidth,
      size   = configMap.worldSize * aspect;

    tbg.planets.initModule();

    configMap.planetMaterial   = new THREE.MeshBasicMaterial({ color : 0x0000dd } );
    configMap.particleMaterial = new THREE.LineBasicMaterial({ color : 0xffffff, linewidth : 1 });
    stateMap.renderer          = new THREE.WebGLRenderer();
    stateMap.scene             = new THREE.Scene();
    stateMap.camera            = new THREE.OrthographicCamera(
      -configMap.worldSize, configMap.worldSize, size, -size, 1, -1
    );
    configMap.worldDims.width  = configMap.worldSize * 2;
    configMap.worldDims.height = size * 2;

    stateMap.camera.position.z = 1;
    stateMap.renderer.setSize( window.innerWidth, window.innerHeight );
    $('body').append( stateMap.renderer.domElement );
    $('canvas').mouseup( onMouseUp );
    $(window).resize( onWindowResize );

    stateMap.planet1Mesh = new THREE.Mesh(
      new THREE.CircleGeometry( 4, 12 ), configMap.planetMaterial
    );
    stateMap.planet2Mesh = new THREE.Mesh(
      new THREE.CircleGeometry( 4, 12 ), configMap.planetMaterial
    );
    initParticleGeometry();

    stateMap.scene.add( stateMap.planet1Mesh );
    stateMap.scene.add( stateMap.planet2Mesh );
    stateMap.scene.add(
      new THREE.Line( stateMap.particleGeometry, configMap.particleMaterial )
    );
    render();
  };
  // End Public method /initModule/
  // --------------------- END PUBLIC METHODS -----------------------

  return { initModule : initModule };
}());
