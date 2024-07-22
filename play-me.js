const chalk = require(`chalk`);
// ----------- get key input -----------------------------------------------------------------------------------------------------

let key;
// process.exit();

function getKeyInput() {
    const stdin = process.stdin;

    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    stdin.on("data", function (key) {
        if (key === "\u0003") process.exit();

        if (key === "d") gunRight();
        if (key === "a") gunLeft();
        if (key === " ") createShots();
    });
}

getKeyInput();

// ----------- action -----------------------------------------------------------------------------------------------------

let field = {};

createField(enemies1);
let mainVal = setInterval(() => action(lev1Done), 50);
let moveDown = setInterval(moveEnemiesDown, 3000);
let leftRight = setInterval(moveEnemiesRandom, 1000);

function action(levelDone) {
    console.clear();
    showField();
    remShots();
    showHits();
    checkLose();
    levelDone();
}

function lev1Done() {
    let copyField = JSON.parse(JSON.stringify(field));
    if (hits === 5) {
        // 9
        clearInterval(mainVal);
        clearInterval(leftRight);
        clearInterval(moveDown);
        hits = 0;
        clearField();
        let copyField = JSON.parse(JSON.stringify(field));
        let text = `You killed them all. But there are still Aliens. Let's go to Level 2!`;
        let i = 0;
        for (let c = 15; c < 84; c++) {
            copyField[`r20`][c] = text[i];
            i++;
        }
        field = copyField;
        console.clear();
        showField();
        setTimeout(() => {
            createField(enemies2);
            mainVal = setInterval(() => action(lev2Done), 50);
            leftRight = setInterval(moveEnemiesRandom, 1000);
            moveDown = setInterval(moveEnemiesDown, 3000);
        }, 3000);
    }
}

function lev2Done() {
    let copyField = JSON.parse(JSON.stringify(field));
    if (hits === 8) {
        // 40
        clearInterval(mainVal);
        clearInterval(leftRight);
        clearInterval(moveDown);
        hits = 0;
        clearField();
        let copyField = JSON.parse(JSON.stringify(field));
        let text = `Only one left. The Boss!`;
        let i = 0;
        for (let c = 37; c < 61; c++) {
            copyField[`r20`][c] = text[i];
            i++;
        }
        field = copyField;
        console.clear();
        showField();
        setTimeout(() => {
            createField(enemies3);
            mainVal = setInterval(() => action(lev3Done), 50);
            leftRight = setInterval(moveEnemiesRandom, 1000);
            moveDown = setInterval(moveEnemiesDown, 3000);
        }, 3000);
    }
}

function lev3Done() {
    let copyField = JSON.parse(JSON.stringify(field));
    if (hits === 15) {
        // 192
        clearInterval(mainVal);
        clearInterval(leftRight);
        clearInterval(moveDown);
        hits = 0;
        clearField();
        let copyField = JSON.parse(JSON.stringify(field));
        let text = `You have Won!`;
        let i = 0;
        for (let c = 40; c < 53; c++) {
            copyField[`r20`][c] = text[i];
            i++;
        }
        field = copyField;
        console.clear();
        showField();
    }
}

// ----------- create the field -----------------------------------------------------------------------------------------------------

function createField(enemies) {
    let row = "";

    for (let r = 1; r < 51; r++) {
        String(r).length === 1 ? (row = `r0${r}`) : (row = `r${r}`);

        field[row] = new Array(100).fill(` `);
    }
    field[`r50`][49] = `:`;
    field[`r50`][50] = `|`;
    field[`r50`][51] = `:`;

    enemies();
}

// ----------- show field -----------------------------------------------------------------------------------------------------

function showField() {
    let copyField = JSON.parse(JSON.stringify(field)); // {...field}
    let row = "";

    for (let r = 1; r < 51; r++) {
        String(r).length === 1 ? (row = `r0${r}`) : (row = `r${r}`);

        copyField[row] = copyField[row].join("");
        console.log(chalk.cyan.bgBlue.bold(copyField[row]));
    }
}

