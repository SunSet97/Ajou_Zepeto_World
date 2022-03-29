import { AnimationClip, Camera, Collider, LayerMask, Transform, Vector3 } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AnimationLinker from './AnimationLinker'

export default class FixedInteractor extends ZepetoScriptBehaviour {
    
    public testButton : Button
    public stopButton : Button
    // @Header("애니메이션 이름을 넣으세요. ex) idle_cup인 경우 cup")
    public animationClip : AnimationClip
    public fixedPoint : Transform
    public cameraOffset : Vector3
    private localCamera : Camera
    Start() {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() =>{
            this.localCamera = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera
        })
        this.testButton.onClick.AddListener(() => {
            AnimationLinker.instance.PlayFixedGesture(this.animationClip.name)
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position = this.fixedPoint.position
            this.stopButton.gameObject.SetActive(true)
            this.testButton.gameObject.SetActive(false)
        })
        this.stopButton.onClick.AddListener(() => {
            AnimationLinker.instance.StopGesture(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer)
            this.stopButton.gameObject.SetActive(false)
            this.testButton.gameObject.SetActive(true)
        })
    }

    Update(){
        if((this.testButton.gameObject.activeSelf || this.stopButton.gameObject.activeSelf) && this.localCamera != null){
            // console.log(this.testButton.gameObject.transform.position)
            var screenPos = this.localCamera.WorldToScreenPoint(this.transform.position)
            console.log(screenPos)
            this.testButton.transform.position = this.AddVec(screenPos, this.cameraOffset)
            this.stopButton.transform.position = this.AddVec(screenPos, this.cameraOffset)

            // this.testButton.gameObject.transform.LookAt(this.localCamera.transform)
        }
    }

    OnTriggerEnter(col : Collider){    
        if(col.gameObject.layer === LayerMask.NameToLayer("LocalPlayer")){
            this.testButton.gameObject.SetActive(true)
        }
    }

    OnTriggerExit(col : Collider){
        if(col.gameObject.layer === LayerMask.NameToLayer("LocalPlayer")){
            this.testButton.gameObject.SetActive(false)
        }
    }

    AddVec(vec1 : Vector3, vec2 : Vector3) : Vector3{
        var vec = new Vector3(0, 0)
        console.log(vec)
        vec.x = vec1.x + vec2.x
        vec.y = vec1.y + vec2.y
        vec.z = vec1.z + vec2.z
        return vec
    }
}