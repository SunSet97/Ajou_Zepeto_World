import { GameObject } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import LeaderBoardModule from './leaderBoardModule'

export default class ShowLeaderBoard extends ZepetoScriptBehaviour {
    public leaderBoardManager : GameObject
    public _leaderBoardManager : LeaderBoardModule
    
    public leaderBoardButton : Button
    
    Start() {
        this._leaderBoardManager = this.leaderBoardManager.GetComponent<LeaderBoardModule>()
        
        this.leaderBoardButton.onClick.AddListener(() => {
            this._leaderBoardManager.ShowRank()
        })
    }
}