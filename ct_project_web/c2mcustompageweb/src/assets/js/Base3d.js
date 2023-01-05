import * as THREE from "three";
// 导入控制器，轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入模型解析器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";

import Stats from "three/examples/jsm/libs/stats.module.js";

import { RoomEnvironment } from "./RoomEnvironment.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

import GUI from "lil-gui";
import { MeshBVH, acceleratedRaycast, MeshBVHVisualizer } from "three-mesh-bvh";
THREE.Mesh.prototype.raycast = acceleratedRaycast;

//动画控件
import gsap from "gsap";
// let headset;
class Base3d {
  constructor(selector, modeFileUrl, onFinish, name) {
    this.camera;
    this.scene;
    this.renderer;
    this.headset;
    this.textureLoader;
    this.textureRef;
    this.isTrue;
    this.changeShaderMaterial;
    this.container = document.querySelector(selector);
    this.map;
    this.alphaMap;
    this.fileUrl = modeFileUrl;
    this.onFinish = onFinish;
    this.progressFn;
    // this.clock = new THREE.Clock();
    this.stats = new Stats(); // 性能
    this.renderEnabled = true; // 渲染开关
    this.oldRandomBgIndx;
    this.number = 0;
    this.DecalGeometry;
    this.timer;
    this.decalDiffuse;
    this.pointOpen = true;
    this.decalMaterial;
    this.decalMaterialType = {
      positionSvg: null,
      positionHiddin: null,
    };
    this.total_material = [];
    this.total_actions = [];

    this.raycaster = new THREE.Raycaster();
    this.points = {
      position: null,
      element: null,
    };
    this.collider; // bvh
    this.anm_point;
    this.anm_point_show = false;
    this.name = name || "Square";
    this.NetcShow = false; //镜片背面不可见

    this.init();
    this.animate();
    this.initPostion(this.name);

    Base3d.instance = this;
    return Base3d.instance;
  }

  initPostion(name) {
    const obj = new Map([
      [
        "Aviator",
        {
          position: new THREE.Vector3(33, 12, 53),
          positionSvg: new THREE.Vector3(26, 8, 50),
          positionHiddin: new THREE.Vector3(32, 11, 54),
        },
      ],
      [
        "Square",
        {
          position: new THREE.Vector3(33, 11, 50),
          positionSvg: new THREE.Vector3(26, 8, 52),
          positionHiddin: new THREE.Vector3(32, 11, 50),
        },
      ],
      [
        "Round",
        {
          position: new THREE.Vector3(33, 12, 52),
          positionSvg: new THREE.Vector3(26, 8, 52),
          positionHiddin: new THREE.Vector3(32, 11, 52),
        },
      ],
      [
        "Oval",
        {
          position: new THREE.Vector3(33, 12, 50),
          positionSvg: new THREE.Vector3(26, 8, 52),
          positionHiddin: new THREE.Vector3(32, 11, 50),
        },
      ],
    ]);
    if (obj.get(name)) {
      this.points.position = obj.get(name).position;
      this.decalMaterialType.positionSvg = obj.get(name).positionSvg;
      this.decalMaterialType.positionHiddin = obj.get(name).positionHiddin;
    } else {
      this.points.position = new THREE.Vector3(33, 12, 50);
    }
  }

  initPoint() {
    this.anm_point_show = true;
    this.raycaster.firstHitOnly = true;
    const point = document.querySelector(".point_fixed");
    const ponit_flashing = document.querySelector(".ponit_flashing");
    point.classList.add("visible");

    this.points.element = point;
    if (this.anm_point) {
      this.anm_point.kill();
    } else {
      point.addEventListener("click", () => {
        gsap.to(this.camera.position, {
          x: 0,
          y: 0,
          z: 125,
          duration: 0.8,
          onUpdate: () => {
            this.controls.update();
          },
        });
      });
    }
    this.anm_point = gsap.fromTo(
      ponit_flashing,
      {
        scale: "1",
      },
      {
        scale: "1.3",
        duration: 0.5,
        repeat: 7,
        yoyo: true,
        onComplete: () => {
          this.points.element.classList.remove("visible");
          this.anm_point_show = false;
        },
        onUpdate: () => {
          this.controls.update();
        },
      }
    );
  }