// ----------- move gun left and right -----------------------------------------------------------------------------------------------------

function gunLeft() {
    let copyRow = JSON.parse(JSON.stringify(field[`r50`]));

    let shiftEle = copyRow.shift();
    copyRow.push(shiftEle);

    field[`r50`] = copyRow;
}

function gunRight() {
    let copyRow = JSON.parse(JSON.stringify(field[`r50`]));

    let popEle = copyRow.pop();
    copyRow.unshift(popEle);

    field[`r50`] = copyRow;
}

// ----------- move enemies left and right -----------------------------------------------------------------------------------------------------

function moveEnemiesLeft() {
    let copyField = JSON.parse(JSON.stringify(field));

    let row;

    for (let r = 2; r < 49; r++) {
        String(r).length === 1 ? (row = `r0${r}`) : (row = `r${r}`);

        let popEle = copyField[row].shift();
        copyField[row].push(popEle);
    }

    field = copyField;
}

function moveEnemiesRight() {
    let copyField = JSON.parse(JSON.stringify(field));

    let row;

    for (let r = 2; r < 49; r++) {
        String(r).length === 1 ? (row = `r0${r}`) : (row = `r${r}`);

        let popEle = copyField[row].pop();
        copyField[row].unshift(popEle);
    }

    field = copyField;
}

function moveEnemiesRandom() {
    let randomNum = Math.round(Math.random());

    if (randomNum) {
        moveEnemiesLeft();
        moveEnemiesLeft();
        moveEnemiesLeft();
    } else {
        moveEnemiesRight();
        moveEnemiesRight();
        moveEnemiesRight();
    }
}

// ----------- move enemies down -----------------------------------------------------------------------------------------------------

let r = 2;

function moveEnemiesDown() {
    let copyField = JSON.parse(JSON.stringify(field));
    let row = ``;
    let row2 = ``;

    for (let r = 49; r > 3; r--) {
        String(r).length === 1 ? (row = `r0${r}`) : (row = `r${r}`);
        r2 = r - 1;
        String(r2).length === 1 ? (row2 = `r0${r2}`) : (row2 = `r${r2}`);

        copyField[row] = copyField[row2];
    }
    copyField[`r03`] = new Array(100).fill(` `);

    field = copyField;
}
field[`r50`][49] = `:`;
field[`r50`][50] = `|`;
field[`r50`][51] = `:`;

// ----------- shot animation -----------------------------------------------------------------------------------------------------

// |

let hits = 0;

function createShots() {
    let copyField = JSON.parse(JSON.stringify(field));

    let gunPos = copyField[`r50`].indexOf(`|`);

    for (let r = 49; r > 1; r--) {
        let row = "";

        String(r).length === 1 ? (row = `r0${r}`) : (row = `r${r}`);

        let bulletPos = copyField[row][gunPos];
        let enemyParts = [
            `>`,
            `O`,
            `<`,
            `:`,
            `#`,
            `!`,
            `V`,
            `W`,
            `O`,
            `"`,
            `_`,
        ];

        if (enemyParts.includes(bulletPos)) {
            copyField[row][gunPos] = `|`;
            hits++;
            break;
        }

        copyField[row][gunPos] = `|`;
    }

    field = copyField;
}

function remShots() {
    let copyField = JSON.parse(JSON.stringify(field));

    for (let r = 2; r < 50; r++) {
        let row = "";

        String(r).length === 1 ? (row = `r0${r}`) : (row = `r${r}`);

        for (let c = 0; c < 100; c++) {
            if (copyField[row][c] === `|`) {
                copyField[row][c] = ` `;
            }
        }
    }
    field = copyField;
}

// ----------- show hits -----------------------------------------------------------------------------------------------------

