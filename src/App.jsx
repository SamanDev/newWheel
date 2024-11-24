import React, { useState, useEffect } from "react";

import { Howl } from "howler";
import { Popup } from "semantic-ui-react";
import $ from "jquery";
import Info from "./components/Info";
import Wheel from "./components/Wheel";
import Loaderr from "./components/Loader";
const segments = [0, 2, 4, 2, 10, 2, 4, 2, 8, 2, 4, 2, 25, 2, 4, 2, 8, 2, 4, 2, 10, 2, 4, 2, 8, 2, 4, 2, 20];

let _auth = null;
const loc = new URL(window.location);
const pathArr = loc.pathname.toString().split("/");

if (pathArr.length == 3) {
    _auth = pathArr[1];
}
//_auth = "farshad-HangOver2";
//console.log(_auth);

//const WEB_URL = process.env.REACT_APP_MODE === "production" ? `wss://${process.env.REACT_APP_DOMAIN_NAME}/` : `ws://${loc.hostname}:8080`;
const WEB_URL = `wss://mwheel.wheelofpersia.com/`;
// (A) LOCK SCREEN ORIENTATION
const betAreas = [{ x: 2 }, { x: 4 }, { x: 8 }, { x: 10 }, { x: 20 }, { x: 25 }];
const getcolor = (item) => {
    var def = "#000000";

    if (item == 25) {
        def = "#e57452";
    }
    if (item == 4) {
        def = "#e05b89";
    }
    if (item == 10) {
        def = "#8de29d";
    }
    if (item == 8) {
        def = "#fdf65d";
    }
    if (item == 20) {
        def = "#9277de";
    }
    if (item == 2) {
        def = "#6fc2d3";
    }

    return def;
};
const getcolortext = (item) => {
    var def = "#ffffff";
    if (parseInt(item) == 8) {
        def = "#000000";
    }
    return def;
};
const doCurrency = (value) => {
    var val = value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return val;
};
const doCurrencyMil = (value, fix) => {
    if (value < 1000000) {
        var val = doCurrency(parseFloat(value / 1000).toFixed(fix || fix == 0 ? fix : 0)) + "K";
    } else {
        var val = doCurrency(parseFloat(value / 1000000).toFixed(fix || fix == 0 ? fix : 1)) + "M";
        val = val.replace(".0", "");
    }
    return val;
};
function checkbox() {
    if ($("#cadr2:visible").length) {
        $("#cadr").show();
        $("#cadr2").hide();
    } else {
        $("#cadr2").show();
        $("#cadr").hide();
    }
}
setInterval(() => {
    checkbox();
}, 500);
const haveSideBet = (sideBets, nickname, seat, mode) => {
    var _have = false;
    sideBets
        .filter((sideBet) => sideBet?.seat == seat && sideBet?.mode == mode && sideBet?.nickname == nickname)
        .map(function (bet) {
            _have = bet.amount;
        });
    return _have;
};
const AppOrtion = () => {
    var gWidth = $("#root").width() / 1400;
    var gHight = $("#root").height() / 850;
    var scale = gWidth<gHight?gWidth:gHight;
    var highProtect = $("#root").height() * scale;
    //console.log($("#root").width(),$("#root").height());
   // console.log(gWidth,gHight,scale);
   
    

    if (highProtect > 850) {
        //console.log(gWidth,gHight,highProtect);
        //gHight = $("#root").height() / 850;
        // scale = (scale + gHight)/2;
        scale = gHight;
        highProtect = $("#root").height() * scale;
        var _t = ($("#root").height() - highProtect)/2;
        if(_t<0){_t=_t*-1}
        
        if (scale < 1) {
            setTimeout(() => {
                $("#scale").css("transform", "scale(" + scale + ")");
            }, 10);
        } else {
            scale = 1;
            setTimeout(() => {
                $("#scale").css("transform", "scale(" + scale + ") translateY("+_t+"px)");
            }, 10);
        }
    } else {
       // gHight = $("#root").height() / 850;
        // scale = (scale + gHight)/2;
      //  scale = gHight;
      var _t = ($("#root").height() - highProtect)/2;
   if(_t<0){_t=_t*-1}
        if (scale < 1) {
            
            setTimeout(() => {
                $("#scale").css("transform", "scale(" + scale + ") translateY("+_t+"px)");
            }, 10);
        } else {
            scale = 1;
            setTimeout(() => {
                $("#scale").css("transform", "scale(" + scale + ") translateY("+_t+"px)");
            }, 10);
        }
    }

    // console.log(gWidth,highProtect,gHight,scale)
};
const socket = new WebSocket(WEB_URL, _auth);
window.addEventListener("message", function (event) {
    if (event?.data?.username) {
        const payLoad = {
            method: "syncBalance",

            balance: event?.data?.balance,
        };
        try {
            socket.send(JSON.stringify(payLoad));
        } catch (error) {}
    }
});
var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

