let listObjects = 15;

async function loadActiveFoods() {
  const loadedFoodList = await Managers.Cache.load("activeFoods");
  if (!loadedFoodList) {
    foods.forEach((food) => (food.checked = true));
    return;
  }
  if (loadedFoodList && loadedFoodList.length > 0) {
    loadedFoodList.forEach((food) => {
      food2 = getFoodByName(food.name);
      food2.checked = food.checked;
    });
  }
}

function getFoodByName(name) {
  // Find and return the food object from the array that has the same name as the provided name
  return foods.find((food) => food.name === name);
}

function getFacilityByName(name) {
  // Find and return the food object from the array that has the same name as the provided name
  return facilities.find((facility) => facility.name === name);
}

function isFoodBoosted(food, otherFood) {
  // Check if otherFood is in the boosts array of food
  return food.boosts.includes(otherFood.name);
}

function getFoodComboValue(boostedFood, food) {
  return Math.floor(getFoodValue(boostedFood) / 2 + getFoodValue(food) / 2);
}
function getFoodValue(food, boostedBool = false) {
  let facility = getFacilityByName(
    document.getElementById("facilityDropdown").value,
  );
  if (boostedBool) return Math.floor(food.value + food.value / 2);
  if (facility.foodCompatibility.includes(food.name)) {
    return Math.floor(food.value + food.value / 2);
  } else {
    return food.value;
  }
}

function getBonusIcon(food, boostedBool = false) {
  let facility = getFacilityByName(
    document.getElementById("facilityDropdown").value,
  );
  if (boostedBool) return "○";
  if (facility.foodCompatibility.includes(food.name)) {
    return "○";
  } else {
    return "";
  }
}

// Function to populate dropdown
function populateDropdown() {
  const dropdown = document.getElementById("facilityDropdown");
  facilities.forEach((facility) => {
    const option = document.createElement("option");
    option.value = facility.name;
    option.textContent = facility.name;
    dropdown.appendChild(option);
  });
}

foods.forEach((food) => {
  getFoodByName("Kairo Pudding").boosts = [];
  if (food.name != "Kairo Pudding")
    getFoodByName("Kairo Pudding").boosts.push(food.name);
});
populateDropdown();

var isThreeSlots = true;

// Add event listener to the dropdown
document
  .getElementById("facilityDropdown")
  .addEventListener("change", onFacilityChange);
document
  .getElementById("slotsDropdown")
  .addEventListener("change", onFacilityChange);
document
  .getElementById("listSize")
  .addEventListener("change", onFacilityChange);
document
  .getElementById("toggleFoodCheckboxes")
  .addEventListener("click", toggleAllCheckboxes);

function toggleAllCheckboxes() {
  let togglerBox = setTogglerBoxChecked();

  // Get all checkbox elements
  const checkboxes = document.querySelectorAll(
    '#activeFoodsTable input[type="checkbox"]',
  );
  // Determine if any checkbox is not checked
  const allChecked = Array.from(checkboxes).every(
    (checkbox) => checkbox.checked,
  );
  // Set all checkboxes to the opposite of the current state
  checkboxes.forEach((checkbox) => (checkbox.checked = !allChecked));
  foods.forEach((food) => (food.checked = togglerBox.checked));
  onFacilityChange();
  const savedData = Managers.Cache.save("activeFoods", foods, "savedFoodList");
}

function getCompatibleFoods(facility, foods) {
  // Extract the names of compatible foods from the facility object
  const compatibleFoodNames = facility.foodCompatibility;

  // Filter the foods array to only include foods whose names are in the compatibleFoodNames array
  const compatibleFoods = foods.filter((food) =>
    compatibleFoodNames.includes(food.name),
  );

  // Return the array of compatible food objects
  return compatibleFoods;
}

// Function to calculate boost value
function getBoostValue(food1, food2) {
  // Assuming food1 and food2 have a property 'baseValue' which is a number
  const combinedBaseValue = getFoodValue(food1) + getFoodValue(food2);
  // Return half of the combined base value, rounded down
  return Math.floor(combinedBaseValue / 2);
}

function getAmountOfActiveFoods() {
  let checks = 0;
  foods.forEach((food) => {
    if (food.checked) checks++;
  });
  return checks;
}

