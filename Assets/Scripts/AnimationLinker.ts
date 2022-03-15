import { AnimationClip, Animator, AnimatorOverrideController, GameObject, WaitUntil } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { List$1 } from 'System.Collections.Generic';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ScriptRunDelayedTasks } from 'UnityEngine.PlayerLoop.Update';
import * as System from 'System';
import ClientStarter from './ClientStarter';

export default class AnimationLinker extends ZepetoScriptBehaviour {

    private static _instance: AnimationLinker;
    
    public static get instance(): AnimationLinker {
        return this._instance;
    }

    public animationName : string   //현재 animation 이름 - "", "물건 든 상태", "어떤 상태"

    public animations : AnimationClip[]

    private readonly AniOriginal : string[] = ["idle", "walk", "run", "jump_idle", "jump_move"]

    Awake(){
        GameObject.DontDestroyOnLoad(this.gameObject)
        AnimationLinker._instance = this
        //console.log(AnimationLinker.instance)
    }
    Start(){
        //기본 Animation들 넣어주기, Inspector에서 넣어주기는 좀 싫긴한데 그냥 넣어도 됨, 단 이름은 통일된 형식으로 ex) 이름_상태, coffee_walk
        // this.StartCoroutine(this.AniSet())
    }
    // *AniSet(){
    //     while(ZepetoPlayers.instance.LocalPlayer == null){
    //         console.log("로딩 중")
    //         yield null
    //     }
    //     var charAnimator = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.ZepetoAnimator
    //     //animationName - ex) "", "coffee"
    //     var overrideController : AnimatorOverrideController = new AnimatorOverrideController(charAnimator.runtimeAnimatorController);
    //     charAnimator.runtimeAnimatorController = overrideController
                
        
    //     //이런 느낌
    //     console.log("애니메이션 찾기")
    //     for(var index = 0; index < this.AniOriginal.length; index++){
    //         console.log("아이템 : " + this.AniOriginal[index])
    //         overrideController[this.AniOriginal[index]] = this.FindAnimation(this.AniOriginal[index] + "_" + "self");
    //     }
    // }


    //오버로드



    SetAnimationName(name : string){
        this.animationName = name
        console.log("이름 보냄 - " + name)
        this.SetAnimation(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.ZepetoAnimator, name)
        console.log("로컬 세팅")
        ClientStarter.instance.SendAnimation(name)
    }

    // 서버에서 클라이언트로 요청을 보내 실행시키는 함수
    SetAnimation(charAnimator : Animator, name : string){
        //animationName - ex) "", "coffee"
        this.animationName = name

        //animationName - ex) "", "coffee"
        var overrideController : AnimatorOverrideController = new AnimatorOverrideController(charAnimator.runtimeAnimatorController);
        charAnimator.runtimeAnimatorController = overrideController
                
        
        //이런 느낌
        console.log("애니메이션 찾기")
        for(var index = 0; index < this.AniOriginal.length; index++){
            // console.log("아이템 : " + this.AniOriginal[index])
            overrideController[this.AniOriginal[index]] = this.FindAnimation(this.AniOriginal[index] + "_" + this.animationName);
        }
    }


    //대충 이런 느낌
    FindAnimation(name : string) : AnimationClip{
        // item name - asda_idle, asda_jump_move
        // console.log("찾는 애니메이션 이름 : " + name)
        var clip : AnimationClip = this.animations.find((item) => {return item.name == name})
        return clip
    }
}