import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
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
const WheelContect = (prop) => {
    
const [mustSpin, setMustSpin] = useState(false);

const [mustSpinFF, setMustSpinFF] = useState(false);
const [prizeNumber, setPrizeNumber] = useState(0);
    const [timer, setTimer] = useState(prop.time);
   
    
    useEffect(() => {
        if (!mustSpin && prop.status == "Spin") {
           
                const newPrizeNumber = prop.number;
                setMustSpinFF(true);
                setPrizeNumber(newPrizeNumber);
                setMustSpin(true);
                
            //const newPrizeNumber = Math.floor(Math.random() * _l.length);
        }
    }, [prop.status]);
    useEffect(() => {
        setTimer(prop.time);
    }, [prop.time]);

    return (
        <div className={prop.status=="Spin"||prop.gameTimer<3?"lastwheel Spin":"lastwheel "+prop.status}>

            <div className="shadow"></div>
                <div className="countover">
                    {prop.status == "Spin" ? (
                        <>
                            <img src="/imgs/cadr3.png" id="cadr" />
                            <img src="/imgs/cadr4.png" id="cadr2" />
                        </>
                    ) : (
                        <>
                            <img src="/imgs/cadr3.png"  />
                            <img src="/imgs/cadr4.png" />
                        </>
                    )}
                </div>
                <Wheel
                    data={_l}
                    outerBorderWidth={0}
                    outerBorderColor={"#eeeeee"}
                    innerRadius={10}
                    innerBorderColor={"#000000"}
                    innerBorderWidth={0}
                    radiusLineColor={"#000000"}
                    radiusLineWidth={0}
                    textDistance={80}
                    fontSize={20}
                    spinDuration={parseFloat(1*timer/15).toFixed(2)}
                    startingOptionIndex={!mustSpinFF?prop.last:-1}
                    disableInitialAnimation={false}
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    pointerProps={{src:'/imgs/avatars/baby.svg'}}
                    onStopSpinning={() => {
                        setMustSpin(false);
                    }}
                />
            
        </div>
    );
};
export default WheelContect;