  onProgress(fn) {
    this.progressFn = fn;
  }

  initGui() {
    var gui = new GUI();

    const MaterialGUI = new (function () {
      (this._alphaTest = 0.2),
        (this.opacity = 1),
        (this.metalness = 0.5), //金属度
        (this.roughness = 0.6); //粗糙度
      this.color = 0x000;
      this.emissive = 0x000;
      this.emissiveIntensity = 1; //光强度
      this.bumpScale = -1;
    })();
    gui
      .add(MaterialGUI, "_alphaTest", 0, 1, 0.01)
      .name("_alphaTest")
      .onChange((value) => {
        this.changeRenderEnabled();
        this.decalMaterial._alphaTest = value;
      });
    gui
      .add(MaterialGUI, "opacity", 0, 1, 0.1)
      .name("opacity")
      .onChange((value) => {
        this.changeRenderEnabled();
        this.decalMaterial.opacity = value;
      });
    gui
      .add(MaterialGUI, "metalness", 0, 1, 0.1)
      .name("金属度")
      .onChange((value) => {
        this.changeRenderEnabled();
        this.decalMaterial.metalness = value;
      });
    gui
      .add(MaterialGUI, "roughness", 0, 1, 0.1)
      .name("粗糙度")
      .onChange((value) => {
        this.changeRenderEnabled();
        this.decalMaterial.roughness = value;
      });
    gui
      .add(MaterialGUI, "emissiveIntensity", 0, 1, 0.1)
      .name("光强度")
      .onChange((value) => {
        this.changeRenderEnabled();
        this.decalMaterial.emissiveIntensity = value;
      });
    gui
      .add(MaterialGUI, "bumpScale", -1, 1, 0.1)
      .name("凹凸深度")
      .onChange((value) => {
        this.changeRenderEnabled();
        this.decalMaterial.bumpScale = value;
      });
    gui.addColor(MaterialGUI, "color").onChange((value) => {
      this.changeRenderEnabled();
      this.decalMaterial.color.set(value);
    });
    gui.addColor(MaterialGUI, "emissive").onChange((value) => {
      this.changeRenderEnabled();
      this.decalMaterial.emissive.set(value);
    });

    const positionGui = new (function () {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    })();
    const Folder = gui.addFolder("position");
    Folder.add(positionGui, "x").onChange((value) => {
      this.changeRenderEnabled();
      this.DecalGeometry.position = new THREE.Vector3(
        value,
        this.DecalGeometry.position.y,
        this.DecalGeometry.position.z
      );
    });
    Folder.add(positionGui, "y").onChange((value) => {
      this.changeRenderEnabled();
      this.DecalGeometry.position = new THREE.Vector3(
        this.DecalGeometry.position.x,
        value,
        this.DecalGeometry.position.z
      );
    });
    Folder.add(positionGui, "z").onChange((value) => {
      this.changeRenderEnabled();
      this.DecalGeometry.position = new THREE.Vector3(
        this.DecalGeometry.position.x,
        this.DecalGeometry.position.y,
        value
      );
    });

    const name = gui.domElement.querySelectorAll(".name");
    name.forEach((item) => {
      item.style.width = "45%";
    });
  }

  initStats() {
    //设置统计模式
    this.stats.setMode(0); // 0: fps, 1: ms
    //统计信息显示在左上角
    this.stats.domElement.style.position = "absolute";
    this.stats.domElement.style.left = "0px";
    this.stats.domElement.style.top = "0px";
    let Stats = document.createElement("div");
    Stats.style.position = "fixed";
    Stats.style.left = "0px";
    Stats.style.top = "0px";
    Stats.style.zIndex = 888;
    let StatsOutput = document.createElement("div");
    Stats.appendChild(StatsOutput);
    StatsOutput.id = "Stats-output";
    document.getElementById("app").appendChild(Stats);

    //将统计对象添加到对应的<div>元素中
    //document.getElementById("Stats-output").appendChild(this.stats.domElement);
  }

