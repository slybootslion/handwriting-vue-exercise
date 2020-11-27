import { createAppApi } from "./apiCreateApp";

function createRenderer(options) {
  return {
    createApp: createAppApi()
  };
}

export { createRenderer };