let showHits = () => {
    let copyField = JSON.parse(JSON.stringify(field));

    if (String(hits).length > 2) {
        copyField[`r01`][99] = String(hits)[2];
        copyField[`r01`][98] = String(hits)[1];
        copyField[`r01`][97] = String(hits)[0];
    } else if (String(hits).length > 1) {
        copyField[`r01`][99] = String(hits)[1];
        copyField[`r01`][98] = String(hits)[0];
    } else {
        copyField[`r01`][99] = String(hits)[0];
    }

    copyField[`r01`][90] = `s`;
    copyField[`r01`][91] = `c`;
    copyField[`r01`][92] = `o`;
    copyField[`r01`][93] = `r`;
    copyField[`r01`][94] = `e`;
    copyField[`r01`][95] = `:`;

    field = copyField;
};

// ----------- check if lost -----------------------------------------------------------------------------------------------------

function checkLose() {
    let copyField = JSON.parse(JSON.stringify(field));

    if (!copyField[`r48`].every((e) => e === ` ` || e === `|`)) {
        clearInterval(mainVal);
        clearInterval(leftRight);
        clearInterval(moveDown);
        clearField();
        let copyField = JSON.parse(JSON.stringify(field));
        let lose = `Maybe new Try`;
        let i = 0;
        for (let c = 40; c < 53; c++) {
            copyField[`r20`][c] = lose[i];
            i++;
        }
        field = copyField;
        console.clear();
        showField();
    }
}

// ----------- clear field -----------------------------------------------------------------------------------------------------

function clearField() {
    let copyField = JSON.parse(JSON.stringify(field));

    for (let r = 1; r < 51; r++) {
        let row = "";
        String(r).length === 1 ? (row = `r0${r}`) : (row = `r${r}`);

        copyField[row] = copyField[row].map((e) => (e = ` `));
    }
    field = copyField;
}

// ----------- enemies 1 -----------------------------------------------------------------------------------------------------

// >O<

function enemies1() {
    let copyField = JSON.parse(JSON.stringify(field));

    copyField[`r03`][45] = `>`;
    copyField[`r03`][46] = `O`;
    copyField[`r03`][47] = `<`;

    copyField[`r05`][20] = `>`;
    copyField[`r05`][21] = `O`;
    copyField[`r05`][22] = `<`;

    copyField[`r05`][70] = `>`;
    copyField[`r05`][71] = `O`;
    copyField[`r05`][72] = `<`;

    field = copyField;
}

// ----------- enemies 2 -----------------------------------------------------------------------------------------------------

// =O=
// :V:

function enemies2() {
    let copyField = JSON.parse(JSON.stringify(field));

    for (let c = 0; c < copyField[`r01`].length; c++) {
        let val = "";

        String(c).length === 1 ? (val = `0${c}`) : (val = `${c}`);

        if (val[1] === `5`) copyField[`r03`][c] = `=`;
        if (val[1] === `6`) copyField[`r03`][c] = `O`;
        if (val[1] === `7`) copyField[`r03`][c] = `=`;

        if (val[1] === `5`) copyField[`r04`][c] = `:`;
        if (val[1] === `6`) copyField[`r04`][c] = `V`;
        if (val[1] === `7`) copyField[`r04`][c] = `:`;
    }

    field = copyField;
}

// ----------- enemies 3 the boss -----------------------------------------------------------------------------------------------------

//   4         5         6         7
//   01234567890123456789012345678901234
//04      #########################
//05     ###########################
//06    #############################
//07     ###########################
//08      #########################
//09                 ____
//10    __________ |      | _________
//11   |         | | O  O | |        |
//12  |||       WW |      | WW      |||
//13 VVVV           """"""          VVVV

