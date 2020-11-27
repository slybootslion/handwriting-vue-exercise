import { createRenderer } from "../runtime-core";
import { nodeOpts } from "./nodeOpts";
import { patchProps } from "./patchProps";

function ensureRenderer() {
  return createRenderer({ ...nodeOpts, patchProps });
}

function createApp(rootComponent) {
  const app = ensureRenderer().createApp(rootComponent);

  const { mount } = app;
  app.mount = function (container) {
    container = document.querySelector(container);
    container.innerHTML = "";
    mount(container);
  };
  return app;
}

export { createApp };
