const floors = document.querySelector(".floors");
const lifts = document.querySelector(".lifts");
const form = document.querySelector(".form-wrapper");
const backBtn = document.querySelector(".back-btn");
const doorLeft = document.querySelector(".door-left");
const doorRight = document.querySelector(".door-right");

const liftsAndFloors = document.querySelector(".liftsAndFloors");
let noOfFloors = "";
let noOfLifts = "";
let liftsData = {};

const getLifts = () => {
  let liftsHtml = "";
  for (let i = 0; i < noOfLifts; i++) {
    liftsHtml += `<div class="lift lift-${i + 1}">
    <div class="door-left closeAndOpenLeft"></div>
    <div class="door-right closeAndOpenRight"></div>
    </div>`;
  }
  return liftsHtml;
  // return `${Array(noOfLifts).map((_, index) => {
  //   return `Lift ${index}`;
  // })}</div>`;
};

const getNearestLift = (floorIndex) => {
  let comingFloorIndexArr = [];
  let comingFloorIndex;

  // console.log("lifts data ", liftsData, "floor idx ", floorIndex);

  // checking lifts below current floor
  for (let i = floorIndex - 1; i >= 0; i--) {
    if (liftsData[i].hasLift && !liftsData[i].isBusy) {
      comingFloorIndexArr.push(i);
      break;
    }
  }

  // checking lifts above current floor
  for (let i = floorIndex + 1; i <= noOfFloors - 1; i++) {
    // debugger;
    if (liftsData[i].hasLift && !liftsData[i].isBusy) {
      comingFloorIndexArr.push(i);
      break;
    }
  }
  //   console.log("coming floor index arr", comingFloorIndexArr);

  if (comingFloorIndexArr.length === 2) {
    if (
      floorIndex - comingFloorIndexArr[0] <
      comingFloorIndexArr[1] - floorIndex
    ) {
      comingFloorIndex = comingFloorIndexArr[0];
    } else {
      comingFloorIndex = comingFloorIndexArr[1];
    }
    // comingFloorIndex = Math.min(
    //   floorIndex - comingFloorIndexArr[0],
    //   comingFloorIndexArr[1] - floorIndex
    // );
  } else if (comingFloorIndexArr.length === 1) {
    comingFloorIndex = comingFloorIndexArr[0];
  }
  const { liftsArr, busyLiftIndex } = liftsData[comingFloorIndex] || {};
  //   console.log("coming floor index", comingFloorIndex);

  return {
    comingFloorIndex,
    liftIndex: liftsArr.find((liftIndex) => liftIndex !== busyLiftIndex),
  };
};

const handleLifts = (floorIndex) => {
  //   console.log("-------------------------------");
  let liftIndex;
  let comingFloorIndex;
  if (
    liftsData[floorIndex].hasLift
    // && !liftsData[floorIndex].isBusy
  ) {
    liftIndex = liftsData[floorIndex].liftsArr[0];
    comingFloorIndex = floorIndex;
  } else {
    const { comingFloorIndex: comingFloorIdx, liftIndex: liftIdx } =
      getNearestLift(floorIndex);
    liftIndex = liftIdx;
    comingFloorIndex = comingFloorIdx;
  }

  const lifts = document.querySelectorAll(".lift");
  //   console.log(
  //     "lifts data => ",
  //     liftsData,
  //     "floorIndex is => ",
  //     floorIndex,
  //     "coming florr index => ",
  //     comingFloorIndex,
  //     "lift index => ",
  //     liftIndex
  //     // lifts[liftIndex]
  //   );

  const animateDoors = () => {
    const leftDoors = document.querySelectorAll(".door-left");
    const rightDoors = document.querySelectorAll(".door-right");
    // console.log(liftIndex, "left ", leftDoors, "right ", rightDoors);
    // console.log("DOORS ANIMATINGGG", floorIndex);

    if (!leftDoors[liftIndex].classList.contains("leftDoorAnimate")) {
      leftDoors[liftIndex].classList.add("leftDoorAnimate");
      // console.log("before timeout floorIndex ", floorIndex);

      setTimeout(() => {
        leftDoors[liftIndex].classList.remove("leftDoorAnimate");
        // console.log("after timeout floorIndex ", floorIndex);
        // console.log("NOT BUSY", floorIndex);
        lifts[liftIndex].removeEventListener("transitionend", animateDoors);
        liftsData[floorIndex].isBusy = false;
        liftsData[floorIndex].busyLiftIndex = "";
        // console.log("lifts Data final ", liftsData);
      }, 2500);
    }
    if (!rightDoors[liftIndex].classList.contains("rightDoorAnimate")) {
      rightDoors[liftIndex].classList.add("rightDoorAnimate");
      setTimeout(() => {
        rightDoors[liftIndex].classList.remove("rightDoorAnimate");
        // liftsData[floorIndex].isBusy = false;
        // liftsData[floorIndex].busyLiftIndex = "";
      }, 2500);
    }
  };

  // const comingLiftIndex = liftsData[liftIndex].liftsArr[0];
  const { liftsArr, busyLiftIndex } = liftsData[comingFloorIndex] || {};

  const nonBusyLiftIndex = liftsArr.find(
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

    liftsData[comingFloorIndex].isBusy = false;
    liftsData[comingFloorIndex].liftsArr = liftsData[
      comingFloorIndex
    ].liftsArr.filter((liftIndex) => liftIndex !== nonBusyLiftIndex);
    liftsData[comingFloorIndex].hasLift =
      liftsData[comingFloorIndex].liftsArr.length > 0 ? true : false;
  }

  // const liftIndex = liftsData[liftIndex].liftsArr[0];
  if (comingFloorIndex !== floorIndex) {
    lifts[liftIndex].style.transform = `translateY(-${floorIndex * 100}px)`;
    lifts[liftIndex].style["transition-duration"] = `2s`;
    // console.log("BEFORE TRANSITION END FLOOR INDEX", floorIndex);

    // console.log("AFTER TRANSITION END FLOOR INDEX", floorIndex);
    lifts[liftIndex].addEventListener("transitionend", animateDoors);
    // animateDoors(liftIndex, floorIndex, lifts)
  } else if (comingFloorIndex === floorIndex) {
    if (!liftsData[floorIndex].isBusy) {
      animateDoors();
    }
    liftsData[floorIndex].isBusy = true;
    setTimeout(() => {
      liftsData[floorIndex].isBusy = false;
    }, 2500);
  }
  // animateDoors(liftIndex);
};

