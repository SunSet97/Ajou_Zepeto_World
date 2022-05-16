import { Camera, Collider, GameObject, LayerMask, Vector3 } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AnimationLinker from './AnimationLinker'

export default class MoveAnimationInteractor extends ZepetoScriptBehaviour {

    public inteactButton : Button
    @Header("애니메이션 이름을 넣으세요. ex) idle_cup인 경우 cup")
    public animationClipName : string
    public cameraOffset : Vector3

    public prefab : GameObject

    public posOffset : Vector3
    public rotOffset : Vector3

    private localCamera : Camera
    Start() {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() =>{
            this.localCamera = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera
        })
        this.inteactButton.onClick.AddListener(() => {
            AnimationLinker.instance.SendAnimationToServer(this.animationClipName, this.gameObject.name)
        })
        
    }

    Update(){
        if(this.inteactButton.gameObject.activeSelf && this.localCamera != null){
            // console.log(this.testButton.gameObject.transform.position)
            var screenPos = this.localCamera.WorldToScreenPoint(this.AddVec(this.transform.position, this.cameraOffset))
            // console.log(screenPos)
            this.inteactButton.transform.position = screenPos

            // this.testButton.transform.LookAt(this.localCamera.transform)
        }
    }

    OnTriggerEnter(col : Collider){    
        if(col.gameObject.layer === LayerMask.NameToLayer("LocalPlayer")){
            this.inteactButton.gameObject.SetActive(true)
        }
    }

    OnTriggerExit(col : Collider){
        if(col.gameObject.layer === LayerMask.NameToLayer("LocalPlayer")){
            this.inteactButton.gameObject.SetActive(false)
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