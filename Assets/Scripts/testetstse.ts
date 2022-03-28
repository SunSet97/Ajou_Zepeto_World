import { AnimationClip, WaitForSeconds } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AnimationLinker from './AnimationLinker';

export default class testetstse extends ZepetoScriptBehaviour {
    public danceButton : Button;
    private zepetoCharacter: ZepetoCharacter;
    public animationClip : AnimationClip;
    
    Start() {
        //create character
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });
        // when button click
        this.danceButton.onClick.AddListener(()=>{
            //start gesture
            console.log("누름")
            // AnimationLinker.instance.ResetAniamtor(this.zepetoCharacter)
            this.zepetoCharacter.SetGesture(this.animationClip);
            this.StartCoroutine(this.DoRoutine());
        });
    }
    
    //after 3 seconds later, stop gesture
    *DoRoutine() {
        yield new WaitForSeconds(3);
        this.zepetoCharacter.CancelGesture();
    }
}