const showLiftsAndFloors = () => {
  for (let i = noOfFloors; i > 0; i--) {
    liftsData[i - 1] =
      i === 1
        ? {
            hasLift: true,
            isBusy: false,
            busyLiftIndex: "",
            liftsArr: Array(Number(noOfFloors))
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
    ${
      i === 1
        ? `<div class="flex flex-wrap justify-between gap-8">${getLifts()}</div>`
        : ""
    }
    </div>`;
  }

  const upBtns = document.querySelectorAll(".up");
  // console.log("lifts dataaaaa is ", liftsData);
  const down = document.querySelector(".down");

  for (let i = 0; i < upBtns.length; i++) {
    upBtns[i].addEventListener(
      "click",
      () => handleLifts(upBtns.length - 1 - i)
      // animateDoors(upBtns.length - 1 - i)
    );
  }
  // up.addEventListener("click", animateDoors);
  // console.log("lifts & floors ", liftsAndFloors);
};

const handleError = (e) => {
  // const { name, value } = e.target;
  const errors = document.querySelectorAll(".error");
  // const liftErr = document.querySelector(".lift-error");
  let hasError = false;
  e.preventDefault();
  for (let i = 0; i < 2; i++) {
    const { name, value } = e.target[i];
    if (e.target[i].value <= 0) {
      hasError = true;
      errors[i].innerText = `No.of ${name} cannot be less than or equal to 0`;
      errors[i].classList.remove("hide");
    }
    if (e.target[i].value > 0) {
      errors[i].classList.add("hide");
    }
    if (e.target[i].value === "") {
      hasError = true;
      errors[i].innerText = `No.of ${name} cannot be empty`;
      errors[i].classList.remove("hide");
    }
  }
  return hasError;

  // if (e.target[0].value <= 0) {
  //   floorErr.innerText = "No.of floors cannot be less than or equal to 0";
  //   floorErr.classList.remove("hide");
  // }
  // if (e.target[1].value <= 0) {
  //   liftErr.innerText = "No.of lifts cannot be less than or equal to 0";
  //   liftErr.classList.remove("hide");
  // }
  // if (e.target[0].value > 0) {
  //   floorErr.classList.add("hide");
  // }
  // if (e.target[1].value > 0) {
  //   liftErr.classList.add("hide");
  // }
  // if (e.target[0].value === "") {
  //   floorErr.innerText = "No.of floors cannot be empty";
  //   floorErr.classList.remove("hide");
  // }
  // if (e.target[1].value === "") {
  //   liftErr.innerText = "No.of lifts cannot be empty";
  //   liftErr.classList.remove("hide");
  //   return;
  // }
};

const saveFloorsAndLifts = (e) => {
  const hasError = handleError(e);

  if (!hasError) {
    noOfFloors = e.target[0].value;
    noOfLifts = e.target[1].value;
    form.style.display = "none";
    liftsAndFloors.classList.remove("hide");
    showLiftsAndFloors();
  }
};

form.addEventListener("submit", saveFloorsAndLifts);
