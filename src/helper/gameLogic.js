class gameLogic {
    constructor() {
        this.rolls = [];
        this.currentRoll = 0;
    }

    static createGame = () => new gameLogic();

    resetGame = () => {
        this.rolls = [];
        this.currentRoll = 0;
    };

    //records input pins knocked down
    roll = (pins) => {
        this.rolls[this.currentRoll] = pins;
        this.currentRoll++;
    }
    
    //need a function to determine how many pins remain after a roll

    pinsLeft = () => {
        const score = this.score();
        let pinsLeft = 10; //initialize pins remaining
        let n = score.length;

        for(let i=0;i<n;i++){
            if(score[i] !== null && !isNaN(score[i].pinsLeft)){
                pinsLeft = score[i].pinsLeft;
            }
        }

        return pinsLeft;

    }
    //update the entire scoreboard every time this function is called, which is whenever an input is made.
    //this is because of the whole strike/spare point system 
    score = () => {
        let cumulativeScore = [];
        let score = 0;

        let firstFrame = 0; 
        
        //when rolling a spare, the extra value you get from it comes in the form of a third roll, from the next frame. 
        //when rolling a strike, it's two values from the next frame
        //hence why a second and third roll is needed.
        
        const firstRoll = () => this.rolls[firstFrame];
        const secondRoll = () => this.rolls[firstFrame+1];
        const thirdRoll = () => this.rolls[firstFrame+2];

        
        
        const spareValue = () => {
            return thirdRoll()*1;
        }
        
        const strikeValue = () => {
            return secondRoll()*1 + thirdRoll()*1;
        }


        //boolean checks for strike/spare
        const isStrike = () => {
            return firstRoll()*1 === 10;
        }
        const isSpare = () => {
            return firstRoll()*1 + secondRoll()*1 === 10;
        }

        //the 10th round has exceptions, if its a spare or strike, you can get an extra round in, so this function handles that
        const updateFrame = (cumulativeScore, firstScore, secondScore, score, pinsLeft) => {
            if(cumulativeScore.length < 9){
                cumulativeScore.push({
                    firstScore,
                    secondScore, 
                    totalScore : score,
                    pinsLeft
                });
            }
            else{
                //could probably turn these into ternary expressions..
                let firstBox;
                if(firstRoll()*1 === 10){
                    firstBox = "X";
                }
                else{
                    firstBox = firstRoll();
                }

                let secondBox;
                if(secondRoll()*1 === 10){
                    secondBox = "X"
                }
                else{
                    if(isSpare()){
                        secondBox = "/";
                    }
                    else{
                        secondBox = secondRoll();
                    }
                }

                
                //only applicable for the last frame
                let third;
                if(thirdRoll()*1 === 10){
                    third = "X";
                }
                else if(firstRoll()*1 === 10 || firstRoll()*1 + secondRoll()*1 === 10){
                    third = thirdRoll();
                }
                else{
                    third = ""
                }

                const first = firstBox;
                const second = secondBox;

                cumulativeScore.push({
                    firstScore: first,
                    secondScore: second,
                    totalScore: score,
                    pinsLeft,
                    thirdScore:third
                });

            };
        };

        //updating all the rolls
        //the firstFrame variable tracks the current ROLL (a bit badly named). If a strike is rolled before, only need to increment once since the bonus points depend on both of the following rolls
        //above, the code takes the following two rolls (secondRoll, thirdRoll), so those are taken into account here
        //in a spare situation, the bonus points depend on only the next roll after the frame, so increment rolls twice
        //in any other situation, increment twice to get to the next full frame

        for (let i = 0; i < 10; i++) {
            let firstVal = firstRoll();
            let secondVal = secondRoll();

            if(isStrike()){
                score += 10 + strikeValue();
                updateFrame(cumulativeScore, "", "X", score, 10);
                firstFrame++;
            }
            else if(isSpare()){
                score += 10 + spareValue();
                updateFrame(cumulativeScore, firstVal, "/", score, 10);
                firstFrame += 2;
            } 
            else{

                score += (firstVal*1 + secondVal*1);
                let remainingPins;
                if(secondVal !== undefined){
                    remainingPins = 10;
                }
                else{
                    remainingPins = 10 - firstVal;
                }
                const pinsLeft = remainingPins

                if(firstVal*1 === 0){
                    firstVal = '-'
                }
                if(secondVal*1 === 0){
                    secondVal = '-';
                }
 
                updateFrame(cumulativeScore, firstVal, secondVal, score, pinsLeft);
                firstFrame += 2;
            }
        };

        return cumulativeScore;

    };
}

export default gameLogic