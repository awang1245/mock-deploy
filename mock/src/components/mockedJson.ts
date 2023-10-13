export const datasets: { [key: string]: string[][] } = {
  "people.csv": [
    ["Name", "Age", "City"],
    ["Alice", "25", "New York"],
    ["Bob", "30", "Chicago"],
    ["Charlie", "35", "Los Angeles"],
    ["Percy", "26", "New York"],
  ],
  "movies.csv": [
    ["Title", "Year", "Director"],
    ["My Neighbor Totoro", "1988", "Hayao Miyazaki"],
    ["Your Name", "2017", "Makoto Shinkai"],
    ["Ponyo", "2008", "Hayao Miyazaki"],
    ["Barbie", "2023", "Greta Gerwig"],
    ["Oppenheimer", "2023", "Christopher Nolan"],
  ],
  "empty.csv": [],
};

export const searchPeopleSet: { [key: string]: string[][] } = {
  "Name Bob": [["Bob", "30", "Chicago"]],
  "Name Alice": [["Alice", "25", "New York"]],
  "Age 35": [["Charlie", "35", "Los Angeles"]],
  "Age 26": [["Percy", "26", "New York"]],
  "City New York": [
    ["Alice", "25", "New York"],
    ["Percy", "26", "New York"],
  ],
  "City Chicago": [["Bob", "30", "Chicago"]],
};

export const searchMovieSet: { [key: string]: string[][] } = {
  "Title Your Name": [["Your Name", "2017", "Makoto Shinkai"]],
  "Title Barbie": [["Barbie", "2023", "Greta Gerwig"]],
  "Year 2023": [
    ["Barbie", "2023", "Greta Gerwig"],
    ["Oppenheimer", "2023", "Christopher Nolan"],
  ],
  "Director Hayao Miyazaki": [
    ["My Neighbor Totoro", "1988", "Hayao Miyazaki"],
    ["Ponyo", "2008", "Hayao Miyazaki"],
  ],
};
