import React, { useState, useEffect } from "react";

import { Howl } from "howler";
import { Popup } from "semantic-ui-react";
import $ from "jquery";

import Wheel from "./components/WheelNew";
import Loaderr from "./components/Loader";
const segments = [0, 2, 4, 2, 10, 2, 4, 2, 8, 2, 4, 2, 25, 2, 4, 2, 8, 2, 4, 2, 10, 2, 4, 2, 8, 2, 4, 2, 20];

let _auth = null;
const loc = new URL(window.location);
const pathArr = loc.pathname.toString().split("/");

if (pathArr.length == 3) {
    _auth = pathArr[1] + "___" + pathArr[2];
}
//_auth = "farshad-HangOver2";
//console.log(_auth);

//const WEB_URL = process.env.REACT_APP_MODE === "production" ? `wss://${process.env.REACT_APP_DOMAIN_NAME}/` : `ws://${loc.hostname}:8080`;
//const WEB_URL = `wss://mwheel.wheelofpersia.com/`;
//const WEB_URL = `ws://${loc.hostname}:8100/wheel`;
const WEB_URL = `wss://server.wheelofpersia.com/wheel`;
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



window.parent.postMessage("userget", "*");

if (window.self === window.top && WEB_URL.indexOf("localhost")==-1) {
    window.location.href = "https://www.google.com/";
}

let chipHover = new Howl({
    src: ["/sounds/chip_hover_fix.mp3"],
    volume: 0.1,
});
let chipPlace = new Howl({
    src: ["/sounds/chip_place.mp3"],
    volume: 0.1,
});
let timerRunningOut = new Howl({
    src: ["/sounds/timer_running_out.mp3"],
    volume: 0.5,
    rate: 0.4
});
function useScale(rootId = "root", scaleId = "scale", gamesData, conn) {

    useEffect(() => {

        const doScale = () => {
            try {
                const root = document.getElementById(rootId);
                const scaleEl = document.getElementById(scaleId);

                if (!root || !scaleEl) return;
                const gWidth = root.clientWidth / 1400;
                const gHeight = root.clientHeight / 850;
                let scale = Math.min(gWidth, gHeight);

                if (scale > 1) scale = 1;
                // center translation to keep proportions (approximate)



                const target = 800 - gHeight;
                let t = (800 - target) / 2;
                scaleEl.style.transform = `scale(${scale}) translateY(${t}px)`;

            } catch (e) {
                // ignore
            }
        };
        window.addEventListener("resize", doScale);
        window.addEventListener("orientationchange", doScale);
        // initial

        setTimeout(doScale, 50);



        return () => {
            window.removeEventListener("resize", doScale);
            window.removeEventListener("orientationchange", doScale);
        };
    }, [gamesData, conn]);

}
function animateNum() {
    $('.counter').each(function () {
        var $this = $(this),
            countTo = $this.attr('data-count'),
            countFrom = $this.attr('start-num') ? $this.attr('start-num') : parseInt($this.text().replace(/,/g, ""));

        if (countTo != countFrom && !$this.hasClass('doing')) {
            $this.attr('start-num', countFrom);
            // $this.addClass("doing");

            $({ countNum: countFrom }).animate({
                countNum: countTo
            },

                {

                    duration: 400,
                    easing: 'linear',

                    step: function () {
                        //$this.attr('start-num',Math.floor(this.countNum));
                        $this.text(doCurrency(Math.floor(this.countNum)));
                    },
                    complete: function () {
                        $this.text(doCurrency(this.countNum));
                        $this.attr('start-num', Math.floor(this.countNum));
                        //$this.removeClass("doing");
                        //alert('finished');
                    }

                });


        } else {
            if ($this.hasClass('doing')) {
                $this.attr('start-num', countFrom);
                $this.removeClass("doing");
            } else {
                $this.attr('start-num', countFrom);
            }
        }
    });
}

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
     useScale("root", "scale", gamesData, conn);
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
                setInterval(() => {

                    socket.send(JSON.stringify({ method: "ping" }));
                }, 15000);
                // Update kardan state
            }
            if (data.method == "timer") {
                
                if (data.sec === 10) {
                timerRunningOut.fade(0, 0.5, 2000);
                timerRunningOut.play();
            }
            if (data.sec == 3) {

                timerRunningOut.fade(0.5, 0, 4000);
            }
            setGameTimer(data.sec);
            }

            if (data.method == "lasts") {
                $('body').css('background',getcolor(segments[data.total[0]]))
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
        setTimeout(() => {
            animateNum()
          
        }, 100);
        
    }, [gamesData]);
    
  
    // Agar gaData nist, ye matn "Loading" neshan bede
    
   
   

    if (!conn || !gamesData ||!gameData|| !userData || lasts.length == 0) {
        return  <div>
            <div className={"game-room"} id="scale">
                <Loaderr errcon={!gamesData||!gameData || !userData || lasts.length == 0?false:true} /></div></div>;
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
            <div className={"game-room"} id="scale">
                <div className="fix">
         
                <div id="balance-bet-box">
                <div className="balance-bet">
                            Balance
                            <div id="balance" className="counter" data-count={userData.balance}></div>
                        </div>
                        <div className="balance-bet">
                            Yout Bets
                            <div id="total-bet" className="counter" data-count={_totalBet}></div>
                        </div>
                        <div className="balance-bet">
                            Your Wins
                            <div id="total-bet" className="counter" data-count={_totalWin}></div>
                        </div>
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
                                        <div className="visibleCards animate__fadeIn animate__animated" key={i} style={{ animationDelay: (i + 1) * 90 + "ms", background: getcolor(card), color: getcolortext(card) }}>
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
                                                            className="betButtons  animate__faster animate__animated animate__zoomInUp"
                                                            style={{ animationDelay: i * 100 + "ms" }}
                                                            id={"chip" + i}
                                                            value={bet * 1000}
                                                            onClick={() => {
                                                                {$('body').css('background',getcolor(player.x))}
                                                                chipPlace.play();
                                                                $("#slot" + pNumber + " #bets-container .betButtons").removeAttr('style').removeClass('animate__zoomInUp').addClass("noclick-nohide animate__zoomOut");
                                                               
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
                                                        <button className="betButtons noclick noclick-nohide animate__animated animate__zoomInUp" style={{ animationDelay: i * 100 + "ms" }} id={"chip" + i} value={bet * 1000}>
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
                                        <button className="betButtons noclick animate__animated animate__rotateIn" id={"chip" + _renge.findIndex((bet) => bet == pBet.bet / 1000)}>
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
                                                    on='hover'
                                                    trigger={
                                                        <button className="betButtons animate__animated animate__zoomInDown" style={{ animationDelay: (pNumber + 1) * 50 + "ms", left: pNumber * 5, top: pNumber * 15 }} id={"chip" + _renge.findIndex((bet) => bet == player.amount / 1000)}>
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
            </div>
     
   
    );
};

export default BlackjackGame;
