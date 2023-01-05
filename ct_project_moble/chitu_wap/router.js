// router.js
import { RouterMount, createRouter } from "uni-simple-router";

const router = createRouter({
  platform: process.env.VUE_APP_PLATFORM,
  routes: [...ROUTES],
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
  if (to.name == "index") {
    console.log("to", to);
    if (
      typeof to.query.basicstyleid == "undefined" ||
      to.query.basicstyleid == "undefined"
    ) {
      window.location.href = `./#/products/`;
      return;
    } else {
      window.location.href = `./#/products/name?basicstyleid=${to.query.basicstyleid}`;
      return;
    }
    next();
  } else {
    next();
  }
  next();
});
// 全局路由后置守卫
router.afterEach((to, from) => {
  console.log("跳转结束");
});

export { router, RouterMount };
