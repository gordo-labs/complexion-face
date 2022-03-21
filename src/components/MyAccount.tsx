import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGameLogicContractProvider } from "../features/contract/contractReducers";
import { cleanTxState, submitPayableTx } from "../features/transaction/transactionActions";
import { ethers } from "ethers";
import { Account } from "./Web3Provider/DataLoaders/dataLoaders";
import { useWeb3React } from "@web3-react/core";

type IMyAccountProps = {}

const defaultProps = {};

type Voter = {
  color: number,
  mintPrice: string,
  minted: boolean,
  voted: boolean,
  claimedReward: boolean,
}

const MyAccount: React.FC<IMyAccountProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const gameLogicContract = useSelector(getGameLogicContractProvider);
  const { account } = useWeb3React();
  const [voter, setVoter] = useState<Voter>();

  const claimReward = () => {
    dispatch(cleanTxState());
    dispatch(submitPayableTx(
      {
        functionName: "claimReward",
        valueArgs: [
          // color
        ],
        overrides: {
          // the value could be a number, or a
          // value: ethers.utils.parseEther()
        },
        name: "Claim",
        contract: gameLogicContract
      }
    ));
  };

  const mint = () => {
    dispatch(cleanTxState());
    dispatch(submitPayableTx(
      {
        functionName: "mintWinner",
        valueArgs: [
          // color
        ],
        overrides: {
          // the value could be a number, or a
          // value: ethers.utils.parseEther()
        },
        name: "Mint Winner",
        contract: gameLogicContract
      }
    ));
  };

  const getVoterData = async () => {
    if (!gameLogicContract) {
      return;
    }
    const round = await gameLogicContract.roundNumber();
    const roundVoter = await gameLogicContract.roundToVoter(account, round);
    console.log("VOTER DATA => 7", roundVoter);
    const voter = {
      color: parseInt(roundVoter.color.toString()),
      mintPrice: ethers.utils.formatEther(roundVoter.mintPrice.toString()),
      minted: roundVoter.minted,
      voted: roundVoter.voted,
      claimedReward: roundVoter.claimedReward
    };
    setVoter(voter);
  };

  useEffect(() => {
    getVoterData();
  }, [gameLogicContract]);

  return (
    <div className={"absolute flex flex-col items-end top-16 right-6 z-10"}>
      {/*VOTER*/}
      {voter && <div>
        {
          voter.voted ?
            <>
              <h3 className={"mb-2 flex items-center "}>Voted
                <span className={"ml-2  border border-black border-2 rounded h-5 w-5"} style={{
                  backgroundColor:
                    voter.color === 1 ? "#F16161" :
                      voter.color === 2 ? "#66B1DC" :
                        voter.color === 3 ? "#7FEFAC" :
                          voter.color === 4 ? "#F9E958" :
                            "white"
                }} />
              </h3>
            </>
            :
            <>
              <h4>Join a team to participate</h4>
            </>
        }
      </div>}

      <button
        onClick={() => {
          // vote(i + 1, team.mintPrice);
          claimReward();
        }}
        className={"mb-2 hover:shadow hover:border-black border text-grey-400 tracking-wide border-4 rounded-lg bg-white w-40 h-12 items-center flex justify-center"}>
        <h2 className={"text-gray-400 hover:text-gray-800"}>Claim Reward</h2>
      </button>
      <button
        onClick={() => {
          // vote(i + 1, team.mintPrice);
          mint();
        }}
        className={"mb-2 hover:shadow hover:border-black border text-grey-400 tracking-wide border-4 rounded-lg bg-white w-40 h-12 items-center flex justify-center"}>
        <h2 className={"text-gray-400 hover:text-gray-800"}>Mint</h2>
      </button>
    </div>
  );
};

MyAccount.defaultProps = defaultProps;

export default MyAccount;
