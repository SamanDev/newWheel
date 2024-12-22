import React, { useState, useEffect } from "react";
import $ from "jquery";

const segments = [0, 2, 4, 2, 10, 2, 4, 2, 8, 2, 4, 2, 25, 2, 4, 2, 8, 2, 4, 2, 10, 2, 4, 2, 8, 2, 4, 2, 20];
var _l = [];
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
segments.map((item, i) => {
    _l.push({
        option: "x" + item,
        style: {
            backgroundColor: getcolor(item),
            textColor: getcolortext(item),
        },
    });
});
let sectors = [];
segments.map((item, i) => {
    sectors.push({
        label: "x" + item,
        color: getcolor(item),
        textColor: getcolortext(item),
    });
});
function checkbox() {
    if ($("#cadr2:visible").length) {
        $("#cadr").show();
        $("#cadr2").hide();
    } else {
        $("#cadr2").show();
        $("#cadr").hide();
    }
}
var lightMod;
const WheelContect = (prop) => {
    const [mustSpin, setMustSpin] = useState(false);

    const [mustSpinFF, setMustSpinFF] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [timer, setTimer] = useState(prop.time);
    
    const initGame = (num, rot) => {
        if (document.getElementsByTagName("canvas")[0]) {
            const tot = 360 / sectors.length;
            const ctx = document.querySelector("#wheel").getContext("2d");
            if (!$("canvas").hasClass("drowed")) {
                $("canvas").addClass("drowed");
                var canvas = document.getElementsByTagName("canvas")[0];
                canvas.width = 600;
                canvas.height = 600;

                const dia = ctx.canvas.width;
                const rad = dia / 2;
                const PI = Math.PI;
                const TAU = 2 * PI;
                const arc = TAU / sectors.length;

                function drawSector(sector, i) {
                    const ang = arc * i;
                    ctx.save();
                    // COLOR
                    ctx.beginPath();
                    ctx.fillStyle = sector.color;
                    ctx.moveTo(rad, rad);
                    ctx.arc(rad, rad, rad, ang, ang + arc);
                    ctx.lineTo(rad, rad);
                    ctx.fill();
                    // TEXT
                    ctx.translate(rad, rad);
                    ctx.rotate(ang + arc / 2);
                    ctx.textAlign = "right";
                    ctx.fillStyle = sector.textColor;
                    ctx.font = "bold 22px sans-serif";
                  
                    ctx.fillText(sector.label, rad - 50, 7);

                    //
                    ctx.restore();
                }
                sectors.forEach(drawSector);
                rot = true;
            }
            const defnum = num;
            function rotate() {
                const mydeg = tot * 21 + Math.floor((Math.random() * tot) / 1.5);
                //console.log(tot * 28, defnum);

                ctx.canvas.style.transform = `rotate(${mydeg - defnum * tot}deg)`;
            }
            if (rot) rotate();
        }
    };
    useEffect(() => {
       // console.log(prop);
        
        if (prop.status == "Spin") {
            if(timer!=15){ setTimer(prop.time);}
            
            $(".lastwheel").addClass("Spin");
            lightMod = setInterval(() => {
                checkbox();
            }, 1000);
            $("#dospin").removeClass("frz").addClass("dospin");
            $("canvas").removeClass("frz");

            initGame(prop.number, true);

            //const newPrizeNumber = Math.floor(Math.random() * _l.length);
        } else {
            setTimer(15);
            $(".lastwheel").removeClass("Spin");
            clearInterval(lightMod);
            $("#dospin").addClass("frz").removeClass("dospin");
            $("canvas").addClass("frz");
            initGame(prop.number);
        }
    }, [prop.status,prop.number]);
   

    return (
        <div className={"lastwheel"}>
            <div>
                <div className="shadow"></div>
                <div className="countover">
                    <img src="/imgs/cadr3.png" id="cadr" />
                    <img src="/imgs/cadr4.png" id="cadr2" style={{ display: "none" }} />
                </div>
                <div id="wheelOfFortune">
                    <div id="dospin" className="" style={{ transitionDuration: timer-3 + "s" }}>
                        <canvas id="wheel" width="450" height="450" style={{ transitionDuration: timer-6 + "s" }}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default WheelContect;
