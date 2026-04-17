# CustomerPortal

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/getting-started/tutorials/angular-standalone-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

npx create-nx-workspace@latest customer-portal --preset=angular
cd customer-portal
https://github.com/iyyanar2405/customer-portal

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/2qJf1ecX6X)


## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve customer-portal
```

To create a production bundle:

```sh
npx nx build customer-portal
```

To see all available targets to run for a project, run:

```sh
npx nx show project customer-portal
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/angular:app app
```

To generate a new library, use:

```sh
cd libs\data-access
npx nx g @nx/angular:lib libs
npx nx g @nx/angular:lib shared
npx nx g @nx/angular:lib actions
npx nx g @nx/angular:lib audit
npx nx g @nx/angular:lib global
npx nx g @nx/angular:lib certificates
npx nx g @nx/angular:lib contracts
npx nx g @nx/angular:lib documents
npx nx g @nx/angular:lib financials
npx nx g @nx/angular:lib findings
npx nx g @nx/angular:lib notifications
npx nx g @nx/angular:lib overview
npx nx g @nx/angular:lib overview-shared
npx nx g @nx/angular:lib permissions
npx nx g @nx/angular:lib preferences
npx nx g @nx/angular:lib router
npx nx g @nx/angular:lib schedules
npx nx g @nx/angular:lib settings



npx nx g @nx/angular:lib actions
npx nx g @nx/angular:lib audit
npx nx g @nx/angular:lib certificates
npx nx g @nx/angular:lib contracts
npx nx g @nx/angular:lib external-apps
npx nx g @nx/angular:lib financials
npx nx g @nx/angular:lib findings
npx nx g @nx/angular:lib notifications
npx nx g @nx/angular:lib overview
npx nx g @nx/angular:lib schedules
npx nx g @nx/angular:lib settings
npx nx g @nx/angular:lib upload

```

npx nx reset
npm install primeng primeicons @angular/cdk --legacy-peer-dep
npm install @jsverse/transloco --legacy-peer-dep 
npm install primeng@latest primeicons@latest --legacy-peer-dep
npm install @angular/animations --legacy-peer-dep
ngx add @jsverse/transloco
npm install primeng --legacy-peer-dep
npm install primeicons --legacy-peer-dep
npm install chart.js --legacy-peer-dep
npm install @fullcalendar/angular --legacy-peer-dep 
npm install @fullcalendar/core --legacy-peer-dep
npm install @fullcalendar/daygrid --legacy-peer-dep
npm install @fullcalendar/multimonth --legacy-peer-dep
npm install file-saver --legacy-peer-dep
npm install tippy.js --legacy-peer-dep
npm install --save-dev jest @types/jest ts-jest --legacy-peer-dep
npm install --save-dev --legacy-peer-deps
npm install --legacy-peer-deps
npm install @angular/localize --legacy-peer-deps
npm install @apollo/client graphql --legacy-peer-deps
npm install apollo-angular apollo-angular-link-http --save --legacy-peer-deps
npm install @ngxs/store @ngxs/router-plugin @ngxs/devtools-plugin @ngxs/logger-plugin @ngxs-labs/dispatch-decorator --legacy-peer-deps
npm install @apollo/client apollo-angular graphql --legacy-peer-deps
npm install --save-dev @types/graphql --legacy-peer-deps
npm install @ngneat/transloco --legacy-peer-dep
ng add @ngneat/transloco


 "assets": [
          // {
          //   "glob": "**/*",
          //   "input": "app/public"
          // }
        ],

  git command
  git push
  git fetch
  git pull
  git commit -m "fix install packages"

  git push --set-upstream origin feature/all_filesmerge

  

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/tutorials/angular-standalone-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

cd libs
cd data-access

