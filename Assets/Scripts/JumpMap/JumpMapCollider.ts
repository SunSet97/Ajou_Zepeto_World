import { Collider, LayerMask, GameObject } from 'UnityEngine';
import { LocalPlayer, ZepetoCharacter } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import JumpMapManager from './JumpMapManager';

export default class JumpMapCollider extends ZepetoScriptBehaviour {

    public jumpManagerObject : GameObject
    @Header("Start인 경우 'Start',  End인 경우 'End'를 적으세요.")
    public kind : string
    private jumpManager : JumpMapManager

    Awake(){
        this.jumpManager = this.jumpManagerObject.GetComponent<JumpMapManager>()
    }
    OnTriggerEnter(col : Collider){
        //ClientStarter에서 Local인 경우 Layer 변경시켜줌, 그거로 판단
        if(col.gameObject.layer === LayerMask.NameToLayer("LocalPlayer")){
            if(this.kind == "Start"){
                this.jumpManager.GameStart()
            }

            if(this.kind == "End"){
                this.jumpManager.GameEnd()
            }
        }
    }

}