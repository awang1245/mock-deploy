# Mock-awang283-jyoo45

https://awang1245.github.io/mock-deploy/

## Project Details:

- Project Name: Mock
- Total estimated time to complete project: 10 hours
- Repo link: https://github.com/cs0320-f23/mock-awang283-jyoo45

## Design Choices:

- The classes in this project can be categorized into components and styles.
  Components is the subdirectory contains all the React components for the project. There is a App.tsx file that handles all the initializing of the REPL. In addition, ControlledInput.tsx handles the input box where all the commands inputted to the REPL can be typed into. longDataset.ts and mockedJson.ts stores all the mocked datasets we have used to run and test our program. REPL.tsx handles all the variables that could be accessed from the web. REPLHistory.tsx deals with displaying the outputs of the commands inputted depending on the mode and commands. REPLInput deals with all the commands and what to expect when they are inputted.

  The styles subdirectory contains the CSS files. App.css sets the visual aspects of the browser, and main.css contains all the style aspects of the page components like buttons and input bar, etc. Besides formatting for aesthetic purposes, our more functionality-based design choices included using a
  flex container for our input box and button, having our button display the current output mode we are on, displaying table data more cleanly, and choosing
  to disable scrolling in the web page as a whole, but having scrollable overflow in the repl history box.

  Still within the src directory but not under any subdirectory sits main.ts, a template TypeScript file that shows that .ts and .tsx files can be used in conjunction. Additionally, index.tsx contains renders the root by loading the App.tsx file when the index.html file is fetched; for your purposes, you should not have to edit it.

- **Data Structures Used:**
- We have stored all the mocked dataset into a form of a dictionary object. We opted to use dictionaries as opposed to the Map object since we only needed to be able to support string key types, as we were only working with file paths and search queries. Additionally, objects are meant to work better and be more optimized for data transfer with JSON, thut it seemed like the better type keeping in mind our back-end functionality. On a similar note, most web APIs are designed to take in objects rather than Maps.
- An important design choice we made was our choice to create an interface to define a "History" type in our REPL file that could then be used in both REPLInput and REPLHistory. The History type always requires a value for command, since every usage of our application requires a command, but we also added two optional fields for message and dataset which allow our interface to be used for both scenarios where a success/error message is outputted, or rows of the dataset for view and search.

## Errors/Bugs:

- We have no known errors or bugs in our program.

## Tests:

- The tests are all conducted under the package "tests"
- Within App.spec.ts, we conduct all of our unit testing for load, view and search by checking whether the component in our index.html port displays what is expected. We have also conducted our integration testings of interacting with different commands within this file. Details on the purpose of each of the tests
  can be found on each of the tests themselves.

## How to...:

- To run the program, ensure that you are under the mock directory by typing 'cd mock' into the terminal. Then, still in the terminal, run 'npm install' to install node_modules folder for dependencies. Additionally, for testing, run 'npx install playwright' to install everything needed to run PlayWright. After that, whenever you want to run the application, run 'npm start' which will provide a local port and click link provided: http://localhost8000/.
- For changing modes, enter 'mode <mode type>' to the input box. The mode type could be either brief or verbose.
- For loading a csv file, enter 'load <CSV file name>'. The list of mocked csv datasets are: people.csv, movies.csv, dol_ri_earnings_disparity.csv, ten_star.csv, and income_by_race.csv.
- To view the file, enter 'view <CSV file name>' of the file loaded with the load command previously.
- For searching within the file, enter 'search <column name or index> <value>'.
