// Global vars

var piece;
var globalPlayers;
var boardValues = [];
var snapPieces = [];


// Snap.svg Setup
var s = Snap('#svg'),
    boardSet = Snap.set(s),
    pieceSet = Snap.set();
var die = Snap('#dice-svg');

var board = Snap.load("", function(loadedFragment) {
    s.image("assets/img/monopoly.svg", 0, 0, 600, 600);
    s.append(loadedFragment);
    var loop = s.path("M 20 18 L 575 18 L 575 580 L 20 580  Z").attr({ fill: "none", stroke: "red", opacity: "0" });

    var rect = s.rect(60, 0, 20, 20).attr({ fill: 'blue', opacity: 0 });
    var rect2 = rect.clone();
});

/*====     Click Handlers     =====
 */
$('#roll').on("click", function() {
    rollDice();

});
$('#start').on('click', function(req, res) {
    event.preventDefault();
    getPlayer();
    getBoard();
    piece = Snap.load("", function(loadedFragment) {
        // Creating group <g>
        g = s.g();
        for (var i = 0; i < globalPlayers.length; i++) {
            var img = s.image(`assets/img/${globalPlayers[i].piece}.svg`, 545, 545, 50, 50);
            img.attr({
                id: `snap-${globalPlayers[i].piece}`
            });
            snapPieces.push(img);
            g.add(img);
            s.select(`snap-${globalPlayers[i].piece}`);
            snapPieces[i].transform('t0,-300');
        }

        s.append(loadedFragment);
        console.log(s);
        console.log(snapPieces);
        promptPlayer();
        $('#roll').show();
    });
});
/*====     Game Functions     =====
 */
// Roll Dice Function
function rollDice(spaces) {
    $('#roll').hide();
    var dice = [];
    spaces = 0;
    for (i = 0; i < 2; i++) {
        var val = Math.floor(Math.random() * 6) + 1;
        dice.push(val);
        spaces += val;
    }
    Snap.load("", function(loadedFragment) {
        die.image("assets/img/die" + dice[0] + ".svg", 0, 0, 40, 40);
        die.image("assets/img/die" + dice[1] + ".svg", 50, 0, 40, 40);
        die.append(loadedFragment);
    });

    console.log(dice, spaces);
    updateGlobal(spaces);
}

// Sort
function playerSort() {
    globalPlayers.sort(function(a, b) {
        return parseFloat(a.roll) - parseFloat(b.roll);
    });
}

// Choose Playing Order
function playingOrder() {
    $('#start').hide();
    // event.preventDefault();
    playerSort();
    globalPlayers[0].active_turn = true;
}

// Update globalPlayers object on move
function updateGlobal(spaces) {
    for (i = 0; i < globalPlayers.length; i++) {
        var next = i + 1;
        console.log(globalPlayers);
        if (globalPlayers[i].money > 0) {
            if (globalPlayers[i].active_turn === true && next < globalPlayers.length) {
                console.log("Your move: " + globalPlayers[i].player_name);
                // Passing 'Go'
                if (globalPlayers[i].current_space + spaces > 39) {
                    globalPlayers[i].money += 200;
                    globalPlayers[i].current_space = 39 % spaces;
                    console.log("L00K  " + globalPlayers[i].current_space);
                } else {
                    globalPlayers[i].current_space += spaces;
                }
                // Get Board Value
                getBoardValue(i, globalPlayers[i].current_space);
                // Console Logs
                console.log("Current Space: " + globalPlayers[i].current_space);
                console.log(globalPlayers[i].player_name, globalPlayers[i].current_space);
                globalPlayers[i].active_turn = false;
                globalPlayers[next].active_turn = true;
                break;
            } else if (globalPlayers[i].active_turn === true && next === globalPlayers.length) {
                console.log("Your move: " + globalPlayers[i].player_name);
                if (globalPlayers[i].current_space + spaces > 39) {
                    globalPlayers[i].money += 200;
                    globalPlayers[i].current_space = spaces % 39;
                } else {
                    globalPlayers[i].current_space += spaces;
                }
                // Get Board Value
                getBoardValue(i, globalPlayers[i].current_space);
                console.log(globalPlayers[i].current_space);
                next = 0;
                console.log(globalPlayers[i].player_name);
                console.log("Current Space: " + globalPlayers[i].current_space);
                globalPlayers[i].active_turn = false;
                globalPlayers[0].active_turn = true;
                break;
            }
        }
        // 
        /* Remove Player From Game
         */
        else {
            delete globalPlayers[i];
        }
        console.log(next);
        console.log(globalPlayers);
    }
}
/* PROMPT PLAYER
 */
