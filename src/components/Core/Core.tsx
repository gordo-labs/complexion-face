import React, { useState, useEffect } from "react";
import cx from "classnames";
import styles from "./core.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { cleanTxState, submitPayableTx } from "../../features/transaction/transactionActions";
import { ethers } from "ethers";
import { getGameLogicContractProvider } from "../../features/contract/contractReducers";
import complexion from "../../assets/complexion.svg"

type ICoreProps = {}

const defaultProps = {};


type teamData = {
  color: number
  mintPrice: string,
  newPrice: number
  oldSupply: number
}

const Core: React.FC<ICoreProps> = (props) => {
  const dispatch = useDispatch();
  const gameLogicContract = useSelector(getGameLogicContractProvider);
  const [winner, setWinner] = useState(0);

  const [teams, setTeams] = useState<teamData[]>([]);

  useEffect(() => {
    getTeamsData();
    getWinner();
  }, [gameLogicContract]);

  const getWinner = async () => {
    if (!gameLogicContract) {
      return;
    }

    const winner = await gameLogicContract.winningRound();
    console.log('WINNER => ',parseInt(winner.toString()));
    setWinner(parseInt(winner.toString()));
    setWinner(3);
  };

  const getTeamsData = async () => {
    if (!gameLogicContract) {
      return;
    }

    let teams = [];
    const indexes = [1, 2, 3, 4];
    for (const index of indexes) {
      const teamData = await gameLogicContract.colorToNFT(index);
      console.log("TEAM INDEX => ", index, teamData);
      const price = ethers.utils.formatEther(teamData.mintPrice.toString());
      const team = {
        color: parseInt(teamData.color.toString()),
        mintPrice: price,
        newPrice: parseFloat(price) + parseFloat(price) / 5,
        oldSupply: parseInt(teamData.oldSupply.toString())
      };
      teams.push(team);
    }
    console.log(teams);
    setTeams(teams);
  };

  const vote = (color, price) => {
    console.log(color, price);
    dispatch(cleanTxState());
    dispatch(submitPayableTx(
      {
        functionName: "voteForColor",
        valueArgs: [
          color
        ],
        overrides: {
          // the value could be a number, or a
          value: ethers.utils.parseEther(price)
        },
        name: "Vote",
        contract: gameLogicContract
      }
    ));
  };

  const teamStack = (data: teamData, index: number) => {
    const list = Array.from(Array(data.oldSupply).keys());
    return <div key={index} className={"relative flex flex-col h-32 w-36 mb-10"}>
      {list.map((red, i) => {
        return (
          <React.Fragment>
            <section key={data.oldSupply}>
              <div
                style={{
                  bottom: 30 * i,
                  backgroundColor:
                    index === 0 ? "#F16161" :
                      index === 1 ? "#66B1DC" :
                        index === 2 ? "#7FEFAC" :
                          index === 3 ? "#F9E958" :
                            "white"
                }}
                className={cx("flex items-center justify-center shadow absolute h-32 w-32 rounded", styles.layer)}
              >
                <h2 className={"text-4xl"}>
                  {data.oldSupply}
                </h2>
              </div>
            </section>
          </React.Fragment>
        );
      })}
    </div>;
  };

  return (
    <section className={"relative flex justify-center items-end h-screen w-screen bg-slate-200"}>
      <div className="max-w-screen-md pb-14 w-full h-full flex items-end justify-between">
        {teams.length > 0 ? teams.map((team, i) => {
          return <div className={"flex flex-col items-center"}>
            {team.color === winner && <div className={" mb-16 text-6xl"}>
                🎉
            </div>}
            {teamStack(team, i)}
            <section className={"mb-2"}>
              <h3 className={"text-2xl flex"}>
                {team.oldSupply !== 0 ? team.newPrice : team.mintPrice} <p className={"pl-2"}>Ξ</p>
              </h3>
            </section>
            <button
              onClick={() => {
                vote(i + 1, team.oldSupply !== 0 ? team.newPrice.toString() : team.mintPrice);
              }}
              className={"hover:shadow hover:border-black border text-grey-400 tracking-wide border-4 rounded-lg bg-white w-32 h-12 items-center flex justify-center"}>
              <h2 className={"text-gray-400 hover:text-gray-800"}>Add card</h2>
            </button>
          </div>;
        })
          : <div className={"h-full w-full flex flex-col items-center justify-center"}>
              <img src={complexion} alt={""}/>
            <h2 className={"mt-10 text-2xl text-gray-500 tracking-wider"}>Connect your wallet</h2>
          </div>
        }
      </div>
    </section>
  );
};

Core.defaultProps = defaultProps;

export default Core;
