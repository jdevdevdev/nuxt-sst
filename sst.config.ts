import { SSTConfig } from "sst";
import { NuxtSite } from "./stacks/NuxtSite";

export default {
  config(_input) {
    return {
      name: "nuxtsst",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NuxtSite(stack, "site", {
        path: "nuxt-app/",
        edge: true,
      });

      stack.addOutputs({
        url: site.url,
      });
    });
  }
} satisfies SSTConfig;