window.addEventListener(
    orientationEvent,
    function () {
        AppOrtion();
    },
    false
);
window.parent.postMessage("userget", "*");

if (window.self == window.top) {
    window.location.href = "https://www.google.com/";
}
let dealingSound = new Howl({
    src: ["/sounds/dealing_card_fix3.mp3"],
    volume: 0.5,
});
let chipHover = new Howl({
    src: ["/sounds/chip_hover_fix.mp3"],
    volume: 0.1,
});
let chipPlace = new Howl({
    src: ["/sounds/chip_place.mp3"],
    volume: 0.1,
});
let actionClick = new Howl({
    src: ["/sounds/actionClick.mp3"],
    volume: 0.1,
});
let defaultClick = new Howl({
    src: ["/sounds/click_default.mp3"],
    volume: 0.1,
});
let clickFiller = new Howl({
    src: ["/sounds/click_filler.mp3"],
    volume: 0.1,
});
let timerRunningOut = new Howl({
    src: ["/sounds/timer_running_out.mp3"],
    volume: 0.5,
});

// let youWin = new Howl({
//   src: ['/sounds/you_win.mp3']
// });
// let youLose = new Howl({
//   src: ['/sounds/you_lose.mp3']
// });
//$("body").css("background", "radial-gradient(#833838, #421e1e)");
const BlackjackGame = () => {
    var _countBet = 0;

    var _totalBet = 0;
    var _totalWin = 0;
    const [gamesData, setGamesData] = useState([]);

    const [lasts, setLasts] = useState([]);
    const [gameData, setGameData] = useState(null); // Baraye zakhire JSON object
    const [userData, setUserData] = useState(null);

    const [conn, setConn] = useState(true);
    const [gameId, setGameId] = useState("Wheel01");
    const [gameTimer, setGameTimer] = useState(-1);
    const [online, setOnline] = useState(0);
    const checkBets = (seat, username) => {
        var check = true;
        var userbet = gameData.players.filter((bet) => bet.seat == seat && bet.nickname == username);
        if (userbet.length) {
            check = false;
        }

        return check;
    };
    const getTotalBets = (seat) => {
        var userbet = gameData.players.filter((bet) => bet.seat == seat);
        var Total = 0;
        userbet.map(function (bet, i) {
            Total = Total + bet.amount;
        });
        return doCurrencyMil(Total);
    };
    const getBets = (seat, username) => {
        var userbet = gameData.players.filter((bet) => bet.seat == seat && bet.nickname == username);

        return userbet[0];
    };
    const getAllBets = (seat, username) => {
        var userbet = gameData.players.filter((bet) => bet.seat == seat && bet.nickname != username);

        return userbet;
    };

    const getPercent = (seat) => {
        var userbet = lasts.filter((x) => segments[x] == seat.x).length;

        return parseFloat((userbet / lasts.length) * 100).toFixed(0);
    };
    useEffect(() => {
        // Event onopen baraye vaghti ke websocket baz shode

        socket.onopen = () => {
            console.log("WebSocket connected");
            setTimeout(() => {
                socket.send(JSON.stringify({ method: "join", gameId: gameId }));
            }, 2000);
        };

        // Event onmessage baraye daryaft data az server
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data); // Parse kardan JSON daryafti
            //console.log("Game data received: ", data);
            if (data.method == "tables") {
                setGamesData(data.games);

                // Update kardan state
            }
            if (data.method == "connect") {
                if (data.theClient?.balance >= 0) {
                    setUserData(data.theClient);
                } else {
                    setUserData(data.theClient);
                    // setConn(false);
                    //_auth = null;
                }
                // Update kardan state
            }
            if (data.method == "timer") {
                setGameTimer(data.sec);
                if (data.sec == 5) {
                    timerRunningOut.play();
                }
                // Update kardan state
            }

            if (data.method == "lasts") {
                setLasts(data.total);
            }
        };

        // Event onclose baraye vaghti ke websocket baste mishe
        socket.onclose = () => {
            console.log("WebSocket closed");
            setConn(false);
            _auth = null;
        };

        // Cleanup websocket dar zamane unmount kardan component
        return () => {
            // socket.close();
        };
    }, []);

    useEffect(() => {
        
       
        if (gamesData.length) {
            const _data = gamesData.filter((game) => game?.id === gameId)[0];
            //console.log(_data);
            if (_data.players.length == 0) {
                setGameTimer(15);
                setTimeout(() => {
         
                    $(".betButtons").hover(
                        function () {
                            // console.log('hi');
        
                            chipHover.play();
                        },
                        function () {
                            // play nothing when mouse leaves chip
                        }
                    );
                }, 10);
            }
            setGameData(_data);
        }
        //AppOrtion();
    }, [gamesData]);
    
    useEffect(() => {
        setTimeout(() => {
         
            AppOrtion();
        }, 500);
        
    }, []);
    // Agar gaData nist, ye matn "Loading" neshan bede
    
   
   

    if (_auth == null || !conn || !gamesData ||!gameData|| !userData || lasts.length == 0) {
        return <Loaderr errcon={!gamesData||!gameData || !userData || lasts.length == 0?false:true} />;
    }
    gameData.players.map(function (player, pNumber) {
        if (player.nickname == userData.nickname) {
            _countBet = _countBet + 1;
            _totalBet = _totalBet + player.amount;
            _totalWin = _totalWin + player.win;
        }
    });
    return (
        <div>
            <div className="game-room" id="scale">
                <Info online={online} />
                <div id="balance-bet-box">
                    <div className="balance-bet">
                        Balance
                        <div id="balance">{doCurrency(userData.balance)}</div>
                    </div>
                    <div className="balance-bet">
                        Total Bet
                        <div id="total-bet">{doCurrency(_totalBet)}</div>
                    </div>
                    <div className="balance-bet">
                        Total Win
                        <div id="total-bet">{doCurrency(_totalWin)}</div>
                    </div>
                </div>
                <div id="volume-button">
                    <i className="fas fa-volume-up"></i>
                </div>
                {gameTimer >= 1 && !gameData.gameOn && gameData.gameStart && (
                    <div id="deal-start-label" >
                        <p className="animate__bounceIn animate__animated animate__infinite" style={{animationDuration:'1s'}}>
                            Waiting for bets <span>{gameTimer}</span>
                        </p>
                    </div>
                )}

                <div id="dealer">
                    {lasts.length>0 && (
                        <div className="dealer-cards">
                            {lasts.map(function (x, i) {
                                if (i < 50) {
                                    var card = segments[x];
                                    return (
                                        <div className="visibleCards animate__flipInY animate__animated" key={i} style={{ animationDelay: (i + 1) * 90 + "ms", background: getcolor(card), color: getcolortext(card) }}>
                                            x{card}
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
                <Wheel number={gameData.number} status={gameData.status} last={lasts[0]} gameTimer={gameTimer} time={gameData.startTimer} />
                <div id="players-container">
                    {betAreas.map(function (player, pNumber) {
                        var _resClass = "";
                        var _resCoinClass = "animate__slideInDown";
                        var _res = "";

                        var _renge = [gameData.min];
                        _renge.push(_renge[0] * 2);
                        _renge.push(_renge[0] * 5);
                        _renge.push(_renge[0] * 10);
                        var pBet = getBets(pNumber, userData.nickname);
                        var allBet = getAllBets(pNumber, userData.nickname);
                        if (pBet) {
                            pBet.bet = pBet.amount;
                        }
                        return (
                            <span  id={"slot"+pNumber} className={gameData.status == "Done" && gameData.gameOn && player.x == segments[gameData.number] ? "players result-win" : gameData.status == "Done" && gameData.gameOn ? "players result-lose" : "players"} key={pNumber} style={getTotalBets(pNumber)=="0K" && gameData.gameOn?{opacity:.1}:{}}>
                                <div className={gameData.gameOn || gameData.min * 1000 > userData.balance || pBet ? "active empty-slot noclick-nohide" : "empty-slot noclick-nohide"} style={{ background: getcolor(player.x), color: getcolortext(player.x) }}>
                                    x{player.x}
                                </div>
                                {!gameData.gameOn && gameTimer >= 0 && checkBets(pNumber, userData.nickname) && (
                                    <div id="bets-container">
                                        {_renge.map(function (bet, i) {
                                            if (bet * 1000 <= userData.balance) {
                                                return (
                                                    <span key={i} className={gameTimer < 2 && gameTimer >= -1 && gameData.gameStart ? "animate__zoomOut animate__animated" : ""}>
                                                        <button
                                                            className="betButtons update-balance-bet animate__animated animate__zoomInUp"
                                                            style={{ animationDelay: i * 100 + "ms" }}
                                                            id={"chip" + i}
                                                            value={bet * 1000}
                                                            onClick={() => {
                                                                chipPlace.play();
                                                                $('#slot'+pNumber+' .betButtons').addClass('noclick-nohide');
                                                                socket.send(JSON.stringify({ method: "bet", amount: bet * 1000, theClient: userData, gameId: gameData.id, seat: pNumber }));
                                                            }}
                                                        >
                                                            {doCurrencyMil(bet * 1000)}
                                                        </button>
                                                    </span>
                                                );
                                            } else {
                                                return (
                                                    <span key={i} className={gameTimer < 2 && gameTimer >= -1 && gameData.gameStart ? "animate__zoomOut animate__animated" : ""}>
                                                        <button className="betButtons update-balance-bet noclick noclick-nohide animate__animated animate__zoomInUp" style={{ animationDelay: i * 100 + "ms" }} id={"chip" + i} value={bet * 1000}>
                                                            {doCurrencyMil(bet * 1000)}
                                                        </button>
                                                    </span>
                                                );
                                            }
                                        })}
                                    </div>
                                )}

                                {pBet && (
                                    <div className={"player-coin"}>
                                        <button className="betButtons update-balance-bet noclick animate__animated animate__rotateIn" id={"chip" + _renge.findIndex((bet) => bet == pBet.bet / 1000)}>
                                            {doCurrencyMil(pBet.bet)}
                                        </button>
                                    </div>
                                )}

                                {allBet.length > 0 && (
                                    <div className={"player-coin all"}>
                                        {allBet.map(function (player, pNumber) {
                                            return (
                                                <Popup
                                                    key={pNumber}
                                                    size="mini"
                                                    inverted
                                                    trigger={
                                                        <button className="betButtons  animate__animated animate__zoomInDown" style={{ animationDelay: (pNumber + 1) * 50 + "ms", left: pNumber * 5, top: pNumber * 45 }} id={"chip" + _renge.findIndex((bet) => bet == player.amount / 1000)}>
                                                            {doCurrencyMil(player.amount)}
                                                        </button>
                                                    }
                                                    content={
                                                        <div style={{minWidth:120}}>
                                                            <img src={"/imgs/avatars/" + player?.avatar + ".webp"} style={{ height: 30, marginRight: 10, float: "left" }} />
                                                            {player.nickname}
                                                            <br />
                                                            <small>{doCurrencyMil(player.amount)}</small>
                                                        </div>
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="percent">
                                    {gameData.gameOn ? (
                                        <>
                                            <b>{getTotalBets(pNumber)}</b>
                                            <br />
                                            Total Bets
                                        </>
                                    ) : (
                                        <>
                                            <b>{getPercent(player)}%</b>
                                            <br />
                                            in Last {lasts.length}
                                        </>
                                    )}
                                </div>
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BlackjackGame;
