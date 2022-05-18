import { AnimationClip, Color } from 'UnityEngine'
import { Button, Image } from 'UnityEngine.UI'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AnimationLinker from './AnimationLinker'

export default class UIGesture extends ZepetoScriptBehaviour {

    public defaultColor : Color
    public infiniteColor : Color
    public infiniteButton : Button

    private isInfinite : boolean = false

    public gestureButtons : Button[]
    public gestureClips : AnimationClip[]
    // private waitForSeconds : WaitForSeconds

    public poseButtons : Button[]
    public poseClips : AnimationClip[]

    Start() {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() =>{
            const player = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer
            for(var idx = 0; idx < this.gestureButtons.length; idx++){
                let clip = this.gestureClips[idx]
                // console.log(this.gestureButtons[idx])
                this.gestureButtons[idx].onClick.AddListener(() =>{
                    if(AnimationLinker.instance.GetIsGesturing(player.id)){
                        AnimationLinker.instance.StopGesture(player)
                        if(clip != AnimationLinker.instance.GetPlayingGesture(player.id)){
                            AnimationLinker.instance.PlayGesture(clip.name, this.isInfinite)    
                            this.StartCoroutine(this.CheckPlayerMove())
                        }
                    }else{
                        AnimationLinker.instance.PlayGesture(clip.name, this.isInfinite)
                        this.StartCoroutine(this.CheckPlayerMove())
                    }
                })
            }
            for(var idx = 0; idx < this.poseButtons.length; idx++){
                let poseClip = this.poseClips[idx]
                this.poseButtons[idx].onClick.AddListener(() =>{
                    if(AnimationLinker.instance.GetIsGesturing(player.id)){
                        AnimationLinker.instance.StopGesture(player)
                        if(poseClip != AnimationLinker.instance.GetPlayingGesture(player.id)){
                            AnimationLinker.instance.PlayGesture(poseClip.name, this.isInfinite)
                            this.StartCoroutine(this.CheckPlayerMove())    
                        }
                    }else{
                        AnimationLinker.instance.PlayGesture(poseClip.name, this.isInfinite)
                        this.StartCoroutine(this.CheckPlayerMove())
                    }
                })
            }
        })
        this.infiniteButton.onClick.AddListener(() =>{
            this.isInfinite = !this.isInfinite
            if(!this.isInfinite){
                this.infiniteButton.GetComponent<Image>().color = this.defaultColor
                this.infiniteButton.colors.normalColor = this.defaultColor
                this.infiniteButton.colors.highlightedColor = this.defaultColor
                this.infiniteButton.colors.pressedColor = this.GetGrayColor(this.defaultColor)
                this.infiniteButton.colors.selectedColor = this.defaultColor
                this.infiniteButton.colors.disabledColor = this.GetGrayColor(this.defaultColor)
            }else{
                this.infiniteButton.GetComponent<Image>().color = this.infiniteColor
                this.infiniteButton.colors.normalColor = this.infiniteColor
                this.infiniteButton.colors.highlightedColor = this.infiniteColor
                this.infiniteButton.colors.pressedColor = this.GetGrayColor(this.infiniteColor)
                this.infiniteButton.colors.selectedColor = this.infiniteColor
                this.infiniteButton.colors.disabledColor = this.GetGrayColor(this.infiniteColor)
            }
        })
    }
    GetGrayColor(color : Color) : Color{
        let c = new Color(color.r - 0.2, color.g - 0.2, color.b - 0.2, color.a)
        return color
    }
    // *OnUpdate(){
    //     while(true){
    //         console.log(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.tryMove)
    //         yield null
    //     }
    // }

    *CheckPlayerMove(){
        while(!ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.tryMove){
            yield null
        }
        AnimationLinker.instance.StopGesture(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer)
    }
    // 2번 제스처하다가 움직이거나 하면 어떻게 되는가 ㅁㄹ 여기도 이거저거 생각
}