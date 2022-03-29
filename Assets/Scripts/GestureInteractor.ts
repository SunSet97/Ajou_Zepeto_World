import { AnimationClip, Collider, LayerMask, WaitForSeconds } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoCharacter, ZepetoPlayers, ZepetoPlayer } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AnimationLinker from './AnimationLinker';

export default class GestureInteractor extends ZepetoScriptBehaviour {

    public btn : Button
    public animationClip : AnimationClip
    private playerCharacter : ZepetoPlayer

    Start(){
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() =>{
            this.playerCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer
        })
        this.btn.onClick.AddListener(() =>{
            AnimationLinker.instance.PlayGesture(this.animationClip.name)
        })
    }
    // OnTriggerEnter(col : Collider){
    //     if(col.gameObject.layer === LayerMask.NameToLayer("LocalPlayer")){
    //         this.btn.gameObject.SetActive(true)
    //     }
    // }

    // OnTriggerExit(col : Collider){
    //     if(col.gameObject.layer === LayerMask.NameToLayer("LocalPlayer")){
    //         this.btn.gameObject.SetActive(false)
    //     }
    // }
}