// Modified event handler to update table with multiple combinations
function onFacilityChange() {
  let slots = document.getElementById("slotsDropdown").value;
  isThreeSlots = slots == 3;
  listObjects = document.getElementById("listSize").value;

  const selectedFacilityName =
    document.getElementById("facilityDropdown").value;
  const facility = facilities.find((fac) => fac.name === selectedFacilityName);
  if (facility) {
    const topCombinations = findTopCombinations(facility, getActiveFoods());
    updateMenuTable(topCombinations);
  }

  let tableLength = document.getElementById("combinationTable").rows.length - 1;

  document.getElementById("foodWarning").innerText =
    tableLength == 0 ? `At least one food combo required` : "";
}

// Assuming isThreeSlots is defined globally
// let isThreeSlots = true; // or false

function calculateTotalValue(foodCombination) {
  let totalBaseValue = 0;
  let totalBoostValue = 0;
  let totalBoosts = 0; // Counter for the total number of boosts in the combination
  let baseValueDetails = [];
  let boostValueDetails = [];
  let boostTimes = 0;
  let boostHasHappened = false;

  // Initialize boost value details with zeros for each food
  for (let i = 0; i < foodCombination.length; i++) {
    boostValueDetails.push(0);
  }

  let A = foodCombination[0];
  let B = foodCombination[1];
  let C = isThreeSlots ? foodCombination[2] : null; // Use C only if isThreeSlots is true

  let ValA = getFoodValue(A);
  let ValB = getFoodValue(B);
  let ValC = isThreeSlots ? getFoodValue(C) : 0; // Get C's value only if isThreeSlots is true

  let boostA = 0;
  let boostB = 0;
  let boostC = 0;

  if (A.boosts.includes(B.name) && A.name != B.name) {
    let boostAB = getFoodComboValue(A, B);
    boostA += boostAB;
    boostHasHappened = true;
    boostTimes++;
  }

  if (isThreeSlots && A.boosts.includes(C.name) && A.name != C.name) {
    let boostAC = getFoodComboValue(A, C);
    boostA += boostAC;
    boostHasHappened = true;
    boostTimes++;
  }

  if (B.boosts.includes(A.name) && B.name != A.name) {
    let boostBA = getFoodComboValue(B, A);
    boostB += boostBA;
    boostHasHappened = true;
    boostTimes++;
  }

  if (isThreeSlots && B.boosts.includes(C.name) && B.name != C.name) {
    let boostBC = getFoodComboValue(B, C);
    boostB += boostBC;
    boostHasHappened = true;
    boostTimes++;
  }

  if (isThreeSlots && C && C.boosts.includes(A.name) && C.name != A.name) {
    let boostCA = getFoodComboValue(C, A);
    boostC += boostCA;
    boostHasHappened = true;
    boostTimes++;
  }

  if (isThreeSlots && C && C.boosts.includes(B.name) && C.name != B.name) {
    let boostCB = getFoodComboValue(C, B);
    boostC += boostCB;
    boostHasHappened = true;
    boostTimes++;
  }

  totalBaseValue = ValA + ValB + (isThreeSlots ? ValC : 0);
  totalBoostValue = boostA + boostB + (isThreeSlots ? boostC : 0);

  // Adjust the baseValueDetails and boostValueDetails based on isThreeSlots
  baseValueDetails = [getBonusIcon(A) + ValA, getBonusIcon(B) + ValB];
  boostValueDetails = [boostA, boostB];
  if (isThreeSlots) {
    baseValueDetails.push(getBonusIcon(C) + ValC);
    boostValueDetails.push(boostC);
  }

  return {
    foods: foodCombination.slice(0, isThreeSlots ? 3 : 2).map((f) => f.name), // Names of foods in the combination
    baseValue: totalBaseValue, // Sum of individual food values
    boostValue: totalBoostValue, // Total additional value from boosts
    totalValue: totalBaseValue + totalBoostValue, // Total value including boosts
    baseValueDetails, // Array of base values for each food
    boostValueDetails, // Array of boost values for each food
    boostTimes, // Total number of boosts applied
  };
}

