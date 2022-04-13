import { AnimationClip } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AnimationLinker from './AnimationLinker'

export default class UIPoseGesture extends ZepetoScriptBehaviour {
    
    public PoseButtons : Button[]
    public animationClip : AnimationClip[]
    
    Start() {    
        for(var index = 0; index < this.PoseButtons.length; index++){
            this.PoseButtons[index].onClick.AddListener(() =>{
                AnimationLinker.instance.PlayGesture(this.animationClip[index].name)
            })
        }
    }
    //포즈 몇초뒤 정지 or 움직이면 정지, 다른 거 누르는 경우 이거저거 생각

}