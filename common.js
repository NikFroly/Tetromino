async function pause(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function resetModifiers() {
  rotL.dataset.type = "rotateLeft";
  rotR.dataset.type = "rotateRight";
  rotL.disabled = rotR.disabled = mir.disabled = true;
}

function setModifiers(shape) {
  resetModifiers();

  rotL.disabled = rotR.disabled = (shape.dataset.type == "O");
  mir.disabled = !(shape.dataset.type == "S" || shape.dataset.type == "L");
}

function disableShapeAnimation() {
  shape.style.transition = "0s";
}

function activateShapeAnimation() {
  shape.style.transition = "0.5s";
}

function resetShapeTransform() {
  shape.style.transform = "none";
}

function setShapeTransform() {
  shape.style.transform = `rotateY(${ shape.dataset.rotateY }deg)`
    + ` rotateZ(${ shape.dataset.rotateZ }deg)`;
}

function resetShape() {
  shape.dataset.type = "";
  shape.dataset.rotateZ = 0;
  shape.dataset.rotateY = 0;

  resetShapeTransform();
}

function setShape(
  type = shape.dataset.type,
  rotateZ = shape.dataset.rotateZ,
  rotateY = shape.dataset.rotateY
) {
  shape.dataset.type = type;
  shape.dataset.rotateZ = rotateZ;
  shape.dataset.rotateY = rotateY;

  setShapeTransform();
  setModifiers(shape);
}

async function editShape(event) {
  event.target.disabled = true;

  switch (event.target.dataset.type) {
    case "rotateLeft":
      if (shape.dataset.rotateZ == 0) {
        disableShapeAnimation();
        shape.dataset.rotateZ = 360;
        setShapeTransform();
        await pause(1);
        activateShapeAnimation();
      }

      shape.dataset.rotateZ -= 90;

      break;
    case "mirror":
      let rLeft = document.querySelector("button[data-type='rotateLeft']"),
        rRight = document.querySelector("button[data-type='rotateRight']");

      if (rLeft && rRight) {
        rLeft.dataset.type = "rotateRight";
        rRight.dataset.type = "rotateLeft";
      }

      shape.dataset.rotateY == 0
        ? shape.dataset.rotateY = 180
        : shape.dataset.rotateY = 0;

      break;
    case "rotateRight":
      if (shape.dataset.rotateZ == 270) {
        disableShapeAnimation();
        shape.dataset.rotateZ = -90;
        setShapeTransform();
        await pause(1);
        activateShapeAnimation();
      }

      shape.dataset.rotateZ = +shape.dataset.rotateZ + 90;
  }

  setShapeTransform();
  event.target.disabled = false;
}

function selectShape(event) {
  const selected = event.target.closest("li");

  if (selected && shape) {
    resetShape();
    setShape(selected.firstElementChild.dataset.type);

    if (!modifiers.classList.contains("set1")) {
      setModifiers(shape);
    }

    initDragDrop();
  }
}

function returnToShapes(cell) {
  const cells = field.querySelectorAll(`[data-link-cell="${cell.dataset.linkCell}"]`),
    [X, Y] = cell.dataset.linkCell.split(","),
    linkCell = field.querySelector(`[data-x="${X}"][data-y="${Y}"]`);

  setShape(linkCell.dataset.color, linkCell.dataset.rotateZ, linkCell.dataset.rotateY);
  cells.forEach((cell) => removeShapePart(cell));

  let item = list.querySelector(`[data-type="${shape.dataset.type}"]`);

  if (item.parentNode.dataset.amount == 0) {
    item.parentNode.classList.add("show");
  }

  item.parentNode.dataset.amount++;
}

function getShapeParts(type, rotateZ = "0", rotateY = "0") {
  switch (type) {
    case "O":
      return [
        { x: 1, y: 1, borders: "left,top" },
        { x: 2, y: 1, borders: "top,right" },
        { x: 1, y: 2, borders: "left,bottom" },
        { x: 2, y: 2, borders: "bottom,right" }
      ];
    case "I":
      if (rotateZ == 90 || rotateZ == 270) {
        return [
          { x: 1, y: 1, borders: "bottom,left,top" },
          { x: 2, y: 1, borders: "bottom,top" },
          { x: 3, y: 1, borders: "bottom,top" },
          { x: 4, y: 1, borders: "bottom,right,top" }
        ];
      } else {
        return [
          { x: 1, y: 1, borders: "left,top,right" },
          { x: 1, y: 2, borders: "left,right" },
          { x: 1, y: 3, borders: "left,right" },
          { x: 1, y: 4, borders: "left,bottom,right" }
        ];
      }
    case "T":
      switch (rotateZ) {
        case "0":
          return [
            { x: 1, y: 1, borders: "bottom,left,top" },
            { x: 2, y: 1, borders: "top" },
            { x: 3, y: 1, borders: "top,right,bottom" },
            { x: 2, y: 2, borders: "right,bottom,left" }
          ];
        case "90":
          return [
            { x: 2, y: 1, borders: "left,top,right" },
            { x: 1, y: 2, borders: "bottom,left,top" },
            { x: 2, y: 2, borders: "right" },
            { x: 2, y: 3, borders: "left,bottom,right" }
          ];
        case "180":
          return [
            { x: 2, y: 1, borders: "left,top,right" },
            { x: 1, y: 2, borders: "bottom,left,top" },
            { x: 2, y: 2, borders: "bottom" },
            { x: 3, y: 2, borders: "bottom,right,top" }
          ];
        case "270":
          return [
            { x: 1, y: 1, borders: "left,top,right" },
            { x: 1, y: 2, borders: "left" },
            { x: 2, y: 2, borders: "top,right,bottom" },
            { x: 1, y: 3, borders: "left,bottom,right" }
          ];
      }
    case "S":
      if (rotateY == 180) {
        if (rotateZ == 90 || rotateZ == 270) {
          return [
            { x: 2, y: 1, borders: "left,top,right" },
            { x: 1, y: 2, borders: "left,top" },
            { x: 2, y: 2, borders: "right,bottom" },
            { x: 1, y: 3, borders: "left,bottom,right" }
          ];
        } else {
          return [
            { x: 1, y: 1, borders: "bottom,left,top" },
            { x: 2, y: 1, borders: "top,right" },
            { x: 2, y: 2, borders: "left,bottom" },
            { x: 3, y: 2, borders: "bottom,right,top" }
          ];
        }
      } else {
        if (rotateZ == 90 || rotateZ == 270) {
          return [
            { x: 1, y: 1, borders: "left,top,right" },
            { x: 1, y: 2, borders: "left,bottom" },
            { x: 2, y: 2, borders: "top,right" },
            { x: 2, y: 3, borders: "left,bottom,right" }
          ];
        } else {
          return [
            { x: 2, y: 1, borders: "left,top" },
            { x: 3, y: 1, borders: "top,right,bottom" },
            { x: 1, y: 2, borders: "bottom,left,top" },
            { x: 2, y: 2, borders: "bottom,right" }
          ];
        }
      }
    case "L":
      if (rotateY == 180) {
        switch (rotateZ) {
          case "0":
            return [
              { x: 2, y: 1, borders: "left,top,right" },
              { x: 2, y: 2, borders: "left,right" },
              { x: 1, y: 3, borders: "bottom,left,top" },
              { x: 2, y: 3, borders: "right,bottom" }
            ];
          case "90":
            return [
              { x: 1, y: 1, borders: "bottom,left,top" },
              { x: 2, y: 1, borders: "bottom,top" },
              { x: 3, y: 1, borders: "top,right" },
              { x: 3, y: 2, borders: "left,bottom,right" }
            ];
          case "180":
            return [
              { x: 1, y: 1, borders: "left,top" },
              { x: 2, y: 1, borders: "top,right,bottom" },
              { x: 1, y: 2, borders: "left,right" },
              { x: 1, y: 3, borders: "left,bottom,right" }
            ];
          case "270":
            return [
              { x: 1, y: 1, borders: "left,top,right" },
              { x: 1, y: 2, borders: "left,bottom" },
              { x: 2, y: 2, borders: "bottom,top" },
              { x: 3, y: 2, borders: "bottom,right,top" }
            ];
        }
      } else {
        switch (rotateZ) {
          case "0":
            return [
              { x: 1, y: 1, borders: "left,top,right" },
              { x: 1, y: 2, borders: "left,right" },
              { x: 1, y: 3, borders: "left,bottom" },
              { x: 2, y: 3, borders: "bottom,right,top" }
            ];
          case "90":
            return [
              { x: 1, y: 1, borders: "left,top" },
              { x: 2, y: 1, borders: "bottom,top" },
              { x: 3, y: 1, borders: "bottom,right,top" },
              { x: 1, y: 2, borders: "left,bottom,right" }
            ];
          case "180":
            return [
              { x: 1, y: 1, borders: "bottom,left,top" },
              { x: 2, y: 1, borders: "top,right" },
              { x: 2, y: 2, borders: "left,right" },
              { x: 2, y: 3, borders: "left,bottom,right" }
            ];
          case "270":
            return [
              { x: 3, y: 1, borders: "left,top,right" },
              { x: 1, y: 2, borders: "bottom,left,top" },
              { x: 2, y: 2, borders: "bottom,top" },
              { x: 3, y: 2, borders: "bottom,right" }
            ];
        }
      }
  }
}

function editShadow(target, isAdd) {
  if (target && shape) {
    const parts = getShapeParts(
      shape.dataset.type,
      shape.dataset.rotateZ,
      shape.dataset.rotateY
    );

    let cells = [];

    for (const part of parts) {
      let cellX = target.dataset.x - (shape.dataset.mainPartX - part.x),
        cellY = target.dataset.y - (shape.dataset.mainPartY - part.y),
        cell = field.querySelector(`[data-x="${cellX}"][data-y="${cellY}"]`);

      if (cell && cell.classList.contains("droppable")) {
        cells.push(cell);
      } else {
        cells = [];
        break;
      }
    }

    cells.forEach((cell) => {
      if (isAdd) {
        cell.classList.add("hover");
        cell.dataset.linkCell = target.dataset.x + "," + target.dataset.y;
      } else {
        cell.classList.remove("hover");
        cell.dataset.linkCell = "";
      }
    });
  }
}

function removeShapePart(cell) {
  if (cell.dataset.linkCell == cell.dataset.x + "," + cell.dataset.y) {
    cell.dataset.rotateZ = "";
    cell.dataset.rotateY = "";
  }

  cell.dataset.linkCell = "";
  cell.dataset.partIndex = "";
  cell.dataset.color = "";
  cell.dataset.borders = "";
  cell.classList.remove("booked", "removable");
  cell.classList.add("droppable");
  cell.onclick = null;
}

function addShapePart(cell, index, part) {
  if (cell.dataset.linkCell == cell.dataset.x + "," + cell.dataset.y) {
    cell.dataset.rotateZ = shape.dataset.rotateZ;
    cell.dataset.rotateY = shape.dataset.rotateY;
  }

  cell.classList.remove("hover", "droppable");
  cell.classList.add("booked", "removable");
  cell.dataset.partIndex = index;
  cell.dataset.color = shape.dataset.type;
  cell.dataset.borders = part.borders;
  cell.onclick = (event) => returnToShapes(event.target);
}

function calcShifts(clientX, clientY) {
  let elemRect = shape.getBoundingClientRect(),
    shiftX = clientX - elemRect.left,
    shiftY = clientY - elemRect.top;

  const minSide = Math.min(elemRect.width, elemRect.height);
  const partSize = shape.dataset.type == "I" ? minSide : minSide / 2;

  shape.dataset.mainPartX = Math.ceil(shiftX / partSize);
  shape.dataset.mainPartY = Math.ceil(shiftY / partSize);

  if (shape.dataset.rotateZ == 90 || shape.dataset.rotateZ == 270) {
    disableShapeAnimation();
    resetShapeTransform();
    elemRect = shape.getBoundingClientRect();
    shiftX = clientX - elemRect.left;
    shiftY = clientY - elemRect.top;
    setShapeTransform();
    activateShapeAnimation();
  }

  return [shiftX, shiftY];
}

function getHMSFromMS(ms) {
  const totalSeconds = Math.floor(ms / 1000),
    hours = Math.floor(totalSeconds / 3600),
    minutes = Math.floor((totalSeconds % 3600) / 60),
    seconds = totalSeconds % 60,
    pad = (unit) => unit.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function showLevelTime() {
  LevelTime = Date.now() - LevelTime;
  GameTime += LevelTime;
  time.textContent = getHMSFromMS(LevelTime);
  shapes.classList.remove("show");
  time.classList.add("show");
  endLevel();
}

function initDragDrop() {
  let currentTarget = null;

  shape.onpointerdown = function(event) {
    const [shiftX, shiftY] = calcShifts(event.clientX, event.clientY);

    shape.classList.add("moveable");
    shape.style.position = "absolute";
    level.append(shape);

    function moveAt(pageX, pageY) {
      shape.style.left = pageX - shiftX  + "px";
      shape.style.top = pageY - shiftY  + "px";
    }

    moveAt(event.pageX, event.pageY);

    level.onpointermove = function(event) {
      moveAt(event.pageX, event.pageY);

      shape.hidden = true;
      const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      shape.hidden = false;

      if (elemBelow) {
        const target = elemBelow.closest(".droppable");

        if (currentTarget != target) {
          if (currentTarget) {
            editShadow(currentTarget, false);
          }
          currentTarget = target;
          if (currentTarget) {
            editShadow(currentTarget, true);
          }
        }
      }
    };

    shape.onpointerup = function(event) {
      level.onpointermove = null;
      shape.onpointerup = null;
      shape.style.position = "static";
      shape.classList.remove("moveable");

      const cells = field.querySelectorAll(".hover");
      let isLast = false;
      
      if (cells.length > 0) {
        const parts = getShapeParts(
          shape.dataset.type,
          shape.dataset.rotateZ,
          shape.dataset.rotateY
        );
        let count = 0,
          activeItem;

        for (let item of list.querySelectorAll(".show")) {
          if (item.firstElementChild.dataset.type == shape.dataset.type) {
            item.dataset.amount--;

            if (item.dataset.amount < 1) {
              item.classList.remove("show");

              activeItem = list.querySelector("li.show");
            } else {
              activeItem = item;
            }
          }

          count += +item.dataset.amount;
        }

        isLast = count == 0;

        cells.forEach((cell, index) => addShapePart(cell, index, parts[index]));
        resetShape();

        if (activeItem) {
          activeItem.click();
        }
      }

      view.append(shape);

      if (isLast && shapes) {
        showLevelTime();
      }
    };
  };
}

function showGameTime() {
  equalizer.firstElementChild.innerHTML = startText.firstElementChild.innerHTML = "All levels completed by<br>" + getHMSFromMS(GameTime);
  startText.classList.add("show");
}

async function updateTitle() {
  if (title && base && sub) {
    const nextSet = "set" + document.body.dataset.set;
    let ms;

    if (title.classList.contains(nextSet)) {
      ms = 1000;
    } else {
      title.classList.add(nextSet);
      ms = 3000;
    }

    await pause(ms)

    if (curLevel.textContent < 15) {
      showStartText(swapToLevelView);
    } else {
      showGameTime();
    }
  }
}

function swapToHomeView() {
  document.body.dataset.view = "home";
  time.classList.remove("show");
  field.innerHTML = "";
  document.documentElement.style.setProperty("--cell-opacity", "1");
  document.documentElement.style.setProperty("--field-clip", "none");
  setTimeout(updateTitle, 1);
}

async function endLevel() {
  const sumStage = LEVELS[document.body.dataset.set]?.length,
    open = LEVELS[document.body.dataset.set][document.body.dataset.stage]?.open;

  if (sumStage) {
    const ms = document.body.dataset.stage == 0 ? 1000 : 3000;

    document.body.classList.remove("game");
    document.body.dataset.stage++;
    document.documentElement.style.setProperty(
      "--pattern-filter",
      `grayscale(${1 - (1 / sumStage * document.body.dataset.stage)})`
    );

    await pause(ms);

    if (open) {
      document.body.dataset.set++;
      document.body.dataset.stage = 0;
      document.documentElement.style.setProperty(
        "--pattern-filter",
        "grayscale(1)"
      );
      document.documentElement.style.setProperty(
        "--cell-opacity",
        "0"
      );
      document.documentElement.style.setProperty(
        "--field-color",
        `var(--${open}-shape-color)`
      );

      if (open == "I") {
        modifiers.classList.remove("set1");
        modifiers.classList.add("set2");
        resetModifiers();
      }
      if (open == "S") {
        modifiers.classList.remove("set2");
        resetModifiers();
      }

      await pause(3000);


      document.documentElement.style.setProperty(
        "--current-pattern-url",
        `url("img/pattern${document.body.dataset.set}.svg")`
      );
      document.documentElement.style.setProperty(
        "--field-color",
        "none"
      );
    }

    document.documentElement.style.setProperty(
      "--cell-opacity",
      "0"
    );

    setTimeout(swapToHomeView, 3000);
  }
}

function startLevel() {
  if (curLevel) {
    curLevel.textContent = +curLevel.textContent + 1;
    document.body.classList.add("game");
    LevelTime = Date.now();
  }
}

function setHint() {
  const level = LEVELS[document.body.dataset.set][document.body.dataset.stage],
    hint = level.hints[hintButton.dataset.index++];

  if (--hintButton.dataset.amount < 1) {
    hintButton.onclick = null;
    hintButton.classList.add("disable");
  }


  for (const part of getShapeParts(hint.shape, hint.rotZ, hint.rotY)) {
    let cell = field.querySelector(`[data-x="${hint.x + part.x}"][data-y="${hint.y + part.y}"]`);

    if (cell.classList.contains("booked")) {
      cell.click();
    }

    cell.classList.remove("droppable");
    cell.classList.add("booked");
    cell.dataset.color = hint.shape;
    cell.dataset.borders = part.borders;
  }

  let item = list.querySelector(`[data-type="${hint.shape}"]`);

  if (item && --item.parentNode.dataset.amount < 1) {
    item.parentNode.classList.remove("show");
    list.querySelector("li.show")?.click();
  }
}

function initHints(level) {
  hintButton.dataset.index = 0;
  hintButton.dataset.amount = level.hints.length;

  while (hintButton.dataset.index < level.booked) {
    setHint();
  }

  if (hintButton.dataset.amount > 0) {
    hintButton.classList.remove("disable");
    hintButton.classList.add("available");
    hintButton.onclick = setHint;
  }
}

function initShapes(shapeItems) {
  if (shapeItems && list && shapes) {
    let firstShowItem;

    for (const item of list.children) {
      if (shapeItems[item.firstElementChild.dataset.type]) {
        item.dataset.amount = shapeItems[item.firstElementChild.dataset.type]
        item.classList.add("show");

        if (!firstShowItem) {
          firstShowItem = item;
        }
      } else {
        item.classList.remove("show");
      }
    }

    shapes.classList.add("show");

    if (firstShowItem) {
      firstShowItem.click();
    }
  }
}

function isSkipCell(x, y, skips) {
  let isSkip = false;

  if (x && y && skips) {
    for (const skip of skips) {
      if ((y >= skip.y1 && y <= skip.y2) && (x >= skip.x1 && x <= skip.x2)) {
        isSkip = true;
        break;
      }
    }
  }

  return isSkip;
}

function initField(level) {
  if (field && level) {
    document.documentElement.style.setProperty("--field-x", level.x);
    document.documentElement.style.setProperty("--field-y", level.y);

    if (level.clip) {
      document.documentElement.style.setProperty(
        "--field-clip",
        `var(--${level.clip}-clip-path)`
      );
    }

    let cells = [];

    for (let i = level.x * level.y, x = 1, y = 1; i > 0; i--, x++) {
      if (x > level.x) {
        y++;
        x = 1;
      }

      let cell = document.createElement("div");

      if (isSkipCell(x, y, level.skips)) {
        cell.classList.add("skiped");
      } else {
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.classList.add("droppable");
      }

      cells.push(cell);
    }

    field.append(...cells);
  }
}

function swapToLevelView() {
  const level = LEVELS[document.body.dataset.set][document.body.dataset.stage];

  if (level) {
    if (level.open) {
      document.documentElement.style.setProperty(
        "--next-pattern-url",
        `url("img/pattern${+document.body.dataset.set + 1}.svg")`
      );
    }

    document.body.dataset.view = "level";

    initField(level);

    if (level.shapes) {
      initShapes(level.shapes);

      if (level.hints) {
        initHints(level);
      } else {
        hintButton.classList.remove("available");
      }

      startLevel();
    } else {
      endLevel();
    }
  }
}

function hideStartText(event) {
  if (startText) {
    startText.classList.remove("show");
    event();
  }
}

function showStartText(event, text = " to continue") {
  if (equalizer && startText) {
    equalizer.firstElementChild.textContent = startText.firstElementChild.textContent = ACTION_NAME + text;
    startText.classList.add("show");
    document.addEventListener("pointerdown", () => hideStartText(event), { once: true });
  }
}

function initLinkAction() {
  for (const link of document.querySelectorAll("a")) {
    link.addEventListener("pointerdown", (event) => event.stopPropagation());
  }
}

const ACTION_NAME = "ontouchstart" in window ? "Touch" : "Click",
  LEVELS = [
    [
      { open: "O", x: 2, y: 2 }
    ], [
      { open: "I", x: 2, y: 8, shapes: { O: 4 }, booked: 1, hints: [
        { shape: "O", x: 0, y: 6 }
      ] }
    ], [
      { x: 8, y: 8, shapes: { O: 8, I: 8 }, booked: 3, hints: [
        { shape: "O", x: 3, y: 2 },
        { shape: "O", x: 1, y: 4 },
        { shape: "I", rotZ: "90", x: 1, y: 7 }
      ] },
      { open: "T", x: 12, y: 8, shapes: { O: 6, I: 10 }, clip: "T", skips: [
        { x1: 1, x2: 4, y1: 5, y2: 8 },
        { x1: 9, x2: 12, y1: 5, y2: 8 }
      ], booked: 3, hints: [
        { shape: "O", x: 3, y: 1 },
        { shape: "O", x: 9, y: 1 },
        { shape: "O", x: 5, y: 4 }
      ] }
    ], [
      { x: 4, y: 16, shapes: { I: 8, T: 8 }, hints: [
        { shape: "I", x: 1, y: 1 },
        { shape: "I", x: 2, y: 9 }
      ] },
      { x: 8, y: 8, shapes: { O: 4, I: 8, T: 4 }, hints: [
        { shape: "O", x: 2, y: 2 },
        { shape: "O", x: 4, y: 4 }
      ] },
      { open: "S", x: 12, y: 8, shapes: { O: 6, I: 2, T: 8 }, clip: "S", skips: [
        { x1: 1, x2: 4, y1: 1, y2: 4 },
        { x1: 9, x2: 12, y1: 5, y2: 8 }
      ], hints: [
        { shape: "O", x: 8, y: 1 },
        { shape: "O", x: 2, y: 5 }
      ] }
    ], [
      { x: 12, y: 8, shapes: { I: 1, T: 6, S: 9 }, clip: "T", skips: [
        { x1: 1, x2: 4, y1: 5, y2: 8 },
        { x1: 9, x2: 12, y1: 5, y2: 8 }
      ], hints: [
        { shape: "I", rotZ: "90", x: 4, y: 2 }
      ] },
      { x: 4, y: 16, shapes: { O: 4, I: 4, T: 4, S: 4 }, hints: [
        { shape: "O", x: 2, y: 6 },
        { shape: "O", x: 0, y: 8 }
      ] },
      { x: 8, y: 8, shapes: { O: 1, I: 1, T: 4, S: 10 }, hints: [
        { shape: "O", x: 3, y: 3 },
        { shape: "I", rotZ: "90", x: 2, y: 7 }
      ] },
      { open: "L", x: 8, y: 12, shapes: { O: 3, I: 2, T: 6, S: 5 }, clip: "L", skips: [
        { x1: 5, x2: 8, y1: 1, y2: 8 }
      ], hints: [
        { shape: "O", x: 3, y: 9 },
        { shape: "O", x: 0, y: 0 },
        { shape: "I", x: 0, y: 7 },
        { shape: "I", rotZ: "90", x: 2, y: 11 }
      ] }
    ], [
      { x: 12, y: 8, shapes: { T: 2, S: 6, L: 8 }, clip: "S", skips: [
        { x1: 1, x2: 4, y1: 1, y2: 4 },
        { x1: 9, x2: 12, y1: 5, y2: 8 }
      ], hints: [
        { shape: "L", x: 0, y: 5 },
        { shape: "L", rotZ: "90", x: 4, y: 0 },
        { shape: "L", rotZ: "180", x: 10, y: 0 },
        { shape: "L", rotZ: "270", x: 2, y: 3 }
      ] },
      { x: 12, y: 8, shapes: { I: 2, T: 4, S: 4, L: 6 }, clip: "T", skips: [
        { x1: 1, x2: 4, y1: 5, y2: 8 },
        { x1: 9, x2: 12, y1: 5, y2: 8 }
      ], hints: [
        { shape: "L", x: 4, y: 5 },
        { shape: "T", rotZ: "270", x: 6, y: 0 },
        { shape: "I", x: 0, y: 0 }
      ] },
      { x: 4, y: 16, shapes: { O: 1, I: 5, T: 4, S: 2, L: 4 }, hints: [
        { shape: "O", x: 1, y: 7 },
        { shape: "I", rotZ: "90", x: 0, y: 15 },
        { shape: "I", x: 0, y: 1 }
      ] },
      { x: 8, y: 8, shapes: { O: 4, I: 2, T: 2, S: 2, L: 6 }, hints: [
        { shape: "O", x: 3, y: 3 },
        { shape: "O", x: 0, y: 6 },
        { shape: "I", x: 7, y: 0 }
      ] },
      { x: 8, y: 7, shapes: { O: 2, I: 2, T: 2, S: 4, L: 4 } }
    ]
  ];

let GameTime = LevelTime = 0;

initLinkAction();
showStartText(swapToLevelView, " to start the game");