import { AnimationClip, Camera, Collider, LayerMask, Vector3 } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AnimationLinker from './AnimationLinker'

export default class MoveAniInteractor extends ZepetoScriptBehaviour {

    public testButton : Button
    @Header("애니메이션 이름을 넣으세요. ex) idle_cup인 경우 cup")
    public animationClipName : string
    public cameraOffset : Vector3

    private localCamera : Camera
    Start() {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() =>{
            this.localCamera = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera
        })
        this.testButton.onClick.AddListener(() => {
            AnimationLinker.instance.SendAnimationToServer(this.animationClipName)
        })
        
    }

    Update(){
        if(this.testButton.gameObject.activeSelf && this.localCamera != null){
            // console.log(this.testButton.gameObject.transform.position)
            var screenPos = this.localCamera.WorldToScreenPoint(this.transform.position)
            // console.log(screenPos)
            this.testButton.transform.position = this.AddVec(screenPos, this.cameraOffset)

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
        // console.log(vec)
        vec.x = vec1.x + vec2.x
        vec.y = vec1.y + vec2.y
        vec.z = vec1.z + vec2.z
        return vec
    }
}