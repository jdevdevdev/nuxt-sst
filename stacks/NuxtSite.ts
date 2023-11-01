import fs from "fs";
import path from "path";
import { SsrSite } from 'sst/constructs/SsrSite.js';

/**
 * The `NuxtSite` construct is a higher level CDK construct that makes it easy to create a Nuxt app.
 * @example
 * Deploys a Nuxt app in the `my-nuxt-app` directory.
 *
 * ```js
 * new NuxtSite(stack, "web", {
 *   path: "my-nuxt-app/",
 * });
 * ```
 */
export class NuxtSite extends SsrSite {

  protected plan() {
    const { path: sitePath, edge } = this.props;
    const serverDir = ".output/nuxt-sst/server";
    const clientDir = ".output/nuxt-sst/client";
    const serverConfig = {
      description: "Server handler for Nuxt",
      handler: path.join(sitePath, serverDir, "index.handler"),
    };

    return this.validatePlan({
      buildId: JSON.parse(
        fs
          .readFileSync(path.join(sitePath, clientDir, "_nuxt/builds/latest.json"))
          .toString()
      ).id,
      cloudFrontFunctions: {
        serverCfFunction: {
          constructId: "CloudFrontFunction",
          injections: [ this.useCloudFrontFunctionHostHeaderInjection() ],
        },
      },
      edgeFunctions: edge
        ? {
            edgeServer: {
              constructId: "Server",
              function: {
                scopeOverride: this as NuxtSite,
                ...serverConfig,
              },
            },
          }
        : undefined,
      origins: {
        ...(edge
          ? {}
          : {
              regionalServer: {
                type: "function",
                constructId: "ServerFunction",
                function: serverConfig,
              },
            }),
        s3: {
          type: "s3",
          copy: [
            {
              from: clientDir,
              to: "",
              cached: true,
              versionedSubDir: "_nuxt",
            },
          ],
        },
      },
      behaviors: [
        edge
          ? {
              cacheType: "server",
              cfFunction: "serverCfFunction",
              edgeFunction: "edgeServer",
              origin: "s3",
            }
          : {
              cacheType: "server",
              cfFunction: "serverCfFunction",
              origin: "regionalServer",
            },
        // create 1 behaviour for each top level asset file/folder
        ...fs.readdirSync(path.join(sitePath, clientDir)).map(
          (item) =>
            ({
              cacheType: "static",
              pattern: fs
                .statSync(path.join(sitePath, clientDir, item))
                .isDirectory()
                ? `${item}/*`
                : item,
              origin: "s3",
            } as const)
        ),
      ],
    });
  }

  public getConstructMetadata() {
    return {
      type: "NuxtSite" as const,
      ...this.getConstructMetadataBase(),
    };
  }
}
