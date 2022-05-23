import { AnimationClip, Camera, Collider, GameObject, LayerMask, Transform, Vector3 } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AnimationLinker from '../AnimationLinker'

export default class FixedInteractor extends ZepetoScriptBehaviour {
    
    public interactButton : Button
    private _interactButton : Button
    // @Header("애니메이션 이름을 넣으세요. ex) idle_cup인 경우 cup")
    public animationClip : AnimationClip
    public fixedPoint : Transform
    public cameraOffset : Vector3
    private localCamera : Camera

    private isPlaying : boolean = false

    Start() {
        this._interactButton = GameObject.Instantiate<GameObject>(this.interactButton.gameObject, this.interactButton.transform.parent).GetComponent<Button>()
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() =>{
            this.localCamera = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera
        })

        this._interactButton.onClick.AddListener(() => {
            // console.log(this.isPlaying)
            if(!this.isPlaying){
                AnimationLinker.instance.PlayGesture(this.animationClip.name, true)
                ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position = this.fixedPoint.position
                this.isPlaying = true
            }else{
                AnimationLinker.instance.StopGesture(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer)
                this.isPlaying = false
            }
        })
    }

    Update(){
        if((this._interactButton.gameObject.activeSelf || this._interactButton.gameObject.activeSelf) && this.localCamera != null){
            // console.log(this.testButton.gameObject.transform.position)
            var screenPos = this.localCamera.WorldToScreenPoint(this.transform.position + this.cameraOffset)
            // console.log(screenPos)
            this._interactButton.transform.position = screenPos
            this._interactButton.transform.position = screenPos

            // this.testButton.transform.LookAt(this.localCamera.transform)
        }
    }

    OnTriggerEnter(col : Collider){    
        if(col.gameObject.layer === LayerMask.NameToLayer("LocalPlayer")){
            this._interactButton.gameObject.SetActive(true)
        }
    }

    OnTriggerExit(col : Collider){
        if(col.gameObject.layer === LayerMask.NameToLayer("LocalPlayer")){
            this._interactButton.gameObject.SetActive(false)
        }
    }
}