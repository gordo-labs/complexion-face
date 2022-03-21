import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGameLogicContractProvider } from "../features/contract/contractReducers";
import { ethers } from "ethers";
import { cleanTxState, submitPayableTx } from "../features/transaction/transactionActions";

type IRoundProps = {}

const defaultProps = {};

const Round: React.FC<IRoundProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const gameLogicContract = useSelector(getGameLogicContractProvider);
  const [round, setRound] = useState(0);

  const nextRound = () => {
    dispatch(cleanTxState());
    dispatch(submitPayableTx(
      {
        functionName: "reset",
        valueArgs: [
          // color
        ],
        overrides: {
          // the value could be a number, or a
          // value: ethers.utils.parseEther()
        },
        name: "Next Round",
        contract: gameLogicContract
      }
    ));
  }


  useEffect(() => {
    getTeamsData();
  }, [gameLogicContract]);

  const getTeamsData = async () => {
    if (!gameLogicContract) {
      return;
    }
    const round = await gameLogicContract.roundNumber();
    const resetTime = await gameLogicContract.resetTime();
    console.log("Round => ", round.toString());
    // setRound(parseInt(round.toString()));
    setRound(parseInt(round.toString()));
  };

  return (
    <div className={"absolute top-16 left-6 z-10"}>
      <h3>Round: {round}</h3>
      <button
        onClick={() => {
          // vote(i + 1, team.mintPrice);
          nextRound();
        }}
        className={"mt-2 hover:shadow hover:border-black border text-grey-400 tracking-wide border-4 rounded-lg bg-white w-40 h-12 items-center flex justify-center"}>
        <h2 className={"text-gray-400 hover:text-gray-800"}>Next round</h2>
      </button>
    </div>
  );
};

Round.defaultProps = defaultProps;

export default Round;