// Function to update the table with the top combinations
function updateMenuTable(combinations) {
  document.getElementById("currentlyShowing").innerText = `${Math.min(
    listObjects,
    combinations.length,
  )} / ${combinations.length}`;
  combinations = combinations.slice(0, listObjects);

  const tableBody = document
    .getElementById("combinationTable")
    .querySelector("tbody");
  tableBody.innerHTML = ""; // Clear the table

  // Insert a new row for each combination
  combinations.forEach((optimalMenu) => {
    const row = tableBody.insertRow();
    const foodCell = row.insertCell(0);

    foodCell.textContent = optimalMenu.foods.join(", ");

    const baseValueCell = row.insertCell(1);
    baseValueCell.textContent = `${
      optimalMenu.baseValue
    } (${optimalMenu.baseValueDetails.join(", ")})`;

    const boostValueCell = row.insertCell(2);
    boostValueCell.textContent = `${
      optimalMenu.boostValue
    } (${optimalMenu.boostValueDetails.join(", ")})`;

    const totalValueCell = row.insertCell(3);
    totalValueCell.textContent = `${optimalMenu.totalValue}`;

    const boostTimesCell = row.insertCell(4);
    boostTimesCell.textContent = optimalMenu.boostTimes;
  });
}

function findTopCombinations(facility, foods) {
  const compatibleFoods = foods;
  const combinations = [];

  // Generate all possible combinations of foods within the serving capacity
  // For simplicity, assuming serving capacity is 3
  if (document.getElementById("slotsDropdown").value == "3") {
    for (let i = 0; i < compatibleFoods.length; i++) {
      for (let j = i + 1; j < compatibleFoods.length; j++) {
        for (let k = j + 1; k < compatibleFoods.length; k++) {
          const combination = [
            compatibleFoods[i],
            compatibleFoods[j],
            compatibleFoods[k],
          ];
          combinations.push(calculateTotalValue(combination));
        }
      }
    }
  } else {
    for (let i = 0; i < compatibleFoods.length; i++) {
      for (let j = i + 1; j < compatibleFoods.length; j++) {
        const combination = [compatibleFoods[i], compatibleFoods[j]];
        combinations.push(calculateTotalValue(combination));
      }
    }
  }
  // Sort combinations by total value in descending order
  combinations.sort((a, b) => b.totalValue - a.totalValue);
  // Return the top combination(s)
  return combinations;
}

function populateFoodsTable() {
  const tableBody = document
    .getElementById("activeFoodsTable")
    .querySelector("tbody");
  tableBody.innerHTML = ""; // Clear the table

  foods.forEach((food) => {
    const row = tableBody.insertRow();

    const selectCell = row.insertCell(0);
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = food.name + "-checkbox";
    //if (typeof food.checked == "undefined") food.checked = true;
    checkbox.checked = food.checked || false;
    checkbox.addEventListener("change", () => {
      toggleFoodChecked(food);
      onFacilityChange();
    });

    selectCell.appendChild(checkbox);

    const nameCell = row.insertCell(1);
    nameCell.textContent = food.name;

    const baseValueCell = row.insertCell(2);
    baseValueCell.textContent = food.value;

    const comboBonusCell = row.insertCell(3);
    comboBonusCell.textContent =
      getBonusIcon(food, true) + getFoodValue(food, true) || "N/A"; // Assuming comboBonus is a property of food
  });
}

async function toggleFoodChecked(food) {
  food.checked = !food.checked;
  const savedData = await Managers.Cache.save(
    "activeFoods",
    foods,
    "savedFoodList",
  );
  setTogglerBoxChecked();
}

document
  .getElementById("toggleFoodsMenu")
  .addEventListener("click", (button) => {
    const container = document.getElementById("foodsContainer");
    document.getElementById("toggleFoodsButtonText").textContent =
      container.style.display === "none" ? "Hide Foods" : "Show Foods";
    container.style.display =
      container.style.display === "none" ? "flex" : "none";
  });

function getActiveFoods() {
  foodsArray = [];
  foods.forEach((food) => {
    if (food.checked) foodsArray.push(food);
  });
  return foodsArray;
}

function setTogglerBoxChecked() {
  let togglerBox = document.getElementById("toggleFoodCheckboxes");
  togglerBox.checked = getActiveFoods().length != foods.length ? false : true;
  return togglerBox;
}

loadActiveFoods().finally(() => {
  setTogglerBoxChecked();
  populateFoodsTable();
  onFacilityChange();
  updateVisitorCount();
});
