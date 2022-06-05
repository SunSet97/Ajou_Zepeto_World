import { Collider, LayerMask, GameObject } from 'UnityEngine';
import { LocalPlayer, ZepetoCharacter } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import LeaderBoard from './LeaderBoard';

export default class JumpMapCollider extends ZepetoScriptBehaviour {

    public leaderBoardObject : GameObject
    @Header("Start인 경우 'Start',  End인 경우 'End', Fail인 경우 'Fail'를 적으세요.")
    public kind : string


    private leaderBoard : LeaderBoard

    Awake(){
        this.leaderBoard = this.leaderBoardObject.GetComponent<LeaderBoard>()
    }

    OnTriggerEnter(col : Collider){
        //ClientStarter에서 Local인 경우 Layer 변경시켜줌, 그거로 판단
        if(col.gameObject.layer == LayerMask.NameToLayer("LocalPlayer")){
            if(this.kind == "End"){
                this.leaderBoard.GameEnd(true)
            }else if(this.kind == 'Fail'){
                this.leaderBoard.GameEnd(false)
            }
        }
    }

}