function promptPlayer() {
    $('#buy-opt').hide();
    $('#roll').show();
    for (i = 0; i < globalPlayers.length; i++) {
        if (globalPlayers[i].active_turn === true) {
            $('#prop-info').html(`
                <div class="card" id="prop">
                <h2><br><br>Your <br><br> Move <br><br> ${globalPlayers[i].player_name}</h2> 
                </div>                             
                `);
            $("#prop").css({ "text-align": "center", "font-weight": "strong", "border-style": "solid", "border-width": "15px", "border-radius": "7px", "border-color": "#313233" });
        }
    }
}

/* GET BOARD VALUES
 */
function getBoardValue(player, num) {
    $("#buy-opt").show();
    console.log(globalPlayers[player]);
    var owner = boardValues[num].owner;
    console.log("OWNER:", owner);
    console.log(globalPlayers[player]);
    if (boardValues[num].type === 'Property') {
        $('#prop-info').html(`
        <div class="card" id="prop">
        <h4 id="title">${boardValues[num].name}</h4>
        <hr size="30">
        <p>RENT ${boardValues[num].rent}</p>
        <p>With 1 House  ${boardValues[num].rentOne}</p>
        <p>With 2 House  ${boardValues[num].rentTwo}</p>
        <p>With 3 House  ${boardValues[num].rentThree}</p>
        <p>With 4 House  ${boardValues[num].rentFour}</p>
        <p>With HOTEL  ${boardValues[num].rentHotel}</p>
        <p>Mortgage Value ${boardValues[num].mortgage}</p>
        </div>
      `);
        $("#prop").css({ "text-align": "center", "font-weight": "strong", "border-style": "solid", "border-width": "15px", "border-radius": "7px", "border-color": "#313233" });
        if (boardValues[num].id === 23 || boardValues[num].id === 21 || boardValues[num].id === 24) {
            $("#title").css({ "background-color": "#ff0000", "font-weight": "strong" });
        } else if (boardValues[num].id === 01 || boardValues[num].id === 03) {
            $("#title").css({ "background-color": "#A52A2A", "font-weight": "strong", "color": "white" });
        } else if (boardValues[num].id === 06 || boardValues[num].id === 08 || boardValues[num].id === 09) {
            $("#title").css({ "background-color": "#7FFFD4", "font-weight": "strong" });
        } else if (boardValues[num].id === 11 || boardValues[num].id === 13 || boardValues[num].id === 14) {
            $("#title").css({ "background-color": "purple", "font-weight": "strong", "color": "white" });
        } else if (boardValues[num].id === 16 || boardValues[num].id === 18 || boardValues[num].id === 19) {
            $("#title").css({ "background-color": "orange", "font-weight": "strong" });
        } else if (boardValues[num].id === 26 || boardValues[num].id === 27 || boardValues[num].id === 29) {
            $("#title").css({ "background-color": "yellow", "font-weight": "strong" });
        } else if (boardValues[num].id === 31 || boardValues[num].id === 32 || boardValues[num].id === 34) {
            $("#title").css({ "background-color": "green", "font-weight": "strong" });
        } else if (boardValues[num].id === 37 || boardValues[num].id === 39) {
            $("#title").css({ "background-color": "darkblue", "font-weight": "strong", "color": "white" });
        }
        if (boardValues[num].isOwned === false) {
            $('#buy-opt').html(`
                    <label>${boardValues[num].name} is not owned, would you like to purchase property for ${boardValues[num].price}?</label>
                    <button class='btn btn-default' id='buy-prop'>I would love to!</button>
                    <button class='btn btn-default'>Nah, I'm good</button>
                `);
            $('#buy-prop').on('click', function() {
                globalPlayers[player].money -= boardValues[num].price;
                boardValues[num].isOwned = true;
                boardValues[num].owner = globalPlayers[player].playing_order;
                promptPlayer();
            });
        } else if (boardValues[num].isOwned === true && owner != player) {
            $('#buy-opt').html(`
                    <label>${boardValues[num].name} is owned by ${boardValues[num].owner}.</label>
                    <h4>Pay Up ${globalPlayers[player].player_name}!</h4>
                    <br>
                    <p>$${boardValues[num].rent}</p>
                    <button class='btn btn-default' id='rent-owed'>Pay Owner</button>
                    `);
            $('#rent-owed').on('click', function() {
                globalPlayers[player].money -= boardValues[num].rent;
                globalPlayers[owner].money += boardValues[num].rent;
                console.log(globalPlayers[player].player_name, "PAID RENT");
                promptPlayer();
            });
        } else if (globalPlayers[boardValues[num].owner] === globalPlayers[player].uuid) {
            $('#buy-opt').html(`<p>Rest Easy This Property is Yours</p>`);
        } else if (boardValues[num].isMortgaged === true) {
            $('#buy-opt').html(`
                    <label>${boardValues[num].name} is owned and mortgaged.</label>
                    <p>Enjoy your free stay.</p>
                    `);
        }
    } else if (boardValues[num].type === 'RR') {
        $('#prop-info').html(`
                <div class="card" id="rrProp">
                <img src="/assets/img/rr.svg" id="card-img"/>
                <p>${boardValues[num].name}</p>
                <hr size="30">
                <p>Rent                  ${boardValues[num].rent}</p>
                <p>If 2 R.R.'s are owned ${boardValues[num].rentOne}</p>
                <p>If 3 R.R.'s are owned ${boardValues[num].rentTwo}</p>
                <p>If 4 R.R.'s are owned ${boardValues[num].rentThree}</p>
                <br>
                <p>Mortgage Value        ${boardValues[num].mortgage}</p>
                </div>
                `);
        if (boardValues[num].id === 05 || boardValues[num].id === 15 || boardValues[num].id === 25 || boardValues[num].id === 35) {
            $("#rrProp").css({ "text-align": "center", "font-weight": "strong", "border-style": "solid", "border-width": "15px", "border-radius": "7px", "border-color": "#313233" });
        };
        if (boardValues[num].isOwned === false) {
            $('#buy-opt').html(`
                    <label>${boardValues[num].name} is not owned, would you like to purchase property for ${boardValues[num].price}?</label>
                    <button class='btn btn-default' id='buy-prop'>I would love to!</button>
                    <button class='btn btn-default'>Nah, I'm good</button>
                `);
            $('#buy-prop').on('click', function() {
                globalPlayers[player].money -= boardValues[num].price;
                boardValues[num].isOwned = true;
                boardValues[num].owner = globalPlayers[player].playing_order;
                promptPlayer();
            });
        } else if (boardValues[num].isOwned === true && owner != player) {
            $('#buy-opt').html(`
                    <label>${boardValues[num].name} is owned by ${boardValues[num].owner}.</label>
                    <h4>Pay Up ${globalPlayers[player].player_name}!</h4>
                    <br>
                    <p>$${boardValues[num].rent}</p>
                    <button class='btn btn-default' id='rent-owed'>Pay Owner</button>
                    `);
            $('#rent-owed').on('click', function() {
                globalPlayers[player].money -= boardValues[num].rent;
                globalPlayers[owner].money += boardValues[num].rent;
                console.log(globalPlayers[player].player_name, "PAID RENT");
                promptPlayer();
            });
        } else if (globalPlayers[boardValues[num].owner] === globalPlayers[player].uuid) {
            $('#buy-opt').html(`<p>Rest Easy This Property is Yours</p>`);
        } else if (boardValues[num].isMortgaged === true) {
            $('#buy-opt').html(`
                    <label>${boardValues[num].name} is owned and mortgaged.</label>
                    <p>Enjoy your free stay.</p>
                    `);
        }
    } else if (boardValues[num].type === 'Utility') {
        $('#prop-info').html(`
                <div class="card" id="utility-card">
                <p>${boardValues[num].name}</p>

                <hr size="30">
                <p>  If one "Utility" is owned</p>
                <p>rent is 4 times amount shown</p>
                <p>on dice.</p>
                <br>
                <p>  If both "Utilities" are owned</p>
                <p>rent is 10 times amount shown</p>
                <p>on dice.</p>
                <br>
                <p>Mortgage Value ${boardValues[num].mortgage}</p>
                </div>
                `);
        $("#utility-card").css({ "text-align": "center", "font-weight": "strong", "border-style": "solid", "border-width": "15px", "border-radius": "7px", "border-color": "#313233" });

        if (boardValues[num].isOwned === false) {
            $('#buy-opt').html(`
                    <label>${boardValues[num].name} is not owned, would you like to purchase property for ${boardValues[num].price}?</label>
                    <button class='btn btn-default' id='buy-prop'>I would love to!</button>
                    <button class='btn btn-default'>Nah, I'm good</button>
                `);
            promptPlayer();
        } else if (boardValues[num].isOwned === true) {
            $('#buy-opt').html(`
                    <label>${boardValues[num].name} is owned by ${boardValues[num].owner}.</label>
                    <p>You owe them money for rent.</p>
                    <button class="btn btn-default" id="ok">OK</button>
                    `);
            $("#ok").on('click', function() {
                promptPlayer();
            });
        }
    } else if (boardValues[num].id === 4) {
        $('#prop-info').html(`
                <div class="card" id="tax-card">
                <label>${boardValues[num].name}</label>
                <br>
                <p>Pay 10%</p>
                <p>   or   </p>
                <p>$200</p>
                </div>
                `);
        $('#buy-opt').html(`
                <button class="btn btn-default" id="ok">>Pay 10%</button>
                <button class="btn btn-default" id="ok">>Pay $200</button>
                `);
        $("#tax-card").css({ "text-align": "center", "font-weight": "strong", "border-style": "solid", "border-width": "15px", "border-radius": "7px", "border-color": "#313233" });
        $("#ok").on('click', function() {
            promptPlayer();
        });
    } else if (boardValues[num].id === 38) {
        $('#prop-info').html(`
                <div class="card" id="tax-card">
                <label>LUXURY TAX</label>
                <br>
                <pPAY $75.00</p>   
                </div> 
                `);
        $('#buy-opt').html(`
                <button class='btn btn-default' id="ok">Pay $75</button>
                `);
        $("#tax-card").css({ "text-align": "center", "font-weight": "strong", "border-style": "solid", "border-width": "15px", "border-radius": "7px", "border-color": "#313233" });

        $("#ok").on('click', function() {
            promptPlayer();
        });
    } else if (boardValues[num].type === 'Chance') {
        $('#prop-info').html(`
            <div class="card" id="chance-card">
                <h4>CHANCE</h4> 
                <br>
                <br>
                <img src="/assets/img/chance.svg" id="card-img"/> 
                </div>  
                `);
        $('#buy-opt').html(`
            <button class="btn btn-default" id="ok">OK</button>
                `);
        $("#chance-card").css({ "text-align": "center", "font-weight": "strong", "border-style": "solid", "border-width": "15px", "border-radius": "7px", "border-color": "#313233" });

        $("#ok").on('click', function() {
            promptPlayer();
        });

    } else if (boardValues[num].type === 'Chest') {
        $('#prop-info').html(`
                <div class="card" id="chest-card">
                <h4>COMMUNITY CHEST</h4>
                <br>
                <br>
                <img src="/assets/img/chest.svg" id="card-img"/>
                </div>
                `);
        $('#buy-opt').html(`
            <button class="btn btn-default" id="ok">OK</button>
                `);
        $("#chest-card").css({ "text-align": "center", "font-weight": "strong", "border-style": "solid", "border-width": "15px", "border-radius": "7px", "border-color": "#313233" });

        $("#ok").on('click', function() {
            promptPlayer();
        });
    } else if (boardValues[num].type === 'Go') {
        $('#prop-info').html(`
                <div class="card" id="go">
                <label>GO</label>
                <br>
                <br>
                <img src="/assets/img/go.svg" id="card-img"/>
                <p>COLLECT</p>
                <p>$200.00 SALARY</p>
                <p>AS YOU PASS</p>
                </div>
                `);
        $('#buy-opt').html(`
            <button class="btn btn-default" id="ok">OK</button>
                `);
        $("#go").css({ "text-align": "center", "font-weight": "strong", "border-style": "solid", "border-width": "15px", "border-radius": "7px", "border-color": "#313233" });

        $("#ok").on('click', function() {
            promptPlayer();
        });
    } else if (boardValues[num].type === 'Free') {
        $('#prop-info').html(`
                <div class="card" id="parking">
                <label>FREE PARKING</label>
                <br>
                <br>
                <img src="/assets/img/free-parking.svg" id="card-img"/>
                </div>
                `);
        $('#buy-opt').html(`
            <button class="btn btn-default" id="ok">OK</button>
                `);
        $("#parking").css({ "text-align": "center", "font-weight": "strong", "border-style": "solid", "border-width": "15px", "border-radius": "7px", "border-color": "#313233" });

        $("#ok").on('click', function() {
            promptPlayer();
        });
    } else if (boardValues[num].type === 'Jail') {
        $('#prop-info').html(`
                <label>GO TO JAIL</label>
                <p>Go directly to jail</p>
                <p>Do not pass go,</p>
                <p>Do not collect $200</p>
                `);
        $('#buy-opt').html(`
                        <button class="btn btn-default" id="ok">OK</button>
                `);
        $("#ok").on('click', function() {
            promptPlayer();
        });
    } else if (boardValues[num].type === 'Visiting') {
        $('#prop-info').html(`
                <label>JUST VISITING</label>
                `);
        $('#buy-opt').html(`
                        <button class="btn btn-default" id="ok">OK</button>
                `);
        $("#ok").on('click', function() {
            promptPlayer();
        });
    } else if (boardValues[num].id === 10) {
        $('#prop-info').html(`
                <label>JUST VISITING</label>
                `);
        $('#buy-opt').html(`
                        <button class="btn btn-default" id="ok">OK</button>
                `);
        $("#ok").on('click', function() {
            promptPlayer();
        });
    }

}
/*====     API     =====
 */
// Get Players API
function getPlayer(data) {
    $.get('/api/players', function(data) {
        data.sort(function(a, b) {
            return parseFloat(a.roll) - parseFloat(b.roll);
        });
        globalPlayers = data;
        playingOrder();
        // Appending values
        globalPlayers.forEach(function(element, index, globalPlayers) {
            var playerPiece = "#" + element.piece;
            console.log(playerPiece);
            console.log(element);
            // Append Snap.svg piece as string
            element.player_piece = playerPiece;
            element.playing_order = index;
            // $(playerPiece).show();
        });
        console.log(snapPieces);
        return data;

    });
}
// Get Board Values API
function getBoard(data) {
    $.get('/api/propertys', function(data) {
        boardValues = data;
        console.log(boardValues);
    });
}
