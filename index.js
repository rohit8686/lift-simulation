const floors = document.querySelector(".floors");
const lifts = document.querySelector(".lifts");
const form = document.querySelector(".form-wrapper");
const backBtn = document.querySelector(".back-btn");

const liftsAndFloors = document.querySelector(".liftsAndFloors");
let noOfFloors = "";
let noOfLifts = "";
let liftsData = {};
let floorsQueue = [];

const getLifts = () => {
  let liftsHtml = "";
  for (let i = 0; i < noOfLifts; i++) {
    liftsHtml += `<div class="lift lift-${i + 1}">
    <div class="door-left closeAndOpenLeft"></div>
    <div class="door-right closeAndOpenRight"></div>
    </div>`;
  }
  return liftsHtml;
};

const getNearestLift = (floorIndex) => {
  let comingFloorIndexArr = [];
  let comingFloorIndex;

  // checking lifts below current floor
  for (let i = floorIndex - 1; i >= 0; i--) {
    if (
      liftsData[i].hasLift &&
      (!liftsData[i].isBusy || liftsData[i].liftsArr.length > 1)
    ) {
      comingFloorIndexArr.push(i);
      break;
    }
  }

  // checking lifts above current floor
  for (let i = floorIndex + 1; i <= noOfFloors - 1; i++) {
    if (
      liftsData[i].hasLift &&
      (!liftsData[i].isBusy || liftsData[i].liftsArr.length > 1)
    ) {
      comingFloorIndexArr.push(i);
      break;
    }
  }

  if (comingFloorIndexArr.length === 2) {
    if (
      floorIndex - comingFloorIndexArr[0] <
      comingFloorIndexArr[1] - floorIndex
    ) {
      comingFloorIndex = comingFloorIndexArr[0];
    } else {
      comingFloorIndex = comingFloorIndexArr[1];
    }
  } else if (comingFloorIndexArr.length === 1) {
    comingFloorIndex = comingFloorIndexArr[0];
  }

  const { liftsArr, busyLiftIndex } = liftsData[comingFloorIndex] || {};

  return {
    comingFloorIndex,
    liftIndex: liftsArr?.find((liftIndex) => liftIndex !== busyLiftIndex),
  };
};

const handleLifts = (floorIndex) => {
  let liftIndex;
  let comingFloorIndex;
  if (liftsData[floorIndex].hasLift) {
    liftIndex = liftsData[floorIndex].liftsArr[0];
    comingFloorIndex = floorIndex;
  } else {
    const { comingFloorIndex: comingFloorIdx, liftIndex: liftIdx } =
      getNearestLift(floorIndex);
    liftIndex = liftIdx;
    comingFloorIndex = comingFloorIdx;
  }

  const lifts = document.querySelectorAll(".lift");

  const animateDoors = () => {
    const leftDoors = document.querySelectorAll(".door-left");
    const rightDoors = document.querySelectorAll(".door-right");

    if (!leftDoors[liftIndex].classList.contains("leftDoorAnimate")) {
      leftDoors[liftIndex].classList.add("leftDoorAnimate");

      setTimeout(() => {
        leftDoors[liftIndex].classList.remove("leftDoorAnimate");
        lifts[liftIndex].removeEventListener("transitionend", animateDoors);
        liftsData[floorIndex].isBusy = false;
        liftsData[floorIndex].busyLiftIndex = "";
        if (floorsQueue.length) {
          handleLifts(floorsQueue[0]);
          floorsQueue.shift();
        }
      }, 5000);
    }
    if (!rightDoors[liftIndex].classList.contains("rightDoorAnimate")) {
      rightDoors[liftIndex].classList.add("rightDoorAnimate");
      setTimeout(() => {
        rightDoors[liftIndex].classList.remove("rightDoorAnimate");
      }, 5000);
    }
  };

  if (comingFloorIndex == undefined && !floorsQueue.includes(floorIndex)) {
    floorsQueue.push(floorIndex);
  } else if (comingFloorIndex !== undefined) {
    const { liftsArr, busyLiftIndex } = liftsData[comingFloorIndex] || {};

    const nonBusyLiftIndex = liftsArr?.find(
      (liftIndex) => liftIndex !== busyLiftIndex
    );
    if (comingFloorIndex !== floorIndex) {
      liftsData[floorIndex].hasLift = true;
      liftsData[floorIndex].isBusy = true;
      liftsData[floorIndex].liftsArr = [
        nonBusyLiftIndex,
        ...liftsData[floorIndex].liftsArr,
      ];
      liftsData[floorIndex].busyLiftIndex = liftIndex;

      liftsData[comingFloorIndex].liftsArr = liftsData[
        comingFloorIndex
      ].liftsArr.filter((liftIndex) => liftIndex !== nonBusyLiftIndex);
      liftsData[comingFloorIndex].hasLift =
        liftsData[comingFloorIndex].liftsArr.length > 0 ? true : false;

      lifts[liftIndex].style.transform = `translateY(-${
        floorIndex * 120 + floorIndex
      }px)`;
      lifts[liftIndex].style["transition-duration"] = `${
        2 * Math.abs(comingFloorIndex - floorIndex)
      }s`;
      lifts[liftIndex].addEventListener("transitionend", animateDoors);
    } else if (comingFloorIndex === floorIndex) {
      if (!liftsData[floorIndex].isBusy) {
        liftsData[floorIndex].busyLiftIndex = liftIndex;
        liftsData[floorIndex].isBusy = true;
        animateDoors();
      }
    }
  }
};