  init() {
    // 初始化场景
    this.initScene();
    // 初始化灯光
    //this.initLight();
    // 初始化相机
    this.initCamera();

    //this.initStats();

    // 初始化渲染器
    this.initRenderer();
    // 控制器
    this.initControls();

    this.onWindowResize();

    // 添加物体
    this.addMesh(this.fileUrl).then(() => {
      // this.initGui();
    });

    // 监听场景大小改变，调整渲染尺寸
    window.addEventListener("resize", this.onWindowResize.bind(this));

    this.controls.addEventListener(
      "change",
      this.changeRenderEnabled.bind(this)
    );
  }

  changeRenderEnabled() {
    this.renderEnabled = true;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.renderEnabled = false;
    }, 3000);
  }

  initScene() {
    this.scene = new THREE.Scene();
    // this.scene.position.set(-50, -10, 0);

    // 显示三维坐标系
    // const axes = new THREE.AxesHelper(100);
    //添加坐标系到场景中
    // this.scene.add(axes);
  }

  initLight() {
    //添加灯光

    const hemispherelight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemispherelight.position.set(0, 30, 1);
    this.scene.add(hemispherelight);

    const directionalRightLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalRightLight.position.set(-30, -8, 0);
    this.scene.add(directionalRightLight);

    const directionalLeftLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLeftLight.position.set(30, -8, 0);
    this.scene.add(directionalLeftLight);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.container.clientWidth / this.container.clientHeight,
      1,
      1000
    );
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });

    const Pixel = window.devicePixelRatio >= 2 ? window.devicePixelRatio : 2;
    this.renderer.setPixelRatio(Pixel);
    this.renderer.setClearAlpha(0);

    this.renderer.toneMappingExposure = 1;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // 渲染的尺寸大小
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.container.appendChild(this.renderer.domElement);
    this.setEnvMap();
  }

  //模型贴图
  async addLettering(val) {
    let mesh = this.scene.getObjectByName("svg_map"); //贴图模型
    const img_svg = await this.buildMap(val); //svg图片
    console.log(img_svg);
    //判断是否有刻字模型，如果有改变内容，若没有创建一个
    if (mesh) {
      const decalDiffuse = this.textureLoader.load(img_svg);
      decalDiffuse.minFilter = THREE.LinearMipMapLinearFilter;
      decalDiffuse.anisotropy = 16;
      mesh.material.map = decalDiffuse;
      mesh.material.bumpMap = decalDiffuse;
    } else {
      const decalDiffuse = this.textureLoader.load(img_svg);
      decalDiffuse.minFilter = THREE.LinearMipMapLinearFilter;
      decalDiffuse.anisotropy = 16;
      const decalMaterial = new THREE.MeshStandardMaterial({
        map: decalDiffuse,
        bumpMap: decalDiffuse,

        // shininess: 30,
        transparent: false,
        opacity: 1,
        depthTest: true,
        depthWrite: true,
        // DepthMode: THREE.AlwaysDepth,
        alphaTest: 0.2,
        side: THREE.FrontSide,
        metalness: 0.5, //金属度
        roughness: 0.6, //粗糙度
        // emissive: 0x000, //发光的
        // emissiveIntensity: 1, //发射光强度
        bumpScale: -1, //凹凸程度
        // dithering: true,
        precision: "highp",
        clipShadows: true,
        // wireframe: false,
        alphaToCoverage: 10.0,
        polygonOffset: true, //开启多边形偏移。当发生两个面深度值相同时，设置了polygonOffset的面便会向前或向后偏移一小段距离
        polygonOffsetFactor: -10, // 多边形偏移因子
      });
      this.decalMaterial = decalMaterial;
      const position = this.decalMaterialType.positionSvg;
      const orientation = new THREE.Euler();
      const size = new THREE.Vector3(30, 30, 10);
      let lens = this.headset.getObjectByName("lens");
      if (lens) {
        this.DecalGeometry = new THREE.Mesh(
          new DecalGeometry(lens, position, orientation, size),
          decalMaterial
        );
        this.DecalGeometry.name = "svg_map";
        this.scene.add(this.DecalGeometry);
        // const box = new THREE.BoxHelper(this.DecalGeometry, 0xffff00);
        // this.scene.add(box);
      }
    }
    this.changeRenderEnabled();
  }

  //创建svg文字图
  async buildMap(val) {
    return new Promise((resolve) => {
      let svg, div, text;
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.width = 1024;
      img.height = 1024;
      const loader = new THREE.FileLoader();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const URL = window.URL || window.webkitURL || window;
      loader.load(require("../svg/" + `${this.name}.svg`), (object) => {
        div = document.createElement("div");
        console.log(div);
        div.innerHTML = object;
        svg = div.querySelector("svg");
        text = div.querySelector("textPath");
        svg.setAttribute("width", img.width);
        svg.setAttribute("height", img.width);
        text.textContent = val || "";
        if (text.textContent) {
          this.NetcShow = true;
        } else {
          this.NetcShow = false;
        }
        const data = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([data], {
          type: "image/svg+xml",
        });
        var url = URL.createObjectURL(blob);
        img.onload = () => {
          let scale = 2;
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          ctx.fillStyle = "transparent"; // 设为透明
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL("image/png", 1));
        };
        img.src = url;
      });
    });
  }

  setEnvMap() {
    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(environment).texture;
    this.textureLoader = new THREE.TextureLoader();
    this.map = this.textureLoader.load(require("../img/gradual-change.jpg"));
    this.alphaMap = this.textureLoader.load(
      require("../img/gradual-change.jpg")
    );
  }
  //渲染函数
  render() {
    if (this.anm_point_show) {
      // 获取2D屏幕位置
      const screenPosition = this.points.position.clone();
      screenPosition.project(this.camera);
      this.raycaster.setFromCamera(screenPosition, this.camera);
      const intersects = this.raycaster.intersectObjects([this.collider], true);
      if (intersects.length === 0) {
        // 未找到相交点，显示
        // this.points.element.classList.add("visible");
      } else {
        const intersectionDistance = intersects[0].distance;
        const pointDistance = this.points.position.distanceTo(
          this.camera.position
        );
        // 相交点距离比点距离近，隐藏；相交点距离比点距离远，显示
        intersectionDistance < pointDistance
          ? this.points.element.classList.remove("visible")
          : this.points.element.classList.add("visible");
      }
      // console.log(this.camera.position.z/100);
      const translateX = screenPosition.x * this.sizes.width * 0.5;
      const translateY = -screenPosition.y * this.sizes.height * 0.5;

      this.points.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
    }

    if (this.renderEnabled) {
      this.renderer.render(this.scene, this.camera);
      //this.stats.update();
      this.controls.update();

      if (this.NetcShow) {
        const screenPosition = this.decalMaterialType.positionHiddin.clone();
        screenPosition.project(this.camera);
        this.raycaster.setFromCamera(screenPosition, this.camera);
        const intersects = this.raycaster.intersectObjects(
          [this.collider],
          true
        );
        if (intersects.length !== 0) {
          const intersectionDistance = intersects[0].distance;
          const pointDistance = this.points.position.distanceTo(
            this.camera.position
          );
          // 相交点距离比点距离近，隐藏；相交点距离比点距离远，显示

          if (intersectionDistance + 1 < pointDistance) {
            this.decalMaterial.visible = false;
          } else {
            this.decalMaterial.visible = true;
          }
        }
      }
    }
  }
  //开启渲染
  animate() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }
  //初始化控制器
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // 开启控制阻尼
    this.controls.enablePan = false; //平移
    this.controls.screenSpacePanning = true;
    this.controls.enableZoom = true;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 300;
    this.controls.autoRotate = false; //旋转
    this.controls.autoRotateSpeed = 3.0;
    this.controls.target.set(0, 0, 0);
    //this.controls.position.set(1000, 0, 0);
    // 初始化标签

    this.controls.update();
  }

  //模型移除
  removeGroup() {
    // 递归遍历组对象group释放所有后代网格模型绑定几何体占用内存
    if (this.headset) {
      this.headset.traverse(function (obj) {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });
      this.scene.remove(this.headset);
      THREE.Cache.clear();
      // this.scene.clear();
      this.headset = null;
    }
  }
  //更新相机
  setCamera(value) {
    this.camera = value;
    let right_nav = document.querySelector(".right-nav");
    if (right_nav.classList.contains("close")) {
      document.querySelector("#scene").style.width =
        document.querySelector("#app").clientWidth -
        document.querySelector(".nav_right").clientWidth +
        "px";
    } else {
      document.querySelector("#scene").style.width =
        document.querySelector("#app").clientWidth -
        document.querySelector(".right-nav").clientWidth +
        "px";
    }
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  //初始位置
  animateInit() {
    // gsap.ticker.fps(60); //每s60帧
    // gsap.ticker.lagSmoothing(100, 60);
    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: 150,
      duration: 0.8,
      ease: "power1.out",
      // useFrames: true,
      onUpdate: () => {
        this.controls.update();
      },
      onComplete: () => {
        this.anm_point_show = false;
        this.points.element &&
          this.points.element.classList &&
          this.points.element.classList.remove("visible");
      },
    });
  }

  //刻字位置
  animateBack() {
    gsap.to(this.camera.position, {
      z: 125,
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "power1.out",
      onUpdate: () => {
        this.controls.update();
      },
      onComplete: () => {
        if (this.pointOpen) {
          this.initPoint();
        }
      },
    });
  }

  animateShow() {
    const mirrorBox = document.getElementById("mirror_box");
    const canvas = document.getElementById("scenes");
    var tl = gsap.timeline();
    tl.add(
      gsap.fromTo(
        canvas,
        {
          opacity: 1,
        },
        {
          opacity: 0,
          onUpdate: () => {
            this.controls.update();
          },
          onComplete: () => {
            canvas.style.display = "none";
            mirrorBox.style.display = "block";
          },
        }
      )
    );
    tl.fromTo(
      mirrorBox,
      { opacity: 0 },
      {
        opacity: 1,
      }
    );
  }
  unAnimateShow() {
    const mirrorBox = document.getElementById("mirror_box");
    const canvas = document.getElementById("scenes");
    var tl = gsap.timeline();
    tl.add(
      gsap.fromTo(
        mirrorBox,
        {
          opacity: 1,
        },
        {
          opacity: 0,
          onUpdate: () => {
            this.controls.update();
          },
          onComplete: () => {
            canvas.style.display = "block";
            mirrorBox.style.display = "none";
            this.onWindowResize();
          },
        }
      )
    );
    tl.fromTo(
      canvas,
      { opacity: 0 },
      {
        opacity: 1,
      }
    );
  }

  setModel(fileUrl) {
    return new Promise((resolve) => {
      const loader = new GLTFLoader();

      // fix model scale
      loader.load(
        fileUrl,
        // 'static/files/gltf/蓝色(1).glb',
        // "../../../public/untitled.glb",
        // "https://dstcc.obs.cidc-rp-12.joint.cmecloud.cn/f7240f10d9e84f5bba633d9cd2209f89/scene.glb",
        (object) => {
          // this.headset && this.headset.removeFromParent();
          // console.log(object);
          this.headset = object.scene;
          this.headset.position.set(0, -15, 0);
          const geometries = [];
          this.headset.updateMatrixWorld(true);
          // 筛选动作
          let total_actions_name_Array = [];
          this.total_actions.forEach((item) => {
            item.args.forEach((item1) => {
              total_actions_name_Array.push(item1.module_name);
            });
          });
          total_actions_name_Array = Array.from(
            new Set(total_actions_name_Array)
          );
          this.headset.traverse((item) => {
            if (item.geometry) {
              // 模型里的mesh如果配置了动作&&之前没有保存的话 就存一下
              if (
                total_actions_name_Array.includes(item.name) &&
                !this.total_material.includes(item.name)
              ) {
                this.total_material.push(item.clone());
              }
              const cloned = item.geometry.clone();
              cloned.applyMatrix4(item.matrixWorld);
              for (const key in cloned.attributes) {
                if (key !== "position") {
                  cloned.deleteAttribute(key);
                }
              }
              geometries.push(cloned);
            }
          });
          const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
            geometries,
            false
          );
          mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, {
            lazyGeneration: true,
          });

          this.collider = new THREE.Mesh(mergedGeometry);
          this.visualizer = new MeshBVHVisualizer(this.collider, 10);
          this.scene.add(this.headset);

          this.progressFn({
            isReady: true,
            progressNum: 100,
          });
          this.onWindowResize();
          this.onFinish();
          resolve("模型添加成功");
        },
        (e) => {
          if (
            e.response.headers.get("x-amz-meta-original-content-length") ===
            null
          ) {
            console.error("无法获取精确模型大小");
          }
          //   console.log("模型加载进度");
          //   console.log(e);
          let progressNum;
          if (
            e.response &&
            e.response.headers &&
            e.response.headers.get("x-amz-meta-original-content-length")
          ) {
            progressNum =
              e.loaded /
              e.response.headers.get("x-amz-meta-original-content-length");
            progressNum = parseFloat((progressNum * 100).toFixed(2));
          } else {
            progressNum = e.loaded / e.total;
            progressNum = parseFloat((progressNum * 100).toFixed(2));
          }
          this.progressFn({
            isReady: false,
            progressNum,
          });
        }
      );
    });
  }

  async addMesh(fileUrl) {
    this.removeGroup();
    this.camera.position.set(0, 0, 150);
    const res = await this.setModel(fileUrl);
    if (res) {
      this.addLettering().then(() => {
        this.renderEnabled = false;
        //模型全部完成
        this.isTrue = true;
        this.onWindowResize();
      });
    }
  }
  // 改变模型颜色
  changeColor(tag, json) {
    // return false
    // console.log(json);
    const newJson = JSON.parse(json);
    for (let key in newJson) {
      const obj = this.scene.getObjectByName(key);
      if (obj) {
        if (newJson[key].type) {
          obj.material = new THREE[newJson[key].type](newJson[key]);
          this.onWindowResize();
        } else {
          //console.log("没有该json");
        }
      } else {
        //console.log("没有该模块");
      }
    }
    this.changeRenderEnabled();
  }
  action_initial() {
    // 把模型的材质都恢复初始
    this.total_material.forEach((item) => {
      const obj = this.scene.getObjectByName(item.name);
      // console.log("obj", obj);
      // console.log("item", item);
      if (obj) {
        obj.material = item.material;
      }
    });
  }
  // 随机颜色
  randomColor(colorsList, tag) {
    const random_length = colorsList.length - 1;

    let randomBgIndex = Math.round(Math.random() * random_length);
    if (this.oldRandomBgIndx !== randomBgIndex) {
      this.oldRandomBgIndx = randomBgIndex;
    } else {
      randomBgIndex = Math.round(Math.random() * random_length);
    }

    const random_json = colorsList[randomBgIndex]["json"];

    this.changeColor(tag, random_json);

    return randomBgIndex;
  }
  // 改变镜片
  changeLens(json) {
    if (this.changeShaderMaterial) {
      this.changeShaderMaterial.transparent = false;
      this.changeShaderMaterial.transmission = 0;
    }
    const newJson = JSON.parse(json);
    for (let key in newJson) {
      const keyObj = this.scene.getObjectByName(key);
      const oldJson = {
        type: "MeshPhysicalMaterial",
        // name: "Black",
        color: 657930,
        roughness: 0,
        metalness: 0,
        reflectivity: 0.3,
        transmission: 1,
        side: 2,
        opacity: 1,
        transparent: true,
        depthFunc: 3,
        depthTest: true,
        depthWrite: false,
        isGradual: true,
        map: this.map,
        alphaMap: this.alphaMap,
      };
      //newJson[key] =
      if (newJson[key].materialType === 4) {
        newJson[key].isGradual = true;
      }
      keyObj.material = new THREE[oldJson.type]({
        ...oldJson,
      });
      if (keyObj) {
        if (newJson[key].isGradual) {
          if (newJson[key].type === "MeshPhysicalMaterial") {
            delete newJson[key].isGradual;
            this.changeShaderMaterial = new THREE[newJson[key].type]({
              ...newJson[key],
              alphaMap: this.alphaMap,
            });
            let transmission = this.changeShaderMaterial.transmission;
            keyObj.material = this.changeShaderMaterial;
            this.number++;
            if (this.number > 1) {
              this.changeShaderMaterial.transparent = true;
              this.changeShaderMaterial.transmission = transmission;
              this.onWindowResize();
            } else {
              setTimeout(() => {
                this.changeShaderMaterial.transparent = true;
                this.changeShaderMaterial.transmission = transmission;
                this.onWindowResize();
              }, 800);
            }
          } else {
            const change_uniforms = {
              color1: {
                value: new THREE.Color(newJson[key].color),
              },
              color2: {
                value: new THREE.Color("#bbb"),
              },
              power: {
                value: 0.005,
              },
            };
            delete newJson[key].color;
            delete newJson[key].isGradual;
            const changeShaderMaterial = new THREE[newJson[key].type]({
              uniforms: change_uniforms,
              // depthTest: false,
              ...newJson[key],
            });
            keyObj.material = changeShaderMaterial;
            this.onWindowResize();
          }
        } else {
          delete newJson[key].isGradual;
          keyObj.material = new THREE[newJson[key].type](newJson[key]);
          this.onWindowResize();
        }
      }
    }
    this.changeRenderEnabled();
  }

  onWindowResize() {
    let right_nav = document.querySelector(".right-nav");
    if (right_nav) {
      if (right_nav.classList.contains("close")) {
        document.querySelector("#scene").style.width =
          document.querySelector("#app").clientWidth -
          document.querySelector(".nav_right").clientWidth +
          "px";
      } else {
        document.querySelector("#scene").style.width =
          document.querySelector("#app").clientWidth -
          document.querySelector(".right-nav").clientWidth +
          "px";
      }
    }
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    //设置渲染器的像素比
    this.renderer.setPixelRatio();
    this.sizes = {
      height: document.querySelector("#scene").clientHeight,
      width: document.querySelector("#scene").clientWidth,
    };
    this.changeRenderEnabled();
  }

  onWindowResize2() {
    let right_nav = document.querySelector(".right-nav");
    if (right_nav.classList.contains("close")) {
      document.querySelector("#scene").style.width =
        document.querySelector("#app").clientWidth -
        document.querySelector(".nav_right").clientWidth +
        "px";
    } else {
      document.querySelector("#scene").style.width =
        document.querySelector("#app").clientWidth -
        document.querySelector(".right-nav").clientWidth +
        "px";
    }
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.changeRenderEnabled();
    this.sizes = {
      height: document.querySelector("#scene").clientHeight,
      width: document.querySelector("#scene").clientWidth,
    };
  }

  // 移出眼镜片
  shiftOutLens() {
    let lens = this.headset.getObjectByName("lens");
    let lens1 = this.headset.getObjectByName("lens1");
    // let svg_map = this.scene.getObjectByName("svg_map");
    if (!lens1) return;
    if (this.isTrue) {
      if (this.name == "Aviator") {
        this.points.position = new THREE.Vector3(33, 12, 65);
        this.DecalGeometry.position = new THREE.Vector3(0, 0, 12.5);
      }
      lens.position.set(-0.9, 0, 0);
      lens1.position.set(-0.9, 0, 0);
      // if (svg_map) {
      //   svg_map.position.set(0, 0, 12.5);
      // }
      this.isTrue = false;
    } else {
      if (this.name == "Aviator") {
        this.points.position = new THREE.Vector3(33, 12, 53);
        this.DecalGeometry.position = new THREE.Vector3(0, 0, 0.2);
      }
      lens.position.set(-0.713, 0, 0);
      lens1.position.set(-0.713, 0, 0);
      // if (svg_map) {
      //   svg_map.position.set(0, 0, 0);
      // }
      this.isTrue = true;
    }
    this.changeRenderEnabled();
  }
}

export default Base3d;
