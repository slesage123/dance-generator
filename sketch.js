let video;
let poseNet;
let poses = [];
let rightWristX=0;
let rightWristY=0;
let leftWristX=0;
let leftWristY=0;
let mic;
let sound;
let amplitude;

function preload() {
  soundFormats('mp3', 'ogg');
  sound = loadSound('Buttercup.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //sound stuff
  amplitude=new p5.AudioIn()
  //video in
  video = createCapture(VIDEO);
  video.size(width, height);
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
  
  poseNet.on('pose',gotPoses)
}

function mousePressed(){
  sound.setVolume(0.1);
  sound.play();
}

function gotPoses(poses){
  // console.log(poses)
  if(poses.length>0){
  let newX = rightWristX =poses[0].pose.keypoints[10].position.x;
  let newY = rightWristY =poses[0].pose.keypoints[10].position.y;
    lerp(rightWristX, newX ,0.5);
    lerp(rightWristY, newX ,0.5);
    
  let newerX = leftWristX =poses[0].pose.keypoints[9].position.x;
  let newerY = leftWristY =poses[0].pose.keypoints[9].position.y;
    lerp(leftWristX, newerX ,0.5);
    lerp(leftWristY, newerX ,0.5);
    
  }
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  // image(video, 0, 0, width, height);
  // filter(ERODE)
  background(0,3);
  
  let level=amplitude.getLevel();
  // console.log(level)
  
  
  noStroke();
  fill(0,random(0,255),random(0,255))
  ellipse(rightWristX,rightWristY,(level*1100),(level*1100))
  fill(0,random(0,255),random(0,255))
  ellipse(leftWristX,leftWristY,(level*1100),(level*1100))


  // We can call both functions to draw all keypoints and the skeletons
  // drawKeypoints();
  // drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons  
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

