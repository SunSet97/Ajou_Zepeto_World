import { AnimationClip } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AnimationLinker from './AnimationLinker'

export default class UIGesture extends ZepetoScriptBehaviour {

    public animationButtons : Button[]
    public animationClip : AnimationClip[]
    // private waitForSeconds : WaitForSeconds

    Start() {
        for(var index = 0; index < this.animationButtons.length; index++){
            const clip = this.animationClip[index]
            console.log(clip)
            this.animationButtons[index].onClick.AddListener(() =>{
                AnimationLinker.instance.PlayGesture(clip.name)
            })
        }
    }
    // 2번 제스처하다가 움직이거나 하면 어떻게 되는가 ㅁㄹ 여기도 이거저거 생각
}