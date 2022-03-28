import { AnimationClip, Camera, Collider, Vector3 } from 'UnityEngine'
import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import AnimationLinker from './AnimationLinker'

export default class MoveAniInteractor extends ZepetoScriptBehaviour {

    public testButton : Button
    @Header("애니메이션 이름을 넣으세요. ex) idle_cup인 경우 cup")
    public animationClipName : string

    Start() {
        this.testButton.onClick.AddListener(() => {
            AnimationLinker.instance.SendAnimationToServer(this.animationClipName)
        })
        
    }

    // Update(){
        // if(this.localCamera != null){
            // this.btn.gameObject.transform.LookAt(this.localCamera.transform)
        // }
    // }

    // OnTriggerEnter(col : Collider){
    //     this.localCamera = ZepetoPlayers.instance.ZepetoCamera.camera
    
    //     this.btn.gameObject.SetActive(true) //버튼 키기
    // }
    // OnTriggerExit(col : Collider){
    //     this.localCamera = null
    //     this.btn.gameObject.SetActive(false) //버튼 끄기
    // }

    AddVec(vec1 : Vector3, vec2 : Vector3) : Vector3{
        var vec = new Vector3(0, 0)
        console.log(vec)
        vec.x = vec1.x + vec2.x
        vec.y = vec1.y + vec2.y
        vec.z = vec1.z + vec2.z
        return vec
    }
}