"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/unsupported-syntax */

import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const sketch = (p: p5) => {
      interface Player {
        x: number;
        y: number;
        vy: number;
        isFallingOver: boolean;
        rotation: number;
        fallRotationDir: number;
        fallRotationSpeed: number;
        maxFallRotation: number;
        onPlatform: PlatformCloud | null;
        alpha: number;
      }

      // Game Variables
      let player: Player;
      let currentGravity: number; // Set by level
      let currentJumpForce: number; // Set by level
      let originalL2JumpForce: number; // To store the normal L2 jump force
      let isFirstJumpL2 = false; // Flag for the initial boosted jump in Level 2

      let groundLevel: number; // Y-coordinate for ground or cave floor
      let ceilingLevel: number; // Y-coordinate for cave ceiling
      let score = 0;
      let gameSpeed: number;
      let minGameSpeed: number;
      let maxGameSpeed: number;
      let speedIncreaseRate: number;

      // Level-specific object arrays
      let trees: Tree[] = [];
      let backgroundAestheticClouds: BackgroundAestheticCloud[] = [];
      let platformClouds: PlatformCloud[] = [];
      let obstacles: PointyRock[] = []; // For Level 3 rocks
      let cave: Cave | null = null;
      let endPortal: EndPortal | null = null;

      let currentLevel = 1;
      let gameState = 'mainMenu'; // mainMenu, playing, gameOver, levelComplete, allLevelsComplete, transitioning
      let isPaused = false;
      let isRainingInLevel2 = false; // To track rainy day state in Level 2
      let isThunderstormInLevel2 = false; // To track thunderstorm state in Level 2

      // NEW FLAG: Tracks if the next Level 2 start should have the rainbow effect
      let shouldShowStormRainbowFX = false;

      const stickFigure = {
        headSize: 20,
        bodyLength: 40,
        armLength: 25,
        legLength: 30,
        legSpread: 15,
        animationSpeed: 0.2,
        armAngle: 0,
        legAngle: 0,
      };

      let PLAYER_ACTUAL_HEIGHT: number;
      let STICKFIGURE_EFFECTIVE_WIDTH_FOR_SPACING: number;
      const MIN_TREE_SPACING_MULTIPLIER = 3;
      let actualMinTreeHorizontalSpacing: number;
      let nextPossibleSpawnFrame = 0;

      let treesSpawnedTotal = 0;
      let platformCloudsSpawnedTotal = 0;

      // --- UI & Menu Element Properties ---
      const buttonWidth = 180;
      const buttonHeight = 35;
      const buttonMargin = 10;
      const itemMargin = 2;

      const menuButton: { x: number, y: number, w: number, h: number, text: string } = { x: 0, y: 0, w: 0, h: 0, text: '' };
      const pauseButton = { w: buttonWidth, h: buttonHeight, x: 0, y: 0 };
      const restartCurrentLevelButton = { w: buttonWidth, h: buttonHeight, x: 0, y: 0, text: '', defaultText: '' };
      const mainPageButton = { w: buttonWidth, h: buttonHeight, x: 0, y: 0, text: '' };
      let playLevelButtons: any[] = [];
      const gameOverRestartButton: any = {};

      let isMenuOpen = false;
      // Levels unlocked for testing
      const unlockedLevels: any = { 1: true, 2: true, 3: true };
      let maxDefinedLevel: number;

      // --- Level End & Transition Logic ---
      let levelStartTime = 0;
      let totalPausedTime = 0;
      let timeOfPause = 0;
      let levelTimeUp = false; // Generic timer for levels
      let caveMissed = false; // L1 specific
      let caveMissedTime = 0; // L1 specific
      let blackHole: any = null; // L1 specific
      const blackHoleAppearDelay = 3000;

      // --- Level 2 Cloud Spacing (screen-independent) ---
      const L2_SPAWN_AHEAD  = 220;   // when last cloud's RIGHT edge < width + this, queue the next
      const L2_FIRST_OFFSET = 140;   // first seed offset from right edge

      // --- One-shot Rainbow effect ---
      const rainbowFX = { active: false, startedAt: 0, durationMs: 1500 };

      const LEVEL_PARAMS: any = {
        1: {
          levelType: 'ground',
          duration: 45000,
          minSpeed: 5, maxSpeed: 15, speedRate: 0.002,
          skyColor: [135, 206, 250],
          groundColor: [100, 150, 70],
          treeSpawnRandomFactor: { min: 30, max: 90 },
          endsInCave: true,
          levelGravity: 0.7,
          levelJumpForce: -15,
          progressBarType: 'time'
        },
        2: {
          levelType: 'sky',
          minSpeed: 4.5, maxSpeed: 6.5, speedRate: 0.0005,
          skyColor: [90, 170, 250],
          platformCloudCountForPortal: 15,
          cloudVisualHeight: 30,
          cloudYPositionFactor: 0.75,
          endsInPortal: true,
          levelGravity: 0.50,
          levelJumpForce: -12.8,
          firstJumpBoostFactor: 1.8,
          progressBarType: 'count',
          itemToCountVariable: 'platformCloudsSpawnedTotal',
          countGoalKey: 'platformCloudCountForPortal'
        },
        3: {
          levelType: 'cave',
          duration: 45000,
          minSpeed: 4, maxSpeed: 10, speedRate: 0.001,
          skyColor: [15, 15, 25],
          groundColor: [40, 35, 30],
          obstacleSpawnRandomFactor: { min: 60, max: 120 },
          endsIn: 'white_portal',
          gravity: 0.65,
          jumpForce: -14.5,
          progressBarType: 'time',
          lightRadiusAroundRock: 180,
          playerLightRadius: 40,
          caveFloorHeight: 60,
          caveCeilingHeight: 60
        }
      };
      let currentSkyColor: p5.Color;
      let levelEndObjective: any = null;

      const progressBarHeight = 8;
      const progressBarY = 0;

      // Portal entry animation state for L3
      const portalAnimation: any = {
        active: false,
        progress: 0,
        duration: 60, // frames for the animation
        playerStartPos: null
      };

      const transitionAnimation: any = {
          active: false, phase: 0, timer: 0, duration: 300,
          playerStartCaveX: 0, playerTargetExitX: 0, playerGroundY: 0,
          playerAscendY: 0, playerFinalL2Y: 0, groundOriginalY: 0,
          groundTargetY: 0, caveSnapshot: null, firstL2Cloud: null,
          skyColorL1: null, skyColorL2: null,
          triggeredByBlackHole: false
      };

      // --- Main Page Buttons ---
      const mainPageUI = {
        startButton: { x: 0, y: 0, w: 260, h: 58, text: "Start Game" }
      };

      // ---------------------------------------------------------------------
      // CLASS DEFINITIONS
      // ---------------------------------------------------------------------
      class BackgroundAestheticCloud {
        x: number; y: number; scale: number; baseSpeedFactor: number; speed: number; parts: any[];
        constructor(x: number, y: number, scale: number) {
          this.x = x; this.y = y; this.scale = scale;
          this.baseSpeedFactor = 0.2;
          let initialMinSpeed = LEVEL_PARAMS[1].minSpeed;
          if (LEVEL_PARAMS[currentLevel]) initialMinSpeed = LEVEL_PARAMS[currentLevel].minSpeed;
          this.speed = initialMinSpeed * this.baseSpeedFactor * this.scale;
          this.parts = []; const numEllipses = p.int(p.random(3, 6));
          for (let i = 0; i < numEllipses; i++) {
            this.parts.push({
              offsetX: p.random(-30*scale,30*scale), offsetY: p.random(-10*scale,10*scale),
              w: p.random(40*scale,80*scale), h: p.random(30*scale,50*scale)
            });
          }
        }
        update() {
          if (isPaused||gameState==='transitioning' || gameState==='mainMenu') return;
          this.speed = gameSpeed*this.baseSpeedFactor*this.scale; this.x -= this.speed;
        }
        draw() {
          p.fill(255,255,255,200);p.noStroke();
          for(const part of this.parts) p.ellipse(this.x+part.offsetX,this.y+part.offsetY,part.w,part.h);
        }
        isOffscreen() {
          let maxExtent=0;this.parts.forEach(part=>maxExtent=p.max(maxExtent,part.offsetX+part.w/2));
          return this.x+maxExtent<0;
        }
      }

      class Tree {
        x: number; sizeFactor: number; type: string; s_trunkWidth: number; s_trunkHeight: number;
        s_leavesRadius: number; s_leavesColor: p5.Color; s_trunkColor: p5.Color;
        s_yTrunkTop: number; s_yLeavesCenter: number; hasHole: boolean; visualWidth: number;
        collisionBox: any; rotationAngle: number = 0; fallenTreeHeight: number = 0;
        fallenTreeWidth: number = 0; yPosForDrawing: number = 0; visualHeight: number = 0;

        constructor(x: number,sizeFactor: number,type='standing') {
          this.x=x;this.sizeFactor=sizeFactor;this.type=type;
          this.s_trunkWidth=20*this.sizeFactor;this.s_trunkHeight=60*this.sizeFactor;
          this.s_leavesRadius=40*this.sizeFactor;
          this.s_leavesColor=p.color(34,139,34,230);this.s_trunkColor=p.color(139,69,19);
          this.s_yTrunkTop=-this.s_trunkHeight/2;this.s_yLeavesCenter=this.s_yTrunkTop-this.s_leavesRadius*0.5;
          this.hasHole = (this.type === 'standing' && p.random() < 0.2);

          const currentGround=(typeof groundLevel==='number')?groundLevel:p.height-50;
          if(this.type==='standing'){
            this.visualWidth=this.s_leavesRadius*1.5;
            const abs_yTrunkTop=currentGround-this.s_trunkHeight;
            const abs_yLeavesCenter=abs_yTrunkTop-this.s_leavesRadius*0.5;
            this.collisionBox={top:abs_yLeavesCenter-this.s_leavesRadius*0.7,bottom:currentGround,width:this.s_leavesRadius*1.5};
          }else{
            this.rotationAngle=p.random([p.PI/2,-p.PI/2]);
            this.fallenTreeHeight=this.s_leavesRadius*1.5;this.fallenTreeWidth=this.s_trunkHeight+this.s_leavesRadius*1.2;
            this.visualWidth=this.fallenTreeWidth;this.visualHeight=this.fallenTreeHeight;
            this.yPosForDrawing=currentGround-this.visualHeight/2;
            this.collisionBox={top:currentGround-this.visualHeight,bottom:currentGround,width:this.visualWidth*0.9,};
          }
          this.collisionBox.left=this.x-this.collisionBox.width/2;this.collisionBox.right=this.x+this.collisionBox.width/2;
        }
        update(){
          if(isPaused||gameState==='transitioning'||gameState==='levelComplete'||gameState==='allLevelsComplete' || gameState==='mainMenu')return;
          this.x-=gameSpeed;this.collisionBox.left=this.x-this.collisionBox.width/2;this.collisionBox.right=this.x+this.collisionBox.width/2;
          const currentGround=(typeof groundLevel==='number')?groundLevel:p.height-50;
          if(this.type==='standing'){
            const abs_yTrunkTop=currentGround-this.s_trunkHeight;const abs_yLeavesCenter=abs_yTrunkTop-this.s_leavesRadius*0.5;
            this.collisionBox.top=abs_yLeavesCenter-this.s_leavesRadius*0.7;this.collisionBox.bottom=currentGround;
          }else{
            this.yPosForDrawing=currentGround-this.visualHeight/2;this.collisionBox.top=currentGround-this.visualHeight;this.collisionBox.bottom=currentGround;
          }
        }
        draw(){
          const currentGround=(typeof groundLevel==='number')?groundLevel:p.height-50;
          if(currentGround>p.height*1.5&&gameState==='transitioning')return;
          if(this.type==='standing'){
            const abs_yTrunkTop=currentGround-this.s_trunkHeight;const abs_yLeavesCenter=abs_yTrunkTop-this.s_leavesRadius*0.5;
            p.fill(this.s_trunkColor);p.noStroke();p.rect(this.x-this.s_trunkWidth/2,abs_yTrunkTop,this.s_trunkWidth,this.s_trunkHeight);
            if (this.hasHole) { p.fill(40,25,10); p.ellipse(this.x, abs_yTrunkTop + this.s_trunkHeight / 2, this.s_trunkWidth * 0.4, this.s_trunkWidth * 0.5); }
            p.fill(this.s_leavesColor);p.ellipse(this.x,abs_yLeavesCenter,this.s_leavesRadius*1.5,this.s_leavesRadius*1.4);
            p.ellipse(this.x-this.s_leavesRadius*0.3,abs_yLeavesCenter+this.s_leavesRadius*0.2,this.s_leavesRadius,this.s_leavesRadius);
            p.ellipse(this.x+this.s_leavesRadius*0.3,abs_yLeavesCenter+this.s_leavesRadius*0.1,this.s_leavesRadius*0.9,this.s_leavesRadius*0.9);
          }else{
            p.push();p.translate(this.x,this.yPosForDrawing);p.rotate(this.rotationAngle);
            p.fill(this.s_trunkColor);p.noStroke();p.rectMode(p.CENTER);p.rect(0,0,this.s_trunkWidth,this.s_trunkHeight);p.rectMode(p.CORNER);
            const leavesCenterY_rotated=-this.s_trunkHeight/2-this.s_leavesRadius*0.5;p.fill(this.s_leavesColor);
            p.ellipse(0,leavesCenterY_rotated,this.s_leavesRadius*1.5,this.s_leavesRadius*1.4);
            p.ellipse(-this.s_leavesRadius*0.3,leavesCenterY_rotated+this.s_leavesRadius*0.2,this.s_leavesRadius,this.s_leavesRadius);
            p.ellipse(this.s_leavesRadius*0.3,leavesCenterY_rotated+this.s_leavesRadius*0.1,this.s_leavesRadius*0.9,this.s_leavesRadius*0.9);p.pop();
          }
        }
        collidesWith(plr: any){
          if(levelTimeUp && LEVEL_PARAMS[currentLevel] && LEVEL_PARAMS[currentLevel].endsInCave)return false;
          if(gameState!=='playing')return false;
          const pTop=plr.y-stickFigure.bodyLength/2-stickFigure.headSize;const pBot=plr.y+stickFigure.bodyLength/2+stickFigure.legLength;
          const pLeft=plr.x-stickFigure.headSize/2;const pRight=plr.x+stickFigure.headSize/2;
          return pRight>this.collisionBox.left&&pLeft<this.collisionBox.right&&pBot>this.collisionBox.top&&pTop<this.collisionBox.bottom;
        }
        isOffscreen(){return this.x+this.visualWidth/2<0;}
      }

      class Cave {
        width: number; actualGroundLevel: number; visualHeight: number; x: number;
        peakY: number; color: p5.Color; openingWidth: number; openingHeight: number;
        constructor(){
          this.width=150;this.actualGroundLevel=(typeof groundLevel==='number')?groundLevel:p.height-50;
          this.visualHeight=this.actualGroundLevel*0.9;this.x=p.width+this.width;this.peakY=this.actualGroundLevel-this.visualHeight;
          this.color=p.color(80,80,90,220);this.openingWidth=stickFigure.headSize*3;this.openingHeight=PLAYER_ACTUAL_HEIGHT*1.2;
        }
        update(){if(isPaused||gameState==='transitioning'||gameState==='levelComplete'||gameState==='allLevelsComplete' || gameState==='mainMenu')return;this.x-=gameSpeed;}
        draw(){
          const currentGround=(typeof groundLevel==='number')?groundLevel:p.height-50;
          if(gameState==='transitioning'&&currentGround>p.height+this.visualHeight)return;
          p.fill(this.color);p.noStroke();p.beginShape();
          p.vertex(this.x-this.width/2,currentGround);p.vertex(this.x-this.width/2,currentGround-this.visualHeight*0.8);
          p.vertex(this.x,currentGround-this.visualHeight);p.vertex(this.x+this.width/2,currentGround-this.visualHeight*0.8);
          p.vertex(this.x+this.width/2,currentGround);p.endShape(p.CLOSE);
          p.fill(20,20,20,240);const openingTopY=currentGround-this.openingHeight;
          p.rect(this.x-this.openingWidth/2,openingTopY+this.openingWidth/4,this.openingWidth,this.openingHeight-this.openingWidth/4);
          p.arc(this.x,openingTopY+this.openingWidth/4,this.openingWidth,this.openingWidth/2,p.PI,0,p.CHORD);
        }
        collidesWith(plr: any){
          const currentGround=(typeof groundLevel==='number')?groundLevel:p.height-50;
          if(currentGround>p.height*1.5&&gameState!=='transitioning')return false;
          const pBodyCenterY=plr.y;const caveOpenTop=currentGround-this.openingHeight;const caveOpenBot=currentGround;
          return plr.x>this.x-this.openingWidth/2&&plr.x<this.x+this.openingWidth/2&&
                 pBodyCenterY+stickFigure.bodyLength/2+stickFigure.legLength>caveOpenTop&&
                 pBodyCenterY-stickFigure.bodyLength/2-stickFigure.headSize<caveOpenBot&&
                 this.x<plr.x+stickFigure.headSize;
        }
        isOffscreen(){return this.x+this.width<0;}
      }

      class PlatformCloud {
        x: number; y: number; w: number; h: number; type: string; color: p5.Color; bottomColor: p5.Color;
        constructor(x: number, y: number, platWidth: number, platVisualHeight: number, cloudType = 'normal') {
          this.x = x;
          this.y = y; // Y of the TOP SURFACE
          this.w = platWidth;
          this.h = platVisualHeight;
          this.type = cloudType; // 'normal', 'black', 'gray', 'dream'

          // Set colors based on cloudType
          switch (this.type) {
            case 'black':
              this.color = p.color(60, 60, 60, 245);
              this.bottomColor = p.color(40, 40, 40, 230);
              break;
            case 'gray':
              this.color = p.color(150, 150, 150, 240);
              this.bottomColor = p.color(120, 120, 120, 220);
              break;
            case 'dream':
              this.color = p.color(255, 105, 180, 240);
              this.bottomColor = p.color(255, 140, 190, 220);
              break;
            default: // 'normal'
              this.color = p.color(240, 240, 250, 245);
              this.bottomColor = p.color(210, 210, 230, 220);
              break;
          }
        }

        update() {
          if (isPaused || gameState === 'transitioning' || gameState==='mainMenu') return;
          this.x -= gameSpeed;
        }

        draw() {
          p.push();
          p.noStroke();
          p.fill(this.color);
          p.rect(this.x - this.w / 2, this.y, this.w, this.h, 8);

          const fluffiness = this.h * 2;
          const fluffYOffset = this.h * 0.6;
          p.fill(this.bottomColor);
          p.ellipse(this.x, this.y + fluffYOffset, this.w * 1.15, fluffiness);
          p.ellipse(this.x - this.w * 0.35, this.y + fluffYOffset + 10, this.w * 0.55, fluffiness * 0.8);
          p.ellipse(this.x + this.w * 0.35, this.y + fluffYOffset + 10, this.w * 0.55, fluffiness * 0.9);

          if (isRainingInLevel2 && (this.type === 'gray' || this.type === 'black')) {
              this.drawRain();
          }
          p.pop();
        }

        drawRain() {
            p.stroke(173, 216, 230, 150);
            p.strokeWeight(1.5);
            const rainStartY = this.y + this.h;
            for (let i = 0; i < this.w / 5; i++) {
                const rainX = this.x - this.w / 2 + p.random(this.w);
                const rainLength = p.random(10, 25);
                const rainDropY = rainStartY + (p.frameCount * 2.5) % 40 + p.random(30);
                p.line(rainX, rainDropY, rainX, rainDropY + rainLength);
            }
        }

        isOffscreen() { return this.x + this.w / 2 < 0; }
        isPlayerOn(plr: any) {
          const pFeetY = plr.y + stickFigure.bodyLength / 2 + stickFigure.legLength;
          const pLeewayY = 20;
          const pLeft = plr.x - stickFigure.headSize / 2;
          const pRight = plr.x + stickFigure.headSize / 2;
          const cLeft = this.x - this.w / 2;
          const cRight = this.x + this.w / 2;
          return (plr.vy >= -0.8 && pFeetY >= this.y - pLeewayY / 2 &&
                  pFeetY <= this.y + pLeewayY && pRight > cLeft && pLeft < cRight);
        }
      }

      class EndPortal {
        x: number; y: number; baseSize: number; size: number; active: boolean;
        color1: p5.Color; color2: p5.Color; particles: any[];
        constructor(x: number,y: number,size: number){
          this.x=x;this.y=y;this.baseSize=size;this.size=size;this.active=true;
          this.color1=p.color(180,80,255,200);this.color2=p.color(255,200,255,230);this.particles=[];
          for(let i=0;i<20;i++)this.particles.push({offsetAngle:p.random(p.TWO_PI),offsetDist:p.random(this.baseSize*0.1,this.baseSize*0.45),speed:p.random(0.03,0.07),particleSize:p.random(2,5)});
        }
        update(){if(isPaused||!this.active||gameState==='transitioning'||gameState==='allLevelsComplete'||gameState==='mainMenu')return;this.x-=gameSpeed;this.size=this.baseSize+p.sin(p.frameCount*0.15)*(this.baseSize*0.08);}
        draw(){
          if(!this.active&&gameState!=='allLevelsComplete'&&gameState!=='levelComplete')return;p.push();p.noStroke();
          const c1: any = this.color1;
          p.fill(c1.levels[0], c1.levels[1], c1.levels[2], 80 + p.sin(p.frameCount * 0.07) * 40);
          p.ellipse(this.x,this.y,this.size*1.7,this.size*1.7);
          p.fill(this.color1);p.ellipse(this.x,this.y,this.size,this.size);p.fill(this.color2);p.ellipse(this.x,this.y,this.size*0.55,this.size*0.55);
          for(const pt of this.particles){
            const curAng=pt.offsetAngle+p.frameCount*pt.speed;const px=this.x+p.cos(curAng)*pt.offsetDist*(this.size/this.baseSize);const py=this.y+p.sin(curAng)*pt.offsetDist*(this.size/this.baseSize);
            p.fill(255,p.random(200,255),255,p.random(150,220));p.ellipse(px,py,pt.particleSize,pt.particleSize);
          }p.pop();
        }
        collidesWithPlayer(plr: any){if(!this.active)return false;const d=p.dist(plr.x,plr.y,this.x,this.y);return d<this.size/2+stickFigure.bodyLength/3;}
        isOffscreen(){return this.x+this.size<0;}
      }

      class PointyRock {
        x: number; y: number; size: number; fromCeiling: boolean; rockColor: p5.Color;
        lightColor: p5.Color; lightName: string; numPoints: number; shapePoints: p5.Vector[];
        visualWidth: number; visualHeight: number; collisionBox: any;
        constructor(x: number, y: number, size: number, fromCeiling = false) {
          this.x = x; this.y = y; this.size = size; this.fromCeiling = fromCeiling;

          // --- Rock color family selection ---
          const rand = p.random();
          if (rand < 1 / 15) { // Brown
            this.rockColor = p.color(160, 120, 90);
            this.lightColor = p.color(190, 140, 90);   // warm brown glow
            this.lightName = 'brown';
          } else if (rand < (1 / 15) + (1 / 10)) { // Black
            this.rockColor = p.color(50, 50, 55);
            this.lightColor = p.color(20, 20, 25);    // dark/black glow (subtle)
            this.lightName = 'black';
          } else { // Grey
            this.rockColor = p.color(110, 115, 120);
            this.lightColor = p.color(180, 180, 190); // cool grey glow
            this.lightName = 'grey';
          }
          this.numPoints = p.int(p.random(5, 9));
          this.shapePoints = [];
          const angleStep = p.TWO_PI / (this.numPoints * 2);

          for (let i = 0; i < this.numPoints * 2; i++) {
            const rOuter = this.size * 0.8;
            const rInner = this.size * 0.4;
            const r = (i % 2 === 0) ? rOuter * p.random(0.9, 1.1) : rInner * p.random(0.7, 1.0);
            const angle = i * angleStep + p.random(-angleStep / 3, angleStep / 3);
            const px = p.cos(angle) * r;
            let py = p.sin(angle) * r;
            py = this.fromCeiling ? p.abs(py) * (i % 2 === 0 ? 1 : 0.6) : -p.abs(py) * (i % 2 === 0 ? 1 : 0.6);
            this.shapePoints.push(p.createVector(px, py));
          }

          this.visualWidth = this.size * 1.6;
          this.visualHeight = this.size * 0.8;
          this.collisionBox = { width: this.visualWidth * 0.7, height: this.visualHeight };
          this.collisionBox.left = this.x - this.collisionBox.width / 2;
          this.collisionBox.right = this.x + this.collisionBox.width / 2;
          if (this.fromCeiling) {
            this.collisionBox.top = this.y;
            this.collisionBox.bottom = this.y + this.collisionBox.height;
          } else {
            this.collisionBox.bottom = this.y;
            this.collisionBox.top = this.y - this.collisionBox.height;
          }
        }
        update() {
          if (isPaused || gameState !== 'playing') return;
          this.x -= gameSpeed;
          this.collisionBox.left = this.x - this.collisionBox.width / 2;
          this.collisionBox.right = this.x + this.collisionBox.width / 2;
        }
        draw() {
          // Colored glow per rock family (grey, black, brown)
          p.noStroke();
          const lightRadius = LEVEL_PARAMS[3].lightRadiusAroundRock;
          for (let r = lightRadius; r > 0; r -= lightRadius / 8) {
            // Black light is intentionally subtle; others are brighter
            const baseAlpha = (this.lightName === 'black') ? 16 : 30;
            const alpha = p.map(r, lightRadius, 0, 0, baseAlpha);
            const lc: any = this.lightColor;
            p.fill(lc.levels[0], lc.levels[1], lc.levels[2], alpha);
            p.ellipse(this.x, this.y, r * 2, r * 2);
          }
          // Rock body
          p.push();
          p.translate(this.x, this.y);
          p.fill(this.rockColor);
          p.stroke(20, 20, 25);
          p.strokeWeight(1.5);
          p.beginShape();
          this.shapePoints.forEach(pt => p.vertex(pt.x, pt.y));
          p.endShape(p.CLOSE);
          p.pop();
        }
        collidesWith(plr: any) {
          if (gameState !== 'playing') return false;
          const playerTop = plr.y - stickFigure.bodyLength/2 - stickFigure.headSize;
          const playerBottom = plr.y + stickFigure.bodyLength/2 + stickFigure.legLength;
          const playerLeft = plr.x - stickFigure.headSize/2;
          const playerRight = plr.x + stickFigure.headSize/2;
          return playerRight > this.collisionBox.left && playerLeft < this.collisionBox.right &&
                 playerBottom > this.collisionBox.top && playerTop < this.collisionBox.bottom;
        }
        isOffscreen() { return this.x + this.visualWidth < 0; }
      }

      class WhitePortal {
          x: number; y: number; h: number; w: number; active: boolean;
          color1: p5.Color; color2: p5.Color;
          constructor(x: number, y: number, height: number) {
              this.x = x;
              this.y = y;
              this.h = height;
              this.w = this.h * 0.4;
              this.active = true;
              this.color1 = p.color(255, 255, 240, 200);
              this.color2 = p.color(220, 220, 255, 230);
          }
          update() {
              if (isPaused || !this.active || gameState !== 'playing') return;
              this.x -= gameSpeed;
          }
          draw() {
              if (!this.active) return;
              p.push();
              p.noStroke();
              for (let i = 0; i < 5; i++) {
                  const sW = this.w * (1 + i * 0.4);
                  const sH = this.h * (1 + i * 0.2);
                  const alpha = p.map(i, 0, 5, 40, 0);
                  p.fill(255, alpha);
                  p.ellipse(this.x, this.y, sW, sH);
              }
              p.fill(this.color2);
              p.ellipse(this.x, this.y, this.w, this.h);
              p.fill(this.color1);
              p.ellipse(this.x, this.y, this.w * 0.6, this.h * 0.8);
              p.pop();
          }
          collidesWith(plr: any) {
              if (!this.active) return false;
              return (p.pow(plr.x - this.x, 2) / p.pow(this.w / 2, 2)) +
                     (p.pow(plr.y - this.y, 2) / p.pow(this.h / 2, 2)) <= 1;
          }
          isOffscreen() { return this.x + this.w < 0; }
      }

      const updateMenuLayout = () => {
        menuButton.x=p.width-buttonWidth-buttonMargin;menuButton.y=progressBarY+progressBarHeight+buttonMargin;
        menuButton.w=buttonWidth;menuButton.h=buttonHeight;menuButton.text="Menu";
        pauseButton.w=buttonWidth;pauseButton.h=buttonHeight;restartCurrentLevelButton.w=buttonWidth;restartCurrentLevelButton.h=buttonHeight;
        mainPageButton.w=buttonWidth;mainPageButton.h=buttonHeight;
      };

      const updateMainPageLayout = () => {
        mainPageUI.startButton.w = p.min(300, p.max(220, p.width * 0.25));
        mainPageUI.startButton.h = 60;
        mainPageUI.startButton.x = p.width/2 - mainPageUI.startButton.w/2;
        mainPageUI.startButton.y = p.height*0.58;
      };

      const initializeGame = (levelNum: number,transitionData=null) => {
        currentLevel=levelNum;
        let paramsForInit=LEVEL_PARAMS[currentLevel];
        if(!paramsForInit){currentLevel=1;paramsForInit=LEVEL_PARAMS[1];}

        currentSkyColor=p.color(paramsForInit.skyColor[0],paramsForInit.skyColor[1],paramsForInit.skyColor[2]);
        minGameSpeed=paramsForInit.minSpeed;maxGameSpeed=paramsForInit.maxSpeed;speedIncreaseRate=paramsForInit.speedRate;gameSpeed=minGameSpeed;
        currentGravity = paramsForInit.levelType === 'cave' ? paramsForInit.gravity : paramsForInit.levelGravity;
        currentJumpForce = paramsForInit.levelType === 'cave' ? paramsForInit.jumpForce : paramsForInit.levelJumpForce;

        // Reset one-shot rainbow status
        rainbowFX.active = false;

        if (currentLevel === 2) {
          // Check the new global flag for a "storm death" restart bonus
          if (shouldShowStormRainbowFX) {
            rainbowFX.active = true;
            rainbowFX.startedAt = p.millis();
            // Consume the bonus effect
            shouldShowStormRainbowFX = false;
            // Set peaceful sky color if storm rainbow is active (overrides random weather)
            currentSkyColor = p.color(90, 170, 250);
            isRainingInLevel2 = false;
            isThunderstormInLevel2 = false;
          } else {
            // Determine random weather conditions for Level 2
            isThunderstormInLevel2 = p.random() < 0.05; // 1 in 20 chance for a thunderstorm
            isRainingInLevel2 = isThunderstormInLevel2 || p.random() < 0.1; // Rain can happen alone or with a storm

            if (isThunderstormInLevel2) {
              currentSkyColor = p.color(80, 88, 102); // Darker sky for thunderstorm
            } else if (isRainingInLevel2) {
              currentSkyColor = p.color(115, 128, 140); // Standard rainy sky
            }

            // Start one-shot rainbow immediately after regular random weather "comes on"
            if (isRainingInLevel2 || isThunderstormInLevel2) {
              rainbowFX.active = true;
              rainbowFX.startedAt = p.millis();
            }
          }

          originalL2JumpForce = paramsForInit.levelJumpForce;
          isFirstJumpL2 = true;
        } else {
          isRainingInLevel2 = false;
          isThunderstormInLevel2 = false;
          isFirstJumpL2 = false;
          // Ensure the bonus flag is only relevant for Level 2
          shouldShowStormRainbowFX = false;
        }

        player={x:150,y:0,vy:0,isFallingOver:false,rotation:0,fallRotationDir:1,fallRotationSpeed:0.08,maxFallRotation:p.PI/2,onPlatform:null, alpha: 255};

        // Reset all level objects
        trees=[]; backgroundAestheticClouds=[]; platformClouds=[]; obstacles=[];
        levelEndObjective=null; cave=null; endPortal=null;
        levelTimeUp=false; caveMissed=false; caveMissedTime=0; blackHole=null;
        treesSpawnedTotal=0; platformCloudsSpawnedTotal=0;

        if(paramsForInit.levelType==='ground'){
          groundLevel=p.height-50;
          player.y=groundLevel-(stickFigure.bodyLength/2+stickFigure.legLength);
          for(let i=0;i<5;i++)backgroundAestheticClouds.push(new BackgroundAestheticCloud(p.random(p.width),p.random(50,p.height/2-50),p.random(0.5,1.5)));
          nextPossibleSpawnFrame=p.frameCount+60;
        } else if(paramsForInit.levelType==='sky'){
          groundLevel=p.height*2;
          const firstCloudBaseY=p.height*paramsForInit.cloudYPositionFactor;
          const firstCloudActualW = PLAYER_ACTUAL_HEIGHT * 11;

          if(transitionData && (transitionData as any).playerStartPos && (transitionData as any).firstCloudData){
            player.x=(transitionData as any).playerStartPos.x;player.y=(transitionData as any).playerStartPos.y;
            const tcData=(transitionData as any).firstCloudData;
            const firstPlatform=new PlatformCloud(tcData.x,tcData.y, firstCloudActualW, paramsForInit.cloudVisualHeight, 'normal');
            platformClouds.push(firstPlatform);player.onPlatform=firstPlatform;platformCloudsSpawnedTotal=1;
          } else{
            player.x=100;
            const firstPlatform=new PlatformCloud(player.x+20,firstCloudBaseY,firstCloudActualW,paramsForInit.cloudVisualHeight, 'normal');
            platformClouds.push(firstPlatform);player.y=firstPlatform.y-(stickFigure.bodyLength/2+stickFigure.legLength);
            player.onPlatform=firstPlatform;platformCloudsSpawnedTotal=1;
          }
        } else if (paramsForInit.levelType === 'cave') {
          groundLevel = p.height - paramsForInit.caveFloorHeight;
          ceilingLevel = paramsForInit.caveCeilingHeight;
          player.y = groundLevel - (PLAYER_ACTUAL_HEIGHT - stickFigure.legLength) - stickFigure.bodyLength / 2;
          nextPossibleSpawnFrame = p.frameCount + 120;
        }

        score=0;gameState='playing';isPaused=false;isMenuOpen=false;transitionAnimation.active=false; portalAnimation.active = false;
        levelStartTime=p.millis();totalPausedTime=0;timeOfPause=0;
        if(restartCurrentLevelButton)restartCurrentLevelButton.defaultText="Restart Level "+currentLevel;
        p.loop();
      };

      const drawStickFigure = (x: number, y: number, strokeColor = p.color(0)) => {
        p.push();p.translate(x,y);
        if(player.isFallingOver&&gameState==='gameOver'){
          if(p.abs(player.rotation)<player.maxFallRotation)player.rotation+=player.fallRotationSpeed*player.fallRotationDir;
          else player.rotation=player.maxFallRotation*player.fallRotationDir;
          const pivotOffsetY=stickFigure.bodyLength*0.4;p.translate(0,pivotOffsetY);p.rotate(player.rotation);p.translate(0,-pivotOffsetY);
        }
        p.stroke(strokeColor);p.strokeWeight(4);p.noFill();
        p.ellipse(0,-stickFigure.bodyLength/2-stickFigure.headSize/2,stickFigure.headSize,stickFigure.headSize);
        p.line(0,-stickFigure.bodyLength/2,0,stickFigure.bodyLength/2);
        const shoulderY=-stickFigure.bodyLength/2+5;const hipY=stickFigure.bodyLength/2;
        p.line(0,shoulderY,-stickFigure.armLength*p.cos(stickFigure.armAngle),shoulderY+stickFigure.armLength*p.sin(stickFigure.armAngle));
        p.line(0,shoulderY,stickFigure.armLength*p.cos(stickFigure.armAngle),shoulderY-stickFigure.armLength*p.sin(stickFigure.armAngle));
        p.line(0,hipY,-stickFigure.legSpread-stickFigure.legLength*p.cos(stickFigure.legAngle+p.PI/4),hipY+stickFigure.legLength*p.sin(stickFigure.legAngle+p.PI/4));
        p.line(0,hipY,stickFigure.legSpread+stickFigure.legLength*p.cos(stickFigure.legAngle+p.PI/4),hipY+stickFigure.legLength*p.sin(stickFigure.legAngle+p.PI/4));
        p.pop();
      };

      const spawnTree = () => {
        treesSpawnedTotal++;let treeTyp='standing';if(treesSpawnedTotal>3&&p.random()<0.15)treeTyp='fallen';
        const pL1Tree=LEVEL_PARAMS[1];
        const minSF=(0.7*PLAYER_ACTUAL_HEIGHT)/100.0;const maxSF=PLAYER_ACTUAL_HEIGHT/100.0;const absMinSF=0.3;
        let lowRB=p.max(minSF,absMinSF);lowRB=p.min(lowRB,maxSF);const upRB=maxSF;
        const treeNewSF=(lowRB>=upRB)?upRB:p.random(lowRB,upRB);
        trees.push(new Tree(p.width+50,treeNewSF,treeTyp));
        const spawnF=pL1Tree.treeSpawnRandomFactor;let framesWait=p.ceil(actualMinTreeHorizontalSpacing/gameSpeed);
        framesWait=p.max(framesWait,20);const randDelay=p.int(p.random(spawnF.min,spawnF.max));
        nextPossibleSpawnFrame=p.frameCount+framesWait+randDelay;
      };

      const spawnPlatformCloud = (seedFirst = false) => {
        const paramsL2Cloud = LEVEL_PARAMS[2];
        const cloudPlatformY = p.height * paramsL2Cloud.cloudYPositionFactor;

        // Width similar to original feel
        const newCloudW = p.random(3, 8) * PLAYER_ACTUAL_HEIGHT;

        let newCloudX;
        if (platformClouds.length === 0 || seedFirst) {
          newCloudX = p.width + L2_FIRST_OFFSET + newCloudW / 2;
        } else {
          const last = platformClouds[platformClouds.length - 1];
          const lastRight = last.x + last.w / 2;
          // MODIFICATION: Set fixed gap to 2 times the player's height
          const fixedGap = PLAYER_ACTUAL_HEIGHT * 2;
          newCloudX = lastRight + fixedGap + (newCloudW / 2);
        }

        // Weather/Type selection
        let cloudType;
        if (isRainingInLevel2) {
          cloudType = (p.random() < 0.2) ? 'black' : 'gray';
        } else {
          cloudType = 'normal';
          if (platformCloudsSpawnedTotal > 2) {
            const r = p.random();
            if (r < 1 / 1000) cloudType = 'dream';
            else if (r < 1 / 1000 + 1 / 40) cloudType = 'black';
            else if (r < 1 / 1000 + 1 / 40 + 1 / 15) cloudType = 'gray';
          }
        }
        platformClouds.push(new PlatformCloud(newCloudX, cloudPlatformY, newCloudW, paramsL2Cloud.cloudVisualHeight, cloudType));
        platformCloudsSpawnedTotal++;
      };

      const spawnPointyRock = () => {
        const params = LEVEL_PARAMS[3];
        const rockSize = p.random(PLAYER_ACTUAL_HEIGHT * 0.4, PLAYER_ACTUAL_HEIGHT * 1.0);
        const fromCeiling = p.random() < 0.45;
        const rockY = fromCeiling ? ceilingLevel : groundLevel;
        obstacles.push(new PointyRock(p.width + rockSize, rockY, rockSize, fromCeiling));

        const spawnFactors = params.obstacleSpawnRandomFactor;
        const minSpacing = PLAYER_ACTUAL_HEIGHT * 2.5;
        const framesToWait = p.ceil(minSpacing / gameSpeed) + p.int(p.random(spawnFactors.min, spawnFactors.max));
        nextPossibleSpawnFrame = p.frameCount + framesToWait;
      };

      const drawRainbow = (alpha = 150) => {
        const rainbowColors = [
          p.color(255, 0, 0, alpha),
          p.color(255, 165, 0, alpha),
          p.color(255, 255, 0, alpha),
          p.color(0, 128, 0, alpha),
          p.color(0, 0, 255, alpha),
          p.color(75, 0, 130, alpha),
          p.color(238, 130, 238, alpha)
        ];
        const rainbowCenterX = p.width / 2;
        const rainbowCenterY = p.height;
        const rainbowRadius = p.width * 0.8;
        const bandThickness = 15;

        p.noFill();
        p.strokeWeight(bandThickness);

        for (let i = 0; i < rainbowColors.length; i++) {
          p.stroke(rainbowColors[i]);
          p.arc(
            rainbowCenterX,
            rainbowCenterY,
            rainbowRadius - i * bandThickness,
            rainbowRadius - i * bandThickness,
            p.PI,
            p.TWO_PI
          );
        }
      };

      const drawRainbowOnce = () => {
        const elapsed = p.millis() - rainbowFX.startedAt;
        const t = p.constrain(elapsed / rainbowFX.durationMs, 0, 1);
        const alpha = p.lerp(180, 0, t);
        drawRainbow(alpha);
        if (elapsed >= rainbowFX.durationMs) {
          rainbowFX.active = false; // only once per Level 2 run
        }
      };

      const drawMainPage = () => {
        p.background(135, 206, 250);
        // Some gentle background clouds
        if (backgroundAestheticClouds.length < 6) {
          backgroundAestheticClouds.push(new BackgroundAestheticCloud(p.random(p.width), p.random(60, p.height*0.5), p.random(0.6, 1.6)));
        }
        for (let i = backgroundAestheticClouds.length - 1; i >= 0; i--) {
          backgroundAestheticClouds[i].update();
          backgroundAestheticClouds[i].draw();
          if (backgroundAestheticClouds[i].isOffscreen()) {
            backgroundAestheticClouds.splice(i,1);
          }
        }

        // Title
        p.fill(0); p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);

        // Game Name
        p.textSize(p.min(80, p.width * 0.08));
        p.text("Stick Figure Adventure", p.width/2, p.height*0.28);

        // Subtitle (small makers credit at the bottom)
        p.textSize(14);
        p.fill(0, 0, 0, 180);
        p.text("by Vincenzo and Nelson", p.width/2, p.height - 20);

        // Start button
        const b = mainPageUI.startButton;
        p.fill(255,255,255,230);
        if (p.mouseX > b.x && p.mouseX < b.x+b.w && p.mouseY > b.y && p.mouseY < b.y+b.h) p.fill(240,240,240,230);
        p.stroke(40); p.strokeWeight(1); p.rect(b.x, b.y, b.w, b.h, 10);
        p.fill(0); p.noStroke(); p.textSize(24);
        p.text(b.text, b.x + b.w/2, b.y + b.h/2);
      };

      const drawProgressBarAndScore = () => {
          if (gameState !== 'playing') return;
          const LParamsProg=LEVEL_PARAMS[currentLevel];
          let progress=0;
          let pBarColor = p.color(100, 255, 100, 200);

          if(LParamsProg.progressBarType==='time'){
            const timeVal=p.millis();const elapTime=timeVal-levelStartTime-totalPausedTime;
            progress=p.constrain(elapTime/LParamsProg.duration,0,1);
            if (LParamsProg.levelType === 'cave') pBarColor = p.color(220, 220, 180, 200);
          }else if(LParamsProg.progressBarType==='count'){
            const countVal=platformCloudsSpawnedTotal;const goalVal=LParamsProg[LParamsProg.countGoalKey];
            progress=p.constrain(countVal/(goalVal+1),0,1);pBarColor=p.color(100,200,255,200);
          }

          p.fill(50,50,50,100);p.noStroke();p.rect(0,progressBarY,p.width,progressBarHeight);
          p.fill(pBarColor);p.rect(0,progressBarY,p.width*progress,progressBarHeight);

          const textColor = (LParamsProg.levelType === 'cave') ? p.color(255) : p.color(0);
          p.fill(textColor);p.textSize(26);p.textAlign(p.LEFT,p.TOP);
          const scoreLY=progressBarY+progressBarHeight+buttonMargin;
          p.text("Level: "+currentLevel,buttonMargin,scoreLY);p.text("Score: "+score,buttonMargin,scoreLY+30);
      };

      const drawMenu = () => {
        // Show the menu button even on main menu? We'll keep it only during gameplay UI.
        if (gameState !== 'playing') return;

        const menuTxtCol=p.color(0);const menuBgCol=p.color(220,220,220,240);
        const itemHoverCol=p.color(200,200,200,240);const dropBgCol=p.color(230,230,230,235);
        p.fill(menuBgCol);
        if(p.mouseX>menuButton.x && p.mouseX<menuButton.x+menuButton.w && p.mouseY>menuButton.y && p.mouseY<menuButton.y+menuButton.h)p.fill(itemHoverCol);
        p.stroke(0);p.strokeWeight(1);p.rect(menuButton.x,menuButton.y,menuButton.w,menuButton.h,5);
        p.fill(menuTxtCol);p.noStroke();p.textSize(18);p.textAlign(p.CENTER,p.CENTER);
        p.text(menuButton.text,menuButton.x+menuButton.w/2,menuButton.y+menuButton.h/2);
        playLevelButtons=[];
        if(isMenuOpen){
          let curItemY=menuButton.y+menuButton.h+itemMargin;const itemsX=menuButton.x;const menuItemsToDisp=[];

          // Pause/Resume
          const pauseText = isPaused ? "Resume" : "Pause";
          pauseButton.x=itemsX;menuItemsToDisp.push({displayObj:pauseButton,text: pauseText,actionType:"pause"});

          // Restart Current Level
          restartCurrentLevelButton.x=itemsX;restartCurrentLevelButton.text="Restart Level "+currentLevel;
          menuItemsToDisp.push({displayObj:restartCurrentLevelButton,text:restartCurrentLevelButton.text,actionType:"restartCurrent"});

          // Main Page option
          mainPageButton.x=itemsX;mainPageButton.text="Main Page";
          menuItemsToDisp.push({displayObj:mainPageButton,text:mainPageButton.text,actionType:"mainPage"});

          // Play Level Buttons for unlocked levels
          for(let i=1;i<=maxDefinedLevel;i++){
            if(unlockedLevels[i]){
              const btnDat={x:itemsX,y:0,w:buttonWidth,h:buttonHeight,text:"Play Level "+i,levelNum:i,actionType:"playLevel"};
              playLevelButtons.push(btnDat);menuItemsToDisp.push({displayObj:btnDat,text:btnDat.text,actionType:"playLevel",levelNum:i});
            }
          }

          const dropContentH=(menuItemsToDisp.length*(buttonHeight+itemMargin))-itemMargin;
          p.fill(dropBgCol);p.stroke(50);p.strokeWeight(1);p.rect(itemsX,menuButton.y+menuButton.h,buttonWidth,dropContentH+itemMargin,0,0,5,5);
          curItemY=menuButton.y+menuButton.h+itemMargin;

          for(const item of menuItemsToDisp){
            item.displayObj.y=curItemY;item.displayObj.x=itemsX;p.fill(menuBgCol);
            if(p.mouseX>item.displayObj.x && p.mouseX<item.displayObj.x+item.displayObj.w && p.mouseY>item.displayObj.y && p.mouseY<item.displayObj.y+item.displayObj.h)p.fill(itemHoverCol);
            p.stroke(80);p.strokeWeight(0.5);p.rect(item.displayObj.x,item.displayObj.y,item.displayObj.w,item.displayObj.h);
            p.fill(menuTxtCol);p.noStroke();p.textSize(16);p.textAlign(p.CENTER,p.CENTER);
            p.text(item.text,item.displayObj.x+item.displayObj.w/2,item.displayObj.y+item.displayObj.h/2);curItemY+=buttonHeight+itemMargin;
          }
        }
      };

      const drawPausedScreen = () => {p.fill(0,0,0,150);p.rect(0,0,p.width,p.height);p.fill(255);p.textSize(48);p.textAlign(p.CENTER,p.CENTER);p.text("PAUSED",p.width/2,p.height/2);};
      const drawGameOverScreen = () => {
          // NEW LOGIC: Check for stormy death in L2 and set the rainbow flag
          if (currentLevel === 2 && (isRainingInLevel2 || isThunderstormInLevel2)) {
              shouldShowStormRainbowFX = true;
          }

          p.fill(0,0,0,180);p.rect(0,0,p.width,p.height);p.fill(255,60,60);p.textSize(56);p.textAlign(p.CENTER,p.CENTER);
          p.text("GAME OVER",p.width/2,p.height/2-60);p.fill(255);p.textSize(32);p.text("Level "+currentLevel+" Score: "+score,p.width/2,p.height/2);
          gameOverRestartButton.w=200;gameOverRestartButton.h=40;gameOverRestartButton.x=p.width/2-gameOverRestartButton.w/2;
          gameOverRestartButton.y=p.height/2+60;gameOverRestartButton.text="Restart (Lvl "+currentLevel+")";
          p.fill(220,220,220,230);
          if(p.mouseX>gameOverRestartButton.x && p.mouseX<gameOverRestartButton.x+gameOverRestartButton.w && p.mouseY>gameOverRestartButton.y && p.mouseY<gameOverRestartButton.y+gameOverRestartButton.h)p.fill(200,200,200,230);
          p.stroke(0);p.strokeWeight(1);p.rect(gameOverRestartButton.x,gameOverRestartButton.y,gameOverRestartButton.w,gameOverRestartButton.h,5);
          p.fill(0);p.noStroke();p.textSize(20);p.textAlign(p.CENTER,p.CENTER);
          p.text(gameOverRestartButton.text,gameOverRestartButton.x+gameOverRestartButton.w/2,gameOverRestartButton.y+gameOverRestartButton.h/2);
          p.textSize(24);p.text("or Press 'R'",p.width/2,p.height/2+115);
      };
      const drawLevelCompleteScreen = () => {
        p.fill(0,0,0,180);p.rect(0,0,p.width,p.height);p.fill(0,255,0);p.textSize(56);p.textAlign(p.CENTER,p.CENTER);
        p.text("Level "+currentLevel+" Complete!",p.width/2,p.height/2-60);p.fill(255);p.textSize(32);p.text("Score: "+score,p.width/2,p.height/2);
        if(LEVEL_PARAMS[currentLevel+1])p.textSize(24).text("Press 'N' for Next Level ("+(currentLevel+1)+")",p.width/2,p.height/2+50);
        p.textSize(20).text("Press 'R' to Restart Game (L1)",p.width/2,p.height/2+90);
      };
      const drawAllLevelsCompleteScreen = () => {
        p.fill(0,0,0,180);p.rect(0,0,p.width,p.height);p.fill(0,255,255);p.textSize(56);p.textAlign(p.CENTER,p.CENTER);
        p.text("Congratulations!",p.width/2,p.height/2-60);p.fill(255);p.textSize(40);
        p.text("You've Completed All Levels!",p.width/2,p.height/2-10);
        p.textSize(32).text("Final Score: "+score,p.width/2,p.height/2+40);
        p.textSize(24).text("Press 'R' to Play Again (from Level 1)",p.width/2,p.height/2+90);
      };
      const drawBlackHole = () => {
        if(!blackHole||!blackHole.active)return;p.push();
        const auraSz=blackHole.size*1.2+p.sin(p.frameCount*0.1)*(blackHole.size*0.05);
        p.fill(20,0,30,100+p.sin(p.frameCount*0.1)*40);p.noStroke();p.ellipse(blackHole.x,blackHole.y,auraSz,auraSz);
        p.fill(0,0,5,250);p.ellipse(blackHole.x,blackHole.y,blackHole.size,blackHole.size);
        for(let i=0;i<10;i++){
          const ang=p.random(p.TWO_PI)+p.frameCount*0.02/(i+1);const distC=p.random(blackHole.size*0.1,blackHole.size*0.45);
          const sX=blackHole.x+p.cos(ang)*distC;const sY=blackHole.y+p.sin(ang)*distC;
          p.fill(255,255,p.random(150,255),p.random(100,200));p.ellipse(sX,sY,p.random(1,4),p.random(1,4));
        }p.pop();
      };

      const runPortalAnimation = () => {
        portalAnimation.progress++;
        const t = portalAnimation.progress / portalAnimation.duration;

        player.x = p.lerp(portalAnimation.playerStartPos.x, levelEndObjective.x, t);
        player.y = p.lerp(portalAnimation.playerStartPos.y, levelEndObjective.y, t);
        player.alpha = p.lerp(255, 0, t);

        p.push();
        p.tint(255, player.alpha);
        drawStickFigure(player.x, player.y, p.color(240));
        p.pop();

        if(portalAnimation.progress >= portalAnimation.duration) {
            portalAnimation.active = false;
            if (currentLevel === maxDefinedLevel) { gameState = 'allLevelsComplete'; }
        }
      };

      const prepareTransitionToLevel2 = () => {
        gameState='transitioning';const tAn=transitionAnimation;tAn.active=true;tAn.phase=1;tAn.timer=0;
        tAn.skyColorL1=p.color(LEVEL_PARAMS[1].skyColor);tAn.skyColorL2=p.color(LEVEL_PARAMS[2].skyColor);

        if (tAn.triggeredByBlackHole) {
          tAn.playerStartCaveX = player.x;
          tAn.playerGroundY = player.y;
          tAn.playerTargetExitX = player.x;
          tAn.caveSnapshot = null;
        } else {
          tAn.playerStartCaveX=player.x;tAn.playerGroundY=player.y;tAn.playerTargetExitX=player.x+stickFigure.headSize*1.5;
          if(levelEndObjective&&levelEndObjective instanceof Cave){
            tAn.caveSnapshot={x:levelEndObjective.x,width:levelEndObjective.width,visualHeight:levelEndObjective.visualHeight,
                              openingWidth:levelEndObjective.openingWidth,openingHeight:levelEndObjective.openingHeight,
                              color:levelEndObjective.color,};
            player.x=tAn.caveSnapshot.x-tAn.caveSnapshot.openingWidth*0.3;
            player.y=tAn.playerGroundY;
          }else{console.error("Cave obj missing for cave transition.");initializeGame(2);return;}
        }

        tAn.groundOriginalY=groundLevel;tAn.groundTargetY=p.height+200;tAn.playerAscendY=p.height*0.25;
        const l2Par=LEVEL_PARAMS[2];const firstCloudSYL2=p.height*l2Par.cloudYPositionFactor;
        tAn.playerFinalL2Y=firstCloudSYL2-(stickFigure.bodyLength/2+stickFigure.legLength);

        trees=[];backgroundAestheticClouds=[];blackHole=null;
        levelEndObjective = null; cave = null;
      };

      const drawAnimatedCaveSnapshot = (caveDat: any,curGrndLY: number) => {
        if (!caveDat) return;
        p.fill(caveDat.color);p.noStroke();p.beginShape();
        p.vertex(caveDat.x-caveDat.width/2,curGrndLY);p.vertex(caveDat.x-caveDat.width/2,curGrndLY-caveDat.visualHeight*0.8);
        p.vertex(caveDat.x,curGrndLY-caveDat.visualHeight);p.vertex(caveDat.x+caveDat.width/2,curGrndLY-caveDat.visualHeight*0.8);
        p.vertex(caveDat.x+caveDat.width/2,curGrndLY);p.endShape(p.CLOSE);
        p.fill(20,20,20,240);const openTopAbsY=curGrndLY-caveDat.openingHeight;
        p.rect(caveDat.x-caveDat.openingWidth/2,openTopAbsY+caveDat.openingWidth/4,caveDat.openingWidth,caveDat.openingHeight-caveDat.openingWidth/4);
        p.arc(caveDat.x,openTopAbsY+caveDat.openingWidth/4,caveDat.openingWidth,caveDat.openingWidth/2,p.PI,0,p.CHORD);
      };

      const drawTransitionAnimation = () => {
        const tAn=transitionAnimation;tAn.timer++;const overallProg=p.constrain(tAn.timer/tAn.duration,0,1);
        let curSky=tAn.skyColorL1;let curGrndY=tAn.groundOriginalY;
        if(overallProg<0.25){
          const phaseProg=overallProg/0.25;curSky=tAn.skyColorL1;p.background(curSky);
          if (!tAn.triggeredByBlackHole) player.x=p.lerp(tAn.playerStartCaveX,tAn.playerTargetExitX,phaseProg);
          player.y=tAn.playerGroundY;
          curGrndY=p.lerp(tAn.groundOriginalY,tAn.groundOriginalY+50,phaseProg);
          p.fill(LEVEL_PARAMS[1].groundColor);p.rect(0,curGrndY,p.width,p.height-curGrndY+10);
          if(tAn.caveSnapshot)drawAnimatedCaveSnapshot(tAn.caveSnapshot,curGrndY);
          drawStickFigure(player.x,player.y);
        }else if(overallProg<0.70){
          const phaseProg=(overallProg-0.25)/(0.70-0.25);curSky=p.lerpColor(tAn.skyColorL1,tAn.skyColorL2,phaseProg);p.background(curSky);
          player.x=tAn.playerTargetExitX;player.y=p.lerp(tAn.playerGroundY,tAn.playerAscendY,phaseProg);
          curGrndY=p.lerp(tAn.groundOriginalY+50,tAn.groundTargetY,phaseProg);
          if(curGrndY<p.height+(tAn.caveSnapshot?tAn.caveSnapshot.visualHeight:(tAn.triggeredByBlackHole?0:100))){
            p.fill(LEVEL_PARAMS[1].groundColor);p.rect(0,curGrndY,p.width,p.height-curGrndY+10);
            if(tAn.caveSnapshot)drawAnimatedCaveSnapshot(tAn.caveSnapshot,curGrndY);
          }
          if(!tAn.firstL2Cloud){
            const l2Par=LEVEL_PARAMS[2];const cloudSY=p.height*l2Par.cloudYPositionFactor;
            const firstAnimatedCloudWidth = PLAYER_ACTUAL_HEIGHT * 11;
            tAn.firstL2Cloud={x:player.x,y:p.height+l2Par.cloudVisualHeight*2,targetY:cloudSY,
                              w: firstAnimatedCloudWidth, h:l2Par.cloudVisualHeight,
                              color:p.color(240,240,250,245),bottomColor:p.color(210,210,230,220),
                              drawSelf:function(){p.push();p.noStroke();p.fill(this.color);p.rect(this.x-this.w/2,this.y,this.w,this.h,8);
                                                  const fluff=this.h*2;const fluffYOff=this.h*0.6;p.fill(this.bottomColor);
                                                  p.ellipse(this.x,this.y+fluffYOff,this.w*1.15,fluff);p.pop();}};
          }
          tAn.firstL2Cloud.y=p.lerp(p.height+tAn.firstL2Cloud.h*2,tAn.firstL2Cloud.targetY,phaseProg*1.2);
          if(tAn.firstL2Cloud.y<p.height+tAn.firstL2Cloud.h)tAn.firstL2Cloud.drawSelf();
          drawStickFigure(player.x,player.y);
        }else{
          const phaseProg=(overallProg-0.70)/(1.0-0.70);curSky=tAn.skyColorL2;p.background(curSky);
          player.x=tAn.playerTargetExitX;player.y=p.lerp(tAn.playerAscendY,tAn.playerFinalL2Y,phaseProg);
          if(tAn.firstL2Cloud){tAn.firstL2Cloud.y=tAn.firstL2Cloud.targetY;tAn.firstL2Cloud.drawSelf();}
          drawStickFigure(player.x,player.y);
        }
        if(overallProg>=1){
          tAn.active=false;unlockedLevels[2]=true;
          initializeGame(2,{playerStartPos:{x:player.x,y:player.y},
                            firstCloudData:{x:tAn.firstL2Cloud.x,y:tAn.firstL2Cloud.y,
                                            w:tAn.firstL2Cloud.w,h:tAn.firstL2Cloud.h}} as any);
          isPaused=false; tAn.triggeredByBlackHole = false;
        }
      };

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        PLAYER_ACTUAL_HEIGHT=stickFigure.headSize+stickFigure.bodyLength+stickFigure.legLength;
        maxDefinedLevel=Object.keys(LEVEL_PARAMS).length;
        STICKFIGURE_EFFECTIVE_WIDTH_FOR_SPACING=stickFigure.headSize*1.5;
        actualMinTreeHorizontalSpacing=MIN_TREE_SPACING_MULTIPLIER*STICKFIGURE_EFFECTIVE_WIDTH_FOR_SPACING;
        updateMenuLayout();
        updateMainPageLayout();
        // Start on main page
        currentSkyColor = p.color(LEVEL_PARAMS[1].skyColor[0], LEVEL_PARAMS[1].skyColor[1], LEVEL_PARAMS[1].skyColor[2]);
      };

      p.draw = () => {
        if (gameState === 'mainMenu') { drawMainPage(); return; }
        if(gameState==='transitioning'&&transitionAnimation.active){drawTransitionAnimation();return;}

        const LParams=LEVEL_PARAMS[currentLevel];
        p.background(currentSkyColor);

        // One-shot rainbow: appears once after weather, fades out, then gone
        if (rainbowFX.active) {
          drawRainbowOnce();
        }

        // Thunderstorm flash effect if active
        if (isThunderstormInLevel2 && p.frameCount % 120 > 115 && p.random() > 0.5) {
            p.fill(200, 200, 255, 150);
            p.rect(0, 0, p.width, p.height);
        }

        // Draw scenery based on level type
        if(LParams.levelType==='ground'){
          for(let i=backgroundAestheticClouds.length-1;i>=0;i--){
            backgroundAestheticClouds[i].update();backgroundAestheticClouds[i].draw();
            if(backgroundAestheticClouds[i].isOffscreen()){backgroundAestheticClouds.splice(i,1);backgroundAestheticClouds.push(new BackgroundAestheticCloud(p.width+p.random(50,200),p.random(50,p.height/2-50),p.random(0.5,1.5)));}
          }
          p.fill(LParams.groundColor);p.noStroke();p.rect(0,groundLevel,p.width,p.height-groundLevel);
        } else if (LParams.levelType === 'cave') {
          p.noStroke(); p.fill(LParams.groundColor);
          p.rect(0, 0, p.width, ceilingLevel); // Ceiling
          p.rect(0, groundLevel, p.width, p.height - groundLevel); // Floor
        }

        if(gameState==='playing'){
          if(!isPaused){
            // --- Player Physics Update ---
            player.vy+=currentGravity; player.y+=player.vy;

            if(LParams.levelType==='ground'){
              const pFeetY=player.y+stickFigure.bodyLength/2+stickFigure.legLength;
              if(pFeetY>groundLevel){player.y=groundLevel-(stickFigure.bodyLength/2+stickFigure.legLength);player.vy=0;}
            } else if(LParams.levelType==='sky'){
              player.onPlatform=null;
              for(const pc of platformClouds)if(pc.isPlayerOn(player)){player.y=pc.y-(stickFigure.bodyLength/2+stickFigure.legLength);player.vy=0;player.onPlatform=pc;break;}
              if(!player.onPlatform&&player.y>p.height+PLAYER_ACTUAL_HEIGHT)gameState='gameOver';
            } else if (LParams.levelType === 'cave') {
              const playerFeetY = player.y + stickFigure.bodyLength / 2 + stickFigure.legLength;
              if (playerFeetY > groundLevel) {
                  player.y = groundLevel - (stickFigure.bodyLength / 2 + stickFigure.legLength);
                  player.vy = 0;
              }
              const playerHeadY = player.y - stickFigure.bodyLength / 2 - stickFigure.headSize / 2;
              if (playerHeadY < ceilingLevel) {
                  player.y = ceilingLevel + stickFigure.bodyLength / 2 + stickFigure.headSize / 2;
                  player.vy = 0;
              }
            }

            stickFigure.armAngle=p.sin(p.frameCount*stickFigure.animationSpeed)*(p.PI/4);stickFigure.legAngle=p.cos(p.frameCount*stickFigure.animationSpeed)*(p.PI/6);

            // --- Level-specific game logic ---
            const elapsedTime = p.millis() - levelStartTime - totalPausedTime;
            if (!levelTimeUp && elapsedTime >= LParams.duration) {
                levelTimeUp = true;
            }

            if(LParams.levelType==='ground'){
              if(levelTimeUp && LParams.endsInCave && !levelEndObjective && !caveMissed) {
                  levelEndObjective = new Cave(); cave = levelEndObjective;
              }
              if(!levelTimeUp && p.frameCount >= nextPossibleSpawnFrame) spawnTree();

              for(let i=trees.length-1;i>=0;i--){
                trees[i].update();
                if(trees[i].collidesWith(player)){gameState='gameOver';if(!player.isFallingOver){player.isFallingOver=true;player.rotation=0;player.fallRotationDir=(p.random()>0.4)?1:-1;player.vy=0;}}
                if(trees[i].isOffscreen()){trees.splice(i,1);score++;}
              }

              if(levelEndObjective&&levelEndObjective instanceof Cave){
                if(levelEndObjective.collidesWith(player)){player.x=levelEndObjective.x;gameState='levelComplete'; transitionAnimation.triggeredByBlackHole = false;}
                else if(levelEndObjective.isOffscreen()&&gameState==='playing'){if(!caveMissed){caveMissed=true;caveMissedTime=p.millis();}levelEndObjective=null;cave=null;}
              }

              if(caveMissed&&!blackHole&&gameState==='playing' && p.millis()-caveMissedTime>blackHoleAppearDelay){
                  const bhSz=3*PLAYER_ACTUAL_HEIGHT;const bhY=groundLevel-bhSz/2;blackHole={x:p.width+bhSz/2,y:bhY,size:bhSz,active:true};
              }
              if(blackHole&&blackHole.active&&gameState==='playing'){
                blackHole.x-=gameSpeed;const d=p.dist(player.x,player.y,blackHole.x,blackHole.y);
                if(d<blackHole.size/2+p.max(stickFigure.headSize,stickFigure.bodyLength)/2){
                    gameState='levelComplete'; unlockedLevels[2]=true;
                    transitionAnimation.triggeredByBlackHole = true;
                    blackHole.active=false; caveMissed=false; levelEndObjective=null; cave=null;
                }
                if(blackHole.x<-blackHole.size/2)blackHole.active=false;
              }
            } else if(LParams.levelType==='sky'){
              const portalDue=platformCloudsSpawnedTotal>=LParams.platformCloudCountForPortal;

              // --- Fixed-spacing spawn trigger (screen-independent) ---
              if (!levelEndObjective) {
                if (platformClouds.length === 0) {
                  // Seed a first off-screen cloud at a predictable offset
                  spawnPlatformCloud(true);
                } else {
                  const last = platformClouds[platformClouds.length - 1];
                  const lastRightEdge = last.x + last.w / 2;
                  if (lastRightEdge < p.width + L2_SPAWN_AHEAD) {
                    if (!portalDue) {
                      spawnPlatformCloud(false);
                    } else {
                      const portalSize=PLAYER_ACTUAL_HEIGHT*1.3;
                      let portalY=p.height*LParams.cloudYPositionFactor+LParams.cloudVisualHeight/2-portalSize/2;
                      portalY=p.constrain(portalY,portalSize/2+progressBarHeight+5,p.height-portalSize/2-5);
                      levelEndObjective=new EndPortal(p.width+portalSize+100,portalY,portalSize);endPortal=levelEndObjective;
                    }
                  }
                }
              }

              for(let i=platformClouds.length-1;i>=0;i--){
                  const pc=platformClouds[i];pc.update();
                  if(pc.isOffscreen()){platformClouds.splice(i,1);if(player.onPlatform!==pc&&!levelEndObjective)score++;}
              }
              if(levelEndObjective && levelEndObjective instanceof EndPortal){
                if(levelEndObjective.collidesWithPlayer(player)){unlockedLevels[currentLevel+1]=true;gameState='levelComplete';levelEndObjective.active=false;}
                else if(levelEndObjective.isOffscreen()){gameState='gameOver';levelEndObjective=null;endPortal=null;}
              }
            } else if (LParams.levelType === 'cave') {
              if (levelTimeUp && LParams.endsIn === 'white_portal' && !levelEndObjective) {
                  const portalHeight = p.height - ceilingLevel - LParams.caveFloorHeight;
                  levelEndObjective = new WhitePortal(p.width + 100, p.height / 2, portalHeight);
              }
              if (!levelTimeUp && p.frameCount > nextPossibleSpawnFrame) spawnPointyRock();

              for (let i = obstacles.length - 1; i >= 0; i--) {
                  obstacles[i].update();
                  if (obstacles[i].collidesWith(player)) { gameState = 'gameOver'; player.isFallingOver = true; }
                  if (obstacles[i].isOffscreen()) { if (!obstacles[i].fromCeiling) score++; obstacles.splice(i, 1); }
              }
              if (levelEndObjective && levelEndObjective instanceof WhitePortal) {
                  if (levelEndObjective.collidesWith(player)) {
                      gameState = 'levelComplete'; portalAnimation.active = true; portalAnimation.progress = 0;
                      portalAnimation.playerStartPos = p.createVector(player.x, player.y);
                  }
                  if (levelEndObjective.isOffscreen()) gameState = 'gameOver';
              }
            }

            // Universal speed update
            if(gameSpeed < LParams.maxSpeed && !levelEndObjective) gameSpeed += LParams.speedRate;
          }
        }

        // --- DRAWING LOGIC ---
        trees.forEach(t => t.draw());
        platformClouds.forEach(pc => pc.draw());
        obstacles.forEach(o => o.draw());

        // Draw player light in cave
        if (LParams.levelType === 'cave') {
            // Keep a neutral player light so colored rock glows remain readable
            const pLightColor = p.color(220, 220, 180, 30);
            p.noStroke();
            for (let r = LParams.playerLightRadius * 2; r > 0; r -= LParams.playerLightRadius / 4) {
                const alpha = p.map(r, LParams.playerLightRadius * 2, 0, 0, 25);
                const lc: any = pLightColor;
                p.fill(lc.levels[0], lc.levels[1], lc.levels[2], alpha);
                p.ellipse(player.x, player.y - PLAYER_ACTUAL_HEIGHT / 4, r, r * 0.8);
            }
        }

        if (levelEndObjective) { levelEndObjective.update(); levelEndObjective.draw(); }
        if (blackHole) drawBlackHole();

        // Draw Player or portal animation
        if (gameState === 'levelComplete' && portalAnimation.active) {
            runPortalAnimation();
        } else {
            const playerStroke = (LParams.levelType === 'cave') ? p.color(240) : p.color(0);
            if (player.alpha === 255) drawStickFigure(player.x, player.y, playerStroke);
        }

        // Draw UI and Game State Screens
        drawProgressBarAndScore();
        drawMenu();

        if (gameState === 'gameOver') {
          drawGameOverScreen();
        } else if (gameState === 'levelComplete' && !portalAnimation.active) {
          if (currentLevel === maxDefinedLevel) {
              drawAllLevelsCompleteScreen();
          } else {
              drawLevelCompleteScreen();
          }
        } else if (gameState === 'allLevelsComplete') {
          drawAllLevelsCompleteScreen();
        }

        if(isPaused && gameState === 'playing') drawPausedScreen();
      };

      p.keyPressed = () => {
        if(gameState==='playing'&&!isPaused){
          let canJmp=false;
          let jumpToApply = currentJumpForce;
          const LParams = LEVEL_PARAMS[currentLevel];

          if(LParams.levelType==='ground'){
              const plrFeetY=player.y+stickFigure.bodyLength/2+stickFigure.legLength;
              if(plrFeetY>=groundLevel-5)canJmp=true;
          } else if(LParams.levelType==='sky'){
              if(player.onPlatform)canJmp=true;
              if (canJmp && isFirstJumpL2) {
                  const targetHeight = PLAYER_ACTUAL_HEIGHT * LParams.firstJumpBoostFactor;
                  jumpToApply = -p.sqrt(2 * currentGravity * targetHeight);
              }
          } else if (LParams.levelType === 'cave') {
              const playerFeetY = player.y + stickFigure.bodyLength / 2 + stickFigure.legLength;
              if (playerFeetY >= groundLevel - 5) canJmp = true;
          }

          if((p.keyCode===p.UP_ARROW||p.key===' ')&&canJmp){
              player.vy=jumpToApply;
              if(LParams.levelType==='sky') player.onPlatform=null;
              if (isFirstJumpL2 && currentLevel === 2) isFirstJumpL2 = false;
          }
        }

        if (p.key === 'p' || p.key === 'P') {
            if(gameState === 'playing') {
              isPaused = !isPaused;
              if (isPaused) { timeOfPause = p.millis(); }
              else { totalPausedTime += p.millis() - timeOfPause; }
            }
        }

        if(gameState==='levelComplete'&&!isMenuOpen){
          if((p.key==='n'||p.key==='N')){
            if(currentLevel===1&&LEVEL_PARAMS[2])prepareTransitionToLevel2();
            else if(LEVEL_PARAMS[currentLevel+1])initializeGame(currentLevel+1);
          }else if((p.key==='r'||p.key==='R'))initializeGame(1);
        }else if((gameState==='gameOver'||gameState==='allLevelsComplete')&&!isMenuOpen){
          if((p.key==='r'||p.key==='R'))initializeGame(1);
        }
      };

      p.mousePressed = () => {
        let clickHandled=false;

        // Main page interactions
        if (gameState === 'mainMenu') {
          const b = mainPageUI.startButton;
          if (p.mouseX > b.x && p.mouseX < b.x+b.w && p.mouseY > b.y && p.mouseY < b.y+b.h) {
            initializeGame(1);
            return;
          }
        }

        // Menu button
        if(gameState==='playing' && p.mouseX>menuButton.x && p.mouseX<menuButton.x+menuButton.w && p.mouseY>menuButton.y && p.mouseY<menuButton.y+menuButton.h){
          isMenuOpen=!isMenuOpen;if(isMenuOpen&&gameState==='playing'&&!isPaused){isPaused=true;timeOfPause=p.millis();}
          clickHandled=true;
        }else if(isMenuOpen){
          clickHandled=true;let actPerf=false;
          if(p.mouseX>pauseButton.x && p.mouseX<pauseButton.x+pauseButton.w && p.mouseY>pauseButton.y && p.mouseY<pauseButton.y+pauseButton.h){
            if(gameState==='playing'){isPaused=!isPaused;if(isPaused)timeOfPause=p.millis();else totalPausedTime+=p.millis()-timeOfPause;}
            actPerf=true;
          }else if(p.mouseX>restartCurrentLevelButton.x && p.mouseX<restartCurrentLevelButton.x+restartCurrentLevelButton.w && p.mouseY>restartCurrentLevelButton.y && p.mouseY<restartCurrentLevelButton.y+restartCurrentLevelButton.h){
            initializeGame(currentLevel);actPerf=true;
          }else if(p.mouseX>mainPageButton.x && p.mouseX<mainPageButton.x+mainPageButton.w && p.mouseY>mainPageButton.y && p.mouseY<mainPageButton.y+mainPageButton.h){
            // Go to main page
            isMenuOpen=false; isPaused=false; gameState='mainMenu';
            updateMainPageLayout();
            actPerf=true;
          }else{
            for(const btn of playLevelButtons){
              if(p.mouseX>btn.x && p.mouseX<btn.x+btn.w && p.mouseY>btn.y && p.mouseY<btn.y+btn.h){initializeGame(btn.levelNum);actPerf=true;break;}
            }
          }
          if(!actPerf){
            const numDropIt=3+playLevelButtons.length; // pause + restart + mainPage + levels
            const dropTotalH=(numDropIt*(buttonHeight+itemMargin))-itemMargin+itemMargin;
            const dropTop=menuButton.y+menuButton.h;const dropBot=dropTop+dropTotalH;
            const dropL=menuButton.x;const dropR=menuButton.x+buttonWidth;
            if(!(p.mouseX>dropL && p.mouseX<dropR && p.mouseY>dropTop && p.mouseY<dropBot))isMenuOpen=false;
          }
        }else if(gameState==='gameOver'){
          let fallDone=true;if(LEVEL_PARAMS[currentLevel].levelType==='ground'&&player.isFallingOver)fallDone=p.abs(player.rotation)>=player.maxFallRotation;
          if(fallDone&&p.mouseX>gameOverRestartButton.x && p.mouseX<gameOverRestartButton.x+gameOverRestartButton.w && p.mouseY>gameOverRestartButton.y && p.mouseY<gameOverRestartButton.y+gameOverRestartButton.h){
            initializeGame(currentLevel);clickHandled=true;
          }
        }
        if(clickHandled)return;
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        if(!PLAYER_ACTUAL_HEIGHT)PLAYER_ACTUAL_HEIGHT=stickFigure.headSize+stickFigure.bodyLength+stickFigure.legLength;
        const currentParams = LEVEL_PARAMS[currentLevel];
        if(currentParams){
          if(currentParams.levelType==='ground'){
            groundLevel=p.height-50;
            if(player)player.y=p.min(player.y,groundLevel-(stickFigure.bodyLength/2+stickFigure.legLength));
          }else if(currentParams.levelType==='sky'){
            if(player)player.y=p.constrain(player.y,0,p.height-PLAYER_ACTUAL_HEIGHT);
          } else if (currentParams.levelType === 'cave') {
              groundLevel = p.height - currentParams.caveFloorHeight;
              ceilingLevel = currentParams.caveCeilingHeight;
              if(player) player.y = p.min(player.y, groundLevel - (PLAYER_ACTUAL_HEIGHT - stickFigure.legLength) - stickFigure.bodyLength/2);
          }
        }
        STICKFIGURE_EFFECTIVE_WIDTH_FOR_SPACING=stickFigure.headSize*1.5;
        actualMinTreeHorizontalSpacing=MIN_TREE_SPACING_MULTIPLIER*STICKFIGURE_EFFECTIVE_WIDTH_FOR_SPACING;
        updateMenuLayout();
        updateMainPageLayout();
      };
    };

    const myP5 = new p5(sketch, canvasRef.current);

    return () => {
      myP5.remove();
    };
  }, []);

  return <div ref={canvasRef} className="w-full h-full overflow-hidden" />;
};

export default Game;
