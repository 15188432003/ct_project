// class ThreeRaycaster {
// 	constructor(arg) {

// 	}

// }

import * as THREE from "three";
const ThreeRaycaster = (scene, camera, dom) => {
  // 获取鼠标点击对象
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  let cuurrentObj = null;
  let modelMoving = false;

  // 判断该触摸模型是否再组下面
  const deepFindParent = (model, parentName) => {
    if (!model.parent) return new Error("该模型没有父模型");
    let deep = (model) => {
      if (!model.parent || model.parent.name === "Scene") return false;
      if (model.parent.name === parentName) return true;
      return deep(model.parent);
    };
    return deep(model);
  };

  const clickEvent = (e) => {
    e.preventDefault();

    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    // mouse.x = (e.offsetX / dom.clientWidth) * 2 - 1;
    // mouse.y = -(e.offsetY / dom.clientHeight) * 2 + 1;

    // 移动端
    mouse.x = (event.touches[0].pageX / dom.clientWidth) * 2 - 1;
    mouse.y = -(event.touches[0].pageY / dom.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(scene.children, true);
    console.log(intersects);
    if (intersects.length) {
      // 处理选中的最上层对象
      if (intersects[0].object.isMesh) {
        // cuurrentObj = intersects[0];
        const select_name = intersects[0].object.name;

        if (select_name !== "左镜腿内侧" && select_name !== "右镜腿内侧") {
          if (cuurrentObj)
            cuurrentObj.material.color.setHex(cuurrentObj.currentHex);
          cuurrentObj = intersects[0].object;
          cuurrentObj.currentHex = cuurrentObj.material.color.getHex(); //记录当前选择的颜色
          cuurrentObj.material.color.set(0x4dffff);
        }
      }
    } else {
      if (cuurrentObj) cuurrentObj.material.color.set(cuurrentObj.currentHex); //恢复选择前的默认颜色

      cuurrentObj = null;
    }
  };

  // window.addEventListener("touchstart", clickEvent, false);
};

export default ThreeRaycaster;
