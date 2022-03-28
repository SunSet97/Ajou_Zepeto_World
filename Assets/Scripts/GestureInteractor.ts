import { AnimationClip, Collider, WaitForSeconds } from 'UnityEngine'
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
            // console.log(this.animationClip)
            // this.StopAllCoroutines()
            // console.log(this.playerCharacter)
            // AnimationLinker.instance.ResetAniamtor(this.playerCharacter.character.ZepetoAnimator, this.playerCharacter.id)
            AnimationLinker.instance.PlayGesture(this.animationClip.name)
            // this.playerCharacter.character.SetGesture(this.animationClip)
            // this.StartCoroutine(this.DoStop(this.animationClip.length))
        })
    }
    OnTriggerEnter(col : Collider){
        const character = col.GetComponent<ZepetoCharacter>()
        // console.log(col.GetComponent<ZepetoPlayer>())
        // this.playerCharacter = ZepetoPlayers.instance.getplayer
        if(character === ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character){
            this.btn.gameObject.SetActive(true)
        }
    }
    // *DoStop(seconds : float){
    //     yield new WaitForSeconds(seconds)
    //     this.playerCharacter.character.CancelGesture()
    //     //기존의 이름으로 애니메이션 변경 후 서버에 보내기
    //     // AnimationLinker.instance.SendAnimationToServer(AnimationLinker.instance.animationName)
    // }

    OnTriggerExit(col : Collider){
        const character = col.GetComponent<ZepetoCharacter>()
        if(character === ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character){
            this.btn.gameObject.SetActive(false)
        }
    }
}