const showLiftsAndFloors = () => {
  for (let i = noOfFloors; i > 0; i--) {
    liftsData[i - 1] =
      i === 1
        ? {
            hasLift: true,
            isBusy: false,
            busyLiftIndex: "",
            liftsArr: Array(Number(noOfLifts))
              .fill("")
              .map((_, idx) => idx),
          }
        : {
            hasLift: false,
            isBusy: false,
            busyLiftIndex: "",
            liftsArr: [],
          };
    liftsAndFloors.innerHTML += `<div class="floor-container flex justify-start gap-8">
    <div class="floor">
      Floor ${i}
      <button class="fit-content up">Up</button>
      <button class="fit-content down">Down</button>
    </div>
    ${i === 1 ? `<div class="flex flex-wrap gap-8">${getLifts()}</div>` : ""}
    </div>`;
  }

  const upBtns = document.querySelectorAll(".up");
  const downBtns = document.querySelectorAll(".down");

  for (let i = 0; i < upBtns.length; i++) {
    upBtns[i].addEventListener("click", () =>
      handleLifts(upBtns.length - 1 - i)
    );
    downBtns[i].addEventListener("click", () =>
      handleLifts(upBtns.length - 1 - i)
    );
  }
};

const getMaxLiftsAndFloors = () => {
  if (screen.width > 1024) return 10;
  if (screen.width > 850 && screen.width <= 1024) return 8;
  if (screen.width > 768 && screen.width <= 850) return 7;
  if (screen.width > 500 && screen.width <= 768) return 6;
  if (screen.width > 0 && screen.width <= 500) return 4;
};

const handleError = (e) => {
  const maxLiftsAndFloors = getMaxLiftsAndFloors();
  const errors = document.querySelectorAll(".error");
  let hasError = false;
  e.preventDefault();
  for (let i = 0; i < 2; i++) {
    const { name, value } = e.target[i];

    if (name == "floors") {
      if (e.target[i].value < 2) {
        hasError = true;
        errors[i].innerText = `No.of ${name} must be greater than 1`;
        errors[i].classList.remove("hide");
      } else if (e.target[i].value > maxLiftsAndFloors) {
        hasError = true;
        errors[
          i
        ].innerText = `No.of ${name} must be less than or equal to ${maxLiftsAndFloors}`;
        errors[i].classList.remove("hide");
      } else errors[i].classList.add("hide");
    }
    if (name == "lifts") {
      if (e.target[i].value < 1) {
        hasError = true;
        errors[i].innerText = `No.of ${name} must be greater than 0`;
        errors[i].classList.remove("hide");
      } else if (e.target[i].value > maxLiftsAndFloors) {
        hasError = true;
        errors[
          i
        ].innerText = `No.of ${name} must be less than or equal to ${maxLiftsAndFloors}`;
        errors[i].classList.remove("hide");
      } else errors[i].classList.add("hide");
    }
    if (e.target[i].value === "") {
      hasError = true;
      errors[i].innerText = `No.of ${name} cannot be empty`;
      errors[i].classList.remove("hide");
    }
  }
  return hasError;
};

const saveFloorsAndLifts = (e) => {
  const hasError = handleError(e);

  if (!hasError) {
    noOfFloors = e.target[0].value;
    noOfLifts = e.target[1].value;
    form.style.display = "none";
    liftsAndFloors.classList.remove("hide");
    backBtn.classList.remove("hide");
    showLiftsAndFloors();
  }
};

const handleBack = () => {
  form.style.display = "flex";
  liftsAndFloors.classList.add("hide");
  backBtn.classList.add("hide");
  floors.value = "";
  lifts.value = "";
  liftsAndFloors.innerHTML = "";
};
backBtn.addEventListener("click", handleBack);
form.addEventListener("submit", saveFloorsAndLifts);
