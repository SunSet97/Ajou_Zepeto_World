import { Vector2 } from 'UnityEngine';
import { CanvasScaler } from 'UnityEngine.UI'
import { ScaleMode } from 'UnityEngine.UI.CanvasScaler';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class CanvasSetter extends ZepetoScriptBehaviour {

    Start() {
        this.GetComponent<CanvasScaler>().uiScaleMode = ScaleMode.ScaleWithScreenSize;
        this.GetComponent<CanvasScaler>().referenceResolution = new Vector2(1920, 1080)
        this.GetComponent<CanvasScaler>().matchWidthOrHeight = 1
    }

}