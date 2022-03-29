import { Canvas } from 'UnityEngine'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class WorldCanvasLocalCamera extends ZepetoScriptBehaviour {

    Start() {    
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() =>{
            this.GetComponent<Canvas>().worldCamera = ZepetoPlayers.instance.LocalPlayer.zepetoCamera.camera
        })
    }

}