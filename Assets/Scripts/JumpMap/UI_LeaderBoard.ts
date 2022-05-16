import { GameObject } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import LeaderBoard from './LeaderBoard'
import LeaderBoardModule from './leaderBoardModule'

export default class UI_LeaderBoard extends ZepetoScriptBehaviour {

    public leaderBoardManager : GameObject
    
    public leaderBoardButton : Button
    public exitButton : Button
    
    Start() {
        let leaderBoard = this.leaderBoardManager.GetComponent<LeaderBoard>()
        this.leaderBoardButton.onClick.AddListener(() => {
            leaderBoard.ShowRank()
        })
        // console.log(this.exitButton.onClick)
        // console.log(this.exitButton.onClick.AddListener)
        this.exitButton.onClick.AddListener(() =>{
            leaderBoard.leaderBoardPanel.SetActive(false)
        })
    }

}