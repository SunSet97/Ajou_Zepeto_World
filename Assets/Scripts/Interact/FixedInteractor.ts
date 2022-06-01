import { AnimationClip, Camera, Collider, GameObject, LayerMask, Transform, Vector3 } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AnimationLinker from '../AnimationLinker'
import ClientStarter from '../ClientStarter'

export default class FixedInteractor extends ZepetoScriptBehaviour {
    
    public interactButtonPrefab : GameObject
    private _interactButton : Button
    // @Header("애니메이션 이름을 넣으세요. ex) idle_cup인 경우 cup")
    public animationClip : AnimationClip
    // public fixedPoint : Transform
    public cameraOffset : Vector3
    public FixedPointOffset : Vector3
    private localCamera : Camera

    private isPlaying : boolean = false

    Start() {
        if(this.FixedPointOffset == undefined)
            this.FixedPointOffset = Vector3.zero
        if(this.cameraOffset == undefined)
            this.cameraOffset = Vector3.zero

        this._interactButton = GameObject.Instantiate<GameObject>(this.interactButtonPrefab).GetComponent<Button>()
        AnimationLinker.instance.AddInteractor(this._interactButton.gameObject)
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() =>{
            this.localCamera = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera
        })

        this._interactButton.onClick.AddListener(() => {
            // console.log(this.isPlaying)
            if(!this.isPlaying){
                AnimationLinker.instance.PlayGesture(this.animationClip.name, true)
                console.log(this.transform.position)
                ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position = Vector3.op_Addition(this.transform.position, this.FixedPointOffset)
                ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.rotation = this.transform.rotation
                ClientStarter.instance.SendTransform(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform)
                this.isPlaying = true
                this._interactButton.gameObject.SetActive(false)
                this.StartCoroutine(this.CheckPlayerMove())
            }else{
                AnimationLinker.instance.StopGesture(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer)
                this.isPlaying = false
            }
        })
    }

    Update(){
        if((this._interactButton.gameObject.activeSelf || this._interactButton.gameObject.activeSelf) && this.localCamera != null){
            console.log(this.cameraOffset)

            var screenPos = this.localCamera.WorldToScreenPoint(Vector3.op_Addition(this.transform.position, this.cameraOffset))
            // console.log(screenPos)
            this._interactButton.transform.position = screenPos
            this._interactButton.transform.position = screenPos

            // this.testButton.transform.LookAt(this.localCamera.transform)
        }
    }

    *CheckPlayerMove(){
        while(!ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.tryMove){
            yield null
        }
        AnimationLinker.instance.StopGesture(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer)
        this.isPlaying = false
        this._interactButton.gameObject.SetActive(true)
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