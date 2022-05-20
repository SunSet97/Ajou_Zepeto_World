import { Animator } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import ClientStarter from './ClientStarter'

export default class CatDirector extends ZepetoScriptBehaviour {

    animator : Animator
    Start() {
        this.animator = this.GetComponent<Animator>()
    }

    public Activate(index){
        // ClientStarter.instance.Debug(`고양이이이이`)
        ClientStarter.instance.Debug(`${this.gameObject}가 ${index}를 실행합니다.`)
        this.animator.SetInteger("random", index)
    }
}