function enemies3() {
    let copyField = JSON.parse(JSON.stringify(field));

    copyField[`r04`][45] = `#`;
    copyField[`r04`][46] = `#`;
    copyField[`r04`][47] = `#`;
    copyField[`r04`][48] = `#`;
    copyField[`r04`][49] = `#`;
    copyField[`r04`][50] = `#`;
    copyField[`r04`][51] = `#`;
    copyField[`r04`][52] = `#`;
    copyField[`r04`][53] = `#`;
    copyField[`r04`][54] = `#`;
    copyField[`r04`][55] = `#`;
    copyField[`r04`][56] = `#`;
    copyField[`r04`][57] = `#`;
    copyField[`r04`][58] = `#`;
    copyField[`r04`][59] = `#`;
    copyField[`r04`][60] = `#`;
    copyField[`r04`][61] = `#`;
    copyField[`r04`][62] = `#`;
    copyField[`r04`][63] = `#`;
    copyField[`r04`][64] = `#`;
    copyField[`r04`][65] = `#`;
    copyField[`r04`][66] = `#`;
    copyField[`r04`][67] = `#`;
    copyField[`r04`][68] = `#`;
    copyField[`r04`][69] = `#`;

    copyField[`r05`][44] = `#`;
    copyField[`r05`][45] = `#`;
    copyField[`r05`][46] = `#`;
    copyField[`r05`][47] = `#`;
    copyField[`r05`][48] = `#`;
    copyField[`r05`][49] = `#`;
    copyField[`r05`][50] = `#`;
    copyField[`r05`][51] = `#`;
    copyField[`r05`][52] = `#`;
    copyField[`r05`][53] = `#`;
    copyField[`r05`][54] = `#`;
    copyField[`r05`][55] = `#`;
    copyField[`r05`][56] = `#`;
    copyField[`r05`][57] = `#`;
    copyField[`r05`][58] = `#`;
    copyField[`r05`][59] = `#`;
    copyField[`r05`][60] = `#`;
    copyField[`r05`][61] = `#`;
    copyField[`r05`][62] = `#`;
    copyField[`r05`][63] = `#`;
    copyField[`r05`][64] = `#`;
    copyField[`r05`][65] = `#`;
    copyField[`r05`][66] = `#`;
    copyField[`r05`][67] = `#`;
    copyField[`r05`][68] = `#`;
    copyField[`r05`][69] = `#`;
    copyField[`r05`][70] = `#`;

    copyField[`r06`][43] = `#`;
    copyField[`r06`][44] = `#`;
    copyField[`r06`][45] = `#`;
    copyField[`r06`][46] = `#`;
    copyField[`r06`][47] = `#`;
    copyField[`r06`][48] = `#`;
    copyField[`r06`][49] = `#`;
    copyField[`r06`][50] = `#`;
    copyField[`r06`][51] = `#`;
    copyField[`r06`][52] = `#`;
    copyField[`r06`][53] = `#`;
    copyField[`r06`][54] = `#`;
    copyField[`r06`][55] = `#`;
    copyField[`r06`][56] = `#`;
    copyField[`r06`][57] = `#`;
    copyField[`r06`][58] = `#`;
    copyField[`r06`][59] = `#`;
    copyField[`r06`][60] = `#`;
    copyField[`r06`][61] = `#`;
    copyField[`r06`][62] = `#`;
    copyField[`r06`][63] = `#`;
    copyField[`r06`][64] = `#`;
    copyField[`r06`][65] = `#`;
    copyField[`r06`][66] = `#`;
    copyField[`r06`][67] = `#`;
    copyField[`r06`][68] = `#`;
    copyField[`r06`][69] = `#`;
    copyField[`r06`][70] = `#`;
    copyField[`r06`][71] = `#`;

    copyField[`r07`][44] = `#`;
    copyField[`r07`][45] = `#`;
    copyField[`r07`][46] = `#`;
    copyField[`r07`][47] = `#`;
    copyField[`r07`][48] = `#`;
    copyField[`r07`][49] = `#`;
    copyField[`r07`][50] = `#`;
    copyField[`r07`][51] = `#`;
    copyField[`r07`][52] = `#`;
    copyField[`r07`][53] = `#`;
    copyField[`r07`][54] = `#`;
    copyField[`r07`][55] = `#`;
    copyField[`r07`][56] = `#`;
    copyField[`r07`][57] = `#`;
    copyField[`r07`][58] = `#`;
    copyField[`r07`][59] = `#`;
    copyField[`r07`][60] = `#`;
    copyField[`r07`][61] = `#`;
    copyField[`r07`][62] = `#`;
    copyField[`r07`][63] = `#`;
    copyField[`r07`][64] = `#`;
    copyField[`r07`][65] = `#`;
    copyField[`r07`][66] = `#`;
    copyField[`r07`][67] = `#`;
    copyField[`r07`][68] = `#`;
    copyField[`r07`][69] = `#`;
    copyField[`r07`][70] = `#`;

    copyField[`r08`][45] = `#`;
    copyField[`r08`][46] = `#`;
    copyField[`r08`][47] = `#`;
    copyField[`r08`][48] = `#`;
    copyField[`r08`][49] = `#`;
    copyField[`r08`][50] = `#`;
    copyField[`r08`][51] = `#`;
    copyField[`r08`][52] = `#`;
    copyField[`r08`][53] = `#`;
    copyField[`r08`][54] = `#`;
    copyField[`r08`][55] = `#`;
    copyField[`r08`][56] = `#`;
    copyField[`r08`][57] = `#`;
    copyField[`r08`][58] = `#`;
    copyField[`r08`][59] = `#`;
    copyField[`r08`][60] = `#`;
    copyField[`r08`][61] = `#`;
    copyField[`r08`][62] = `#`;
    copyField[`r08`][63] = `#`;
    copyField[`r08`][64] = `#`;
    copyField[`r08`][65] = `#`;
    copyField[`r08`][66] = `#`;
    copyField[`r08`][67] = `#`;
    copyField[`r08`][68] = `#`;
    copyField[`r08`][69] = `#`;

    copyField[`r09`][56] = `_`;
    copyField[`r09`][57] = `_`;
    copyField[`r09`][58] = `_`;
    copyField[`r09`][59] = `_`;

    copyField[`r10`][43] = `_`;
    copyField[`r10`][44] = `_`;
    copyField[`r10`][45] = `_`;
    copyField[`r10`][46] = `_`;
    copyField[`r10`][47] = `_`;
    copyField[`r10`][48] = `_`;
    copyField[`r10`][49] = `_`;
    copyField[`r10`][50] = `_`;
    copyField[`r10`][51] = `_`;
    copyField[`r10`][52] = `_`;

    copyField[`r10`][54] = `!`;

    copyField[`r10`][61] = `!`;

    copyField[`r10`][63] = `_`;
    copyField[`r10`][64] = `_`;
    copyField[`r10`][65] = `_`;
    copyField[`r10`][66] = `_`;
    copyField[`r10`][67] = `_`;
    copyField[`r10`][68] = `_`;
    copyField[`r10`][69] = `_`;
    copyField[`r10`][70] = `_`;
    copyField[`r10`][71] = `_`;

    copyField[`r11`][42] = `!`;

    copyField[`r11`][52] = `!`;

    copyField[`r11`][54] = `!`;
    copyField[`r11`][56] = `O`;
    copyField[`r11`][59] = `O`;
    copyField[`r11`][61] = `!`;
    copyField[`r11`][63] = `!`;
    copyField[`r11`][72] = `!`;

    copyField[`r12`][41] = `!`;
    copyField[`r12`][42] = `!`;
    copyField[`r12`][43] = `!`;

    copyField[`r12`][51] = `W`;
    copyField[`r12`][52] = `W`;

    copyField[`r12`][54] = `!`;
    copyField[`r12`][61] = `!`;

    copyField[`r12`][63] = `W`;
    copyField[`r12`][64] = `W`;

    copyField[`r12`][71] = `!`;
    copyField[`r12`][72] = `!`;
    copyField[`r12`][73] = `!`;

    copyField[`r13`][40] = `V`;
    copyField[`r13`][41] = `V`;
    copyField[`r13`][42] = `V`;
    copyField[`r13`][43] = `V`;

    copyField[`r13`][55] = `"`;
    copyField[`r13`][56] = `"`;
    copyField[`r13`][57] = `"`;
    copyField[`r13`][58] = `"`;
    copyField[`r13`][59] = `"`;
    copyField[`r13`][60] = `"`;

    copyField[`r13`][71] = `V`;
    copyField[`r13`][72] = `V`;
    copyField[`r13`][73] = `V`;
    copyField[`r13`][74] = `V`;

    field = copyField;
}
