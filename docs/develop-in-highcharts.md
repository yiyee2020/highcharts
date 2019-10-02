# Develop in Highcharts JS
- TODO: Split the content of this file into seperate articles.
- TODO: Add missing urls to links
- 

# Prerequisites
In addition to the following prerequisites we assume you are in possession of, and have an understanding of the following tools:
- Command-line Interface (CLI)
- Code editor

## [Node.js](https://nodejs.org/en/)
We use Node.js to run our utility scripts. Download and install from the [Node.js website](https://nodejs.org/en/). If you are not sure which version to install, then the latest LTS (Long Term Support) is often a safe choice.

Open a CLI and run `node -v` to make sure Node.js is installed properly.

## [Git](https://git-scm.com/)
We use Git for version control during development. Download and install from the [Git website](https://git-scm.com/). Alternatively if you prefer the [GitHub Desktop](https://desktop.github.com/) application, Git will come bundled together with it.

Open a CLI and run `git --version` to make sure Git is installed properly.

# Install the project
Open a CLI, and navigate to where you would like to store the Highcharts project, then execute the following command:
```
git clone https://github.com/highcharts/highcharts.git &&
cd highcharts &&
npm i
```
This command will download the content of the [Highcharts JS repository](https://github.com/highcharts/highcharts), navigate to its newly created folder, and install the necessary dependencies from [npm](https://www.npmjs.com/).

# Project folder structure
| Folder | Description | Note |
|---|---|---|
| `./build/api` | The location of the local build of the Highcharts API. |
| `./build/dist` | The location of the local build of the Highcharts JS distributed packages. |
| `./changelog` | Where we store the content of our changelog in Markdown. | See [`Writing content for the changelog`](https://github.com/highcharts/highcharts/tree/master/changelog) for more information. |
| `./code` | The   |
| `./css` | Where we store the SASS templates for our CSS styles used in styled mode. | See [`Custom themes in styled mode`](https://github.com/highcharts/highcharts/blob/master/docs/chart-design-and-style/custom-themes-in-styled-mode.md) for more information. |
| `./docs` | Where we store the content of our documentation in Markdown. | See [Highcharts Documentation](https://github.com/highcharts/highcharts/tree/master/docs) for more information. |
| `./errors` | The content of the error messages used in Highcharts JS | See ? for more information. |
| `./js` | The JavaScript source files of Highcharts JS. | We are currently in a migration process to TypeScript, and will soon remove this folder once the process is complete. Make sure that you are not editing a JS file that is already migrated to TypeScript, a warning will be available in the top of the file. |
| `./samples` | The location of demos, unit tests, and visual tests. | See [Highcharts Samples](https://github.com/highcharts/highcharts/tree/master/samples) for more information. |

# Utility Scripts
Most of our utility scripts is currently structured as [gulp.js tasks](https://gulpjs.com/), the remainder is either structured as [npm scripts](https://docs.npmjs.com/misc/scripts), or as [Node.js scripts](https://nodejs.dev/run-nodejs-scripts-from-the-command-line).

| Command | Description |
|---|---|
| `node cloud-downloader` | |
| `node copy-release` | |
| `npm run build` | |
| `npm run dts` | |
| `npm run dtslint` | |
| `npm run gulp` | **NB!:** Redundant script, please see `npx gulp`. |
| `npm run jsdoc` | |
| `npm run prebuild` | |
| `npm run test` | |
| `npm run testall` | |
| `npm run ts-compile:test` | |
| `npm run utils` | |
| `npx gulp`, `npx gulp default` | |
| `npx gulp build-modules` | |
| `npx gulp common-browserify` | Run browserify on a specific sample. |
| `npx gulp common-webpack` | Run webpack on a specific sample. |
| `npx gulp common` | Executes the gulp tasks `scripts`, `common-browserify`, and `common-webpack`. |
| `npx gulp compare-filesizes` | |
| `npx gulp dist-ant` | **NB!:** Requires an installation of Apache Ant. Executes the `dist` task described in `./build.xml`. |
| `npx gulp dist-clean` | Deletes all the files in the local distribution folder `./build/dist`. |
| `npx gulp dist-compress` | First creates zip archives of the `./dist/<product>` folders and outputs them to `./dist/<product>.zip`. Then it gzips the files in `./dist/<product>/code` folders and outputs the result in `./dist/<product>/js-gzip`. |
| `npx gulp dist-copy` | Creates distribution directiories for each product, and copies associated files from `./code` into `./build/dist/<product>` |
| `npx gulp dist-examples` | Copies all demoes related to a product into `./build/dist/<product>/examples`. |
| `npx gulp dist-productsjs` | Creates the file `./build/dist/product.js` |
| `npx gulp dist-testresults` | |
| `npx gulp dist-upload` | |
| `npx gulp dist` | |
| `npx gulp filesize` | |
| `npx gulp get-filesizes` | |
| `npx gulp jsdoc-classes` | |
| `npx gulp jsdoc-clean` | |
| `npx gulp jsdoc-dts` | |
| `npx gulp jsdoc-namespace` | |
| `npx gulp jsdoc-options` | |
| `npx gulp jsdoc-server` | **NB!** Potentially redundant, see `highcharts-utils` for replacement. |
| `npx gulp jsdoc-watch` | |
| `npx gulp jsdoc` | |
| `npx gulp lint-dts` | |
| `npx gulp lint-js` | |
| `npx gulp lint-samples` | |
| `npx gulp lint-ts` | |
| `npx gulp lint` | |
| `npx gulp nightly` | |
| `npx gulp scripts-clean` | |
| `npx gulp scripts-compile` | |
| `npx gulp scripts-css` | |
| `npx gulp scripts-js` | |
| `npx gulp scripts-ts` | |
| `npx gulp scripts-vendor` | |
| `npx gulp scripts-watch` | |
| `npx gulp scripts` | |
| `npx gulp test` | |
| `npx gulp tsdoc-watch` | |
| `npx gulp tsdoc` | |
| `npx gulp update-pr-testresults` | |
| `npx gulp update` | |
| `npx gulp update-vendor` | |
| `npx gulp upload-api` | |
| `npx gulp upload-files` | |

# Chart concepts
https://www.highcharts.com/docs/chart-concepts/understanding-highcharts


# How to contribute to the Highcharts JS repository

## Create a new branch from master
- We use branches to isolate the changes we want to make.
- Create a new branch from master using `git checkout -b <branch_name>`.

## Add changes
- Modify the Highcharts source code in the `ts` folder.
- Use `npx gulp scripts` or `npx gulp scripts-watch` to build the source code.
- To manually test the your changes while devloping you can use [`npx gulp lint-ts`]() to lint the , and [`npx gulp test`]() to run the unit tests.
- Commit the changes. Also runs the tests.

## Propose changes to the Highcharts JS repository
- We use pull requests to submit proposals for changes to the repository. See [GitHub Help - Creating a pull request](https://help.github.com/en/articles/creating-a-pull-request) for more information.
