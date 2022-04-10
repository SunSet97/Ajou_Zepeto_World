import { RenderMode, Vector2 } from 'UnityEngine'
import { CanvasScaler } from 'UnityEngine.UI'
import { ScaleMode } from 'UnityEngine.UI.CanvasScaler'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class ZepetoControllerScaler extends ZepetoScriptBehaviour {

    Start() {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() =>{
            this.GetComponentInChildren<CanvasScaler>().uiScaleMode = ScaleMode.ScaleWithScreenSize
            this.GetComponentInChildren<CanvasScaler>().referenceResolution = new Vector2(1920, 1080)
        })
    }

}