// Global variables
    let playerHP = document.getElementById("health")
    let enemyHP = document.getElementById("Ehealth")
    let dx
    let dz
    let distance
    let SCORE = 0
    let enemyBulletSpeed = 0.004;
    let bullets = []
    enemies2 = []
    let enemyBullets = []
    let RIGHT_LIMIT = 3.5
    let LEFT_LIMIT = -3.5
    canShoot = false
    isGameOver = true
    let playerBulletBox
    let spawnTime = 5000
    let enemyBulletBox
    let currentLevel = 1
    let enemies3 = []
    let enemies3_bullets = []
    let invertedControlls = false;
    let invertedTimerActive = false;
    let enemyRecovery = 0.0089
    const restartScreen = document.getElementById("restartScreen")
    restartScreen.style.display = "none";
    const winScreen = document.getElementById("winScreen")
    winScreen.style.display = "none";
    
    // Buttons,text etc
    const shootBtn = document.getElementById("shootBtn")
    const startBtn = document.getElementById("startBtn")
    const restartBtn = document.getElementById("restartBtn")
    const winBtn = document.getElementById("winBtn")
    const score = document.getElementById("score")
    // audio
    const explosionS = document.getElementById("explosion")
    const playerHit = document.getElementById("playerHit")
    const invertSound = document.getElementById("invertSound")
    // setting visibility
    shootBtn.style.visibility = "hidden";
    playerHP.style.visibility = "hidden";
    enemyHP.style.visibility = "hidden";
    //document.getElementById("joystick").style.display = "none";
    score.innerText = "Score : 0";
    // Adding scene
    const scene = new THREE.Scene();
    //scene.background = new THREE.Color(0x222233);
    // camera for game
    const camera = new THREE.PerspectiveCamera();
    camera.position.set(0,1,5);
    //camera.lookAt(0,0,0)
    scene.add(camera)
    // joystick
    //if(isGameOver) return;
    var joystick = nipplejs.create({
      zone: document.getElementById("joystick"),
      mode: 'static',
      position: {left: '10vh',bottom: '10vh'},
      color: 'blue'
    })
    
    joystick.on('move', function (evt, data){
      //console.log(data.direction);
      const PSPEED = 0.1; // player speed
      if(data.direction){
        const angle = data.direction.angle;
        if(angle === 'left' && player.position.x > LEFT_LIMIT  && !invertedControlls){
          player.position.x -= PSPEED;
        } else if(angle === 'right' && player.position.x < RIGHT_LIMIT && !invertedControlls){
          player.position.x += PSPEED;
        } else if(angle === 'left' && player.position.x < RIGHT_LIMIT && invertedControlls){
          player.position.x += PSPEED;
        } else if(angle === 'right' && player.position.x > LEFT_LIMIT && invertedControlls){
          player.position.x -= PSPEED;
        }
      };
    });
    document.getElementById("joystick").style.display = "none";
    // Light for game
    const light = new THREE.DirectionalLight(0xffffff,1)
    scene.add(light)
    // ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50,50),
      new THREE.MeshPhysicalMaterial({color: 0xff8800})
    );
    ground.rotation.x = -Math.PI/2;
    scene.add(ground);
    // player
    const player = new THREE.Mesh(
      new THREE.CapsuleGeometry(1,2,8,16),
      new THREE.MeshPhysicalMaterial({color: 0xff00ff})
    );
    player.position.set(0,2,0);
    //camera.lookAt(player.position)
    scene.add(player)
    // enemy
    const enemy = new THREE.Mesh(
      new THREE.CapsuleGeometry(1,2,8,16),
      new THREE.MeshPhysicalMaterial({color: 0xffffff})
    );
    enemy.position.set(1,2,-35);
    //camera.lookAt(player.position)
    scene.add(enemy)
    // shoot btn
    function shoot(){
      if(!canShoot) return;
      canShoot = false;
      const bullet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 1, 8),
        new THREE.MeshPhysicalMaterial({
          color: 0xffff00,
          emissive: 0xffff00,
          emissiveIntensity: 1.5,
          metalness: 0.6,
          roughness: 0.3
        })
      );
      bullet.position.set(player.position.x, player.position.y - 0.5, player.position.z - 1);
      bullet.rotation.x = Math.PI/2;
      bullets.push(bullet)
      scene.add(bullet)
    }
    // enemy bullet after 5s
    function enemyShoot(){
      const enemyBullet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 1, 8),
        new THREE.MeshPhysicalMaterial({
          color: 0xffff00,
          emissive: 0xffff00,
          emissiveIntensity: 1.5,
          metalness: 0.6,
          roughness: 0.3
        })
      );
      enemyBullet.position.set(player.position.x, player.position.y, player.position.z - 1);
      enemyBullet.rotation.x = Math.PI/2;
      enemyBullets.push(enemyBullet)
      enemyBullet.position.set(enemy.position.x, enemy.position.y, enemy.position.z + 1);
      scene.add(enemyBullet)
    }
    setInterval(() =>{
      if(isGameOver) return;
      canShoot = true
      enemyHP.value += enemyRecovery + 0.003;
    },3000)
    setInterval(() =>{
      if(isGameOver) return;
      enemyShoot()
      //enemyBulletSpeed += 0.0005
      enemyBulletSpeed *= 0.5
      spawnTime -= 90
    },spawnTime)
    // enemy 2
    function enemy2(){
      const enemy2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 2),
        new THREE.MeshPhysicalMaterial({ color: 0x00ffff })
      );
      enemy2.position.set((Math.random() - 0.35) * 10, 0.5, player.position.z - 35);
      scene.add(enemy2)
      enemies2.push(enemy2)
    }
    setInterval(() =>{
      if(isGameOver) return;
      enemy2()
      SCORE += 1
      score.innerText = "Score : " + SCORE;
    },4000);
    // function enemy3
    function spawnEnemy3() {
      enemy3 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 2),
        new THREE.MeshPhysicalMaterial({ color: 0xff00ff })
      );
      enemy3.position.set((Math.random() - 0.35) * 10, 0.5, player.position.z - 35);
      scene.add(enemy3);
      enemies3.push(enemy3);
      enemy3_bullets = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 1, 8),
        new THREE.MeshPhysicalMaterial({
          color: 0xffff00,
          emissive: 0xffff00,
          emissiveIntensity: 1.5,
          metalness: 0.6,
          roughness: 0.3
        })
      );
      enemy3_bullets.rotation.x = Math.PI / 2;
      enemy3_bullets.position.set(enemy3.position.x, enemy3.position.y, enemy3.position.z + 6);
      scene.add(enemy3_bullets);
      enemies3_bullets.push(enemy3_bullets);
      }

      setInterval(() => {
        if(currentLevel === 2){
          spawnEnemy3();
        };
      }, 24000);
      
      setInterval(() => {
        enemyHP.value += enemyRecovery + 0.025;
      }, 26000);
      
      const loader = new THREE.CubeTextureLoader();
      const skybox = loader.load([
       'arid2_bk.jpg',  // px right
       'arid2_dn.jpg',   // nx left
       'arid2_ft.jpg',    // py top
       'arid2_lf.jpg', // ny bottom
       'arid2_rt.jpg',  // pz front
       'arid2_up.jpg'    // nz back
      ]);
      scene.background = skybox;
    // renderer (renders camera and scene)
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight)
    document.body.appendChild(renderer.domElement)
    // Rendering game
    function animate(){
      window.requestAnimationFrame(animate);
      if(isGameOver) return;
      if(bullets){
        //bullet.position.x -= 0.1;
        bullets.forEach(bullet =>{
          bullet.position.z -= 0.3;
          //bullet.rotation.x = -Math/2
        });
      }
      // enemy3 bullet movement
      if(enemies3_bullets){
        enemies3_bullets.forEach(enemy3_bullets => {
          enemy3_bullets.position.z += 0.32 + enemyBulletSpeed;
        })
      };
      // enemy3 movement
      if(enemies3){
        //bullet.position.x -= 0.1;
        enemies3.forEach(enemy3 => {
          enemy3.position.z += 0.3;
          //bullet.rotation.x = -Math/2
        });
      }
      
      if(enemies2){
        //bullet.position.x -= 0.1;
        enemies2.forEach(enemy2 =>{
          enemy2.position.z += 0.3;
          //bullet.rotation.x = -Math/2
        });
      }
      if(enemyBullets){
        //bullet.position.x -= 0.1;
        enemyBullets.forEach(enemyBullet =>{
          enemyBullet.position.z += 0.3 + enemyBulletSpeed;
          //bullet.rotation.x = -Math/2
        });
      }
      // player collision
      const playerBox = new THREE.Box3().setFromObject(player)
      enemyBullets.forEach(enemyBullet =>{
        enemyBulletBox = new THREE.Box3().setFromObject(enemyBullet)
        if(playerBox.intersectsBox(enemyBulletBox)){
          console.log("collision")
          playerHP.value -= 0.035;
          //explosionS.play()
          playerHit.play()
          scene.remove(enemyBullet)
        }
      })
      
      // enemy3bullet with player
      enemies3_bullets.forEach(enemy3_bullet => {
        const enemy3_bulletBox = new THREE.Box3().setFromObject(enemy3_bullet)
        if(playerBox.intersectsBox(enemy3_bulletBox) && !invertedTimerActive){
          console.log("inverted")
          invertedControlls = true;
          invertedTimerActive = true;
          invertSound.play()
          setTimeout(() => {
            invertedControlls = false;
            invertedTimerActive = false;
          },11000);
        };
      });
      // enemy collision
      const enemyBox = new THREE.Box3().setFromObject(enemy)
      bullets.forEach(bullet =>{
        playerBulletBox = new THREE.Box3().setFromObject(bullet)
        if(enemyBox.intersectsBox(playerBulletBox)){
          console.log("collision")
          enemyHP.value -= 0.024;
          explosionS.play()
          scene.remove(bullet)
        }
      })
      // enemy 2 collision
      enemies2.forEach(enemy2 => {
        const enemy2_box = new THREE.Box3().setFromObject(enemy2)
        if(playerBox.intersectsBox(enemy2_box)){
          playerHP.value -= 0.012;
          //explosionS.play()
          playerHit.play()
          //scene.remove(enemyBullet)
        };
      });
      if(playerHP.value === 0 && !isGameOver){
        isGameOver = true;
        explosionS.play()
        //winScreen.style.display = "flex";
        restartScreen.style.display = "flex";
      };
      if(enemyHP.value === 0 && !isGameOver){
        isGameOver = true;
        winScreen.style.display = "flex";
      };
      camera.position.set(
        player.position.x,
        player.position.y + 2,
        player.position.z + -1
      );
      //camera.lookAt(player.position.z - 10)
      dx = player.position.x - enemy.position.x;
      dz = player.position.z - enemy.position.z;
      distance = Math.sqrt(dx * dx + dz * dz)
      // player health logic
      //camera.lookAt(player.position)
      renderer.render(scene,camera);
    }
    animate()
    // functions
    startBtn.addEventListener("click", () =>{
      shootBtn.style.visibility = "visible";
      playerHP.style.visibility = "visible";
      enemyHP.style.visibility = "visible";
      startScreen.style.display = "none";
      isGameOver = false;
      document.getElementById("joystick").style.display = "block";
    });
    // winBtn
    winBtn.addEventListener("click",() => {
      winScreen.style.display = "none";
      currentLevel = 2
      shootBtn.style.visibility = "visible";
      playerHP.style.visibility = "visible";
      enemyHP.style.visibility = "visible";
      restartScreen.style.display = "none";
      isGameOver = false;
      document.getElementById("joystick").style.display = "block";
      bullets.forEach(bullet =>{
        scene.remove(bullet)
      });
      bullets = []
      
      enemyBullets.forEach(enemyBullet =>{
        scene.remove(enemyBullet)
      });
      enemyBullets = []
      // enemy2 reset
      enemies2.forEach(enemy2 =>{
        scene.remove(enemy2)
      });
      
      enemies2 = []
      SCORE = 0
      playerHP.value = "100";
      enemyHP.value = "100";
    });
    restartBtn.addEventListener("click", () => {
      shootBtn.style.visibility = "visible";
      playerHP.style.visibility = "visible";
      enemyHP.style.visibility = "visible";
      restartScreen.style.display = "none";
      isGameOver = false;
      document.getElementById("joystick").style.display = "block";
      bullets.forEach(bullet =>{
        scene.remove(bullet)
      });
      bullets = []
      
      enemyBullets.forEach(enemyBullet =>{
        scene.remove(enemyBullet)
      });
      enemyBullets = []
      // enemy2 reset
      enemies2.forEach(enemy2 =>{
        scene.remove(enemy2)
      });
      
      enemies2 = []
      // enemy3
      enemies3.forEach(enemy3 =>{
        scene.remove(enemy3)
      });
      
      enemies2 = []
      SCORE = 0
      playerHP.value = "100";
      enemyHP.value = "100";
    });
