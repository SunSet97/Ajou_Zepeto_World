import { GameObject, Mathf } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import CatDirector from './CatDirector'
import ClientStarter from './ClientStarter'

export default class CatManager extends ZepetoScriptBehaviour {

    private static _instance : CatManager
    
    public static get instance() : CatManager{
        return this._instance
    }

    public cats : GameObject[]
    private _cats : CatDirector[]
    
    Awake(){
        CatManager._instance = this
    }

    Start() {
        this._cats = new Array<CatDirector>(this.cats.length)
        for(var i = 0; i < this._cats.length; i++){
            this._cats[i] = this.cats[i].GetComponent<CatDirector>()
        }
    }

    public ActivateCats(catIndex){
        //십의 자리수 - index, 일의 자리수 random animate parameter
        this._cats[Mathf.Round(catIndex % 10)].Activate(Mathf.Round(catIndex/10))
    }

}