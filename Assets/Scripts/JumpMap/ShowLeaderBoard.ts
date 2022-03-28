import { GameObject } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import JumpMapManager from './JumpMapManager'

export default class ShowLeaderBoard extends ZepetoScriptBehaviour {
    public jumpMapManager : GameObject
    public _jumpMapManager : JumpMapManager
    
    public btn : Button
    
    Start() {
        this._jumpMapManager = this.jumpMapManager.GetComponent<JumpMapManager>()
        this.btn.onClick.AddListener(() => {
            this._jumpMapManager.ShowRank()
        })
    }



}