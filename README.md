# Mock-awang283-jyoo45

## Project Details:

- Project Name: Mock
- Total estimated time to complete project: 10 hours
- Repo link: https://github.com/cs0320-f23/mock-awang283-jyoo45

## Design Choices:

- The classes in this project can be categorized into componenets and styles.
  Components is the subdirectory contains all the React components for the project. There is a App.tsx file that handles all the initializing of the REPL. In addition, ControlledInput.tsx handles the input box where all the commands inputted to the REPL can be typed into. longDataset.ts and mockedJson.ts stores all the mocked datasets we have used to run and test our program. REPL.tsx handles all the variables that could be accessed from the web. REPLHistory.tsx deals with displaying the outputs of the commands inputted depending on the mode and commands. REPLInput deals with all the commands and what to expect when they are inputted.

  The styles subdirectory contains the CSS files. App.css sets the visual aspects of the browser, and main.css contains all the style aspects of the page components like buttons and input bar, etc.

  Still within the src directory but not under any subdirectory sits main.ts, a template TypeScript file that shows that .ts and .tsx files can be used in conjunction. Additionally, index.tsx contains renders the root by loading the App.tsx file when the index.html file is fetched; for your purposes, you should not have to edit it.

- **Data Structures Used:**
- We have stored all the mocked dataset into a form of dictionary.

## Errors/Bugs:

-

## Tests:

- The tests are all conducted under the package "tests"
- Within App.spec.ts, we conduct all of our unit testing for load, view and search by checkigng whether the component in our index.html port displays what is expected. We have also conducted our integration testings of interacting with different commands within this file.

## How to...:

- To run the program, ensure that you are under the mock directory by typing 'cd mock' into the terminal. Then, 'npm install' to install node_modules folder for dependencies. Additionally, to run testings, 'npx install playwright' will install everything needed to run the PlayWright. Then, 'npm start' will provide a local port and direct to the link provided: http://localhost8000/.
- For changing modes, enter 'mode <mode type>' to the input box. The mode type could be either brief or verbose.
- For loading a csv file, enter 'load <CSV file name>'. The list of mocked csv datasets are: people.csv, movies.csv, dol_ri_earnings_disparity.csv, ten_star.csv, and income_by_race.csv.
- To view the file, enter 'view <CSV file name>' of the file loaded with the load command previously
- For searching within the file, enter 'search <column name or index> <value>'.
