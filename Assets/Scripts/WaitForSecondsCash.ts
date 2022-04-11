import { List$1 } from 'System.Collections.Generic';
import { WaitForEndOfFrame, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class WaitForSecondsCash extends ZepetoScriptBehaviour {

    private static _timeInterval : Map<float, WaitForSeconds>
    Awake(){
        WaitForSecondsCash._timeInterval = new Map<float, WaitForSeconds>()
    }
    public static WaitForSeconds(seconds : number) : WaitForSeconds{
        if(!WaitForSecondsCash._timeInterval.has(seconds)){
            WaitForSecondsCash._timeInterval.set(seconds, new WaitForSeconds(seconds))
        }
        return WaitForSecondsCash._timeInterval.get(seconds)

    }

}